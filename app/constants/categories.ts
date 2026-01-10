/**
 * Product category constants
 */

import { ProductCategory } from '@types/product.types';

export interface CategoryOption {
  value: ProductCategory;
  label: string;
  icon: string; // Emoji for simplicity, can be replaced with icon components
}

export const CATEGORIES: CategoryOption[] = [
  { value: 'electronics', label: 'Electronics', icon: '📱' },
  { value: 'furniture', label: 'Furniture', icon: '🪑' },
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'sports', label: 'Sports', icon: '🏀' },
  { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'decor', label: 'Decor', icon: '🖼️' },
  { value: 'cycles', label: 'Cycles', icon: '🚲' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export const getCategoryLabel = (value: ProductCategory): string => {
  const category = CATEGORIES.find(c => c.value === value);
  return category?.label || value;
};

export const getCategoryIcon = (value: ProductCategory): string => {
  const category = CATEGORIES.find(c => c.value === value);
  return category?.icon || '📦';
};
