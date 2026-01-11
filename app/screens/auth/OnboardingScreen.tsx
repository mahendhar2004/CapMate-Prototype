/**
 * Onboarding Screen
 * Multi-step onboarding with smooth transitions and data collection
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '@constants/categories';

type Props = AuthStackScreenProps<'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingData {
  // Personal Info
  fullName: string;
  nickname?: string;
  bio?: string;

  // Academic Info
  year: string;
  department: string;
  hostel?: string;

  // Interests & Preferences
  interestedCategories: string[];
  buyingInterest: string[];
  sellingIntent: string;

  // Activity Preferences
  notificationPreferences: {
    newListings: boolean;
    priceDrops: boolean;
    messages: boolean;
  };

  // Shopping behavior (for insights)
  budget: string;
  frequency: string;
}

const OnboardingScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    year: '',
    department: '',
    interestedCategories: [],
    buyingInterest: [],
    sellingIntent: 'maybe',
    notificationPreferences: {
      newListings: true,
      priceDrops: true,
      messages: true,
    },
    budget: 'moderate',
    frequency: 'occasionally',
  });

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const totalSteps = 6;

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG/PhD'];
  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Management',
    'Other',
  ];

  const buyingInterests = [
    { id: 'textbooks', label: 'Textbooks', emoji: '📚' },
    { id: 'electronics', label: 'Electronics', emoji: '💻' },
    { id: 'furniture', label: 'Furniture', emoji: '🪑' },
    { id: 'sports', label: 'Sports Gear', emoji: '⚽' },
    { id: 'fashion', label: 'Fashion', emoji: '👕' },
    { id: 'stationery', label: 'Stationery', emoji: '📝' },
  ];

  const sellingOptions = [
    { id: 'yes', label: 'Yes, I have items to sell', emoji: '✨' },
    { id: 'maybe', label: 'Maybe later', emoji: '🤔' },
    { id: 'no', label: 'Just browsing for now', emoji: '👀' },
  ];

  const budgetOptions = [
    { id: 'low', label: 'Budget-friendly', subtitle: 'Under ₹1000', emoji: '💰' },
    { id: 'moderate', label: 'Moderate', subtitle: '₹1000-₹5000', emoji: '💳' },
    { id: 'high', label: 'Premium', subtitle: 'Above ₹5000', emoji: '💎' },
  ];

  const frequencyOptions = [
    { id: 'rarely', label: 'Rarely', subtitle: 'Once in a while' },
    { id: 'occasionally', label: 'Occasionally', subtitle: 'Few times a month' },
    { id: 'frequently', label: 'Frequently', subtitle: 'Multiple times a week' },
  ];

  useEffect(() => {
    animateTransition();
  }, [currentStep]);

  const animateTransition = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(slideAnim, {
        toValue: currentStep,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(progressAnim, {
        toValue: (currentStep + 1) / totalSteps,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save onboarding data and navigate to college selection
    console.log('Onboarding data:', data);
    navigation.navigate('CollegeSelect', { fromSignup: true, onboardingData: data });
  };

  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setData((prev) => ({
      ...prev,
      interestedCategories: prev.interestedCategories.includes(category)
        ? prev.interestedCategories.filter((c) => c !== category)
        : [...prev.interestedCategories, category],
    }));
  };

  const toggleBuyingInterest = (interest: string) => {
    setData((prev) => ({
      ...prev,
      buyingInterest: prev.buyingInterest.includes(interest)
        ? prev.buyingInterest.filter((i) => i !== interest)
        : [...prev.buyingInterest, interest],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.fullName.trim().length >= 2;
      case 1:
        return data.year !== '' && data.department !== '';
      case 2:
        return data.interestedCategories.length > 0;
      case 3:
        return data.buyingInterest.length > 0;
      case 4:
        return data.sellingIntent !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>👋</Text>
            <Text style={styles.stepTitle}>Let's get to know you!</Text>
            <Text style={styles.stepSubtitle}>What should we call you?</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textTertiary}
                value={data.fullName}
                onChangeText={(text) => updateData('fullName', text)}
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nickname (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="How do friends call you?"
                placeholderTextColor={colors.textTertiary}
                value={data.nickname}
                onChangeText={(text) => updateData('nickname', text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Short Bio (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Tell us a bit about yourself..."
                placeholderTextColor={colors.textTertiary}
                value={data.bio}
                onChangeText={(text) => updateData('bio', text)}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>🎓</Text>
            <Text style={styles.stepTitle}>Academic Details</Text>
            <Text style={styles.stepSubtitle}>Help us personalize your experience</Text>

            <View style={styles.optionsContainer}>
              <Text style={styles.optionLabel}>Current Year *</Text>
              <View style={styles.optionsGrid}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.optionChip,
                      data.year === year && styles.optionChipSelected,
                    ]}
                    onPress={() => updateData('year', year)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        data.year === year && styles.optionChipTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <Text style={styles.optionLabel}>Department *</Text>
              <ScrollView
                style={styles.scrollableOptions}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.optionsGrid}>
                  {departments.map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      style={[
                        styles.optionChip,
                        data.department === dept && styles.optionChipSelected,
                      ]}
                      onPress={() => updateData('department', dept)}
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          data.department === dept && styles.optionChipTextSelected,
                        ]}
                      >
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Hostel/Residence (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Aravali Hostel"
                placeholderTextColor={colors.textTertiary}
                value={data.hostel}
                onChangeText={(text) => updateData('hostel', text)}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>🛍️</Text>
            <Text style={styles.stepTitle}>What interests you?</Text>
            <Text style={styles.stepSubtitle}>
              Select categories you'd like to explore
            </Text>

            <ScrollView
              style={styles.scrollableOptions}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryCard,
                      data.interestedCategories.includes(category.value) &&
                        styles.categoryCardSelected,
                    ]}
                    onPress={() => toggleCategory(category.value)}
                  >
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryLabel,
                        data.interestedCategories.includes(category.value) &&
                          styles.categoryLabelSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                    {data.interestedCategories.includes(category.value) && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>🎯</Text>
            <Text style={styles.stepTitle}>What are you looking for?</Text>
            <Text style={styles.stepSubtitle}>
              We'll show you the best deals
            </Text>

            <View style={styles.interestGrid}>
              {buyingInterests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestCard,
                    data.buyingInterest.includes(interest.id) &&
                      styles.interestCardSelected,
                  ]}
                  onPress={() => toggleBuyingInterest(interest.id)}
                >
                  <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                  <Text style={styles.interestLabel}>{interest.label}</Text>
                  {data.buyingInterest.includes(interest.id) && (
                    <View style={styles.checkmarkSmall}>
                      <Text style={styles.checkmarkTextSmall}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>💼</Text>
            <Text style={styles.stepTitle}>Planning to sell?</Text>
            <Text style={styles.stepSubtitle}>
              Help us understand your goals
            </Text>

            <View style={styles.sellingOptionsContainer}>
              {sellingOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sellingCard,
                    data.sellingIntent === option.id && styles.sellingCardSelected,
                  ]}
                  onPress={() => updateData('sellingIntent', option.id)}
                >
                  <Text style={styles.sellingEmoji}>{option.emoji}</Text>
                  <Text style={styles.sellingLabel}>{option.label}</Text>
                  {data.sellingIntent === option.id && (
                    <View style={styles.radioOuter}>
                      <View style={styles.radioInner} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.optionsContainer}>
              <Text style={styles.optionLabel}>Typical Budget Range</Text>
              <View style={styles.budgetGrid}>
                {budgetOptions.map((budget) => (
                  <TouchableOpacity
                    key={budget.id}
                    style={[
                      styles.budgetCard,
                      data.budget === budget.id && styles.budgetCardSelected,
                    ]}
                    onPress={() => updateData('budget', budget.id)}
                  >
                    <Text style={styles.budgetEmoji}>{budget.emoji}</Text>
                    <Text style={styles.budgetLabel}>{budget.label}</Text>
                    <Text style={styles.budgetSubtitle}>{budget.subtitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepEmoji}>🔔</Text>
            <Text style={styles.stepTitle}>Stay Updated</Text>
            <Text style={styles.stepSubtitle}>
              How often do you shop?
            </Text>

            <View style={styles.frequencyContainer}>
              {frequencyOptions.map((freq) => (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.frequencyCard,
                    data.frequency === freq.id && styles.frequencyCardSelected,
                  ]}
                  onPress={() => updateData('frequency', freq.id)}
                >
                  <View style={styles.frequencyContent}>
                    <Text style={styles.frequencyLabel}>{freq.label}</Text>
                    <Text style={styles.frequencySubtitle}>{freq.subtitle}</Text>
                  </View>
                  {data.frequency === freq.id && (
                    <View style={styles.radioOuter}>
                      <View style={styles.radioInner} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>Notification Preferences</Text>
              {[
                { key: 'newListings', label: 'New listings in your interests', emoji: '🆕' },
                { key: 'priceDrops', label: 'Price drops on saved items', emoji: '💰' },
                { key: 'messages', label: 'New messages and offers', emoji: '💬' },
              ].map((pref) => (
                <TouchableOpacity
                  key={pref.key}
                  style={styles.notificationItem}
                  onPress={() =>
                    updateData('notificationPreferences', {
                      ...data.notificationPreferences,
                      [pref.key]: !data.notificationPreferences[pref.key as keyof typeof data.notificationPreferences],
                    })
                  }
                >
                  <View style={styles.notificationLeft}>
                    <Text style={styles.notificationEmoji}>{pref.emoji}</Text>
                    <Text style={styles.notificationLabel}>{pref.label}</Text>
                  </View>
                  <View
                    style={[
                      styles.toggle,
                      data.notificationPreferences[pref.key as keyof typeof data.notificationPreferences] &&
                        styles.toggleActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        data.notificationPreferences[pref.key as keyof typeof data.notificationPreferences] &&
                          styles.toggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={currentStep === 0 ? () => navigation.goBack() : handleBack}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.stepIndicator}>
          {currentStep + 1}/{totalSteps}
        </Text>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderStep()}
        </ScrollView>
      </Animated.View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
          </Text>
          <Text style={styles.nextButtonIcon}>→</Text>
        </TouchableOpacity>

        {currentStep < totalSteps - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleNext}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepIndicator: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stepContainer: {
    alignItems: 'center',
    minHeight: 400,
  },
  stepEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  optionLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scrollableOptions: {
    maxHeight: 300,
  },
  optionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionChipSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  optionChipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  optionChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  categoryCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2) / 3,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  categoryCardSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
  },
  interestCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  interestCardSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  interestEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  interestLabel: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  checkmarkSmall: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkTextSmall: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  sellingOptionsContainer: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sellingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  sellingCardSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  sellingEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  sellingLabel: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  budgetGrid: {
    gap: spacing.sm,
  },
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  budgetCardSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  budgetEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  budgetLabel: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  budgetSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  frequencyContainer: {
    width: '100%',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  frequencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  frequencyCardSelected: {
    backgroundColor: colors.primaryFaded,
    borderColor: colors.primary,
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  frequencySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  notificationSection: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  notificationTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  notificationLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    ...shadows.md,
  },
  nextButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  nextButtonIcon: {
    fontSize: 18,
    color: colors.surface,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default OnboardingScreen;
