/**
 * General helper utility functions
 */

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Delay function for simulating async operations
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Get placeholder image URL
 */
export const getPlaceholderImage = (width: number = 200, height: number = 200): string => {
  return `https://picsum.photos/${width}/${height}`;
};

/**
 * Get random placeholder image
 */
export const getRandomPlaceholderImage = (width: number = 200, height: number = 200): string => {
  const seed = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
};

/**
 * Create array of numbers
 */
export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Safe JSON parse
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Product Tag Types and Utilities
 */
export type ProductTagType =
  | 'fresh'           // Listed within 24 hours
  | 'hot'             // High view count (most viewed)
  | 'price_drop'      // Price reduced (future feature)
  | 'negotiable'      // Seller open to negotiation
  | 'quick_sale'      // Seller wants quick sale
  | 'premium'         // High-value item
  | 'verified'        // Verified seller
  | 'trending';       // Gaining views quickly

export interface ProductTag {
  type: ProductTagType;
  label: string;
  color: string;
  bgColor: string;
  icon?: string;
}

// Tag configurations
const TAG_CONFIGS: Record<ProductTagType, Omit<ProductTag, 'type'>> = {
  fresh: {
    label: 'FRESH',
    color: '#059669',      // Emerald
    bgColor: '#D1FAE5',
    icon: '✨',
  },
  hot: {
    label: 'HOT',
    color: '#DC2626',      // Red
    bgColor: '#FEE2E2',
    icon: '🔥',
  },
  price_drop: {
    label: 'PRICE DROP',
    color: '#7C3AED',      // Purple
    bgColor: '#EDE9FE',
    icon: '📉',
  },
  negotiable: {
    label: 'NEGOTIABLE',
    color: '#2563EB',      // Blue
    bgColor: '#DBEAFE',
    icon: '💬',
  },
  quick_sale: {
    label: 'QUICK SALE',
    color: '#EA580C',      // Orange
    bgColor: '#FFEDD5',
    icon: '⚡',
  },
  premium: {
    label: 'PREMIUM',
    color: '#B45309',      // Amber
    bgColor: '#FEF3C7',
    icon: '👑',
  },
  verified: {
    label: 'VERIFIED',
    color: '#0891B2',      // Cyan
    bgColor: '#CFFAFE',
    icon: '✓',
  },
  trending: {
    label: 'TRENDING',
    color: '#DB2777',      // Pink
    bgColor: '#FCE7F3',
    icon: '📈',
  },
};

/**
 * Get tag configuration
 */
export const getTagConfig = (type: ProductTagType): ProductTag => {
  return {
    type,
    ...TAG_CONFIGS[type],
  };
};

/**
 * Calculate hours since a date
 */
const hoursSince = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60);
};

/**
 * Determine product tags based on product data
 */
export const getProductTags = (
  product: {
    createdAt: string;
    viewCount: number;
    price: number;
    condition?: string;
  },
  allProducts?: { viewCount: number }[]
): ProductTag[] => {
  const tags: ProductTag[] = [];
  const hoursOld = hoursSince(product.createdAt);

  // Fresh tag - listed within 24 hours
  if (hoursOld <= 24) {
    tags.push(getTagConfig('fresh'));
  }

  // Hot/Most Viewed tag - top 20% by views or 200+ views
  if (allProducts && allProducts.length > 0) {
    const sortedByViews = [...allProducts].sort((a, b) => b.viewCount - a.viewCount);
    const topThreshold = Math.ceil(allProducts.length * 0.2);
    const topViewCounts = sortedByViews.slice(0, topThreshold).map(p => p.viewCount);
    const minHotViews = Math.min(...topViewCounts);

    if (product.viewCount >= minHotViews && product.viewCount >= 100) {
      tags.push(getTagConfig('hot'));
    }
  } else if (product.viewCount >= 200) {
    tags.push(getTagConfig('hot'));
  }

  // Trending - getting views quickly (more than 50 views in first 48 hours)
  if (hoursOld <= 48 && product.viewCount >= 50 && !tags.find(t => t.type === 'hot')) {
    tags.push(getTagConfig('trending'));
  }

  // Premium tag - high value items (10000+)
  if (product.price >= 10000) {
    tags.push(getTagConfig('premium'));
  }

  // Quick sale for lower priced good condition items
  if (product.price <= 1000 && product.condition === 'like_new') {
    tags.push(getTagConfig('quick_sale'));
  }

  // Limit to max 2 tags to avoid cluttering
  return tags.slice(0, 2);
};
