/**
 * Loading Component
 * Loading indicators and skeleton screens
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, typography, spacing } from '@theme/index';

interface LoadingProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  message,
  fullScreen = false,
}) => {
  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreen}>{content}</View>;
  }

  return content;
};

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        {message && <Text style={styles.overlayMessage}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: colors.surface,
    padding: spacing['2xl'],
    borderRadius: 16,
    alignItems: 'center',
  },
  overlayMessage: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.md,
  },
});

export default Loading;
