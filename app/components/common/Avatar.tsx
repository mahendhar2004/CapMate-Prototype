/**
 * Avatar Component
 * User profile picture with fallback initials
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borderRadius } from '@theme/index';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 20,
  xl: 28,
};

export const Avatar: React.FC<AvatarProps> = ({ source, name, size = 'md', style }) => {
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const getInitials = (name?: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const containerStyle = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
    },
    style,
  ];

  if (source) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, styles.placeholder]}>
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.label,
    color: colors.textInverse,
    fontWeight: '600',
  },
});

export default Avatar;
