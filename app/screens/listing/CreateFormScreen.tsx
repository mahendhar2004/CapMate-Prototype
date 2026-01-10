/**
 * Create Form Screen
 * Form for creating a new product listing
 */

import React, { useState } from 'react';
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
import { CreateListingStackScreenProps } from '@types/navigation.types';
import { ProductCategory, ProductCondition, CreateProductInput } from '@types/product.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { Button, Input, Card } from '@components/common';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { CATEGORIES, CONDITIONS, IMAGE_CONFIG } from '@constants/index';
import { validateProductForm, ProductFormErrors } from '@utils/validators';

type Props = CreateListingStackScreenProps<'CreateForm'>;

interface FormState {
  title: string;
  description: string;
  price: string;
  category: ProductCategory | '';
  condition: ProductCondition | '';
}

const CreateFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const editProduct = route.params?.editProduct;

  const [form, setForm] = useState<FormState>({
    title: editProduct?.title || '',
    description: editProduct?.description || '',
    price: editProduct?.price?.toString() || '',
    category: editProduct?.category || '',
    condition: editProduct?.condition || '',
  });
  const [images, setImages] = useState<string[]>(editProduct?.images || []);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handlePickImage = async () => {
    if (images.length >= IMAGE_CONFIG.MAX_IMAGES) {
      Alert.alert('Limit Reached', `You can only add up to ${IMAGE_CONFIG.MAX_IMAGES} images`);
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: IMAGE_CONFIG.ASPECT_RATIO,
      quality: IMAGE_CONFIG.QUALITY,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const validationErrors = validateProductForm({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price) || 0,
      category: form.category,
      condition: form.condition,
      images,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const productInput: CreateProductInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category as ProductCategory,
      condition: form.condition as ProductCondition,
      images,
    };

    navigation.navigate('ReviewListing', { product: productInput, images });
  };

  return (
    <Container withPadding={false}>
      <Header title={editProduct ? 'Edit Listing' : 'Create Listing'} showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Images Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.sectionHint}>
              Add up to {IMAGE_CONFIG.MAX_IMAGES} photos. First photo will be the cover.
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
              {images.map((uri, index) => (
                <View key={uri} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.coverBadge}>
                      <Text style={styles.coverBadgeText}>Cover</Text>
                    </View>
                  )}
                </View>
              ))}

              {images.length < IMAGE_CONFIG.MAX_IMAGES && (
                <TouchableOpacity style={styles.addImageButton} onPress={handlePickImage}>
                  <Text style={styles.addImageIcon}>📷</Text>
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
          </View>

          {/* Title */}
          <Input
            label="Title"
            placeholder="What are you selling?"
            value={form.title}
            onChangeText={text => updateField('title', text)}
            error={errors.title}
            required
          />

          {/* Description */}
          <Input
            label="Description"
            placeholder="Describe your item (condition, brand, reason for selling...)"
            value={form.description}
            onChangeText={text => updateField('description', text)}
            multiline
            numberOfLines={4}
            error={errors.description}
            required
          />

          {/* Price */}
          <Input
            label="Price (₹)"
            placeholder="Enter price"
            value={form.price}
            onChangeText={text => updateField('price', text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            error={errors.price}
            required
          />

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>
              Category <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.optionGrid}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.optionButton,
                    form.category === category.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => updateField('category', category.value)}
                >
                  <Text style={styles.optionIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      form.category === category.value && styles.optionLabelSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>
              Condition <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.conditionList}>
              {CONDITIONS.map(condition => (
                <TouchableOpacity
                  key={condition.value}
                  style={[
                    styles.conditionButton,
                    form.condition === condition.value && styles.conditionButtonSelected,
                  ]}
                  onPress={() => updateField('condition', condition.value)}
                >
                  <View style={styles.conditionContent}>
                    <Text
                      style={[
                        styles.conditionLabel,
                        form.condition === condition.value && styles.conditionLabelSelected,
                      ]}
                    >
                      {condition.label}
                    </Text>
                    <Text style={styles.conditionDescription}>{condition.description}</Text>
                  </View>
                  {form.condition === condition.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Button title="Continue to Review" onPress={handleContinue} fullWidth />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '600',
  },
  coverBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  coverBadgeText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.borderLight,
  },
  addImageIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  addImageText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  inputLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  optionIcon: {
    fontSize: 16,
  },
  optionLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  conditionList: {
    gap: spacing.sm,
  },
  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  conditionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  conditionContent: {
    flex: 1,
  },
  conditionLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: 2,
  },
  conditionLabelSelected: {
    color: colors.primary,
  },
  conditionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  bottomBar: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
});

export default CreateFormScreen;
