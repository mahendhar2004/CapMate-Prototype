/**
 * Chat Service
 * Handles chat/messaging operations (mock implementation)
 */

import { Conversation, Message } from '@types/chat.types';
import { mockConversations, mockMessages } from '../../mock/data/chats';
import { ApiResponse } from '@types/api.types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ChatService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    await delay(500);

    // Sort by last message time (most recent first)
    const sorted = [...mockConversations].sort(
      (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
    );

    return {
      success: true,
      data: sorted,
    };
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    await delay(300);

    const messages = mockMessages[conversationId] || [];

    // Sort by timestamp (oldest first for chat display)
    const sorted = [...messages].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    return {
      success: true,
      data: sorted,
    };
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    conversationId: string,
    text: string
  ): Promise<ApiResponse<Message>> {
    await delay(200);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      text,
      timestamp: new Date(),
      isRead: true,
      type: 'text',
    };

    // In a real app, this would be sent to the server
    // For mock, we just return the message
    return {
      success: true,
      data: newMessage,
    };
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string): Promise<ApiResponse<void>> {
    await delay(100);

    // In a real app, this would update the read status on the server
    return {
      success: true,
    };
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<ApiResponse<Conversation | null>> {
    await delay(200);

    const conversation = mockConversations.find(c => c.id === conversationId);

    return {
      success: true,
      data: conversation || null,
    };
  }

  /**
   * Start a new conversation about a product
   */
  async startConversation(
    productId: string,
    sellerId: string,
    initialMessage: string
  ): Promise<ApiResponse<Conversation>> {
    await delay(300);

    // In a real app, this would create a new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participantId: sellerId,
      participantName: 'Seller',
      productId,
      productTitle: 'Product',
      lastMessage: initialMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
    };

    return {
      success: true,
      data: newConversation,
    };
  }

  /**
   * Get or create a conversation for a product with a seller
   * Returns existing conversation if one exists, otherwise creates a new one
   */
  async getOrCreateConversation(
    productId: string,
    sellerId: string,
    sellerName: string,
    productTitle: string
  ): Promise<ApiResponse<Conversation>> {
    await delay(300);

    // Check if conversation already exists for this product
    const existingConversation = mockConversations.find(
      c => c.productId === productId && c.participantId === sellerId
    );

    if (existingConversation) {
      return {
        success: true,
        data: existingConversation,
      };
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participantId: sellerId,
      participantName: sellerName,
      participantAvatar: undefined,
      productId,
      productTitle,
      productImage: undefined,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
    };

    // In a real app, this would be saved to the server
    mockConversations.push(newConversation);

    return {
      success: true,
      data: newConversation,
    };
  }
}

export const chatService = new ChatService();
