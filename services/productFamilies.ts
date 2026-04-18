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

function looksLikeVariantSuffix(value: string) {
  const normalized = normalizeToken(value);
  if (!normalized) {
    return false;
  }

  if (/^[a-z]?\d{2,6}(?:\s+[a-z0-9].*)?$/i.test(value.trim())) {
    return true;
  }

  const tokenCount = normalized.split(/\s+/).length;
  if (tokenCount <= 4 && normalized.length <= 28) {
    return true;
  }

  return false;
}

function normalizeVariantLabel(value: string) {
  return value
    .replace(/^[|:,\-()\s]+|[|:,\-()\s]+$/g, '')
    .replace(/^[a-z]?\d{2,6}\s+/i, '')
    .trim();
}

function splitTitleStem(name: string) {
  const trimmed = name.trim();
  const separated = trimmed.match(/^(.*?)(?:\s+(?:\||:|-)\s+)([^|:]{1,40})$/);
  if (separated?.[1] && separated?.[2]) {
    const stem = separated[1].trim();
    const suffix = normalizeVariantLabel(separated[2]);
    if (stem && looksLikeVariantSuffix(suffix) && stem.length >= Math.max(6, Math.floor(trimmed.length * 0.45))) {
      return { stem, variantLabel: suffix };
    }
  }

  const patterns = [
    /^(.*)\s+[|:-]\s*([a-z]?\d{2,6}\b[^|:-]{0,40})\s*$/i,
    /^(.*)\s+[(-]([^()]*?(?:shade|color|colour|tone|hue|finish|variant)[^()]*)[)\-]\s*$/i,
    /^(.*)\s+\b(?:in\s+)?(?:shade|color|colour|tone|hue|finish)\b\s+(.+)$/i,
    /^(.*)\s+\b(?:mini|travel size|full size)\b\s*$/i,
  ];

  for (const pattern of patterns) {
    const matched = trimmed.match(pattern);
    const stem = matched?.[1]?.trim() || '';
    const suffix = normalizeVariantLabel((matched?.[2] || '').trim());
    if (stem && stem.length >= Math.max(6, Math.floor(trimmed.length * 0.45))) {
      if (!suffix || looksLikeVariantSuffix(suffix)) {
        return { stem, variantLabel: suffix };
      }
    }
  }

  return { stem: trimmed, variantLabel: '' };
}

export function getProductFamilyName(product: Product) {
  const name = splitTitleStem(product.name || '').stem;
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
  const colors = product.colors || [];
  const colorLabel = colors.find(color => color?.name && !/^shade$/i.test(color.name))?.name?.trim();

  if (colorLabel) {
    return colorLabel;
  }

  if (name && familyName && name.toLowerCase() !== familyName.toLowerCase()) {
    const split = splitTitleStem(name);
    const variantLabel = split.stem.toLowerCase() === familyName.trim().toLowerCase()
      ? split.variantLabel
      : '';
    const normalized = normalizeToken(variantLabel);
    if (
      variantLabel &&
      variantLabel.length <= 40 &&
      normalized &&
      !VARIANT_STOP_WORDS.has(normalized)
    ) {
      return toTitleCase(variantLabel);
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
