/**
 * Card Component
 * Reusable card container with variants
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@theme/index';

export type CardVariant = 'flat' | 'elevated' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'lg',
  style,
  onPress,
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
  },
  flat: {
    // No shadow
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default Card;
