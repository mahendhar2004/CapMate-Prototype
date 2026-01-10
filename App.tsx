/**
 * CAPMATE - College Marketplace App
 * Root Application Component
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@context/AuthContext';
import { ProductProvider } from '@context/ProductContext';
import { ToastProvider } from '@context/ToastContext';
import RootNavigation from '@navigation/index';

/**
 * App Root Component
 * Wraps the application with all necessary providers
 *
 * Provider hierarchy:
 * 1. SafeAreaProvider - Safe area insets
 * 2. ToastProvider - Global toast notifications
 * 3. AuthProvider - Authentication state
 * 4. ProductProvider - Product listings state
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <RootNavigation />
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
