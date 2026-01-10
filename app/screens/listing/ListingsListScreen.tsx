/**
 * Listings List Screen
 * User's own listings
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { MyListingsStackScreenProps } from '@types/navigation.types';
import { Product } from '@types/product.types';
import { Container } from '@components/layout/Container';
import { Header } from '@components/layout/Header';
import { ProductCard, Button, Badge } from '@components/common';
import { Loading, EmptyState } from '@components/feedback';
import { useAuth } from '@context/AuthContext';
import { useProducts } from '@context/ProductContext';
import { productService } from '@services/product.service';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { formatStatus } from '@utils/formatters';
import { getStatusBadgeVariant } from '@components/common/Badge';

type Props = MyListingsStackScreenProps<'ListingsList'>;

const ListingsListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { deleteProduct, markAsSold } = useProducts();
  const [listings, setListings] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const renderListingItem = ({ item }: { item: Product }) => (
    <View style={styles.listingItem}>
      <ProductCard
        product={item}
        onPress={() => handleEditListing(item)}
        variant="list"
      />

      <View style={styles.listingActions}>
        <Badge
          label={formatStatus(item.status)}
          variant={getStatusBadgeVariant(item.status)}
          size="sm"
        />

        <View style={styles.actionButtons}>
          {item.status === 'active' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleMarkAsSold(item)}
            >
              <Text style={styles.actionButtonText}>Mark Sold</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditListing(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteListing(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      <Container>
        <Header title="My Listings" />
        <Loading fullScreen message="Loading your listings..." />
      </Container>
    );
  }

  return (
    <Container withPadding={false}>
      <Header title="My Listings" />

      {listings.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {listings.filter(l => l.status === 'active').length}
            </Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {listings.filter(l => l.status === 'sold').length}
            </Text>
            <Text style={styles.summaryLabel}>Sold</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{listings.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
      )}

      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
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
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primaryFaded,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.primaryLight,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
    flexGrow: 1,
  },
  listingItem: {
    marginBottom: spacing.md,
  },
  listingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.md,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  actionButtonText: {
    ...typography.label,
    color: colors.primary,
  },
  deleteButton: {},
  deleteButtonText: {
    ...typography.label,
    color: colors.error,
  },
});

export default ListingsListScreen;
