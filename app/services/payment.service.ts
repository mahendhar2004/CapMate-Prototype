/**
 * Payment Service
 * Abstraction layer for payment operations
 * Currently uses mock services, will be replaced with Razorpay/Stripe
 */

import { ApiResponse, PaymentIntent, PaymentResult, PaymentStatus } from '@types/api.types';
import {
  mockCreatePaymentIntent,
  mockProcessPayment,
  mockGetPaymentStatus,
  mockVerifyPayment,
  mockGetPaymentMethods,
  LISTING_FEE,
} from '@mock/services/payment.mock';

// TODO: Import Razorpay SDK when ready
// import RazorpayCheckout from 'react-native-razorpay';

/**
 * PaymentService class implementing repository pattern
 * Swap mock implementations with Razorpay/Stripe when ready
 */
class PaymentService {
  readonly listingFee = LISTING_FEE;

  /**
   * Create a payment intent for listing fee
   * TODO: Replace with Razorpay.createOrder()
   */
  async createPaymentIntent(amount: number = LISTING_FEE): Promise<ApiResponse<PaymentIntent>> {
    return mockCreatePaymentIntent(amount);
  }

  /**
   * Process payment
   * TODO: Replace with RazorpayCheckout.open()
   */
  async processPayment(
    paymentIntentId: string,
    paymentMethod?: string
  ): Promise<ApiResponse<PaymentResult>> {
    return mockProcessPayment(paymentIntentId, paymentMethod);
  }

  /**
   * Get payment status
   * TODO: Replace with Razorpay.fetchPayment()
   */
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentStatus>> {
    return mockGetPaymentStatus(paymentId);
  }

  /**
   * Verify payment signature
   * TODO: Replace with server-side Razorpay verification
   */
  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<ApiResponse<boolean>> {
    return mockVerifyPayment(orderId, paymentId, signature);
  }

  /**
   * Get saved payment methods
   * TODO: Implement with Razorpay saved cards
   */
  async getPaymentMethods(): Promise<
    ApiResponse<
      Array<{
        id: string;
        type: string;
        last4?: string;
        brand?: string;
      }>
    >
  > {
    return mockGetPaymentMethods();
  }

  /**
   * Process listing payment (convenience method)
   */
  async payForListing(): Promise<ApiResponse<PaymentResult>> {
    // Create payment intent
    const intentResponse = await this.createPaymentIntent(LISTING_FEE);
    if (!intentResponse.success || !intentResponse.data) {
      return {
        data: { success: false, error: 'Failed to create payment' },
        error: intentResponse.error,
        success: false,
      };
    }

    // Process payment
    return this.processPayment(intentResponse.data.id);
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
