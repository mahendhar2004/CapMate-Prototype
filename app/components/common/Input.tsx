/**
 * Input Component
 * Reusable text input with validation support
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  Animated,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { TIMING, EASING } from '@utils/animations';

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
  const borderAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const hasError = !!error;
  const isSecure = secureTextEntry && !isPasswordVisible;

  // Animate border on focus
  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: TIMING.fast,
      easing: EASING.smooth,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  // Subtle scale animation on focus
  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.01,
      useNativeDriver: true,
      tension: 300,
      friction: 15,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 15,
    }).start();
  };

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [hasError ? colors.error : colors.border, hasError ? colors.error : colors.primary],
  });

  const inputContainerStyles = [
    styles.inputContainer,
    hasError && styles.inputContainerError,
    textInputProps.editable === false && styles.inputContainerDisabled,
  ];

  return (
    <Animated.View style={[styles.container, containerStyle, { transform: [{ scale: scaleAnim }] }]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <Animated.View style={[inputContainerStyles, { borderColor: animatedBorderColor }]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
      </Animated.View>

      {(error || hint) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>{error || hint}</Text>
      )}
    </Animated.View>
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
    borderRadius: borderRadius.lg,
    minHeight: 48,
  },
  inputContainerError: {
    // Error state handled by animated border
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
