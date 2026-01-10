/**
 * Listings List Screen
 * User's own listings with improved UI matching feed page
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MyListingsStackScreenProps } from '@types/navigation.types';
import { Product } from '@types/product.types';
import { Container } from '@components/layout/Container';
import { Badge } from '@components/common';
import { Loading, EmptyState } from '@components/feedback';
import { useAuth } from '@context/AuthContext';
import { useProducts } from '@context/ProductContext';
import { productService } from '@services/product.service';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { formatStatus, formatPrice, formatRelativeTime } from '@utils/formatters';
import { getStatusBadgeVariant, CategoryBadge } from '@components/common/Badge';
import { TIMING, EASING } from '@utils/animations';

type Props = MyListingsStackScreenProps<'ListingsList'>;

// Tab bar height calculation helper
const TAB_BAR_BASE_HEIGHT = 60;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;

// Animated Stat Card Component
interface StatCardProps {
  number: number;
  label: string;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, color, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 200,
        friction: 15,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay,
        duration: TIMING.normal,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// Animated Listing Card Component
interface ListingCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onMarkSold: (product: Product) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  product,
  index,
  onEdit,
  onDelete,
  onMarkSold,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = Math.min(index * TIMING.stagger, 400);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TIMING.normal,
        delay,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: TIMING.normal,
        delay,
        easing: EASING.decelerate,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        },
      ]}
    >
      <Pressable
        onPress={() => onEdit(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.card}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.images[0] || 'https://picsum.photos/400/200' }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Status Badge Overlay */}
            <View style={styles.statusOverlay}>
              <Badge
                label={formatStatus(product.status)}
                variant={getStatusBadgeVariant(product.status)}
                size="sm"
              />
            </View>

            {/* Image Count */}
            {product.images.length > 1 && (
              <View style={styles.imageCountBadge}>
                <Text style={styles.imageCountText}>{product.images.length}</Text>
              </View>
            )}

            {/* Sold Overlay */}
            {product.status === 'sold' && (
              <View style={styles.soldOverlay}>
                <View style={styles.soldBadge}>
                  <Text style={styles.soldText}>SOLD</Text>
                </View>
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            <View style={styles.categoryRow}>
              <CategoryBadge category={product.category} size="sm" />
              <Text style={styles.time}>{formatRelativeTime(product.createdAt)}</Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>

            <Text style={styles.price}>{formatPrice(product.price)}</Text>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {product.status === 'active' && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => onMarkSold(product)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnIcon}>✓</Text>
                  <Text style={styles.actionBtnText}>Mark Sold</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => onEdit(product)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnIcon}>✎</Text>
                <Text style={styles.actionBtnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => onDelete(product)}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionBtnIcon, styles.deleteBtnText]}>×</Text>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const ListingsListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + (insets.bottom > 0 ? insets.bottom : spacing.sm);
  const { deleteProduct, markAsSold } = useProducts();
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: TIMING.normal,
      easing: EASING.smooth,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadListings = useCallback(async () => {
    if (!user) return;

    const response = await productService.getSellerProducts(user.id);
    if (response.success && response.data) {
      setListings(response.data);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
  };

  const handleEditListing = (product: Product) => {
    navigation.navigate('EditListing', { product });
  };

  const handleDeleteListing = (product: Product) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteProduct(product.id);
            if (success) {
              setListings(prev => prev.filter(p => p.id !== product.id));
            } else {
              Alert.alert('Error', 'Failed to delete listing');
            }
          },
        },
      ]
    );
  };

  const handleMarkAsSold = (product: Product) => {
    Alert.alert(
      'Mark as Sold',
      `Mark "${product.title}" as sold?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Sold!',
          onPress: async () => {
            const success = await markAsSold(product.id);
            if (success) {
              setListings(prev =>
                prev.map(p => (p.id === product.id ? { ...p, status: 'sold' } : p))
              );
            } else {
              Alert.alert('Error', 'Failed to update listing');
            }
          },
        },
      ]
    );
  };

  const handleCreateListing = () => {
    navigation.getParent()?.navigate('Create');
  };

  const activeCount = listings.filter(l => l.status === 'active').length;
  const soldCount = listings.filter(l => l.status === 'sold').length;

  const renderHeader = () => (
    <Animated.View style={[styles.headerSection, { opacity: headerFadeAnim }]}>
      {/* Stats Row */}
      {listings.length > 0 && (
        <View style={styles.statsRow}>
          <StatCard number={activeCount} label="Active" color={colors.success} delay={0} />
          <StatCard number={soldCount} label="Sold" color={colors.primary} delay={50} />
          <StatCard number={listings.length} label="Total" color={colors.text} delay={100} />
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {listings.length === 0
            ? 'No listings yet'
            : `${listings.length} ${listings.length === 1 ? 'listing' : 'listings'}`}
        </Text>
        {listings.length > 0 && (
          <TouchableOpacity style={styles.createBtn} onPress={handleCreateListing}>
            <Text style={styles.createBtnText}>+ New</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  const renderListingItem = ({ item, index }: { item: Product; index: number }) => (
    <ListingCard
      product={item}
      index={index}
      onEdit={handleEditListing}
      onDelete={handleDeleteListing}
      onMarkSold={handleMarkAsSold}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyState
        title="No listings yet"
        message="Start selling items you no longer need!"
        actionLabel="Create Listing"
        onAction={handleCreateListing}
      />
    );
  };

  if (isLoading) {
    return (
      <Container withPadding={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Listings</Text>
        </View>
        <Loading fullScreen message="Loading your listings..." />
      </Container>
    );
  }

  return (
    <Container withPadding={false} withTabBarPadding={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{user?.collegeName || 'Seller'}</Text>
        </View>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + spacing.lg }]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text,
    fontWeight: '700',
  },
  headerBadge: {
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  headerBadgeText: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: '600',
  },
  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statNumber: {
    ...typography.h2,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  createBtn: {
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  createBtnText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '600',
  },
  listContent: {
    // paddingBottom handled dynamically with tab bar height
    flexGrow: 1,
  },
  cardWrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  imageContainer: {
    height: 160,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountText: {
    ...typography.labelSmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  soldText: {
    ...typography.label,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    padding: spacing.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  time: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  title: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  price: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFaded,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  actionBtnIcon: {
    fontSize: 14,
    color: colors.primary,
  },
  actionBtnText: {
    ...typography.labelSmall,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: colors.errorFaded,
  },
  deleteBtnText: {
    color: colors.error,
  },
});

export default ListingsListScreen;
