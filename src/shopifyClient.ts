import { config, AppConfig } from './config';

export interface ShopifyProductImage {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  originalSrc?: string | null;
  mediaContentType: string;
  mimeType?: string | null;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  updatedAt: string;
  images: ShopifyProductImage[];
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface ProductEdge {
  cursor: string;
  node: {
    id: string;
    title: string;
    handle: string;
    updatedAt: string;
    images: {
      edges: Array<{
        node: {
          id: string;
          url: string;
          altText?: string | null;
          width?: number | null;
          height?: number | null;
          originalSrc?: string | null;
          mimeType?: string | null;
          mediaContentType: string;
        };
      }>;
    };
  };
}

interface ProductsQueryResult {
  products: {
    edges: ProductEdge[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          handle
          updatedAt
          images(first: 50) {
            edges {
              node {
                id
                url
                altText
                width
                height
                originalSrc
                mimeType
                mediaContentType
              }
            }
          }
        }
      }
    }
  }
`;

export class ShopifyClient {
  private readonly graphqlEndpoint: string;
  private readonly headers: Record<string, string>;

  constructor(private readonly options: Pick<AppConfig, 'storeDomain' | 'accessToken' | 'apiVersion'>) {
    this.graphqlEndpoint = `https://${options.storeDomain}/admin/api/${options.apiVersion}/graphql.json`;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': options.accessToken
    };
  }

  async fetchProductPage(pageSize: number, cursor?: string): Promise<ProductsQueryResult> {
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: {
          first: pageSize,
          after: cursor ?? null
        }
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Shopify GraphQL request failed (${response.status}): ${body}`);
    }

    const payload = (await response.json()) as GraphQLResponse<ProductsQueryResult>;

    if (payload.errors?.length) {
      const messages = payload.errors.map((error) => error.message).join(', ');
      throw new Error(`Shopify GraphQL errors: ${messages}`);
    }

    if (!payload.data) {
      throw new Error('Shopify GraphQL response contained no data');
    }

    return payload.data;
  }
}

export const shopifyClient = new ShopifyClient(config);

export const mapEdgesToProducts = (edges: ProductEdge[]): ShopifyProduct[] =>
  edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    updatedAt: node.updatedAt,
    images: node.images.edges.map(({ node: imageNode }) => ({
      id: imageNode.id,
      url: imageNode.url,
      altText: imageNode.altText,
      width: imageNode.width,
      height: imageNode.height,
        originalSrc: imageNode.originalSrc,
      mimeType: imageNode.mimeType,
      mediaContentType: imageNode.mediaContentType
    }))
  }));
