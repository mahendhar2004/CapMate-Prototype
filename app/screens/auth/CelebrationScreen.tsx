/**
 * Celebration Screen
 * Animated success screen after completing onboarding
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { colors, typography, spacing } from '@theme/index';

type Props = AuthStackScreenProps<'Celebration'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CelebrationScreen: React.FC<Props> = ({ navigation }) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confetti1 = useRef(new Animated.Value(0)).current;
  const confetti2 = useRef(new Animated.Value(0)).current;
  const confetti3 = useRef(new Animated.Value(0)).current;
  const confetti4 = useRef(new Animated.Value(0)).current;
  const confetti5 = useRef(new Animated.Value(0)).current;
  const confetti6 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main celebration animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Confetti animations
    const confettiAnimations = [confetti1, confetti2, confetti3, confetti4, confetti5, confetti6];
    confettiAnimations.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Auto-navigate after animation
    const timer = setTimeout(() => {
      // Navigate to main app - this will be handled by auth context
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const createConfettiStyle = (anim: Animated.Value, delay: number) => {
    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, SCREEN_HEIGHT + 100],
    });

    const translateX = anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100],
    });

    const rotate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${360 * (Math.random() + 1)}deg`],
    });

    return {
      transform: [{ translateY }, { translateX }, { rotate }],
      opacity: anim.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [0, 1, 1, 0],
      }),
    };
  };

  const confettiColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <View style={styles.container}>
      {/* Confetti */}
      {[confetti1, confetti2, confetti3, confetti4, confetti5, confetti6].map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            createConfettiStyle(anim, index * 100),
            {
              backgroundColor: confettiColors[index],
              left: `${10 + index * 15}%`,
            },
          ]}
        />
      ))}

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }, { rotate: rotation }],
            },
          ]}
        >
          <Text style={styles.icon}>🎉</Text>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.subtitle}>
            Welcome to CAPMATE{'\n'}
            Let's find some amazing deals!
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Setting up your marketplace...</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  confetti: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing['2xl'],
  },
  icon: {
    fontSize: 120,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.surface,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h4,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loadingBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: colors.surface,
    borderRadius: 3,
  },
  loadingText: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default CelebrationScreen;
