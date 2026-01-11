/**
 * Edit Profile Screen
 * Allows users to edit their profile information
 */

import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { ProfileStackScreenProps } from '@types/navigation.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Input, Avatar } from '@components/common';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';

type Props = ProfileStackScreenProps<'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateProfile, isLoading } = useAuth();
  const { showToast } = useToast();
  const parentNavigation = useNavigation();

  // Hide tab bar when this screen is focused
  useLayoutEffect(() => {
    parentNavigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      parentNavigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [parentNavigation]);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError('');
    setPhoneError('');

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setPhoneError('Please enter a valid 10-digit phone number');
      isValid = false;
    }

    return isValid;
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take a profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Change Profile Picture', 'Choose an option', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Library', onPress: handlePickImage },
      { text: 'Remove Photo', onPress: () => setAvatar(''), style: 'destructive' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.replace(/\D/g, '') || undefined,
        avatar: avatar || undefined,
      });

      showToast('Profile updated successfully!', 'success');
      navigation.goBack();
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleCancel = () => {
    if (
      name !== user?.name ||
      phone !== (user?.phone || '') ||
      avatar !== (user?.avatar || '')
    ) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <Container withPadding={false}>
      <Header
        title="Edit Profile"
        showBack
        onBackPress={handleCancel}
        rightAction={
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Avatar name={name || user?.name} size="xl" />
              )}
              <View style={styles.cameraButton}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={text => {
              setName(text);
              setNameError('');
            }}
            error={nameError}
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={user?.email || ''}
            editable={false}
            containerStyle={styles.disabledInput}
            hint="Email cannot be changed"
          />

          <Input
            label="Phone Number (Optional)"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={text => {
              setPhone(text);
              setPhoneError('');
            }}
            error={phoneError}
            keyboardType="phone-pad"
          />

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>College</Text>
              <Text style={styles.infoValue}>{user?.collegeName || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Graduation Year</Text>
              <Text style={styles.infoValue}>{user?.graduationYear || 'Not set'}</Text>
            </View>
            <Text style={styles.infoHint}>
              College details cannot be changed. Contact support if needed.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          <Button
            title="Cancel"
            variant="ghost"
            onPress={handleCancel}
            fullWidth
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['4xl'],
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.skeleton,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadows.md,
  },
  cameraIcon: {
    fontSize: 18,
  },
  changePhotoText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.md,
  },
  formSection: {
    padding: spacing.xl,
  },
  disabledInput: {
    opacity: 0.7,
  },
  infoCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.label,
    color: colors.text,
  },
  infoHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  cancelButton: {
    marginTop: spacing.md,
  },
  saveButton: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
