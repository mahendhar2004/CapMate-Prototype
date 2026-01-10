/**
 * Review Listing Screen
 * Preview listing before payment
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { CreateListingStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Card, Badge, CategoryBadge } from '@components/common';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { formatPrice, formatCondition } from '@utils/formatters';
import { getConditionBadgeVariant } from '@components/common/Badge';
import { LISTING_FEE } from '@mock/services/payment.mock';

type Props = CreateListingStackScreenProps<'ReviewListing'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ReviewListingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { product, images } = route.params;

  const handleEdit = () => {
    navigation.goBack();
  };

  const handleProceedToPayment = () => {
    navigation.navigate('Payment', { product, images });
  };

  const displayImages = images.length > 0 ? images : ['https://picsum.photos/400/300'];

  return (
    <Container withPadding={false}>
      <Header title="Review Listing" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Preview Card */}
        <Card variant="elevated" padding="none" style={styles.previewCard}>
          <Text style={styles.previewLabel}>PREVIEW</Text>

          {/* Image */}
          <Image
            source={{ uri: displayImages[0] }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          {/* Content */}
          <View style={styles.previewContent}>
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

            <View style={styles.divider} />

            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>

            {images.length > 1 && (
              <View style={styles.moreImages}>
                <Text style={styles.moreImagesText}>
                  +{images.length - 1} more photo{images.length > 2 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Listing Fee Info */}
        <Card variant="outlined" style={styles.feeCard}>
          <View style={styles.feeRow}>
            <View>
              <Text style={styles.feeLabel}>Listing Fee</Text>
              <Text style={styles.feeDescription}>
                One-time payment to publish your listing
              </Text>
            </View>
            <Text style={styles.feeAmount}>{formatPrice(LISTING_FEE)}</Text>
          </View>

          <View style={styles.feeBenefits}>
            <Text style={styles.benefitItem}>✓ Listing visible for 30 days</Text>
            <Text style={styles.benefitItem}>✓ Reach all students in your college</Text>
            <Text style={styles.benefitItem}>✓ Direct contact with buyers</Text>
          </View>
        </Card>

        {/* Notice */}
        <View style={styles.notice}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <Text style={styles.noticeText}>
            Your listing will be published immediately after payment. You can edit or remove it anytime from "My Listings".
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <Button
          title="Edit"
          variant="outline"
          onPress={handleEdit}
          style={styles.editButton}
        />
        <Button
          title={`Pay ${formatPrice(LISTING_FEE)} to Post`}
          onPress={handleProceedToPayment}
          style={styles.payButton}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  previewCard: {
    margin: spacing.lg,
    overflow: 'hidden',
  },
  previewLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.borderLight,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    letterSpacing: 2,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  previewContent: {
    padding: spacing.lg,
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
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  },
  descriptionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  moreImages: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  moreImagesText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  feeCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  feeLabel: {
    ...typography.h4,
    color: colors.text,
  },
  feeDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  feeAmount: {
    ...typography.h3,
    color: colors.primary,
  },
  feeBenefits: {
    gap: spacing.sm,
  },
  benefitItem: {
    ...typography.bodySmall,
    color: colors.success,
  },
  notice: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing['2xl'],
    padding: spacing.md,
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    ...typography.bodySmall,
    color: colors.info,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  editButton: {
    flex: 0.4,
  },
  payButton: {
    flex: 0.6,
  },
});

export default ReviewListingScreen;
