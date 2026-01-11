/**
 * User-related type definitions
 * Designed for future AWS Cognito integration
 */

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  collegeId: string;
  collegeName: string;
  graduationYear: number;
  createdAt: string;
  updatedAt: string;

  // Onboarding data for personalization and insights
  nickname?: string;
  bio?: string;
  year?: string;
  department?: string;
  hostel?: string;
  interestedCategories?: string[];
  buyingInterest?: string[];
  sellingIntent?: 'yes' | 'maybe' | 'no';
  budget?: 'low' | 'moderate' | 'high';
  shoppingFrequency?: 'rarely' | 'occasionally' | 'frequently';
  notificationPreferences?: {
    newListings: boolean;
    priceDrops: boolean;
    messages: boolean;
  };
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  logoUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
  phone?: string;
  collegeId: string;
  graduationYear: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// TODO: AWS Cognito integration
// These types will map to Cognito User Pool attributes
export interface CognitoUserAttributes {
  sub: string; // Cognito user ID
  email: string;
  email_verified: boolean;
  name: string;
  phone_number?: string;
  'custom:collegeId': string;
  'custom:graduationYear': string;
}
