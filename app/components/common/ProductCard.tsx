/**
 * ProductCard Component
 * Display product information in a card format - Enhanced design
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { Product } from '@types/product.types';
import { CategoryBadge } from './Badge';
import { formatPrice, formatRelativeTime } from '@utils/formatters';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  variant?: 'grid' | 'list' | 'featured';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  variant = 'grid',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isGrid = variant === 'grid';
  const isFeatured = variant === 'featured';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const renderGridCard = () => (
    <View style={styles.gridContainer}>
      {/* Image Section */}
      <View style={styles.gridImageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://picsum.photos/300/300' }}
          style={styles.gridImage}
          resizeMode="cover"
        />

        {/* Category Badge */}
        <View style={styles.categoryOverlay}>
          <CategoryBadge category={product.category} size="sm" />
        </View>

        {/* Sold Overlay */}
        {product.status === 'sold' && (
          <View style={styles.soldOverlay}>
            <View style={styles.soldBadge}>
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          </View>
        )}

        {/* Multiple Images Indicator */}
        {product.images.length > 1 && (
          <View style={styles.imageCountBadge}>
            <Text style={styles.imageCountText}>{product.images.length}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {product.title}
        </Text>

        <Text style={styles.gridPrice}>{formatPrice(product.price)}</Text>

        <View style={styles.gridFooter}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerDot} />
            <Text style={styles.gridCollege} numberOfLines={1}>
              {product.collegeName}
            </Text>
          </View>
          <Text style={styles.gridTime}>{formatRelativeTime(product.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  const renderListCard = () => (
    <View style={styles.listContainer}>
      {/* Image Section */}
      <View style={styles.listImageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://picsum.photos/200' }}
          style={styles.listImage}
          resizeMode="cover"
        />
        {product.status === 'sold' && (
          <View style={styles.soldOverlaySmall}>
            <Text style={styles.soldTextSmall}>SOLD</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.listContent}>
        <CategoryBadge category={product.category} size="sm" />

        <Text style={styles.listTitle} numberOfLines={1}>
          {product.title}
        </Text>

        <Text style={styles.listDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.listFooter}>
          <Text style={styles.listPrice}>{formatPrice(product.price)}</Text>
          <Text style={styles.listTime}>{formatRelativeTime(product.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  const renderFeaturedCard = () => (
    <View style={styles.featuredContainer}>
      {/* Full Width Image */}
      <View style={styles.featuredImageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://picsum.photos/400/300' }}
          style={styles.featuredImage}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <View style={styles.featuredGradient} />

        {/* Category Badge */}
        <View style={styles.featuredCategoryOverlay}>
          <CategoryBadge category={product.category} size="md" />
        </View>

        {/* Sold Overlay */}
        {product.status === 'sold' && (
          <View style={styles.soldOverlay}>
            <View style={styles.soldBadgeLarge}>
              <Text style={styles.soldTextLarge}>SOLD</Text>
            </View>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.featuredContent}>
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.featuredPrice}>{formatPrice(product.price)}</Text>
        </View>

        <Text style={styles.featuredDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.featuredFooter}>
          <View style={styles.featuredSeller}>
            <View style={styles.featuredAvatar}>
              <Text style={styles.featuredAvatarText}>
                {product.sellerName?.charAt(0) || 'S'}
              </Text>
            </View>
            <View>
              <Text style={styles.featuredSellerName}>{product.sellerName}</Text>
              <Text style={styles.featuredCollege}>{product.collegeName}</Text>
            </View>
          </View>
          <Text style={styles.featuredTime}>{formatRelativeTime(product.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {isGrid && renderGridCard()}
        {variant === 'list' && renderListCard()}
        {isFeatured && renderFeaturedCard()}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.95,
  },

  // Grid Card Styles
  gridContainer: {
    width: GRID_CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gridImageContainer: {
    height: GRID_CARD_WIDTH,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
  },
  gridContent: {
    padding: spacing.md,
  },
  gridTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  gridPrice: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  sellerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  gridCollege: {
    ...typography.caption,
    color: colors.textTertiary,
    flex: 1,
  },
  gridTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // List Card Styles
  listContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  listImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  listTitle: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.xs,
  },
  listDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  listPrice: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  listTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Featured Card Styles
  featuredContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  featuredImageContainer: {
    height: 200,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
  },
  featuredCategoryOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  featuredContent: {
    padding: spacing.lg,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  featuredTitle: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  featuredPrice: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  featuredDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  featuredSeller: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  featuredAvatarText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
  },
  featuredSellerName: {
    ...typography.label,
    color: colors.text,
  },
  featuredCollege: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  featuredTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Sold Overlay Styles
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  soldText: {
    ...typography.label,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 1,
  },
  soldOverlaySmall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldTextSmall: {
    ...typography.labelSmall,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 1,
  },
  soldBadgeLarge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  soldTextLarge: {
    ...typography.h4,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default ProductCard;
