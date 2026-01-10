/**
 * Profile Main Screen
 * User profile with settings
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ProfileStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Avatar, Card, Button } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';

type Props = ProfileStackScreenProps<'ProfileMain'>;

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const ProfileMainScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing will be available in the full version.',
      [{ text: 'OK' }]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      'Notification settings will be available in the full version.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Settings',
      'Privacy controls will be available in the full version.',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For support, contact us at support@capmate.app\n\nThis is a prototype version.',
      [{ text: 'OK' }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About CAPMATE',
      'CAPMATE v1.0.0 (Prototype)\n\nThe college marketplace for students.\n\nBuilt with React Native & Expo.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <Container withPadding={false}>
      <Header title="Profile" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar source={user?.avatar} name={user?.name} size="xl" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.collegeTag}>
                <Text style={styles.collegeTagText}>{user?.collegeName}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>

        {/* Stats Card */}
        <Card variant="outlined" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Items Listed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Items Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.graduationYear || 'N/A'}</Text>
              <Text style={styles.statLabel}>Grad Year</Text>
            </View>
          </View>
        </Card>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <Card variant="flat" padding="none" style={styles.menuCard}>
            <MenuItem icon="👤" label="Edit Profile" onPress={handleEditProfile} />
            <MenuItem icon="🔔" label="Notifications" onPress={handleNotifications} />
            <MenuItem icon="🔒" label="Privacy" onPress={handlePrivacy} />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <Card variant="flat" padding="none" style={styles.menuCard}>
            <MenuItem icon="❓" label="Help & Support" onPress={handleHelp} />
            <MenuItem icon="ℹ️" label="About CAPMATE" onPress={handleAbout} />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Card variant="flat" padding="none" style={styles.menuCard}>
            <MenuItem icon="🚪" label="Logout" onPress={handleLogout} danger />
          </Card>
        </View>

        {/* Version Info */}
        <Text style={styles.versionText}>CAPMATE v1.0.0 (Prototype)</Text>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    ...typography.h3,
    color: colors.text,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  collegeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  collegeTagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    ...typography.label,
    color: colors.primary,
  },
  statsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  menuSection: {
    marginBottom: spacing.lg,
  },
  menuSectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  menuCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  menuArrow: {
    ...typography.h3,
    color: colors.textTertiary,
  },
  versionText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginVertical: spacing['2xl'],
  },
});

export default ProfileMainScreen;
