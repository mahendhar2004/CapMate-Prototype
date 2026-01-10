/**
 * Product Detail Screen
 * Full product information with image gallery and seller contact
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
  Share,
} from 'react-native';
import { HomeStackScreenProps } from '@types/navigation.types';
import { Product } from '@types/product.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Avatar, Badge, CategoryBadge, Card, ImageViewer } from '@components/common';
import { Loading } from '@components/feedback';
import { productService } from '@services/product.service';
import { useToast } from '@context/ToastContext';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { formatPrice, formatRelativeTime, formatCondition } from '@utils/formatters';
import { getConditionBadgeVariant } from '@components/common/Badge';

type Props = HomeStackScreenProps<'ProductDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId, product: initialProduct } = route.params;
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [isLoading, setIsLoading] = useState(!initialProduct);
  const { showToast } = useToast();
  const scrollY = useRef(new Animated.Value(0)).current;

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
    Alert.alert(
      'Contact Seller',
      `How would you like to contact ${product?.sellerName || 'the seller'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Chat (Coming Soon)',
          onPress: () => showToast('In-app chat coming soon!', 'info'),
        },
        {
          text: 'Email',
          onPress: () => {
            const email = `seller@demo.com`;
            const subject = `Interested in: ${product?.title}`;
            const body = `Hi ${product?.sellerName},\n\nI'm interested in your listing "${product?.title}" priced at ${formatPrice(product?.price || 0)} on CAPMATE.\n\nIs it still available?\n\nThanks!`;
            Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${product?.title}" for ${formatPrice(product?.price || 0)} on CAPMATE!\n\nDownload the app to browse more items from your college.`,
        title: product?.title,
      });
    } catch (error) {
      showToast('Failed to share', 'error');
    }
  };

  const handleSaveItem = () => {
    showToast('Item saved to favorites!', 'success');
  };

  const handleReportItem = () => {
    Alert.alert(
      'Report Listing',
      'Why are you reporting this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Inappropriate Content',
          onPress: () => showToast('Report submitted. Thank you!', 'success'),
        },
        {
          text: 'Suspicious/Scam',
          onPress: () => showToast('Report submitted. Thank you!', 'success'),
        },
        {
          text: 'Wrong Category',
          onPress: () => showToast('Report submitted. Thank you!', 'success'),
        },
      ]
    );
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
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSaveItem}>
              <Text style={styles.headerIcon}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <Text style={styles.headerIcon}>↗</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <ImageViewer
            images={images}
            height={SCREEN_WIDTH * 0.85}
            showPagination
          />

          {/* Sold Overlay */}
          {product.status === 'sold' && (
            <View style={styles.soldBanner}>
              <Text style={styles.soldBannerText}>This item has been sold</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Price and Title Section */}
          <View style={styles.mainSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
              {product.status === 'sold' && (
                <Badge label="Sold" variant="error" size="md" />
              )}
            </View>

            <Text style={styles.title}>{product.title}</Text>

            <View style={styles.badges}>
              <CategoryBadge category={product.category} />
              <Badge
                label={formatCondition(product.condition)}
                variant={getConditionBadgeVariant(product.condition)}
                size="sm"
              />
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>👁</Text>
                <Text style={styles.metaText}>{product.viewCount || 0} views</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>🕐</Text>
                <Text style={styles.metaText}>{formatRelativeTime(product.createdAt)}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleSaveItem}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>♡</Text>
              </View>
              <Text style={styles.quickActionLabel}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleShare}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>↗</Text>
              </View>
              <Text style={styles.quickActionLabel}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleReportItem}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>⚠</Text>
              </View>
              <Text style={styles.quickActionLabel}>Report</Text>
            </TouchableOpacity>
          </View>

          {/* Description Card */}
          <Card variant="flat" padding="lg" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.description}>{product.description}</Text>
          </Card>

          {/* Seller Card */}
          <Card variant="elevated" padding="lg" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👤</Text>
              <Text style={styles.sectionTitle}>Seller Information</Text>
            </View>
            <TouchableOpacity style={styles.sellerRow} activeOpacity={0.7}>
              <Avatar
                source={product.sellerAvatar}
                name={product.sellerName}
                size="lg"
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{product.sellerName}</Text>
                <View style={styles.sellerMeta}>
                  <Text style={styles.sellerCollege}>🎓 {product.collegeName}</Text>
                </View>
                <View style={styles.sellerStats}>
                  <View style={styles.sellerStat}>
                    <Text style={styles.sellerStatValue}>•</Text>
                    <Text style={styles.sellerStatLabel}>Verified Student</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.sellerArrow}>›</Text>
            </TouchableOpacity>
          </Card>

          {/* Location Card */}
          <Card variant="flat" padding="lg" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📍</Text>
              <Text style={styles.sectionTitle}>Pickup Location</Text>
            </View>
            <View style={styles.locationContent}>
              <Text style={styles.locationName}>{product.collegeName}</Text>
              <Text style={styles.locationHint}>
                Coordinate with seller for a safe pickup location on campus
              </Text>
            </View>
          </Card>

          {/* Safety Tips */}
          <Card variant="flat" padding="lg" style={[styles.card, styles.safetyCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🛡</Text>
              <Text style={styles.sectionTitle}>Safety Tips</Text>
            </View>
            <View style={styles.safetyTips}>
              <Text style={styles.safetyTip}>• Meet in a public area on campus</Text>
              <Text style={styles.safetyTip}>• Inspect the item before paying</Text>
              <Text style={styles.safetyTip}>• Use UPI/digital payments when possible</Text>
              <Text style={styles.safetyTip}>• Trust your instincts</Text>
            </View>
          </Card>
        </View>

        {/* Spacer for bottom bar */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {/* Bottom CTA */}
      {product.status === 'active' && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPrice}>
            <Text style={styles.bottomPriceLabel}>Total Price</Text>
            <Text style={styles.bottomPriceValue}>{formatPrice(product.price)}</Text>
          </View>
          <Button
            title="Contact Seller"
            onPress={handleContactSeller}
            size="lg"
            style={styles.contactButton}
          />
        </View>
      )}

      {product.status === 'sold' && (
        <View style={styles.soldBottomBar}>
          <Text style={styles.soldBottomText}>This item is no longer available</Text>
          <Button
            title="Browse Similar Items"
            variant="outline"
            onPress={() => navigation.goBack()}
            fullWidth
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  headerIcon: {
    fontSize: 20,
    color: colors.text,
  },
  imageSection: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
  },
  soldBanner: {
    backgroundColor: colors.error,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  soldBannerText: {
    ...typography.label,
    color: colors.textInverse,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  mainSection: {
    marginBottom: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  price: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  sellerName: {
    ...typography.h4,
    color: colors.text,
  },
  sellerMeta: {
    marginTop: 2,
  },
  sellerCollege: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sellerStats: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.md,
  },
  sellerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sellerStatValue: {
    ...typography.label,
    color: colors.success,
  },
  sellerStatLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  sellerArrow: {
    ...typography.h2,
    color: colors.textTertiary,
  },
  locationContent: {
    gap: spacing.xs,
  },
  locationName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  locationHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  safetyCard: {
    backgroundColor: colors.successLight,
  },
  safetyTips: {
    gap: spacing.xs,
  },
  safetyTip: {
    ...typography.bodySmall,
    color: colors.successDark,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.xl,
  },
  bottomPrice: {
    flex: 0.4,
  },
  bottomPriceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomPriceValue: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
  },
  contactButton: {
    flex: 0.6,
  },
  soldBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.xl,
    gap: spacing.md,
  },
  soldBottomText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
