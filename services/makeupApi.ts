import type { Category, DataService, Dupe, Product, ProductColor } from './api';

const BASE_URL = 'https://makeup-api.herokuapp.com/api/v1/products.json';

interface MakeupApiProduct {
  id: number;
  brand: string | null;
  name: string;
  price: string | null;
  price_sign: string | null;
  image_link: string;
  product_link: string;
  description: string | null;
  rating: number | null;
  category: string | null;
  product_type: string | null;
  tag_list: string[];
  product_colors: { hex_value: string; colour_name: string }[];
}

function transformProduct(raw: MakeupApiProduct): Product {
  const price = parseFloat(raw.price || '0');
  return {
    id: String(raw.id),
    name: raw.name || 'Unknown Product',
    brand: capitalize(raw.brand || 'Unknown'),
    price: isNaN(price) ? 0 : price,
    image: raw.image_link?.startsWith('//') ? `https:${raw.image_link}` : (raw.image_link || ''),
    rating: raw.rating ?? 0,
    category: raw.category || raw.product_type || 'general',
    productType: raw.product_type || 'general',
    description: raw.description || undefined,
    tags: raw.tag_list || [],
    colors: raw.product_colors
      ?.filter(c => c.hex_value)
      .slice(0, 8)
      .map((c): ProductColor => ({
        name: c.colour_name || 'Shade',
        hex: c.hex_value.startsWith('#') ? c.hex_value : `#${c.hex_value}`,
      })),
  };
}

function capitalize(str: string): string {
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function computeSimilarity(a: Product, b: Product): number {
  let score = 60;
  if (a.productType === b.productType) score += 15;
  if (a.category === b.category) score += 10;
  const aTags = new Set(a.tags || []);
  const bTags = new Set(b.tags || []);
  const shared = [...aTags].filter(t => bTags.has(t)).length;
  const total = new Set([...aTags, ...bTags]).size;
  if (total > 0) score += Math.round((shared / total) * 15);
  return Math.min(score, 99);
}

let productCache: Map<string, Product[]> = new Map();

async function fetchProducts(params: Record<string, string>): Promise<Product[]> {
  const key = JSON.stringify(params);
  if (productCache.has(key)) return productCache.get(key)!;

  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const raw: MakeupApiProduct[] = await res.json();
  const products = raw
    .filter(p => p.price && parseFloat(p.price) > 0)
    .map(transformProduct);

  productCache.set(key, products);
  return products;
}

export const makeupApiService: DataService = {
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    const brands = ['maybelline', 'covergirl', 'nyx', "l'oreal", 'revlon', 'milani', 'almay', 'physicians formula', 'wet n wild', 'e.l.f.'];
    const matchedBrand = brands.find(b => lowerQuery.includes(b));

    const types = ['lipstick', 'foundation', 'mascara', 'blush', 'eyeshadow', 'eyeliner', 'nail_polish', 'bronzer'];
    const matchedType = types.find(t => lowerQuery.includes(t));

    const params: Record<string, string> = {};
    if (matchedBrand) params.brand = matchedBrand;
    if (matchedType) params.product_type = matchedType;

    if (!matchedBrand && !matchedType) {
      const results = await Promise.all([
        fetchProducts({ brand: 'maybelline' }).catch(() => []),
        fetchProducts({ brand: 'nyx' }).catch(() => []),
        fetchProducts({ product_type: 'lipstick' }).catch(() => []),
      ]);
      const all = results.flat();
      return all
        .filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 20);
    }

    const products = await fetchProducts(params);
    return products.slice(0, 20);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const typeMap: Record<string, string> = {
      eyes: 'eyeshadow',
      lips: 'lipstick',
      face: 'foundation',
      skin: 'blush',
      eyeshadow: 'eyeshadow',
      lipstick: 'lipstick',
      foundation: 'foundation',
      blush: 'blush',
      mascara: 'mascara',
      bronzer: 'bronzer',
    };
    const productType = typeMap[category.toLowerCase()] || 'lipstick';
    return (await fetchProducts({ product_type: productType })).slice(0, 20);
  },

  async getProductById(id: string): Promise<Product | null> {
    for (const products of productCache.values()) {
      const found = products.find(p => p.id === id);
      if (found) return found;
    }
    try {
      const res = await fetch(`${BASE_URL}?id=${id}`);
      if (!res.ok) return null;
      const raw: MakeupApiProduct[] = await res.json();
      return raw.length > 0 ? transformProduct(raw[0]) : null;
    } catch {
      return null;
    }
  },

  async findDupes(product: Product): Promise<Dupe[]> {
    const allProducts = await fetchProducts({ product_type: product.productType });

    return allProducts
      .filter(p => p.id !== product.id && p.price < product.price && p.price > 0)
      .map(p => {
        const similarity = computeSimilarity(product, p);
        return {
          id: `dupe-${product.id}-${p.id}`,
          original: product,
          dupe: p,
          similarity,
          savings: Math.round((product.price - p.price) * 100) / 100,
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);
  },

  async getCategories(): Promise<Category[]> {
    return [
      { id: 'eyes', name: 'Eyes', emoji: '👁️', productType: 'eyeshadow', color: '#e8b4f8' },
      { id: 'lips', name: 'Lips', emoji: '💄', productType: 'lipstick', color: '#f8a4b8' },
      { id: 'face', name: 'Face', emoji: '✨', productType: 'foundation', color: '#f8c4a4' },
      { id: 'skin', name: 'Skin', emoji: '🧴', productType: 'blush', color: '#a4d8f8' },
      { id: 'mascara', name: 'Mascara', emoji: '🖌️', productType: 'mascara', color: '#c4b4f8' },
      { id: 'bronzer', name: 'Bronzer', emoji: '☀️', productType: 'bronzer', color: '#f8d4a4' },
    ];
  },

  async getFeaturedDupes(): Promise<Dupe[]> {
    const [lipsticks, foundations, eyeshadows] = await Promise.all([
      fetchProducts({ product_type: 'lipstick' }).catch(() => []),
      fetchProducts({ product_type: 'foundation' }).catch(() => []),
      fetchProducts({ product_type: 'eyeshadow' }).catch(() => []),
    ]);

    const allProducts = [...lipsticks, ...foundations, ...eyeshadows];
    const expensive = allProducts
      .filter(p => p.price >= 15)
      .sort((a, b) => b.price - a.price)
      .slice(0, 6);

    const dupes: Dupe[] = [];
    for (const original of expensive) {
      const candidates = allProducts.filter(
        p => p.id !== original.id && p.productType === original.productType && p.price < original.price && p.price > 0
      );
      if (candidates.length === 0) continue;
      const bestDupe = candidates.reduce((best, c) => {
        const sim = computeSimilarity(original, c);
        return sim > computeSimilarity(original, best) ? c : best;
      });
      dupes.push({
        id: `featured-${original.id}-${bestDupe.id}`,
        original,
        dupe: bestDupe,
        similarity: computeSimilarity(original, bestDupe),
        savings: Math.round((original.price - bestDupe.price) * 100) / 100,
      });
    }

    return dupes.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  },
};
