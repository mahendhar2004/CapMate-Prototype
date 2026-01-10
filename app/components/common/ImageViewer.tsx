/**
 * ImageViewer Component
 * Swipeable image gallery with zoom and pagination
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { colors, spacing, borderRadius } from '@theme/index';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageViewerProps {
  images: string[];
  height?: number;
  showPagination?: boolean;
  borderRadius?: number;
  onImagePress?: (index: number) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  height = 300,
  showPagination = true,
  borderRadius: customBorderRadius = borderRadius.xl,
  onImagePress,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fullscreenFlatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleImagePress = (index: number) => {
    if (onImagePress) {
      onImagePress(index);
    } else {
      setFullscreenVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        fullscreenFlatListRef.current?.scrollToIndex({ index, animated: false });
      }, 100);
    }
  };

  const handleCloseFullscreen = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setFullscreenVisible(false);
    });
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => handleImagePress(index)}
      style={[styles.imageContainer, { width: SCREEN_WIDTH - spacing.lg * 2, height }]}
    >
      <Image
        source={{ uri: item }}
        style={[styles.image, { borderRadius: customBorderRadius }]}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderFullscreenImage = ({ item }: { item: string }) => (
    <View style={styles.fullscreenImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.fullscreenImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderPagination = () => {
    if (!showPagination || images.length <= 1) return null;

    return (
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderThumbnails = () => {
    if (images.length <= 1) return null;

    return (
      <View style={styles.thumbnailContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            style={[
              styles.thumbnail,
              index === activeIndex && styles.thumbnailActive,
            ]}
          >
            <Image
              source={{ uri: image }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (images.length === 0) {
    return (
      <View style={[styles.placeholder, { height }]}>
        <Image
          source={{ uri: 'https://picsum.photos/400/300?grayscale' }}
          style={[styles.image, { borderRadius: customBorderRadius }]}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_WIDTH - spacing.lg * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />

      {renderPagination()}
      {renderThumbnails()}

      {/* Fullscreen Modal */}
      <Modal
        visible={fullscreenVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseFullscreen}
      >
        <StatusBar hidden />
        <Animated.View style={[styles.fullscreenContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseFullscreen}
          >
            <View style={styles.closeButtonInner}>
              <View style={[styles.closeLine, styles.closeLineLeft]} />
              <View style={[styles.closeLine, styles.closeLineRight]} />
            </View>
          </TouchableOpacity>

          <FlatList
            ref={fullscreenFlatListRef}
            data={images}
            renderItem={renderFullscreenImage}
            keyExtractor={(_, index) => `fullscreen-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={activeIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />

          {/* Fullscreen Pagination */}
          <View style={styles.fullscreenPagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.fullscreenDot,
                  index === activeIndex && styles.fullscreenDotActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  flatListContent: {
    paddingHorizontal: spacing.lg,
  },
  imageContainer: {
    marginRight: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.skeleton,
  },
  placeholder: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.skeleton,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },

  // Pagination
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },

  // Thumbnails
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  thumbnailActive: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  // Fullscreen
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  fullscreenImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonInner: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLine: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: colors.textInverse,
    borderRadius: 1,
  },
  closeLineLeft: {
    transform: [{ rotate: '45deg' }],
  },
  closeLineRight: {
    transform: [{ rotate: '-45deg' }],
  },
  fullscreenPagination: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  fullscreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  fullscreenDotActive: {
    backgroundColor: colors.textInverse,
    width: 24,
  },
});

export default ImageViewer;
