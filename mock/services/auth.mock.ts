/**
 * Mock Authentication Service
 * Simulates AWS Cognito authentication
 * TODO: Replace with actual Cognito integration
 */

import { delay, generateId } from '@utils/helpers';
import { User, AuthCredentials, SignupData } from '@types/user.types';
import { ApiResponse } from '@types/api.types';
import { MOCK_USERS, getMockUserByEmail } from '@mock/data/users';
import { getCollegeById } from '@constants/colleges';

// Simulated network delay
const MOCK_DELAY = 800;

// Simulated token (would be JWT from Cognito)
const generateMockToken = (): string => {
  return `mock-token-${generateId()}`;
};

/**
 * Mock login
 * In production: Cognito.signIn()
 */
export const mockLogin = async (
  credentials: AuthCredentials
): Promise<ApiResponse<{ user: User; token: string }>> => {
  await delay(MOCK_DELAY);

  // Simulate validation
  if (!credentials.email || !credentials.password) {
    return {
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required',
      },
      success: false,
    };
  }

  // Check if user exists
  const existingUser = getMockUserByEmail(credentials.email);

  // For prototype: accept any password for existing users
  // Or create a new mock user for new emails
  if (existingUser) {
    return {
      data: {
        user: existingUser,
        token: generateMockToken(),
      },
      error: null,
      success: true,
    };
  }

  // Simulate user not found
  return {
    data: null,
    error: {
      code: 'USER_NOT_FOUND',
      message: 'No account found with this email. Please sign up.',
    },
    success: false,
  };
};

/**
 * Mock signup
 * In production: Cognito.signUp()
 */
export const mockSignup = async (
  data: SignupData
): Promise<ApiResponse<{ user: User; token: string }>> => {
  await delay(MOCK_DELAY);

  // Simulate validation
  if (!data.email || !data.password || !data.name) {
    return {
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'All fields are required',
      },
      success: false,
    };
  }

  // Check if email already exists
  const existingUser = getMockUserByEmail(data.email);
  if (existingUser) {
    return {
      data: null,
      error: {
        code: 'USER_EXISTS',
        message: 'An account with this email already exists',
      },
      success: false,
    };
  }

  // Get college info
  const college = getCollegeById(data.collegeId);

  // Create new user
  const newUser: User = {
    id: `user-${generateId()}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    collegeId: data.collegeId,
    collegeName: college?.shortName || college?.name || 'Unknown College',
    graduationYear: data.graduationYear,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // In a real app, this would persist to database
  MOCK_USERS.push(newUser);

  return {
    data: {
      user: newUser,
      token: generateMockToken(),
    },
    error: null,
    success: true,
  };
};

/**
 * Mock logout
 * In production: Cognito.signOut()
 */
export const mockLogout = async (): Promise<ApiResponse<null>> => {
  await delay(MOCK_DELAY / 2);

  return {
    data: null,
    error: null,
    success: true,
  };
};

/**
 * Mock get current user
 * In production: Cognito.currentAuthenticatedUser()
 */
export const mockGetCurrentUser = async (
  token: string
): Promise<ApiResponse<User>> => {
  await delay(MOCK_DELAY / 2);

  if (!token) {
    return {
      data: null,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'No valid session found',
      },
      success: false,
    };
  }

  // Return first mock user for prototype
  return {
    data: MOCK_USERS[0],
    error: null,
    success: true,
  };
};

/**
 * Mock update user profile
 * In production: Cognito.updateUserAttributes()
 */
export const mockUpdateProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<ApiResponse<User>> => {
  await delay(MOCK_DELAY);

  const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return {
      data: null,
      error: {
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      },
      success: false,
    };
  }

  const updatedUser = {
    ...MOCK_USERS[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  MOCK_USERS[userIndex] = updatedUser;

  return {
    data: updatedUser,
    error: null,
    success: true,
  };
};
