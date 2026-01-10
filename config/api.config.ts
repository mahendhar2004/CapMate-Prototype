/**
 * API Configuration
 * Configuration for API clients and services
 *
 * TODO: Implement actual API clients when backend is ready
 */

import { ENV } from './env';

/**
 * API Client Configuration
 * Will be used with AWS Amplify or custom fetch wrapper
 */
export const apiConfig = {
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

/**
 * AWS Amplify Configuration (Placeholder)
 * TODO: Configure with actual AWS credentials
 */
export const amplifyConfig = {
  Auth: {
    region: ENV.AWS_REGION,
    userPoolId: ENV.COGNITO_USER_POOL_ID,
    userPoolWebClientId: ENV.COGNITO_CLIENT_ID,
    mandatorySignIn: true,
  },
  API: {
    graphql_endpoint: ENV.APPSYNC_ENDPOINT,
    graphql_headers: async () => ({
      // TODO: Add authorization header from Cognito
    }),
  },
  Storage: {
    bucket: ENV.S3_BUCKET,
    region: ENV.AWS_REGION,
  },
};

/**
 * API Endpoints
 * TODO: Define actual endpoints when backend is ready
 */
export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    byCollege: (collegeId: string) => `/products/college/${collegeId}`,
    bySeller: (sellerId: string) => `/products/seller/${sellerId}`,
  },
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    uploadAvatar: '/users/avatar',
  },
  payments: {
    createOrder: '/payments/create-order',
    verify: '/payments/verify',
    status: (id: string) => `/payments/${id}/status`,
  },
  colleges: {
    list: '/colleges',
    detail: (id: string) => `/colleges/${id}`,
  },
};
