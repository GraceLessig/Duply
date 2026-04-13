from pathlib import Path
import faiss
import json
from sentence_transformers import SentenceTransformer

BASE_DIR = Path(__file__).resolve().parent

model = SentenceTransformer(str(BASE_DIR / "cosmetics_dupe_model"))
index = faiss.read_index(str(BASE_DIR / "cosmetics_index.faiss"))

with open(BASE_DIR / "cosmetics_metadata.json", "r", encoding="utf-8") as f:
    products = json.load(f)


def normalize_text(value):
    if value is None:
        return ""
    return str(value).strip().lower()


def lookup_product(query, preferred_type=None):
    query = normalize_text(query)
    preferred_type = canonical_type(preferred_type)

    best_match = None
    best_score = 0

    for product in products:
        text = normalize_text(f"{product.get('brand', '')} {product.get('product_name', '')}")
        candidate_type = infer_candidate_type(product)

        if preferred_type and candidate_type and candidate_type != preferred_type:
            continue

        score = sum(1 for word in query.split() if word in text)

        if score > best_score:
            best_score = score
            best_match = product

    if best_score >= 2:
        return best_match

    return None


def build_query_text(query, preferred_type=None):
    product = lookup_product(query, preferred_type=preferred_type)

    if product and product.get("combined_text"):
        return product["combined_text"], product

    return query, None


def canonical_type(value):
    value = normalize_text(value)

    mapping = {
        "foundation": "foundation",
        "concealer": "concealer",
        "blush": "blush",
        "bronzer": "bronzer",
        "powder": "powder",
        "primer": "primer",
        "highlighter": "highlighter",
        "lipstick": "lipstick",
        "lip gloss": "lipstick",
        "lip_gloss": "lipstick",
        "lip stain": "lipstick",
        "eyeshadow": "eyeshadow",
        "eye shadow": "eyeshadow",
        "eyeliner": "eyeliner",
        "eye liner": "eyeliner",
        "mascara": "mascara",
        "brow": "eyebrow",
        "eyebrow": "eyebrow",
        "nail polish": "nail_polish",
        "nail_polish": "nail_polish",
    }

    return mapping.get(value, value)


VALID_PRODUCT_TYPES = {
    "foundation", "concealer", "blush", "bronzer", "powder",
    "primer", "highlighter", "lipstick", "eyeshadow",
    "eyeliner", "mascara", "eyebrow", "nail_polish"
}


def infer_candidate_type(product):
    raw_subcategory = canonical_type(product.get("subcategory"))
    raw_type = canonical_type(product.get("type"))
    raw_category = canonical_type(product.get("category"))
    raw_name = normalize_text(product.get("product_name"))

    if raw_subcategory in VALID_PRODUCT_TYPES:
        return raw_subcategory

    if raw_type in VALID_PRODUCT_TYPES:
        return raw_type

    if raw_category in VALID_PRODUCT_TYPES:
        return raw_category

    name_rules = [
        ("foundation", "foundation"),
        ("concealer", "concealer"),
        ("blush", "blush"),
        ("bronzer", "bronzer"),
        ("powder", "powder"),
        ("primer", "primer"),
        ("highlight", "highlighter"),
        ("lipstick", "lipstick"),
        ("lip gloss", "lipstick"),
        ("gloss", "lipstick"),
        ("eyeshadow", "eyeshadow"),
        ("eye shadow", "eyeshadow"),
        ("eyeliner", "eyeliner"),
        ("eye liner", "eyeliner"),
        ("mascara", "mascara"),
        ("brow", "eyebrow"),
        ("nail", "nail_polish"),
    ]

    for needle, result in name_rules:
        if needle in raw_name:
            return result

    return ""


def infer_query_type(query):
    return infer_candidate_type({
        "product_name": query,
        "category": query,
        "type": query,
    })


def _same_product(a, b):
    if not a or not b:
        return False

    return (
        normalize_text(a.get("brand")) == normalize_text(b.get("brand")) and
        normalize_text(a.get("product_name")) == normalize_text(b.get("product_name"))
    )


def _collect_results(ids, scores, original_product, target_type=None, k=5):
    results = []

    for idx, score in zip(ids[0], scores[0]):
        if idx < 0 or idx >= len(products):
            continue

        candidate = products[idx]

        if _same_product(candidate, original_product):
            continue

        candidate_type = infer_candidate_type(candidate)

        if target_type and candidate_type != target_type:
            continue

        results.append({
            "record": candidate,
            "score": float(score),
        })

        if len(results) >= k:
            break

    return results


def find_dupes(query, k=5, search_pool=50, preferred_type=None):
    target_type = canonical_type(preferred_type)
    if target_type not in VALID_PRODUCT_TYPES:
        target_type = ""

    query_text, original_product = build_query_text(query, preferred_type=target_type or None)

    embedding = model.encode(
        [query_text],
        normalize_embeddings=True
    ).astype("float32")

    scores, ids = index.search(embedding, search_pool)

    if not target_type:
        if original_product:
            target_type = infer_candidate_type(original_product)
        else:
            target_type = infer_query_type(query)

    # Keep dupes within the same inferred product type when we can infer one.
    # If we cannot infer any type from either the matched product or the raw query,
    # fall back to nearest neighbors so broad searches still return something.
    results = _collect_results(
        ids=ids,
        scores=scores,
        original_product=original_product,
        target_type=target_type or None,
        k=k,
    )

    return results


if __name__ == "__main__":
    query = input("Search product: ")
    dupes = find_dupes(query)

    print("\nTop dupes:\n")
    for d in dupes:
        print(f"{d['brand']} - {d['product_name']} ({d['score']:.3f})")
