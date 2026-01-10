/**
 * Home List Screen
 * Main product feed with filters
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { HomeStackScreenProps } from '@types/navigation.types';
import { Product, ProductCategory, ProductFilters } from '@types/product.types';
import { Container } from '@components/layout/Container';
import { ProductCard, Button, Badge, Input } from '@components/common';
import { Loading, EmptyState } from '@components/feedback';
import { useAuth } from '@context/AuthContext';
import { useProducts } from '@context/ProductContext';
import { colors, typography, spacing, borderRadius } from '@theme/index';
import { CATEGORIES, PRICE_RANGE } from '@constants/index';

type Props = HomeStackScreenProps<'HomeList'>;

const HomeListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const {
    products,
    filters,
    isLoading,
    hasMore,
    fetchProducts,
    loadMore,
    setFilters,
    clearFilters,
  } = useProducts();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [tempFilters, setTempFilters] = useState<ProductFilters>({});

  const collegeId = user?.collegeId || 'iit-delhi';

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts(collegeId);
  }, [collegeId, filters]);

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts(collegeId, true);
    setRefreshing(false);
  }, [collegeId, fetchProducts]);

  // Load more products
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      loadMore(collegeId);
    }
  }, [hasMore, isLoading, collegeId, loadMore]);

  // Navigate to product detail
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id, product });
  };

  // Handle search
  const handleSearch = useCallback(() => {
    setFilters({ ...filters, search: searchQuery });
  }, [searchQuery, filters, setFilters]);

  // Open filters modal
  const handleOpenFilters = () => {
    setTempFilters(filters);
    setShowFilters(true);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setTempFilters({});
    clearFilters();
    setSearchQuery('');
    setShowFilters(false);
  };

  // Toggle category filter
  const toggleCategory = (category: ProductCategory) => {
    setTempFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  };

  // Check if filters are active
  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.search;

  // Render product item
  const renderProductItem = ({ item, index }: { item: Product; index: number }) => (
    <View style={[styles.productItem, index % 2 === 0 ? styles.productItemLeft : styles.productItemRight]}>
      <ProductCard product={item} onPress={handleProductPress} variant="grid" />
    </View>
  );

  // Render header
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            containerStyle={styles.searchInput}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={handleOpenFilters}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          {filters.category && (
            <Badge
              label={CATEGORIES.find(c => c.value === filters.category)?.label || filters.category}
              variant="info"
              size="sm"
            />
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge
              label={`₹${filters.minPrice || 0} - ₹${filters.maxPrice || 'Any'}`}
              variant="info"
              size="sm"
            />
          )}
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.resultsText}>
        {products.length} items in {user?.collegeName || 'your college'}
      </Text>
    </View>
  );

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!isLoading || products.length === 0) return null;
    return <Loading size="small" />;
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyState
        title="No items found"
        message={
          hasActiveFilters
            ? 'Try adjusting your filters or search terms'
            : 'Be the first to post an item!'
        }
        actionLabel={hasActiveFilters ? 'Clear Filters' : 'Post Item'}
        onAction={hasActiveFilters ? handleClearFilters : () => navigation.navigate('Create' as never)}
      />
    );
  };

  return (
    <Container withPadding={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>CAPMATE</Text>
        <Text style={styles.collegeTag}>{user?.collegeName || 'Your College'}</Text>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Categories */}
            <Text style={styles.filterSectionTitle}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryButton,
                    tempFilters.category === category.value && styles.categoryButtonSelected,
                  ]}
                  onPress={() => toggleCategory(category.value)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      tempFilters.category === category.value && styles.categoryLabelSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceInputs}>
              <Input
                placeholder="Min"
                value={tempFilters.minPrice?.toString() || ''}
                onChangeText={text =>
                  setTempFilters(prev => ({
                    ...prev,
                    minPrice: text ? parseInt(text, 10) : undefined,
                  }))
                }
                keyboardType="numeric"
                containerStyle={styles.priceInput}
              />
              <Text style={styles.priceSeparator}>to</Text>
              <Input
                placeholder="Max"
                value={tempFilters.maxPrice?.toString() || ''}
                onChangeText={text =>
                  setTempFilters(prev => ({
                    ...prev,
                    maxPrice: text ? parseInt(text, 10) : undefined,
                  }))
                }
                keyboardType="numeric"
                containerStyle={styles.priceInput}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Clear All"
              variant="outline"
              onPress={handleClearFilters}
              style={styles.modalButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApplyFilters}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
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
  },
  logo: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
  collegeTag: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },
  listHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  searchContainer: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm + 18, // Align with input
  },
  filterButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  filterIcon: {
    fontSize: 20,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  clearFiltersText: {
    ...typography.label,
    color: colors.primary,
  },
  resultsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  row: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  productItem: {
    marginBottom: spacing.lg,
  },
  productItemLeft: {
    marginRight: spacing.sm,
  },
  productItemRight: {
    marginLeft: spacing.sm,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  filterSectionTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
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
  categoryButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  categoryLabelSelected: {
    color: colors.primary,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  priceInput: {
    flex: 1,
    marginBottom: 0,
  },
  priceSeparator: {
    ...typography.body,
    color: colors.textSecondary,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  modalButton: {
    flex: 1,
  },
});

export default HomeListScreen;
