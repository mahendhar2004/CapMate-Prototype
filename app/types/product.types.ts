/**
 * Product-related type definitions
 * Designed for future AWS DynamoDB/AppSync integration
 */

export type ProductCategory =
  | 'electronics'
  | 'furniture'
  | 'books'
  | 'clothing'
  | 'sports'
  | 'kitchen'
  | 'decor'
  | 'cycles'
  | 'other';

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';

export type ListingStatus = 'draft' | 'pending_payment' | 'active' | 'sold' | 'expired';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  collegeId: string;
  collegeName: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  images: string[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  search?: string;
}

export interface ProductListState {
  products: Product[];
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

// TODO: AWS DynamoDB schema mapping
// Product table schema:
// PK: PRODUCT#<productId>
// SK: COLLEGE#<collegeId>
// GSI1PK: SELLER#<sellerId>
// GSI1SK: <createdAt>
// GSI2PK: COLLEGE#<collegeId>#CATEGORY#<category>
// GSI2SK: <createdAt>
