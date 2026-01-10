/**
 * Constants barrel export
 */

export * from './categories';
export * from './conditions';
export * from './colleges';

// App-wide constants
export const APP_NAME = 'CAPMATE';

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@capmate/auth_token',
  USER_DATA: '@capmate/user_data',
  COLLEGE_ID: '@capmate/college_id',
  ONBOARDING_COMPLETE: '@capmate/onboarding_complete',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 100000,
  STEP: 100,
} as const;

export const IMAGE_CONFIG = {
  MAX_IMAGES: 5,
  MAX_SIZE_MB: 5,
  QUALITY: 0.8,
  ASPECT_RATIO: [4, 3] as [number, number],
} as const;

// Graduation years (current year to current year + 6)
export const getGraduationYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, i) => currentYear + i);
};
