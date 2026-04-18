import type { CategoryProductsPage, Product } from './api';

export interface ProductVariantOption {
  id: string;
  label: string;
  image: string;
  price: number;
}

const VARIANT_STOP_WORDS = new Set([
  'shade',
  'shades',
  'color',
  'colors',
  'colour',
  'colours',
  'hue',
  'tone',
  'tones',
  'finish',
  'variant',
]);

function normalizeToken(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stripVariantSuffix(name: string) {
  const trimmed = name.trim();
  const patterns = [
    /\s+[(-][^()]*?(shade|color|colour|tone|hue|finish|variant)[^()]*?[)\-]\s*$/i,
    /\s+[|:-]\s*[^|:-]{1,40}\s*$/i,
    /\s+\b(?:in\s+)?(?:shade|color|colour|tone|hue|finish)\b\s+.+$/i,
    /\s+\b(?:mini|travel size|full size)\b\s*$/i,
  ];

  for (const pattern of patterns) {
    const stripped = trimmed.replace(pattern, '').trim();
    if (stripped && stripped.length >= Math.max(6, Math.floor(trimmed.length * 0.55))) {
      return stripped;
    }
  }

  return trimmed;
}

export function getProductFamilyName(product: Product) {
  const name = stripVariantSuffix(product.name || '');
  return name || product.name || '';
}

function getProductFamilyKey(product: Product) {
  const brand = normalizeToken(product.brand || '');
  const category = normalizeToken(product.category || '');
  const productType = normalizeToken(product.productType || '');
  const familyName = normalizeToken(getProductFamilyName(product));
  return [brand, category, productType, familyName].join('|');
}

function extractVariantLabel(product: Product, familyName: string) {
  const name = (product.name || '').trim();
  const family = familyName.trim();
  const colors = product.colors || [];
  const colorLabel = colors.find(color => color?.name && !/^shade$/i.test(color.name))?.name?.trim();

  if (colorLabel) {
    return colorLabel;
  }

  if (name && family && name.toLowerCase() !== family.toLowerCase()) {
    const escapedFamily = family.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stripped = name
      .replace(new RegExp(`^${escapedFamily}\\s*`, 'i'), '')
      .replace(/^[|:,\-()\s]+|[|:,\-()\s]+$/g, '')
      .trim();
    const normalized = normalizeToken(stripped);
    if (
      stripped &&
      stripped.length <= 40 &&
      normalized &&
      !VARIANT_STOP_WORDS.has(normalized)
    ) {
      return toTitleCase(stripped);
    }
  }

  return '';
}

export function withVariantOptions(product: Product, siblings: Product[]) {
  const familyName = getProductFamilyName(product);
  const variants = siblings
    .map(candidate => ({
      id: candidate.id,
      label: extractVariantLabel(candidate, familyName),
      image: candidate.image,
      price: candidate.price,
    }))
    .filter(variant => variant.label || variant.image)
    .sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id));

  return {
    ...product,
    familyName,
    variantGroupId: getProductFamilyKey(product),
    variantOptions: variants.length > 1 ? variants : [],
    selectedVariantLabel: extractVariantLabel(product, familyName),
  };
}

export function groupProductsByFamily(products: Product[]) {
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    const key = getProductFamilyKey(product);
    const existing = groups.get(key);
    if (existing) {
      existing.push(product);
    } else {
      groups.set(key, [product]);
    }
  }

  const consolidated: Product[] = [];
  for (const siblings of groups.values()) {
    const preferred =
      siblings.find(product => !extractVariantLabel(product, getProductFamilyName(product))) ||
      siblings
        .slice()
        .sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0) || a.name.localeCompare(b.name))[0];
    consolidated.push(withVariantOptions(preferred, siblings));
  }

  return consolidated;
}

export function groupCategoryProductsPage(page: CategoryProductsPage): CategoryProductsPage {
  return {
    ...page,
    items: groupProductsByFamily(page.items),
  };
}

export function findFamilyVariants(product: Product, candidates: Product[]) {
  const key = getProductFamilyKey(product);
  return candidates.filter(candidate => getProductFamilyKey(candidate) === key);
}
