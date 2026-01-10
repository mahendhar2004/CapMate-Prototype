/**
 * API response type definitions
 * Designed for future AWS AppSync/API Gateway integration
 */

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
  total: number;
}

export interface PaginationParams {
  limit?: number;
  nextToken?: string;
}

// TODO: AWS AppSync operation types
// These will be generated from GraphQL schema
export type GraphQLOperation = 'query' | 'mutation' | 'subscription';

export interface GraphQLRequest {
  operationName: string;
  query: string;
  variables?: Record<string, unknown>;
}

// Payment types for future integration
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled';

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}
