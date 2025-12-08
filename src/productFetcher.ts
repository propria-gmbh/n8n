import { config } from './config';
import { ShopifyProduct, shopifyClient, mapEdgesToProducts } from './shopifyClient';

export const fetchAllProducts = async (): Promise<ShopifyProduct[]> => {
  let cursor: string | undefined;
  let hasNextPage = true;
  const products: ShopifyProduct[] = [];

  while (hasNextPage) {
    const page = await shopifyClient.fetchProductPage(config.pageSize, cursor);
    const mappedProducts = mapEdgesToProducts(page.products.edges);

    for (const product of mappedProducts) {
      products.push(product);
      if (config.maxProducts && products.length >= config.maxProducts) {
        return products;
      }
    }

    cursor = page.products.pageInfo.endCursor ?? undefined;
    hasNextPage = Boolean(page.products.pageInfo.hasNextPage && cursor);

    if (!hasNextPage) {
      break;
    }
  }

  return products;
};
