/**
 * Welcome Screen
 * Stunning first screen with hero animations and call-to-action
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = AuthStackScreenProps<'Welcome'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(0.9)).current;
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;

  const features = [
    {
      emoji: '🎓',
      title: 'College Exclusive',
      description: 'Buy & sell with students from your college',
      color: colors.primary,
    },
    {
      emoji: '💸',
      title: 'Best Deals',
      description: 'Get amazing prices on books, gadgets & more',
      color: '#10B981',
    },
    {
      emoji: '🔒',
      title: 'Safe & Secure',
      description: 'Verified students, trusted community',
      color: '#F59E0B',
    },
  ];

  useEffect(() => {
    // Hero entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations for background elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim3, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim3, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const float1Y = floatingAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const float2Y = floatingAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const float3Y = floatingAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const handleGetStarted = () => {
    navigation.navigate('Signup');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Background Gradient */}
      <View style={styles.gradientBackground}>
        {/* Floating decorative elements */}
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.circle1,
            { transform: [{ translateY: float1Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.circle2,
            { transform: [{ translateY: float2Y }] },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            styles.circle3,
            { transform: [{ translateY: float3Y }] },
          ]}
        />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }, { rotate: rotation }],
              },
            ]}
          >
            <View style={styles.logoBackground}>
              <Text style={styles.logoEmoji}>🎓</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>CAPMATE</Text>
            <Text style={styles.subtitle}>Your College Marketplace</Text>
            <Text style={styles.tagline}>
              Buy, Sell & Trade with your campus community
            </Text>
          </Animated.View>
        </View>

        {/* Features Carousel */}
        <Animated.View style={[styles.featuresContainer, { opacity: fadeAnim }]}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureCard,
                {
                  opacity: currentSlide === index ? 1 : 0.4,
                  transform: [
                    {
                      scale: currentSlide === index ? 1 : 0.9,
                    },
                  ],
                },
              ]}
            >
              <View style={[styles.featureIconBg, { backgroundColor: feature.color + '20' }]}>
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentSlide === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* CTA Buttons */}
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              transform: [{ scale: buttonScale }],
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Text style={styles.primaryButtonIcon}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
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
  gradientBackground: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.primary,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: 100,
    left: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: 300,
    right: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: 200,
    left: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xl,
  },
  logoEmoji: {
    fontSize: 60,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.surface,
    letterSpacing: 4,
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...typography.h4,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: spacing.md,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: 280,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  featureCard: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  featureIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureEmoji: {
    fontSize: 40,
  },
  featureTitle: {
    ...typography.h3,
    color: colors.surface,
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  featureDescription: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 260,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: colors.surface,
  },
  ctaContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.xl,
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 18,
  },
  primaryButtonIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
});

export default WelcomeScreen;
