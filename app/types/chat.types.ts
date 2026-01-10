/**
 * Chat type definitions
 * Types for messaging functionality
 */

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'system';
}

export interface ChatListState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatDetailState {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}
