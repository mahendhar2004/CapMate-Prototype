/**
 * Product Detail Screen
 * Full product information with seller contact
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { HomeStackScreenProps } from '@types/navigation.types';
import { Product } from '@types/product.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Avatar, Badge, CategoryBadge, Card } from '@components/common';
import { Loading } from '@components/feedback';
import { productService } from '@services/product.service';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { formatPrice, formatRelativeTime, formatCondition } from '@utils/formatters';
import { getConditionBadgeVariant } from '@components/common/Badge';

type Props = HomeStackScreenProps<'ProductDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId, product: initialProduct } = route.params;
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!initialProduct) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    const response = await productService.getProductById(productId);
    if (response.success && response.data) {
      setProduct(response.data);
    }
    setIsLoading(false);
  };

  const handleContactSeller = () => {
    // In production, this would open chat or show contact options
    Alert.alert(
      'Contact Seller',
      `This would open a chat with ${product?.sellerName || 'the seller'}.\n\nIn the full version, you'll be able to message sellers directly through the app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email (Demo)',
          onPress: () => {
            // Demo email functionality
            const email = `seller@demo.com`;
            const subject = `Interested in: ${product?.title}`;
            const body = `Hi, I'm interested in your listing "${product?.title}" on CAPMATE.`;
            Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };

  if (isLoading || !product) {
    return (
      <Container>
        <Header showBack title="Product Details" />
        <Loading fullScreen message="Loading product..." />
      </Container>
    );
  }

  const images = product.images.length > 0 ? product.images : ['https://picsum.photos/400/300'];

  return (
    <Container withPadding={false}>
      <Header
        showBack
        transparent
        rightAction={
          <TouchableOpacity onPress={handleShare}>
            <Text style={styles.shareIcon}>↗</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={event => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(index);
            }}
          >
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === activeImageIndex && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Sold Overlay */}
          {product.status === 'sold' && (
            <View style={styles.soldOverlay}>
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.titleRow}>
            <View style={styles.badges}>
              <CategoryBadge category={product.category} />
              <Badge
                label={formatCondition(product.condition)}
                variant={getConditionBadgeVariant(product.condition)}
                size="sm"
              />
            </View>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Posted {formatRelativeTime(product.createdAt)}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{product.viewCount} views</Text>
          </View>

          {/* Description */}
          <Card variant="flat" padding="lg" style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </Card>

          {/* Seller Info */}
          <Card variant="outlined" padding="lg" style={styles.sellerCard}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <View style={styles.sellerRow}>
              <Avatar
                source={product.sellerAvatar}
                name={product.sellerName}
                size="lg"
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{product.sellerName}</Text>
                <Text style={styles.sellerCollege}>{product.collegeName}</Text>
              </View>
            </View>
          </Card>

          {/* Location Info */}
          <Card variant="flat" padding="lg" style={styles.locationCard}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>
              📍 {product.collegeName}
            </Text>
            <Text style={styles.locationHint}>
              Meet at a safe location on campus for pickup
            </Text>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {product.status === 'active' && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPrice}>
            <Text style={styles.bottomPriceLabel}>Price</Text>
            <Text style={styles.bottomPriceValue}>{formatPrice(product.price)}</Text>
          </View>
          <Button
            title="Contact Seller"
            onPress={handleContactSeller}
            style={styles.contactButton}
          />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: IMAGE_HEIGHT,
    backgroundColor: colors.skeleton,
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: colors.surface,
    width: 24,
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: {
    ...typography.h1,
    color: colors.textInverse,
    letterSpacing: 4,
  },
  content: {
    padding: spacing.lg,
  },
  titleRow: {
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  metaDot: {
    color: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  descriptionCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.borderLight,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  sellerCard: {
    marginBottom: spacing.lg,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  sellerName: {
    ...typography.h4,
    color: colors.text,
  },
  sellerCollege: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationCard: {
    marginBottom: spacing['2xl'],
    backgroundColor: colors.borderLight,
  },
  locationText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  locationHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  bottomPrice: {
    flex: 1,
  },
  bottomPriceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomPriceValue: {
    ...typography.h3,
    color: colors.primary,
  },
  contactButton: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  shareIcon: {
    fontSize: 24,
    color: colors.primary,
  },
});

export default ProductDetailScreen;
