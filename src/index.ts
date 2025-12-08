import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config';
import { fetchAllProducts } from './productFetcher';
import { downloadImage, isAnimatedImage, convertToWebp } from './imageProcessor';

const sanitize = (value: string): string => {
  const cleaned = value.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned.length ? cleaned : 'item';
};

const ensureDir = async (dirPath: string): Promise<void> => {
  await fs.mkdir(dirPath, { recursive: true });
};

const saveWebpImage = async (
  productHandle: string,
  imageId: string,
  buffer: Buffer
): Promise<string> => {
  const productDir = path.join(config.outputDir, sanitize(productHandle));
  await ensureDir(productDir);
  const destination = path.join(productDir, `${sanitize(imageId)}.webp`);
  await fs.writeFile(destination, buffer);
  return destination;
};

const processProductImages = async () => {
  const products = await fetchAllProducts();
  console.log(`Fetched ${products.length} products from Shopify`);

  for (const product of products) {
    if (!product.images.length) {
      continue;
    }

    for (const image of product.images) {
      try {
        const original = await downloadImage(image.url);
        const animated = await isAnimatedImage(original);

        if (animated) {
          console.warn(
            `Animated image detected. Product ${product.handle} (${product.id}), image ${image.id}, url ${image.url}`
          );
          continue;
        }

        const webpBuffer = await convertToWebp(original, config.webpQuality);
        const storedAt = await saveWebpImage(product.handle || product.id, image.id, webpBuffer);
        console.log(`Converted ${image.id} → ${storedAt}`);
      } catch (error) {
        console.error(`Failed to process image ${image.id} for product ${product.id}:`, error);
      }
    }
  }

  console.log('Processing complete');
};

processProductImages().catch((error) => {
  console.error('Fatal error while processing Shopify images', error);
  process.exitCode = 1;
});
