/**
 * Input Component
 * Reusable text input with validation support
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme/index';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  required = false,
  showPasswordToggle = false,
  secureTextEntry,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const isSecure = secureTextEntry && !isPasswordVisible;

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    hasError && styles.inputContainerError,
    textInputProps.editable === false && styles.inputContainerDisabled,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...textInputProps}
        />

        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.toggleText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {(error || hint) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>{error || hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.borderLight,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  iconLeft: {
    paddingLeft: spacing.lg,
  },
  iconRight: {
    paddingRight: spacing.lg,
  },
  toggleText: {
    ...typography.label,
    color: colors.primary,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
});

export default Input;
