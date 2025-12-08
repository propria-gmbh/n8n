import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
};

const parseNumber = (
  value: string | undefined,
  fallback: number,
  { min, max }: { min?: number; max?: number } = {}
): number => {
  const parsed = Number(value ?? fallback);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  if (typeof min === 'number' && parsed < min) {
    return min;
  }
  if (typeof max === 'number' && parsed > max) {
    return max;
  }
  return parsed;
};

export interface AppConfig {
  storeDomain: string;
  accessToken: string;
  apiVersion: string;
  pageSize: number;
  maxProducts?: number;
  outputDir: string;
  webpQuality: number;
}

const maxProductsValue = process.env.SHOPIFY_MAX_PRODUCTS;

export const config: AppConfig = {
  storeDomain: required('SHOPIFY_STORE_DOMAIN'),
  accessToken: required('SHOPIFY_ACCESS_TOKEN'),
  apiVersion: process.env.SHOPIFY_API_VERSION || '2024-10',
  pageSize: parseNumber(process.env.SHOPIFY_PAGE_SIZE, 50, { min: 1, max: 250 }),
  maxProducts:
    typeof maxProductsValue === 'string' && maxProductsValue.trim().length > 0
      ? parseNumber(maxProductsValue, 0, { min: 1 })
      : undefined,
  outputDir: path.resolve(process.cwd(), process.env.OUTPUT_DIR ?? 'converted'),
  webpQuality: parseNumber(process.env.WEBP_QUALITY, 80, { min: 1, max: 100 })
};
