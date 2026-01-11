/**
 * College Select Screen
 * Select college during onboarding
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AuthStackScreenProps } from '@types/navigation.types';
import { College } from '@types/user.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Input, Card } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { COLLEGES, getGraduationYears } from '@constants/index';

type Props = AuthStackScreenProps<'CollegeSelect'>;

const CollegeSelectScreen: React.FC<Props> = ({ navigation, route }) => {
  const { signup, isLoading, error, clearError } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const graduationYears = getGraduationYears();

  const filteredColleges = useMemo(() => {
    if (!searchQuery.trim()) return COLLEGES;
    const query = searchQuery.toLowerCase();
    return COLLEGES.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.shortName.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  const handleComplete = async () => {
    if (!selectedCollege) {
      Alert.alert('Select College', 'Please select your college to continue');
      return;
    }

    if (!selectedYear) {
      Alert.alert('Select Year', 'Please select your graduation year');
      return;
    }

    clearError();

    // Navigate to celebration screen before completing signup
    navigation.navigate('Celebration');

    // For prototype, create a demo signup in background
    setTimeout(async () => {
      await signup({
        email: `demo.user@${selectedCollege.shortName.toLowerCase().replace(' ', '')}.ac.in`,
        password: 'demo123',
        name: 'Demo User',
        collegeId: selectedCollege.id,
        graduationYear: selectedYear,
      });
    }, 2000);
  };

  const renderCollegeItem = ({ item }: { item: College }) => {
    const isSelected = selectedCollege?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.collegeItem, isSelected && styles.collegeItemSelected]}
        onPress={() => handleCollegeSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.collegeInfo}>
          <Text style={[styles.collegeName, isSelected && styles.collegeNameSelected]}>
            {item.shortName}
          </Text>
          <Text style={styles.collegeLocation}>
            {item.city}, {item.state}
          </Text>
        </View>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Container edges={['bottom']}>
      <Header title="Select College" showBack />

      <View style={styles.container}>
        <Text style={styles.title}>Where do you study?</Text>
        <Text style={styles.subtitle}>
          You'll see listings from students at your college
        </Text>

        <Input
          placeholder="Search for your college..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />

        <FlatList
          data={filteredColleges}
          renderItem={renderCollegeItem}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No colleges found</Text>
          }
        />

        {selectedCollege && (
          <View style={styles.yearSection}>
            <Text style={styles.yearTitle}>Graduation Year</Text>
            <View style={styles.yearContainer}>
              {graduationYears.map(year => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearButton,
                    selectedYear === year && styles.yearButtonSelected,
                  ]}
                  onPress={() => handleYearSelect(year)}
                >
                  <Text
                    style={[
                      styles.yearText,
                      selectedYear === year && styles.yearTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Button
          title="Get Started"
          onPress={handleComplete}
          loading={isLoading}
          fullWidth
          disabled={!selectedCollege || !selectedYear}
          style={styles.button}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  collegeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  collegeItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  collegeInfo: {
    flex: 1,
  },
  collegeName: {
    ...typography.label,
    color: colors.text,
  },
  collegeNameSelected: {
    color: colors.primary,
  },
  collegeLocation: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing['2xl'],
  },
  yearSection: {
    marginBottom: spacing.lg,
  },
  yearTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
  },
  yearContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  yearButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  yearButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  yearText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  yearTextSelected: {
    color: colors.primary,
  },
  button: {
    marginBottom: spacing['2xl'],
  },
});

export default CollegeSelectScreen;
