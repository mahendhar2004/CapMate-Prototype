/**
 * ProductCard Component
 * Display product information in a card format - Single column layout
 */

import React, { useRef, useEffect } from 'react';
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
import { TIMING, EASING } from '@utils/animations';
import { getProductTags, ProductTag } from '@utils/helpers';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  variant?: 'default' | 'compact';
  index?: number; // For staggered animations
  allProducts?: Product[]; // For calculating relative tags like "most viewed"
}

// Product Tag Badge Component
const ProductTagBadge: React.FC<{ tag: ProductTag }> = ({ tag }) => (
  <View style={[styles.tagBadge, { backgroundColor: tag.bgColor }]}>
    {tag.icon && <Text style={styles.tagIcon}>{tag.icon}</Text>}
    <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
  </View>
);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const IMAGE_HEIGHT = 200;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  variant = 'default',
  index = 0,
  allProducts,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  // Calculate tags for this product
  const tags = getProductTags(product, allProducts);

  // Fade in on mount with stagger based on index
  useEffect(() => {
    const delay = Math.min(index * TIMING.stagger, 300); // Cap delay at 300ms
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TIMING.normal,
        delay,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: TIMING.normal,
        delay,
        easing: EASING.decelerate,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
    }).start();
  };

  const renderDefaultCard = () => (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://picsum.photos/400/300' }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Product Tags */}
        {tags.length > 0 && product.status !== 'sold' && (
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <ProductTagBadge key={tag.type} tag={tag} />
            ))}
          </View>
        )}

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
      <View style={styles.content}>
        {/* Category Badge - Now in content section */}
        <View style={styles.categoryRow}>
          <CategoryBadge category={product.category} size="sm" />
          <Text style={styles.time}>{formatRelativeTime(product.createdAt)}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Price */}
        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        {/* Footer with hostel */}
        <View style={styles.footer}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.hostelName} numberOfLines={1}>
              {product.hostelName || 'Campus'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderCompactCard = () => (
    <View style={styles.compactContainer}>
      {/* Image Section */}
      <View style={styles.compactImageContainer}>
        <Image
          source={{ uri: product.images[0] || 'https://picsum.photos/200' }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        {/* Compact Tags - show only first tag */}
        {tags.length > 0 && product.status !== 'sold' && (
          <View style={styles.compactTagContainer}>
            <View style={[styles.compactTagBadge, { backgroundColor: tags[0].bgColor }]}>
              {tags[0].icon && <Text style={styles.compactTagIcon}>{tags[0].icon}</Text>}
              <Text style={[styles.compactTagText, { color: tags[0].color }]}>{tags[0].label}</Text>
            </View>
          </View>
        )}
        {product.status === 'sold' && (
          <View style={styles.soldOverlaySmall}>
            <Text style={styles.soldTextSmall}>SOLD</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.compactContent}>
        <CategoryBadge category={product.category} size="sm" />

        <Text style={styles.compactTitle} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.compactFooter}>
          <Text style={styles.compactPrice}>{formatPrice(product.price)}</Text>
          <View style={styles.compactMeta}>
            <Text style={styles.compactHostel}>{product.hostelName || 'Campus'}</Text>
            <Text style={styles.compactDot}>·</Text>
            <Text style={styles.compactTime}>{formatRelativeTime(product.createdAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {variant === 'default' && renderDefaultCard()}
        {variant === 'compact' && renderCompactCard()}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.95,
  },

  // Default Card Styles (Full Width)
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountText: {
    ...typography.labelSmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  title: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationIcon: {
    fontSize: 12,
  },
  hostelName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Compact Card Styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  compactImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  compactTitle: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  compactFooter: {
    marginTop: spacing.sm,
  },
  compactPrice: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  compactHostel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  compactDot: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  compactTime: {
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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

  // Product Tags Styles
  tagsContainer: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  tagIcon: {
    fontSize: 10,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Compact Tag Styles
  compactTagContainer: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
  },
  compactTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  compactTagIcon: {
    fontSize: 8,
  },
  compactTagText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ProductCard;
