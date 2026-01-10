/**
 * Mock Product Service
 * Simulates AWS AppSync/DynamoDB operations
 * TODO: Replace with actual AppSync queries/mutations
 */

import { delay, generateId } from '@utils/helpers';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ListingStatus,
} from '@types/product.types';
import { ApiResponse, PaginatedResponse } from '@types/api.types';
import { MOCK_PRODUCTS, getMockProductById } from '@mock/data/products';
import { sortProducts } from '@utils/feedAlgorithm';

// Simulated network delay
const MOCK_DELAY = 600;

// Local storage for new products (in-memory for prototype)
let localProducts: Product[] = [...MOCK_PRODUCTS];

/**
 * Get products with filters and pagination
 * In production: AppSync query with DynamoDB GSI
 */
export const mockGetProducts = async (
  collegeId: string,
  filters?: ProductFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  await delay(MOCK_DELAY);

  try {
    // Filter by college
    let filteredProducts = localProducts.filter(
      p => p.collegeId === collegeId && p.status === 'active'
    );

    // Apply filters
    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.condition) {
        filteredProducts = filteredProducts.filter(p => p.condition === filters.condition);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
      }
    }

    // Sort products based on filter option (default: priority algorithm)
    const sortBy = filters?.sortBy || 'priority';
    filteredProducts = sortProducts(filteredProducts, sortBy);

    // Paginate
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: {
        items: paginatedProducts,
        total: filteredProducts.length,
        nextToken: endIndex < filteredProducts.length ? String(page + 1) : undefined,
      },
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch products',
      },
      success: false,
    };
  }
};

/**
 * Get single product by ID
 * In production: AppSync query
 */
export const mockGetProductById = async (
  productId: string
): Promise<ApiResponse<Product>> => {
  await delay(MOCK_DELAY / 2);

  const product = localProducts.find(p => p.id === productId);

  if (!product) {
    return {
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Product not found',
      },
      success: false,
    };
  }

  // Increment view count
  product.viewCount += 1;

  return {
    data: product,
    error: null,
    success: true,
  };
};

/**
 * Get products by seller
 * In production: AppSync query with GSI
 */
export const mockGetSellerProducts = async (
  sellerId: string
): Promise<ApiResponse<Product[]>> => {
  await delay(MOCK_DELAY);

  const products = localProducts
    .filter(p => p.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    data: products,
    error: null,
    success: true,
  };
};

/**
 * Create new product
 * In production: AppSync mutation
 */
export const mockCreateProduct = async (
  input: CreateProductInput,
  sellerId: string,
  sellerName: string,
  sellerAvatar: string | undefined,
  collegeId: string,
  collegeName: string
): Promise<ApiResponse<Product>> => {
  await delay(MOCK_DELAY);

  try {
    const newProduct: Product = {
      id: `prod-${generateId()}`,
      ...input,
      sellerId,
      sellerName,
      sellerAvatar,
      collegeId,
      collegeName,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    };

    localProducts.unshift(newProduct);

    return {
      data: newProduct,
      error: null,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create product',
      },
      success: false,
    };
  }
};

/**
 * Update product
 * In production: AppSync mutation
 */
export const mockUpdateProduct = async (
  input: UpdateProductInput
): Promise<ApiResponse<Product>> => {
  await delay(MOCK_DELAY);

  const productIndex = localProducts.findIndex(p => p.id === input.id);

  if (productIndex === -1) {
    return {
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Product not found',
      },
      success: false,
    };
  }

  const updatedProduct = {
    ...localProducts[productIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  localProducts[productIndex] = updatedProduct;

  return {
    data: updatedProduct,
    error: null,
    success: true,
  };
};

/**
 * Delete product
 * In production: AppSync mutation (soft delete)
 */
export const mockDeleteProduct = async (
  productId: string
): Promise<ApiResponse<null>> => {
  await delay(MOCK_DELAY);

  const productIndex = localProducts.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return {
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Product not found',
      },
      success: false,
    };
  }

  localProducts.splice(productIndex, 1);

  return {
    data: null,
    error: null,
    success: true,
  };
};

/**
 * Activate product (after payment)
 * In production: AppSync mutation
 */
export const mockActivateProduct = async (
  productId: string
): Promise<ApiResponse<Product>> => {
  await delay(MOCK_DELAY / 2);

  const product = localProducts.find(p => p.id === productId);

  if (!product) {
    return {
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Product not found',
      },
      success: false,
    };
  }

  product.status = 'active';
  product.updatedAt = new Date().toISOString();

  return {
    data: product,
    error: null,
    success: true,
  };
};

/**
 * Mark product as sold
 * In production: AppSync mutation
 */
export const mockMarkAsSold = async (
  productId: string
): Promise<ApiResponse<Product>> => {
  await delay(MOCK_DELAY / 2);

  const product = localProducts.find(p => p.id === productId);

  if (!product) {
    return {
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Product not found',
      },
      success: false,
    };
  }

  product.status = 'sold';
  product.updatedAt = new Date().toISOString();

  return {
    data: product,
    error: null,
    success: true,
  };
};
