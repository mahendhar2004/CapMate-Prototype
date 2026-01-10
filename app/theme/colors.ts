/**
 * CAPMATE Design System - Colors
 * Purple/Modern theme optimized for college-age users
 */

export const colors = {
  // Primary palette
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  primaryFaded: '#EDE9FE',

  // Secondary palette
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#BE185D',

  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderFocus: '#7C3AED',

  // Status colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Utility
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#E5E7EB',

  // Category colors (for badges)
  categoryColors: {
    electronics: '#3B82F6',
    furniture: '#8B5CF6',
    books: '#10B981',
    clothing: '#EC4899',
    sports: '#F59E0B',
    other: '#6B7280',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type CategoryColorKey = keyof typeof colors.categoryColors;
