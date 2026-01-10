/**
 * Login Screen
 * User authentication with email/password
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Button, Input } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { colors, typography, spacing } from '@theme/index';
import { isValidEmail, validationMessages } from '@utils/validators';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError(validationMessages.email.required);
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError(validationMessages.email.invalid);
      isValid = false;
    }

    if (!password) {
      setPasswordError(validationMessages.password.required);
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    clearError();
    if (!validateForm()) return;

    const success = await login({ email: email.trim(), password });

    if (!success && error) {
      Alert.alert('Login Failed', error);
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  // Demo login for easy testing
  const handleDemoLogin = async () => {
    clearError();
    const success = await login({
      email: 'rahul.sharma@iitd.ac.in',
      password: 'demo123',
    });

    if (!success) {
      Alert.alert('Login Failed', 'Demo login failed. Please try again.');
    }
  };

  return (
    <Container scrollable keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>CAPMATE</Text>
          <Text style={styles.tagline}>Your College Marketplace</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <Input
            label="Email"
            placeholder="Enter your college email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={emailError}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            showPasswordToggle
            error={passwordError}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.button}
          />

          <TouchableOpacity onPress={handleDemoLogin} style={styles.demoButton}>
            <Text style={styles.demoButtonText}>Try Demo Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing['4xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
  },
  button: {
    marginTop: spacing.md,
  },
  demoButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  demoButtonText: {
    ...typography.label,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    gap: spacing.xs,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signupLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
