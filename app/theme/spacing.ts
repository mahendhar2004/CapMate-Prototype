/**
 * CAPMATE Design System - Spacing
 * Consistent spacing scale based on 4px grid
 */

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
} as const;

export const hitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type IconSizeKey = keyof typeof iconSizes;
