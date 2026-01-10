/**
 * Chat Detail Screen
 * Individual conversation view with messages
 */

import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChatStackScreenProps } from '@types/navigation.types';
import { Message } from '@types/chat.types';
import { Container } from '@components/layout/Container';
import { Loading } from '@components/feedback';
import { useAuth } from '@context/AuthContext';
import { chatService } from '@services/chat.service';
import { colors, typography, spacing, borderRadius, shadows } from '@theme/index';
import { TIMING, EASING } from '@utils/animations';

type Props = ChatStackScreenProps<'ChatDetail'>;

const TAB_BAR_BASE_HEIGHT = 60;

// Message Bubble Component
interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  index: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const delay = Math.min(index * 30, 200);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: TIMING.fast,
        delay,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: TIMING.fast,
        delay,
        easing: EASING.decelerate,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Animated.View
      style={[
        styles.messageWrapper,
        isCurrentUser ? styles.messageWrapperSent : styles.messageWrapperReceived,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.messageBubbleSent : styles.messageBubbleReceived,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.messageTextSent : styles.messageTextReceived,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isCurrentUser ? styles.messageTimeSent : styles.messageTimeReceived,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
};

const ChatDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { conversationId, participantName } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const parentNavigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

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

  // Scroll to end when keyboard shows
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const loadMessages = useCallback(async () => {
    const response = await chatService.getMessages(conversationId);
    if (response.success && response.data) {
      setMessages(response.data);
    }
    setIsLoading(false);

    // Mark as read
    await chatService.markAsRead(conversationId);
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    const response = await chatService.sendMessage(conversationId, inputText.trim());

    if (response.success && response.data) {
      setMessages(prev => [...prev, response.data!]);
      setInputText('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    setIsSending(false);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble
      message={item}
      isCurrentUser={item.senderId === 'current-user'}
      index={index}
    />
  );

  if (isLoading) {
    return (
      <Container withPadding={false} withTabBarPadding={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{participantName}</Text>
          <View style={styles.headerRight} />
        </View>
        <Loading fullScreen message="Loading messages..." />
      </Container>
    );
  }

  // Calculate bottom padding based on safe area
  const bottomPadding = Math.max(insets.bottom, spacing.md);

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{participantName}</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        keyboardShouldPersistTaps="handled"
        style={styles.messageListContainer}
        inverted={false}
      />

      {/* Input Area - positioned at bottom */}
      <View style={[styles.inputContainer, { paddingBottom: bottomPadding }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            <Text style={styles.sendIcon}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.success,
  },
  headerRight: {
    width: 40,
  },
  messageListContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  messageWrapper: {
    marginBottom: spacing.sm,
  },
  messageWrapperSent: {
    alignItems: 'flex-end',
  },
  messageWrapperReceived: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  messageBubbleSent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  messageBubbleReceived: {
    backgroundColor: colors.surfaceSecondary,
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    ...typography.body,
    lineHeight: 20,
  },
  messageTextSent: {
    color: colors.textInverse,
  },
  messageTextReceived: {
    color: colors.text,
  },
  messageTime: {
    ...typography.caption,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  messageTimeSent: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  messageTimeReceived: {
    color: colors.textTertiary,
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.xl,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.textInverse,
    fontWeight: '700',
  },
});

export default ChatDetailScreen;
