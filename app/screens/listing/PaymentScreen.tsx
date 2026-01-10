/**
 * Payment Screen
 * Mock payment flow for listing fee
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CreateListingStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Card } from '@components/common';
import { LoadingOverlay } from '@components/feedback';
import { useAuth } from '@context/AuthContext';
import { useProducts } from '@context/ProductContext';
import { paymentService } from '@services/payment.service';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { formatPrice } from '@utils/formatters';
import { LISTING_FEE } from '@mock/services/payment.mock';

type Props = CreateListingStackScreenProps<'Payment'>;

type PaymentMethod = 'card' | 'upi' | 'netbanking';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  icon: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'upi',
    label: 'UPI',
    icon: '📱',
    description: 'GPay, PhonePe, Paytm, etc.',
  },
  {
    id: 'card',
    label: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, Rupay',
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    icon: '🏦',
    description: 'All major banks',
  },
];

const PaymentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { product, images } = route.params;
  const { user } = useAuth();
  const { createProduct, activateProduct } = useProducts();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create product (pending status)
      const createdProduct = await createProduct(
        product,
        user.id,
        user.name,
        user.avatar,
        user.collegeId,
        user.collegeName
      );

      if (!createdProduct) {
        throw new Error('Failed to create listing');
      }

      // Step 2: Process payment (mock)
      const paymentResult = await paymentService.payForListing();

      if (!paymentResult.success || !paymentResult.data?.success) {
        throw new Error(paymentResult.data?.error || 'Payment failed');
      }

      // Step 3: Activate product
      const activated = await activateProduct(createdProduct.id);

      if (!activated) {
        throw new Error('Failed to activate listing');
      }

      // Success - navigate to success screen
      navigation.replace('Success', { productId: createdProduct.id });
    } catch (error) {
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      <Header title="Payment" showBack />

      <View style={styles.content}>
        {/* Order Summary */}
        <Card variant="outlined" style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Listing Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(LISTING_FEE)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(LISTING_FEE)}</Text>
          </View>
        </Card>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <View style={styles.methodsList}>
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodButton,
                selectedMethod === method.id && styles.methodButtonSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <View style={styles.methodInfo}>
                <Text
                  style={[
                    styles.methodLabel,
                    selectedMethod === method.id && styles.methodLabelSelected,
                  ]}
                >
                  {method.label}
                </Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              {selectedMethod === method.id && (
                <View style={styles.radioSelected}>
                  <View style={styles.radioInner} />
                </View>
              )}
              {selectedMethod !== method.id && <View style={styles.radio} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Mock Notice */}
        <View style={styles.mockNotice}>
          <Text style={styles.mockNoticeIcon}>🔒</Text>
          <Text style={styles.mockNoticeText}>
            This is a demo payment. No real transaction will be made. Click "Pay Now" to simulate a successful payment.
          </Text>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomPrice}>{formatPrice(LISTING_FEE)}</Text>
        </View>
        <Button
          title="Pay Now"
          onPress={handlePayment}
          loading={isProcessing}
          style={styles.payButton}
        />
      </View>

      <LoadingOverlay visible={isProcessing} message="Processing payment..." />
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  summaryCard: {
    marginBottom: spacing['2xl'],
  },
  summaryTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.text,
  },
  totalValue: {
    ...typography.h3,
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
  },
  methodsList: {
    gap: spacing.md,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  methodButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    ...typography.label,
    color: colors.text,
  },
  methodLabelSelected: {
    color: colors.primary,
  },
  methodDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  mockNotice: {
    flexDirection: 'row',
    marginTop: spacing['2xl'],
    padding: spacing.md,
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  mockNoticeIcon: {
    fontSize: 16,
  },
  mockNoticeText: {
    ...typography.bodySmall,
    color: colors.warning,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  payButton: {
    flex: 1,
    marginLeft: spacing.lg,
  },
});

export default PaymentScreen;
