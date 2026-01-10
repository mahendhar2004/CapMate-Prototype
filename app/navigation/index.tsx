/**
 * Root Navigation
 * Main navigation container with auth flow handling
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from '@types/navigation.types';
import { useAuth } from '@context/AuthContext';
import { Loading } from '@components/feedback/Loading';
import { colors } from '@theme/index';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth status
  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigation;
