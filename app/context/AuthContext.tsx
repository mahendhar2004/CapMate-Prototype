/**
 * Authentication Context
 * Manages user authentication state
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthCredentials, SignupData, AuthState } from '@types/user.types';
import { authService } from '@services/auth.service';
import { STORAGE_KEYS } from '@constants/index';

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // True initially to check stored session
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Context type
interface AuthContextType extends AuthState {
  login: (credentials: AuthCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkStoredSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser) as User;
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, token: storedToken },
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkStoredSession();
  }, []);

  // Login
  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    const response = await authService.login(credentials);

    if (response.success && response.data) {
      const { user, token } = response.data;

      // Store session
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return true;
    }

    dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Login failed' });
    return false;
  };

  // Signup
  const signup = async (data: SignupData): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    const response = await authService.signup(data);

    if (response.success && response.data) {
      const { user, token } = response.data;

      // Store session
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return true;
    }

    dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Signup failed' });
    return false;
  };

  // Logout
  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    await authService.logout();

    // Clear stored session
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);

    dispatch({ type: 'LOGOUT' });
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await authService.updateProfile(state.user.id, updates);

    if (response.success && response.data) {
      // Update stored user
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));

      dispatch({ type: 'UPDATE_USER', payload: response.data });
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    }

    dispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Update failed' });
    return false;
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
