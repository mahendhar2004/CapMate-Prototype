/**
 * Signup Screen
 * Beautiful multi-step signup with amazing animations and UX
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Button, Input } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  validationMessages,
} from '@utils/validators';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = AuthStackScreenProps<'Signup'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(1)).current;
  const strengthBarAnim = useRef(new Animated.Value(0)).current;

  const totalSteps = 3;

  const steps = [
    {
      title: "Let's get started!",
      subtitle: 'Create your account in 3 easy steps',
      emoji: '👋',
    },
    {
      title: 'How can we reach you?',
      subtitle: 'Your college email and phone number',
      emoji: '📧',
    },
    {
      title: 'Secure your account',
      subtitle: 'Choose a strong password',
      emoji: '🔒',
    },
  ];

  useEffect(() => {
    animateStepTransition();
  }, [currentStep]);

  useEffect(() => {
    calculatePasswordStrength(form.password);
  }, [form.password]);

  const animateStepTransition = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(slideAnim, {
        toValue: currentStep,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(progressAnim, {
        toValue: (currentStep + 1) / totalSteps,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.spring(headerScale, {
          toValue: 1.1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(headerScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;

    setPasswordStrength(strength);
    Animated.timing(strengthBarAnim, {
      toValue: strength / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 0) {
      if (!form.name.trim()) {
        newErrors.name = validationMessages.name.required;
      } else if (!isValidName(form.name)) {
        newErrors.name = validationMessages.name.invalid;
      }
    } else if (currentStep === 1) {
      if (!form.email.trim()) {
        newErrors.email = validationMessages.email.required;
      } else if (!isValidEmail(form.email)) {
        newErrors.email = validationMessages.email.invalid;
      }
      if (form.phone && !isValidPhone(form.phone)) {
        newErrors.phone = validationMessages.phone.invalid;
      }
    } else if (currentStep === 2) {
      if (!form.password) {
        newErrors.password = validationMessages.password.required;
      } else if (!isValidPassword(form.password)) {
        newErrors.password = validationMessages.password.invalid;
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = validationMessages.password.required;
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = validationMessages.password.mismatch;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleComplete = () => {
    navigation.navigate('Onboarding');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return colors.error;
    if (passwordStrength < 70) return colors.warning;
    return colors.success;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Good';
    return 'Strong';
  };

  const canProceed = () => {
    if (currentStep === 0) return form.name.trim().length >= 2;
    if (currentStep === 1) return form.email.trim().length > 0;
    if (currentStep === 2)
      return form.password.length >= 8 && form.confirmPassword.length >= 8;
    return false;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>👤</Text>
              </View>
              <Input
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                autoComplete="name"
                error={errors.name}
                autoFocus
                style={styles.input}
              />
            </View>
            <View style={styles.helperTextContainer}>
              <Text style={styles.helperText}>
                This name will be visible to other students
              </Text>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>📧</Text>
              </View>
              <Input
                placeholder="yourname@college.edu"
                value={form.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                autoFocus
                style={styles.input}
              />
            </View>
            <View style={styles.helperTextContainer}>
              <Text style={styles.helperText}>
                Use your official college email address
              </Text>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>📱</Text>
              </View>
              <Input
                placeholder="Phone number (optional)"
                value={form.phone}
                onChangeText={(text) => updateField('phone', text)}
                keyboardType="phone-pad"
                autoComplete="tel"
                error={errors.phone}
                style={styles.input}
              />
            </View>
            <View style={styles.helperTextContainer}>
              <Text style={styles.helperText}>
                Helps buyers contact you for quick deals
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>🔑</Text>
              </View>
              <Input
                placeholder="Create a password"
                value={form.password}
                onChangeText={(text) => updateField('password', text)}
                secureTextEntry
                showPasswordToggle
                error={errors.password}
                autoFocus
                style={styles.input}
              />
            </View>

            {form.password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <Animated.View
                    style={[
                      styles.strengthFill,
                      {
                        width: strengthBarAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: getPasswordStrengthColor(),
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.strengthText,
                    { color: getPasswordStrengthColor() },
                  ]}
                >
                  {getPasswordStrengthText()}
                </Text>
              </View>
            )}

            <View style={styles.passwordRequirements}>
              <View style={styles.requirementRow}>
                <Text
                  style={[
                    styles.requirementDot,
                    form.password.length >= 8 && styles.requirementDotMet,
                  ]}
                >
                  {form.password.length >= 8 ? '✓' : '○'}
                </Text>
                <Text style={styles.requirementText}>At least 8 characters</Text>
              </View>
              <View style={styles.requirementRow}>
                <Text
                  style={[
                    styles.requirementDot,
                    /[0-9]/.test(form.password) && styles.requirementDotMet,
                  ]}
                >
                  {/[0-9]/.test(form.password) ? '✓' : '○'}
                </Text>
                <Text style={styles.requirementText}>Contains a number</Text>
              </View>
              <View style={styles.requirementRow}>
                <Text
                  style={[
                    styles.requirementDot,
                    (/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) &&
                      styles.requirementDotMet,
                  ]}
                >
                  {/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)
                    ? '✓'
                    : '○'}
                </Text>
                <Text style={styles.requirementText}>
                  Mix of uppercase & lowercase
                </Text>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>🔒</Text>
              </View>
              <Input
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChangeText={(text) => updateField('confirmPassword', text)}
                secureTextEntry
                showPasswordToggle
                error={errors.confirmPassword}
                style={styles.input}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Container withPadding={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.stepCounter}>
            {currentStep + 1}/{totalSteps}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step Header */}
          <Animated.View
            style={[
              styles.stepHeader,
              {
                opacity: fadeAnim,
                transform: [{ scale: headerScale }],
              },
            ]}
          >
            <Text style={styles.stepEmoji}>{steps[currentStep].emoji}</Text>
            <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
            <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
          </Animated.View>

          {/* Step Content */}
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            {renderStepContent()}
          </Animated.View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLoginPress}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) },
          ]}
        >
          <Button
            title={currentStep === totalSteps - 1 ? 'Create Account' : 'Continue'}
            onPress={handleNext}
            loading={isLoading}
            disabled={!canProceed()}
            fullWidth
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepCounter: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  stepHeader: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  stepEmoji: {
    fontSize: 72,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  formContainer: {
    paddingBottom: spacing.xl,
  },
  stepContent: {
    gap: spacing.lg,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIconText: {
    fontSize: 18,
  },
  input: {
    paddingLeft: spacing.md + 36 + spacing.md,
  },
  helperTextContainer: {
    marginTop: -spacing.sm,
    paddingLeft: spacing.md + 36 + spacing.md,
  },
  helperText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  strengthContainer: {
    marginTop: spacing.sm,
  },
  strengthBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    ...typography.caption,
    fontWeight: '600',
    textAlign: 'right',
  },
  passwordRequirements: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  requirementDot: {
    ...typography.body,
    color: colors.textTertiary,
    fontSize: 16,
    width: 20,
  },
  requirementDotMet: {
    color: colors.success,
  },
  requirementText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
});

export default SignupScreen;
