/**
 * Toast Notification Component
 * Shows temporary feedback messages
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme/index';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const toastConfig = {
  success: {
    backgroundColor: colors.success,
    icon: '✓',
  },
  error: {
    backgroundColor: colors.error,
    icon: '✕',
  },
  warning: {
    backgroundColor: colors.warning,
    icon: '⚠',
  },
  info: {
    backgroundColor: colors.info,
    icon: 'ℹ',
  },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  action,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  if (!visible) return null;

  const config = toastConfig[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        { transform: [{ translateY }], opacity },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      {action && (
        <TouchableOpacity onPress={action.onPress} style={styles.action}>
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    color: colors.textInverse,
    marginRight: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textInverse,
    flex: 1,
  },
  action: {
    marginLeft: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.md,
  },
  actionText: {
    ...typography.label,
    color: colors.textInverse,
  },
});

export default Toast;
