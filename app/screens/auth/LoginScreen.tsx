/**
 * Login Screen
 * User authentication with email/password - Modern design
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Button, Input, Card } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { isValidEmail, validationMessages } from '@utils/validators';

type Props = AuthStackScreenProps<'Login'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Animation values
  const logoScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;

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

    // Animate logo on login attempt
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

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
    setEmail('rahul.sharma@iitd.ac.in');
    setPassword('demo123');

    setTimeout(async () => {
      const success = await login({
        email: 'rahul.sharma@iitd.ac.in',
        password: 'demo123',
      });

      if (!success) {
        Alert.alert('Login Failed', 'Demo login failed. Please try again.');
      }
    }, 300);
  };

  return (
    <Container scrollable keyboardAvoiding>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Header with animated logo */}
          <Animated.View
            style={[styles.header, { transform: [{ scale: logoScale }] }]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Text style={styles.logoIcon}>🎓</Text>
              </View>
            </View>
            <Text style={styles.logo}>CAPMATE</Text>
            <Text style={styles.tagline}>Your College Marketplace</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View style={[styles.formCard, { opacity: formOpacity }]}>
            <View style={styles.formHeader}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to buy & sell with your college community
              </Text>
            </View>

            <View style={styles.form}>
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="lg"
                style={styles.loginButton}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Demo Account Button */}
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleDemoLogin}
                activeOpacity={0.7}
              >
                <View style={styles.demoIcon}>
                  <Text style={styles.demoIconText}>⚡</Text>
                </View>
                <View style={styles.demoTextContainer}>
                  <Text style={styles.demoButtonTitle}>Try Demo Account</Text>
                  <Text style={styles.demoButtonSubtitle}>
                    Explore without signing up
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignupPress}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Features highlight */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>Secure</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎓</Text>
              <Text style={styles.featureText}>College Only</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureText}>Free to Browse</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  logoIcon: {
    fontSize: 40,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 3,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.md,
    padding: spacing.xl,
    ...shadows.lg,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    ...typography.labelSmall,
    color: colors.primary,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  demoIconText: {
    fontSize: 20,
  },
  demoTextContainer: {
    flex: 1,
  },
  demoButtonTitle: {
    ...typography.label,
    color: colors.text,
  },
  demoButtonSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signupLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  featureItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});

export default LoginScreen;
