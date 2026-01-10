/**
 * Environment Configuration
 * Centralized environment variables
 *
 * TODO: Replace with actual environment variables when deploying
 * Use react-native-dotenv or expo-constants for production
 */

export const ENV = {
  // App Info
  APP_NAME: 'CAPMATE',
  APP_VERSION: '1.0.0',
  APP_ENV: __DEV__ ? 'development' : 'production',

  // API Configuration
  // TODO: Replace with actual AWS endpoints
  API_BASE_URL: 'https://api.capmate.app',
  API_TIMEOUT: 30000,

  // AWS Configuration (Placeholder)
  // TODO: Add actual AWS configuration
  AWS_REGION: 'ap-south-1',
  COGNITO_USER_POOL_ID: 'ap-south-1_XXXXXXXXX',
  COGNITO_CLIENT_ID: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  APPSYNC_ENDPOINT: 'https://xxxxxxxxxx.appsync-api.ap-south-1.amazonaws.com/graphql',
  S3_BUCKET: 'capmate-uploads',

  // Payment Configuration (Placeholder)
  // TODO: Add actual payment gateway keys
  RAZORPAY_KEY_ID: 'rzp_test_XXXXXXXXXXXXXX',
  PAYMENT_CURRENCY: 'INR',

  // Feature Flags
  FEATURES: {
    ENABLE_PAYMENTS: false, // Disabled in prototype
    ENABLE_CHAT: false, // Future feature
    ENABLE_NOTIFICATIONS: false, // Future feature
    ENABLE_ANALYTICS: false, // Future feature
  },

  // Timeouts
  NETWORK_TIMEOUT: 30000,
  SESSION_TIMEOUT: 3600000, // 1 hour

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export type EnvConfig = typeof ENV;
