/**
 * Auth Navigator
 * Stack navigator for authentication screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigation.types';
import { colors } from '@theme/index';

// Screens
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import SignupScreen from '@screens/auth/SignupScreen';
import OnboardingScreen from '@screens/auth/OnboardingScreen';
import CollegeSelectScreen from '@screens/auth/CollegeSelectScreen';
import CelebrationScreen from '@screens/auth/CelebrationScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          animation: 'fade_from_bottom',
        }}
      />
      <Stack.Screen name="CollegeSelect" component={CollegeSelectScreen} />
      <Stack.Screen
        name="Celebration"
        component={CelebrationScreen}
        options={{
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
