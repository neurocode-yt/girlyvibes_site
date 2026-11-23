import type { Lang } from "@/lib/i18n";

export const productCategories = ["stationery", "room", "accessories"] as const;

export type ProductCategory = (typeof productCategories)[number];

type LocalizedText = Record<Lang, string>;

export type Product = {
  id: string;
  category: ProductCategory;
  title: LocalizedText;
  description: LocalizedText;
  retailer: string;
  affiliateUrl: string;
  image?: {
    src: string;
    alt: LocalizedText;
  };
};

const catalog: readonly Product[] = [];

export function isAffiliateUrl(value: string): boolean {
  if (!/^https:\/\/[^/]/i.test(value) || /[\s\\]/.test(value)) return false;

  try {
    const url = new URL(value);
    return Boolean(url.hostname && !url.username && !url.password);
  } catch {
    return false;
  }
}

export const products = catalog.filter(({ affiliateUrl }) => isAffiliateUrl(affiliateUrl));
