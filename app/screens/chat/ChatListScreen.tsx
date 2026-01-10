/**
 * Chat List Screen
 * Displays list of conversations
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatStackScreenProps } from '@types/navigation.types';
import { Conversation } from '@types/chat.types';
import { Container } from '@components/layout/Container';
import { Loading, EmptyState } from '@components/feedback';
import { useAuth } from '@context/AuthContext';
import { chatService } from '@services/chat.service';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { formatRelativeTime } from '@utils/formatters';
import { TIMING, EASING } from '@utils/animations';

type Props = ChatStackScreenProps<'ChatList'>;

const TAB_BAR_BASE_HEIGHT = 60;

// Animated Conversation Card
interface ConversationCardProps {
  conversation: Conversation;
  index: number;
  onPress: (conversation: Conversation) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  index,
  onPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = Math.min(index * TIMING.stagger, 300);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TIMING.normal,
        delay,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
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
          transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => onPress(conversation)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: conversation.participantAvatar || 'https://picsum.photos/100' }}
            style={styles.avatar}
          />
          {conversation.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        {/* Content */}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName} numberOfLines={1}>
              {conversation.participantName}
            </Text>
            <Text style={styles.timestamp}>
              {formatRelativeTime(conversation.lastMessageTime)}
            </Text>
          </View>

          <Text style={styles.productTitle} numberOfLines={1}>
            {conversation.productTitle}
          </Text>

          <View style={styles.messageRow}>
            <Text
              style={[
                styles.lastMessage,
                conversation.unreadCount > 0 && styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {conversation.lastMessage}
            </Text>
            {conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + (insets.bottom > 0 ? insets.bottom : spacing.sm);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = useCallback(async () => {
    const response = await chatService.getConversations();
    if (response.success && response.data) {
      setConversations(response.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('ChatDetail', {
      conversationId: conversation.id,
      participantName: conversation.participantName,
    });
  };

  const renderConversation = ({ item, index }: { item: Conversation; index: number }) => (
    <ConversationCard
      conversation={item}
      index={index}
      onPress={handleConversationPress}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyState
        title="No messages yet"
        message="Start a conversation by contacting a seller from a product listing"
      />
    );
  };

  if (isLoading) {
    return (
      <Container withPadding={false} withTabBarPadding={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <Loading fullScreen message="Loading conversations..." />
      </Container>
    );
  }

  return (
    <Container withPadding={false} withTabBarPadding={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{conversations.length} chats</Text>
        </View>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + spacing.lg }]}
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
  listContent: {
    paddingTop: spacing.md,
    flexGrow: 1,
  },
  cardWrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.skeleton,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  participantName: {
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  productTitle: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 11,
  },
});

export default ChatListScreen;
