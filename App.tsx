/**
 * CAPMATE - College Marketplace App
 * Root Application Component
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@context/AuthContext';
import { ProductProvider } from '@context/ProductContext';
import RootNavigation from '@navigation/index';

/**
 * App Root Component
 * Wraps the application with all necessary providers
 *
 * Provider hierarchy:
 * 1. SafeAreaProvider - Safe area insets
 * 2. AuthProvider - Authentication state
 * 3. ProductProvider - Product listings state
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductProvider>
          <RootNavigation />
        </ProductProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
