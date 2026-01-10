/**
 * Mock Chat Data
 * Sample conversations and messages for development
 */

import { Conversation, Message } from '@types/chat.types';

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'user-2',
    participantName: 'Rahul Sharma',
    participantAvatar: 'https://picsum.photos/seed/user2/100',
    productId: 'prod-1',
    productTitle: 'MacBook Pro 2021',
    productImage: 'https://picsum.photos/seed/macbook/200',
    lastMessage: 'Is this still available?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'conv-2',
    participantId: 'user-3',
    participantName: 'Priya Patel',
    participantAvatar: 'https://picsum.photos/seed/user3/100',
    productId: 'prod-2',
    productTitle: 'Study Table with Chair',
    productImage: 'https://picsum.photos/seed/table/200',
    lastMessage: 'Can you do 1500?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'conv-3',
    participantId: 'user-4',
    participantName: 'Amit Kumar',
    participantAvatar: 'https://picsum.photos/seed/user4/100',
    productId: 'prod-3',
    productTitle: 'Engineering Books Bundle',
    productImage: 'https://picsum.photos/seed/books/200',
    lastMessage: 'Thanks! See you tomorrow at the hostel.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'conv-4',
    participantId: 'user-5',
    participantName: 'Sneha Reddy',
    participantAvatar: 'https://picsum.photos/seed/user5/100',
    productId: 'prod-4',
    productTitle: 'Firefox Cycle - Gear Cycle',
    productImage: 'https://picsum.photos/seed/cycle/200',
    lastMessage: 'What\'s the lowest you can go?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    isOnline: false,
  },
];

// Mock messages for each conversation
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'user-2',
      text: 'Hi! I saw your MacBook listing.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'current-user',
      text: 'Hey! Yes, it\'s available. Are you interested?',
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'user-2',
      text: 'Yes! What\'s the condition like? Any scratches?',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'current-user',
      text: 'It\'s in excellent condition. Only used for 6 months. Battery health is at 95%.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-1-5',
      conversationId: 'conv-1',
      senderId: 'user-2',
      text: 'That sounds great! Is this still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
      type: 'text',
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'user-3',
      text: 'Hello, is the study table still for sale?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'current-user',
      text: 'Yes it is! It\'s in good condition.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'user-3',
      text: 'The price is 2000 right?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-2-4',
      conversationId: 'conv-2',
      senderId: 'current-user',
      text: 'Yes, that\'s correct.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-2-5',
      conversationId: 'conv-2',
      senderId: 'user-3',
      text: 'Can you do 1500?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
      type: 'text',
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conv-3',
      senderId: 'user-4',
      text: 'Hi, are these books for CSE branch?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-3-2',
      conversationId: 'conv-3',
      senderId: 'current-user',
      text: 'Yes! They\'re all from 3rd and 4th year CSE.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-3-3',
      conversationId: 'conv-3',
      senderId: 'user-4',
      text: 'Perfect! I\'ll take them. When can we meet?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-3-4',
      conversationId: 'conv-3',
      senderId: 'current-user',
      text: 'How about tomorrow at 5pm near the library?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-3-5',
      conversationId: 'conv-3',
      senderId: 'user-4',
      text: 'Thanks! See you tomorrow at the hostel.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      type: 'text',
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      conversationId: 'conv-4',
      senderId: 'user-5',
      text: 'Hey, I\'m interested in the cycle!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-4-2',
      conversationId: 'conv-4',
      senderId: 'current-user',
      text: 'Great! It\'s a Firefox with 21 gears.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
      isRead: true,
      type: 'text',
    },
    {
      id: 'msg-4-3',
      conversationId: 'conv-4',
      senderId: 'user-5',
      text: 'What\'s the lowest you can go?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: false,
      type: 'text',
    },
  ],
};

// Get total unread count
export const getTotalUnreadCount = (): number => {
  return mockConversations.reduce((total, conv) => total + conv.unreadCount, 0);
};
