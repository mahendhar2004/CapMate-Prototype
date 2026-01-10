/**
 * Product condition constants
 */

import { ProductCondition } from '@types/product.types';

export interface ConditionOption {
  value: ProductCondition;
  label: string;
  description: string;
}

export const CONDITIONS: ConditionOption[] = [
  {
    value: 'new',
    label: 'New',
    description: 'Brand new, unused item with tags',
  },
  {
    value: 'like_new',
    label: 'Like New',
    description: 'Used only once or twice, excellent condition',
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Used but well maintained, minor wear',
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Shows visible wear, fully functional',
  },
];

export const getConditionLabel = (value: ProductCondition): string => {
  const condition = CONDITIONS.find(c => c.value === value);
  return condition?.label || value;
};

export const getConditionDescription = (value: ProductCondition): string => {
  const condition = CONDITIONS.find(c => c.value === value);
  return condition?.description || '';
};
