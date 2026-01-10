/**
 * Mock Payment Service
 * Simulates payment gateway integration
 * TODO: Replace with actual Razorpay/Stripe integration
 */

import { delay, generateId } from '@utils/helpers';
import { ApiResponse, PaymentIntent, PaymentResult, PaymentStatus } from '@types/api.types';

// Simulated network delay
const MOCK_DELAY = 1500; // Longer delay to simulate payment processing

// Listing fee (in INR)
export const LISTING_FEE = 49;

/**
 * Create payment intent
 * In production: Razorpay/Stripe create order
 */
export const mockCreatePaymentIntent = async (
  amount: number
): Promise<ApiResponse<PaymentIntent>> => {
  await delay(MOCK_DELAY / 2);

  const paymentIntent: PaymentIntent = {
    id: `pay_${generateId()}`,
    amount,
    currency: 'INR',
    status: 'pending',
    clientSecret: `secret_${generateId()}`,
  };

  return {
    data: paymentIntent,
    error: null,
    success: true,
  };
};

/**
 * Process payment
 * In production: Razorpay/Stripe confirm payment
 */
export const mockProcessPayment = async (
  paymentIntentId: string,
  _paymentMethod: string = 'card'
): Promise<ApiResponse<PaymentResult>> => {
  await delay(MOCK_DELAY);

  // Simulate 95% success rate
  const isSuccess = Math.random() > 0.05;

  if (isSuccess) {
    return {
      data: {
        success: true,
        paymentId: paymentIntentId,
      },
      error: null,
      success: true,
    };
  }

  return {
    data: {
      success: false,
      error: 'Payment declined. Please try again.',
    },
    error: {
      code: 'PAYMENT_FAILED',
      message: 'Payment was declined by the bank',
    },
    success: false,
  };
};

/**
 * Get payment status
 * In production: Razorpay/Stripe retrieve payment
 */
export const mockGetPaymentStatus = async (
  paymentId: string
): Promise<ApiResponse<PaymentStatus>> => {
  await delay(MOCK_DELAY / 3);

  // For prototype, always return succeeded
  return {
    data: 'succeeded',
    error: null,
    success: true,
  };
};

/**
 * Verify payment signature
 * In production: Razorpay signature verification
 */
export const mockVerifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<ApiResponse<boolean>> => {
  await delay(MOCK_DELAY / 4);

  // For prototype, always return verified
  return {
    data: true,
    error: null,
    success: true,
  };
};

/**
 * Get payment methods
 * In production: Razorpay/Stripe get saved payment methods
 */
export const mockGetPaymentMethods = async (): Promise<
  ApiResponse<
    Array<{
      id: string;
      type: string;
      last4?: string;
      brand?: string;
    }>
  >
> => {
  await delay(MOCK_DELAY / 4);

  // Return mock saved cards
  return {
    data: [
      {
        id: 'pm_1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
      },
      {
        id: 'pm_2',
        type: 'upi',
      },
    ],
    error: null,
    success: true,
  };
};
