/**
 * Success Screen
 * Listing successfully published
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CreateListingStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Button } from '@components/common';
import { colors, typography, spacing } from '@theme/index';

type Props = CreateListingStackScreenProps<'Success'>;

const SuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { productId } = route.params;

  const handleViewListing = () => {
    // Navigate to the listing
    navigation.getParent()?.navigate('MyListings');
  };

  const handleGoHome = () => {
    navigation.getParent()?.navigate('Home');
  };

  const handleCreateAnother = () => {
    navigation.replace('CreateForm', {});
  };

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✅</Text>
          </View>

          {/* Success Message */}
          <Text style={styles.title}>Listing Published!</Text>
          <Text style={styles.subtitle}>
            Your item is now visible to students at your college. You'll be notified when someone is interested.
          </Text>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Quick Tips</Text>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💬</Text>
              <Text style={styles.tipText}>Respond quickly to interested buyers</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>📍</Text>
              <Text style={styles.tipText}>Meet in a safe, public location on campus</Text>
            </View>
            <View style={styles.tip}>
              <Text style={styles.tipIcon}>💰</Text>
              <Text style={styles.tipText}>Accept cash or UPI for quick transactions</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="View My Listings"
            onPress={handleViewListing}
            fullWidth
          />
          <Button
            title="Post Another Item"
            variant="outline"
            onPress={handleCreateAnother}
            fullWidth
          />
          <Button
            title="Go to Home"
            variant="ghost"
            onPress={handleGoHome}
            fullWidth
          />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
    lineHeight: 24,
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: colors.borderLight,
    borderRadius: 16,
    padding: spacing.lg,
  },
  tipsTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});

export default SuccessScreen;
