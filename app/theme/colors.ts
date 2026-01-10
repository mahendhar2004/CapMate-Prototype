/**
 * CAPMATE Design System - Colors
 * Purple/Modern theme optimized for college-age users
 */

export const colors = {
  // Primary palette - Vibrant Purple
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  primaryFaded: '#EDE9FE',
  primaryGradientStart: '#8B5CF6',
  primaryGradientEnd: '#6366F1',

  // Secondary palette - Pink accent
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#BE185D',
  secondaryFaded: '#FCE7F3',

  // Accent colors
  accent: '#06B6D4',
  accentLight: '#67E8F9',
  accentDark: '#0891B2',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',

  // Text
  text: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textMuted: '#CBD5E1',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#7C3AED',
  borderHover: '#CBD5E1',

  // Status colors
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#2563EB',

  // Utility
  transparent: 'transparent',
  overlay: 'rgba(15, 23, 42, 0.6)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
  skeleton: '#E2E8F0',
  shimmer: '#F1F5F9',
  backdrop: 'rgba(0, 0, 0, 0.5)',

  // Category colors (for badges)
  categoryColors: {
    electronics: '#3B82F6',
    furniture: '#8B5CF6',
    books: '#10B981',
    clothing: '#EC4899',
    sports: '#F59E0B',
    kitchen: '#F97316',
    decor: '#06B6D4',
    cycles: '#84CC16',
    other: '#64748B',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type CategoryColorKey = keyof typeof colors.categoryColors;
