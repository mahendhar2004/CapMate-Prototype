/**
 * Container Component
 * Safe area wrapper with consistent padding
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@theme/index';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  withPadding?: boolean;
  keyboardAvoiding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  withTabBarPadding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  scrollable = false,
  withPadding = true,
  keyboardAvoiding = false,
  edges = ['top'],
  withTabBarPadding = true,
}) => {
  const insets = useSafeAreaInsets();
  // Calculate tab bar height to add bottom padding
  const tabBarHeight = 60 + (insets.bottom > 0 ? insets.bottom : spacing.sm);

  const contentStyle = [
    styles.content,
    withPadding && styles.withPadding,
    withTabBarPadding && { paddingBottom: tabBarHeight },
    style,
  ];

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            withPadding && styles.withPadding,
            withTabBarPadding && { paddingBottom: tabBarHeight },
            style,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }
    return <View style={contentStyle}>{children}</View>;
  };

  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderContent()}
    </KeyboardAvoidingView>
  ) : (
    renderContent()
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  withPadding: {
    paddingHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});

export default Container;
