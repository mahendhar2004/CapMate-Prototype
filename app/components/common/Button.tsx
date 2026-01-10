/**
 * Button Component
 * Reusable button with multiple variants and animations
 */

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  View,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}` as keyof typeof styles] as ViewStyle,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    isDisabled && (styles[`${variant}_disabled` as keyof typeof styles] as ViewStyle),
    variant === 'primary' && !isDisabled && styles.primaryShadow,
    variant === 'danger' && !isDisabled && styles.dangerShadow,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textStylesArray: TextStyle[] = [
    styles.text,
    styles[`text_${variant}` as keyof typeof styles] as TextStyle,
    styles[`text_${size}` as keyof typeof styles] as TextStyle,
    isDisabled && styles.textDisabled,
    textStyle,
  ].filter(Boolean) as TextStyle[];

  return (
    <Animated.View style={[fullWidth && styles.fullWidthContainer, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={({ pressed }) => [
          ...buttonStyles,
          pressed && !isDisabled && styles.pressed,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary}
              size="small"
            />
            <Text style={[...textStylesArray, styles.loadingText]}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <Text style={textStylesArray}>{title}</Text>
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthContainer: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    marginLeft: spacing.xs,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryFaded,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  danger: {
    backgroundColor: colors.error,
  },

  // Shadows for elevated buttons
  primaryShadow: {
    ...shadows.md,
    shadowColor: colors.primary,
  },
  dangerShadow: {
    ...shadows.md,
    shadowColor: colors.error,
  },

  // Sizes
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    minHeight: 56,
  },
  size_xl: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing['3xl'],
    minHeight: 64,
  },

  // Disabled states
  disabled: {
    opacity: 0.5,
  },
  primary_disabled: {
    backgroundColor: colors.border,
  },
  secondary_disabled: {},
  outline_disabled: {
    borderColor: colors.border,
  },
  ghost_disabled: {},
  danger_disabled: {
    backgroundColor: colors.border,
  },

  // Text styles
  text: {
    ...typography.button,
    fontWeight: '600',
  },
  text_primary: {
    color: colors.textInverse,
  },
  text_secondary: {
    color: colors.primary,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.textInverse,
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  text_xl: {
    fontSize: 20,
  },
  textDisabled: {
    color: colors.textSecondary,
  },
});

export default Button;
