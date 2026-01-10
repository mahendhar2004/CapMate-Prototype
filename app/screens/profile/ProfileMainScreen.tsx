/**
 * Profile Main Screen
 * User profile with settings - Enhanced design
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { ProfileStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Avatar, Card, Button } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';

type Props = ProfileStackScreenProps<'ProfileMain'>;

interface MenuItemProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  showArrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  danger,
  showArrow = true,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
      <Text style={styles.menuIcon}>{icon}</Text>
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && <Text style={styles.menuArrow}>›</Text>}
  </TouchableOpacity>
);

const ProfileMainScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
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
      'Need help? Choose an option below:',
      [
        {
          text: 'Email Support',
          onPress: () => Linking.openURL('mailto:support@capmate.app'),
        },
        { text: 'FAQ', onPress: () => showToast('FAQ coming soon!', 'info') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About CAPMATE',
      'CAPMATE v1.0.0 (Prototype)\n\nThe college marketplace for students.\n\nBuilt with React Native & Expo.\n\n© 2024 CAPMATE',
      [{ text: 'OK' }]
    );
  };

  const handleShare = () => {
    showToast('Share functionality coming soon!', 'info');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          showToast('Logged out successfully', 'success');
        },
      },
    ]);
  };

  return (
    <Container withPadding={false}>
      <Header title="Profile" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.profileHeader}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Avatar source={user?.avatar} name={user?.name} size="xl" />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.collegeTag}>
                <Text style={styles.collegeIcon}>🎓</Text>
                <Text style={styles.collegeTagText}>{user?.collegeName}</Text>
              </View>
            </View>
            <View style={styles.editIconContainer}>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <Card variant="outlined" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.graduationYear || '—'}</Text>
              <Text style={styles.statLabel}>Batch</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleShare}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>🔗</Text>
            </View>
            <Text style={styles.quickActionLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleHelp}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>💬</Text>
            </View>
            <Text style={styles.quickActionLabel}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleNotifications}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>🔔</Text>
            </View>
            <Text style={styles.quickActionLabel}>Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <Card variant="flat" padding="none" style={styles.menuCard}>
            <MenuItem
              icon="👤"
              label="Edit Profile"
              subtitle="Update your information"
              onPress={handleEditProfile}
            />
            <MenuItem
              icon="🔔"
              label="Notifications"
              subtitle="Manage alerts"
              onPress={handleNotifications}
            />
            <MenuItem
              icon="🔒"
              label="Privacy"
              subtitle="Control your data"
              onPress={handlePrivacy}
            />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <Card variant="flat" padding="none" style={styles.menuCard}>
            <MenuItem
              icon="❓"
              label="Help & Support"
              subtitle="Get help with CAPMATE"
              onPress={handleHelp}
            />
            <MenuItem
              icon="ℹ️"
              label="About"
              subtitle="App info & version"
              onPress={handleAbout}
            />
          </Card>
        </View>

        <View style={styles.menuSection}>
          <Card variant="flat" padding="none" style={styles.menuCard}>
            <MenuItem
              icon="🚪"
              label="Logout"
              onPress={handleLogout}
              danger
              showArrow={false}
            />
          </Card>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>CAPMATE v1.0.0</Text>
          <Text style={styles.versionSubtext}>Prototype Version</Text>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    ...shadows.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  collegeIcon: {
    fontSize: 12,
  },
  collegeTagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  editIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 16,
  },
  editButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
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
    paddingVertical: spacing.sm,
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
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
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuIconDanger: {
    backgroundColor: colors.errorLight,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    ...typography.label,
    color: colors.text,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  menuArrow: {
    ...typography.h3,
    color: colors.textTertiary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  versionText: {
    ...typography.label,
    color: colors.textTertiary,
  },
  versionSubtext: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default ProfileMainScreen;
