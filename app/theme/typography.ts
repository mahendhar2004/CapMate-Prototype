/**
 * CAPMATE Design System - Typography
 * Clean, readable typography for mobile screens
 */

import { TextStyle } from 'react-native';

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const typography = {
  // Headings
  h1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  } as TextStyle,
  h2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  } as TextStyle,
  h3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  } as TextStyle,
  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xl * lineHeights.tight,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * lineHeights.normal,
  } as TextStyle,
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * lineHeights.normal,
  } as TextStyle,
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,

  // Labels
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  labelSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xs * lineHeights.normal,
  } as TextStyle,

  // Special
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.md * lineHeights.tight,
  } as TextStyle,
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.xs * lineHeights.normal,
  } as TextStyle,
  price: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xl * lineHeights.tight,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
