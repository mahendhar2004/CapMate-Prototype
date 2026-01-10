/**
 * Animation Utilities
 * Reusable animation configurations and helpers
 */

import { Animated, Easing } from 'react-native';

// Animation timing configurations
export const TIMING = {
  fast: 150,
  normal: 250,
  slow: 400,
  stagger: 50,
};

// Easing presets
export const EASING = {
  smooth: Easing.bezier(0.4, 0, 0.2, 1),
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
};

/**
 * Fade in animation
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  duration = TIMING.normal,
  delay = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: EASING.smooth,
    useNativeDriver: true,
  });
};

/**
 * Fade out animation
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  duration = TIMING.normal
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASING.smooth,
    useNativeDriver: true,
  });
};

/**
 * Slide up animation (for modals, bottom sheets)
 */
export const slideUp = (
  animatedValue: Animated.Value,
  duration = TIMING.normal
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    easing: EASING.decelerate,
    useNativeDriver: true,
  });
};

/**
 * Slide down animation
 */
export const slideDown = (
  animatedValue: Animated.Value,
  toValue: number,
  duration = TIMING.normal
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing: EASING.accelerate,
    useNativeDriver: true,
  });
};

/**
 * Scale animation (for press feedback)
 */
export const scalePress = (
  animatedValue: Animated.Value,
  toValue = 0.96
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    useNativeDriver: true,
    tension: 300,
    friction: 10,
  });
};

/**
 * Scale release animation
 */
export const scaleRelease = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    useNativeDriver: true,
    tension: 300,
    friction: 10,
  });
};

/**
 * Staggered fade in for lists
 */
export const staggeredFadeIn = (
  animatedValues: Animated.Value[],
  staggerDelay = TIMING.stagger
): Animated.CompositeAnimation => {
  const animations = animatedValues.map((value, index) =>
    Animated.timing(value, {
      toValue: 1,
      duration: TIMING.normal,
      delay: index * staggerDelay,
      easing: EASING.smooth,
      useNativeDriver: true,
    })
  );
  return Animated.parallel(animations);
};

/**
 * Pulse animation (for loading states, attention)
 */
export const pulse = (
  animatedValue: Animated.Value,
  minValue = 0.97,
  maxValue = 1
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: minValue,
        duration: 800,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: maxValue,
        duration: 800,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Shake animation (for errors)
 */
export const shake = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Create animated style for fade + slide up effect
 */
export const createFadeSlideStyle = (
  opacity: Animated.Value,
  translateY: Animated.Value
) => ({
  opacity,
  transform: [{ translateY }],
});

/**
 * Hook-friendly animation starter
 */
export const startAnimation = (
  animation: Animated.CompositeAnimation,
  callback?: () => void
) => {
  animation.start(callback);
};
