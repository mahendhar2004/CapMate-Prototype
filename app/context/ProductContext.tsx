/**
 * Product Context
 * Manages product listings state
 */

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductListState,
} from '@types/product.types';
import { productService } from '@services/product.service';
import { PAGINATION } from '@constants/index';

// Action types
type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: { products: Product[]; hasMore: boolean; total: number } }
  | { type: 'APPEND_PRODUCTS'; payload: { products: Product[]; hasMore: boolean } }
  | { type: 'SET_FILTERS'; payload: ProductFilters }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'INCREMENT_PAGE' }
  | { type: 'RESET_PAGINATION' };

// Initial state
const initialState: ProductListState = {
  products: [],
  filters: {},
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Reducer
const productReducer = (state: ProductListState, action: ProductAction): ProductListState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.products,
        hasMore: action.payload.hasMore,
        isLoading: false,
        error: null,
        page: 1,
      };
    case 'APPEND_PRODUCTS':
      return {
        ...state,
        products: [...state.products, ...action.payload.products],
        hasMore: action.payload.hasMore,
        isLoading: false,
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, page: 1 };
    case 'CLEAR_FILTERS':
      return { ...state, filters: {}, page: 1 };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    case 'INCREMENT_PAGE':
      return { ...state, page: state.page + 1 };
    case 'RESET_PAGINATION':
      return { ...state, page: 1, hasMore: true };
    default:
      return state;
  }
};

// Context type
interface ProductContextType extends ProductListState {
  fetchProducts: (collegeId: string, refresh?: boolean) => Promise<void>;
  loadMore: (collegeId: string) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  clearFilters: () => void;
  createProduct: (
    input: CreateProductInput,
    sellerId: string,
    sellerName: string,
    sellerAvatar: string | undefined,
    collegeId: string,
    collegeName: string
  ) => Promise<Product | null>;
  updateProduct: (input: UpdateProductInput) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  activateProduct: (productId: string) => Promise<boolean>;
  markAsSold: (productId: string) => Promise<boolean>;
  clearError: () => void;
}

// Create context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch products
  const fetchProducts = useCallback(async (collegeId: string, refresh = false) => {
    if (refresh) {
      dispatch({ type: 'RESET_PAGINATION' });
    }
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await productService.getProducts(
      collegeId,
      state.filters,
      1,
      PAGINATION.DEFAULT_PAGE_SIZE
    );

    if (response.success && response.data) {
      dispatch({
        type: 'SET_PRODUCTS',
        payload: {
          products: response.data.items,
          hasMore: !!response.data.nextToken,
          total: response.data.total,
        },
      });
    } else {
      dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to fetch products' });
    }
  }, [state.filters]);

  // Load more products (pagination)
  const loadMore = useCallback(async (collegeId: string) => {
    if (!state.hasMore || state.isLoading) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    const nextPage = state.page + 1;

    const response = await productService.getProducts(
      collegeId,
      state.filters,
      nextPage,
      PAGINATION.DEFAULT_PAGE_SIZE
    );

    if (response.success && response.data) {
      dispatch({
        type: 'APPEND_PRODUCTS',
        payload: {
          products: response.data.items,
          hasMore: !!response.data.nextToken,
        },
      });
      dispatch({ type: 'INCREMENT_PAGE' });
    } else {
      dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to load more' });
    }
  }, [state.hasMore, state.isLoading, state.page, state.filters]);

  // Set filters
  const setFilters = useCallback((filters: ProductFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Create product
  const createProduct = useCallback(async (
    input: CreateProductInput,
    sellerId: string,
    sellerName: string,
    sellerAvatar: string | undefined,
    collegeId: string,
    collegeName: string
  ): Promise<Product | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await productService.createProduct(
      input,
      sellerId,
      sellerName,
      sellerAvatar,
      collegeId,
      collegeName
    );

    if (response.success && response.data) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return response.data;
    }

    dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to create product' });
    return null;
  }, []);

  // Update product
  const updateProduct = useCallback(async (input: UpdateProductInput): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await productService.updateProduct(input);

    if (response.success && response.data) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
      return true;
    }

    dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to update product' });
    return false;
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await productService.deleteProduct(productId);

    if (response.success) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      return true;
    }

    dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to delete product' });
    return false;
  }, []);

  // Activate product
  const activateProduct = useCallback(async (productId: string): Promise<boolean> => {
    const response = await productService.activateProduct(productId);

    if (response.success && response.data) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
      return true;
    }

    return false;
  }, []);

  // Mark as sold
  const markAsSold = useCallback(async (productId: string): Promise<boolean> => {
    const response = await productService.markAsSold(productId);

    if (response.success && response.data) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
      return true;
    }

    return false;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: ProductContextType = {
    ...state,
    fetchProducts,
    loadMore,
    setFilters,
    clearFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    activateProduct,
    markAsSold,
    clearError,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// Custom hook for using product context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
