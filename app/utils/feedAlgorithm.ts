/**
 * Feed Priority Algorithm
 * Calculates priority scores for products to show the most relevant items first
 *
 * Factors considered:
 * 1. Recency - Newer items get higher priority
 * 2. Engagement - Higher view counts indicate popular items
 * 3. Price attractiveness - Items priced competitively for their category
 * 4. Image quality - Items with multiple images rank higher
 * 5. Completeness - Items with full details rank higher
 */

import { Product, ProductCategory } from '@types/product.types';

// Weight configuration for priority calculation
const WEIGHTS = {
  recency: 0.35,        // 35% - How recent the listing is
  engagement: 0.20,     // 20% - View count and interaction
  priceScore: 0.15,     // 15% - Price competitiveness
  imageQuality: 0.15,   // 15% - Number and quality of images
  completeness: 0.15,   // 15% - Profile and description completeness
};

// Average prices by category (for price scoring)
const CATEGORY_AVG_PRICES: Record<ProductCategory, number> = {
  electronics: 15000,
  furniture: 4000,
  books: 500,
  clothing: 1500,
  sports: 3000,
  kitchen: 2000,
  decor: 1000,
  cycles: 6000,
  other: 2000,
};

/**
 * Calculate recency score (0-100)
 * Items posted within last 24 hours get max score
 * Score decreases logarithmically with age
 */
const calculateRecencyScore = (createdAt: string): number => {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const hoursAgo = (now - created) / (1000 * 60 * 60);

  if (hoursAgo <= 1) return 100;
  if (hoursAgo <= 6) return 95;
  if (hoursAgo <= 12) return 90;
  if (hoursAgo <= 24) return 85;
  if (hoursAgo <= 48) return 75;
  if (hoursAgo <= 72) return 65;
  if (hoursAgo <= 168) return 50; // 1 week
  if (hoursAgo <= 336) return 35; // 2 weeks
  if (hoursAgo <= 720) return 20; // 1 month
  return 10;
};

/**
 * Calculate engagement score (0-100)
 * Based on view count with diminishing returns
 */
const calculateEngagementScore = (viewCount: number): number => {
  if (viewCount >= 500) return 100;
  if (viewCount >= 300) return 90;
  if (viewCount >= 200) return 80;
  if (viewCount >= 100) return 70;
  if (viewCount >= 50) return 60;
  if (viewCount >= 25) return 50;
  if (viewCount >= 10) return 40;
  if (viewCount >= 5) return 30;
  return 20;
};

/**
 * Calculate price attractiveness score (0-100)
 * Items priced below category average get higher scores
 */
const calculatePriceScore = (price: number, category: ProductCategory): number => {
  const avgPrice = CATEGORY_AVG_PRICES[category];
  const ratio = price / avgPrice;

  if (ratio <= 0.3) return 100;  // 70%+ below average - great deal
  if (ratio <= 0.5) return 90;   // 50%+ below average
  if (ratio <= 0.7) return 80;   // 30%+ below average
  if (ratio <= 0.9) return 70;   // 10%+ below average
  if (ratio <= 1.1) return 60;   // Around average
  if (ratio <= 1.3) return 50;   // 10-30% above average
  if (ratio <= 1.5) return 40;   // 30-50% above average
  return 30;                      // 50%+ above average
};

/**
 * Calculate image quality score (0-100)
 * More images = higher score
 */
const calculateImageScore = (images: string[]): number => {
  const count = images.length;
  if (count >= 5) return 100;
  if (count >= 4) return 90;
  if (count >= 3) return 80;
  if (count >= 2) return 60;
  if (count >= 1) return 40;
  return 10;
};

/**
 * Calculate completeness score (0-100)
 * Based on description length, seller avatar, hostel name
 */
const calculateCompletenessScore = (product: Product): number => {
  let score = 0;

  // Description length (max 40 points)
  const descLength = product.description.length;
  if (descLength >= 200) score += 40;
  else if (descLength >= 100) score += 30;
  else if (descLength >= 50) score += 20;
  else score += 10;

  // Has seller avatar (20 points)
  if (product.sellerAvatar) score += 20;

  // Has hostel name (20 points)
  if (product.hostelName) score += 20;

  // Title quality (20 points)
  const titleLength = product.title.length;
  if (titleLength >= 20 && titleLength <= 60) score += 20;
  else if (titleLength >= 10) score += 10;

  return score;
};

/**
 * Calculate overall priority score for a product
 */
export const calculatePriorityScore = (product: Product): number => {
  const recencyScore = calculateRecencyScore(product.createdAt);
  const engagementScore = calculateEngagementScore(product.viewCount);
  const priceScore = calculatePriceScore(product.price, product.category);
  const imageScore = calculateImageScore(product.images);
  const completenessScore = calculateCompletenessScore(product);

  const totalScore =
    recencyScore * WEIGHTS.recency +
    engagementScore * WEIGHTS.engagement +
    priceScore * WEIGHTS.priceScore +
    imageScore * WEIGHTS.imageQuality +
    completenessScore * WEIGHTS.completeness;

  return Math.round(totalScore * 100) / 100;
};

/**
 * Sort products by priority score
 */
export const sortByPriority = (products: Product[]): Product[] => {
  return [...products].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreB - scoreA;
  });
};

/**
 * Sort products by different criteria
 */
export type SortOption = 'priority' | 'newest' | 'price_low' | 'price_high' | 'popular';

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'priority':
      return sortByPriority(sorted);

    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);

    case 'popular':
      return sorted.sort((a, b) => b.viewCount - a.viewCount);

    default:
      return sortByPriority(sorted);
  }
};

/**
 * Get sort option label for display
 */
export const getSortOptionLabel = (sortBy: SortOption): string => {
  switch (sortBy) {
    case 'priority':
      return 'Best Match';
    case 'newest':
      return 'Newest First';
    case 'price_low':
      return 'Price: Low to High';
    case 'price_high':
      return 'Price: High to Low';
    case 'popular':
      return 'Most Popular';
    default:
      return 'Best Match';
  }
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'priority', label: 'Best Match' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];
