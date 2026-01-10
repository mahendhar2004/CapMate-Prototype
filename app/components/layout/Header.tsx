/**
 * Header Component
 * Screen header with back button and actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, hitSlop } from '@theme/index';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightAction,
  transparent = false,
  style,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, transparent && styles.transparent, style]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            hitSlop={hitSlop.medium}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        {title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  transparent: {
    backgroundColor: colors.transparent,
    borderBottomWidth: 0,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    ...typography.h4,
    color: colors.primary,
  },
  title: {
    ...typography.h4,
    color: colors.text,
  },
});

export default Header;
