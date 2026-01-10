/**
 * Signup Screen
 * New user registration
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Input } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { colors, typography, spacing } from '@theme/index';
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  validationMessages,
} from '@utils/validators';

type Props = AuthStackScreenProps<'Signup'>;

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
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = validationMessages.name.required;
    } else if (!isValidName(form.name)) {
      newErrors.name = validationMessages.name.invalid;
    }

    if (!form.email.trim()) {
      newErrors.email = validationMessages.email.required;
    } else if (!isValidEmail(form.email)) {
      newErrors.email = validationMessages.email.invalid;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      newErrors.phone = validationMessages.phone.invalid;
    }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    // Navigate to college selection with form data
    navigation.navigate('CollegeSelect', { fromSignup: true });
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <Container scrollable keyboardAvoiding edges={['bottom']}>
      <Header title="Create Account" showBack />

      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Join CAPMATE</Text>
          <Text style={styles.subtitle}>Create an account to buy and sell items</Text>

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={text => updateField('name', text)}
            autoComplete="name"
            error={errors.name}
            required
          />

          <Input
            label="Email"
            placeholder="Enter your college email"
            value={form.email}
            onChangeText={text => updateField('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={form.phone}
            onChangeText={text => updateField('phone', text)}
            keyboardType="phone-pad"
            autoComplete="tel"
            error={errors.phone}
            hint="Optional - helps buyers contact you"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={form.password}
            onChangeText={text => updateField('password', text)}
            secureTextEntry
            showPasswordToggle
            error={errors.password}
            hint="Min 8 characters with letters and numbers"
            required
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChangeText={text => updateField('confirmPassword', text)}
            secureTextEntry
            showPasswordToggle
            error={errors.confirmPassword}
            required
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            fullWidth
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
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
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignupScreen;
