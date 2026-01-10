/**
 * Mock user data
 */

import { User } from '@types/user.types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'rahul.sharma@iitd.ac.in',
    name: 'Rahul Sharma',
    phone: '9876543210',
    avatar: 'https://i.pravatar.cc/150?u=rahul',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    graduationYear: 2024,
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
  },
  {
    id: 'user-2',
    email: 'priya.patel@iitb.ac.in',
    name: 'Priya Patel',
    phone: '9876543211',
    avatar: 'https://i.pravatar.cc/150?u=priya',
    collegeId: 'iit-bombay',
    collegeName: 'IIT Bombay',
    graduationYear: 2024,
    createdAt: '2023-07-20T12:00:00Z',
    updatedAt: '2024-02-05T09:15:00Z',
  },
  {
    id: 'user-3',
    email: 'amit.kumar@bits.ac.in',
    name: 'Amit Kumar',
    phone: '9876543212',
    collegeId: 'bits-pilani',
    collegeName: 'BITS Pilani',
    graduationYear: 2025,
    createdAt: '2023-08-10T14:00:00Z',
    updatedAt: '2024-01-20T11:45:00Z',
  },
  {
    id: 'user-4',
    email: 'sneha.reddy@vit.ac.in',
    name: 'Sneha Reddy',
    phone: '9876543213',
    avatar: 'https://i.pravatar.cc/150?u=sneha',
    collegeId: 'vit-vellore',
    collegeName: 'VIT Vellore',
    graduationYear: 2024,
    createdAt: '2023-09-05T16:00:00Z',
    updatedAt: '2024-02-10T08:30:00Z',
  },
  {
    id: 'user-5',
    email: 'vikram.singh@iitm.ac.in',
    name: 'Vikram Singh',
    phone: '9876543214',
    avatar: 'https://i.pravatar.cc/150?u=vikram',
    collegeId: 'iit-madras',
    collegeName: 'IIT Madras',
    graduationYear: 2024,
    createdAt: '2023-10-15T11:00:00Z',
    updatedAt: '2024-01-25T14:20:00Z',
  },
];

export const getCurrentMockUser = (): User => MOCK_USERS[0];

export const getMockUserById = (id: string): User | undefined => {
  return MOCK_USERS.find(u => u.id === id);
};

export const getMockUserByEmail = (email: string): User | undefined => {
  return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
};
