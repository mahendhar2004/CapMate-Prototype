/**
 * Badge Component
 * For categories, status indicators, and tags
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { ProductCategory, ProductCondition, ListingStatus } from '@types/product.types';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.base, styles[variant], styles[`size_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`], textStyle]}>
        {label}
      </Text>
    </View>
  );
};

// Helper function for category badges
export const getCategoryBadgeColor = (category: ProductCategory): string => {
  const categoryColors: Record<ProductCategory, string> = {
    electronics: colors.categoryColors.electronics,
    furniture: colors.categoryColors.furniture,
    books: colors.categoryColors.books,
    clothing: colors.categoryColors.clothing,
    sports: colors.categoryColors.sports,
    kitchen: colors.warning,
    decor: colors.secondary,
    cycles: colors.success,
    other: colors.categoryColors.other,
  };
  return categoryColors[category];
};

// Helper function for condition badges
export const getConditionBadgeVariant = (condition: ProductCondition): BadgeVariant => {
  const conditionVariants: Record<ProductCondition, BadgeVariant> = {
    new: 'success',
    like_new: 'info',
    good: 'default',
    fair: 'warning',
  };
  return conditionVariants[condition];
};

// Helper function for status badges
export const getStatusBadgeVariant = (status: ListingStatus): BadgeVariant => {
  const statusVariants: Record<ListingStatus, BadgeVariant> = {
    draft: 'default',
    pending_payment: 'warning',
    active: 'success',
    sold: 'info',
    expired: 'error',
  };
  return statusVariants[status];
};

interface CategoryBadgeProps {
  category: ProductCategory;
  size?: BadgeSize;
  style?: ViewStyle;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm', style }) => {
  const color = getCategoryBadgeColor(category);
  const label = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');

  return (
    <View
      style={[
        styles.base,
        styles[`size_${size}`],
        { backgroundColor: `${color}20` },
        style,
      ]}
    >
      <Text style={[styles.text, styles[`text_${size}`], { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  size_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  // Variants
  default: {
    backgroundColor: colors.borderLight,
  },
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  error: {
    backgroundColor: colors.errorLight,
  },
  info: {
    backgroundColor: colors.infoLight,
  },

  // Text
  text: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  text_default: {
    color: colors.textSecondary,
  },
  text_success: {
    color: colors.success,
  },
  text_warning: {
    color: colors.warning,
  },
  text_error: {
    color: colors.error,
  },
  text_info: {
    color: colors.info,
  },
  text_sm: {
    fontSize: 10,
  },
  text_md: {
    fontSize: 12,
  },
});

export default Badge;
