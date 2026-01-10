/**
 * ProductCard Component
 * Display product information in a card format for listings
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { Product } from '@types/product.types';
import { CategoryBadge } from './Badge';
import { formatPrice, formatRelativeTime } from '@utils/formatters';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  variant?: 'grid' | 'list';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  variant = 'grid',
}) => {
  const isGrid = variant === 'grid';

  return (
    <TouchableOpacity
      style={[styles.container, isGrid ? styles.gridContainer : styles.listContainer]}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, isGrid ? styles.gridImage : styles.listImage]}>
        <Image
          source={{ uri: product.images[0] || 'https://picsum.photos/200' }}
          style={styles.image}
          resizeMode="cover"
        />
        {product.status === 'sold' && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
      </View>

      <View style={[styles.content, isGrid ? styles.gridContent : styles.listContent]}>
        <CategoryBadge category={product.category} size="sm" />

        <Text style={styles.title} numberOfLines={isGrid ? 2 : 1}>
          {product.title}
        </Text>

        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        {!isGrid && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.college} numberOfLines={1}>
            {product.collegeName}
          </Text>
          <Text style={styles.time}>{formatRelativeTime(product.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  gridContainer: {
    width: GRID_CARD_WIDTH,
    marginBottom: spacing.lg,
  },
  listContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    marginHorizontal: spacing.lg,
  },
  imageContainer: {
    backgroundColor: colors.skeleton,
    overflow: 'hidden',
  },
  gridImage: {
    height: GRID_CARD_WIDTH,
    width: '100%',
  },
  listImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: {
    ...typography.h4,
    color: colors.textInverse,
    letterSpacing: 2,
  },
  content: {
    padding: spacing.md,
  },
  gridContent: {
    // Default padding
  },
  listContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.sm,
  },
  price: {
    ...typography.price,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  college: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});

export default ProductCard;
