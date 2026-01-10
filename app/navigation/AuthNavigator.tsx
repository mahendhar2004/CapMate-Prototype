/**
 * Auth Navigator
 * Stack navigator for authentication screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigation.types';
import { colors } from '@theme/index';

// Screens
import LoginScreen from '@screens/auth/LoginScreen';
import SignupScreen from '@screens/auth/SignupScreen';
import CollegeSelectScreen from '@screens/auth/CollegeSelectScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="CollegeSelect" component={CollegeSelectScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
