import json

from web_products import augment_firestore_catalog_with_top_brands


def main():
    result = augment_firestore_catalog_with_top_brands()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
