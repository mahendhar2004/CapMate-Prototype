/**
 * CAPMATE Design System - Theme Export
 * Central export for all theme values
 */

export { colors, type ColorKey, type CategoryColorKey } from './colors';
export {
  typography,
  fontSizes,
  fontWeights,
  lineHeights,
  type TypographyVariant,
} from './typography';
export {
  spacing,
  borderRadius,
  iconSizes,
  hitSlop,
  type SpacingKey,
  type BorderRadiusKey,
  type IconSizeKey,
} from './spacing';

// Shadow styles for elevated surfaces
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export type ShadowKey = keyof typeof shadows;
