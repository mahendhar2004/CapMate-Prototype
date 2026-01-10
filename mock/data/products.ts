/**
 * Mock product data
 */

import { Product, ProductCategory, ProductCondition, ListingStatus } from '@types/product.types';
import { getRandomPlaceholderImage } from '@utils/helpers';

// Generate mock dates
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'MacBook Air M1 2020',
    description: 'Excellent condition MacBook Air with M1 chip. 8GB RAM, 256GB SSD. Includes original charger and box. Battery health at 92%. Perfect for coding and design work.',
    price: 65000,
    category: 'electronics',
    condition: 'like_new',
    images: [
      'https://picsum.photos/seed/macbook1/400/300',
      'https://picsum.photos/seed/macbook2/400/300',
    ],
    sellerId: 'user-1',
    sellerName: 'Rahul Sharma',
    sellerAvatar: 'https://i.pravatar.cc/150?u=rahul',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    viewCount: 156,
  },
  {
    id: 'prod-2',
    title: 'Study Table with Chair',
    description: 'Wooden study table with comfortable chair. Table has drawer for storage. Used for 2 years, still in great condition. Pick up from hostel.',
    price: 3500,
    category: 'furniture',
    condition: 'good',
    images: [
      'https://picsum.photos/seed/table1/400/300',
      'https://picsum.photos/seed/table2/400/300',
    ],
    sellerId: 'user-2',
    sellerName: 'Priya Patel',
    sellerAvatar: 'https://i.pravatar.cc/150?u=priya',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
    viewCount: 89,
  },
  {
    id: 'prod-3',
    title: 'Engineering Mathematics Books Set',
    description: 'Complete set of engineering mathematics textbooks (Sem 1-4). Includes solved examples and previous year papers. Minimal highlighting.',
    price: 800,
    category: 'books',
    condition: 'good',
    images: [
      'https://picsum.photos/seed/books1/400/300',
    ],
    sellerId: 'user-3',
    sellerName: 'Amit Kumar',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
    viewCount: 234,
  },
  {
    id: 'prod-4',
    title: 'Firefox Cycle - Gear Cycle',
    description: '21-speed Firefox gear cycle in excellent condition. Recently serviced with new brakes. Perfect for campus commute. Lock included.',
    price: 8500,
    category: 'cycles',
    condition: 'like_new',
    images: [
      'https://picsum.photos/seed/cycle1/400/300',
      'https://picsum.photos/seed/cycle2/400/300',
      'https://picsum.photos/seed/cycle3/400/300',
    ],
    sellerId: 'user-4',
    sellerName: 'Sneha Reddy',
    sellerAvatar: 'https://i.pravatar.cc/150?u=sneha',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    viewCount: 312,
  },
  {
    id: 'prod-5',
    title: 'JBL Bluetooth Speaker',
    description: 'JBL Flip 5 portable Bluetooth speaker. Waterproof, great bass. Battery lasts 12+ hours. Comes with charging cable.',
    price: 4500,
    category: 'electronics',
    condition: 'good',
    images: [
      'https://picsum.photos/seed/speaker1/400/300',
    ],
    sellerId: 'user-5',
    sellerName: 'Vikram Singh',
    sellerAvatar: 'https://i.pravatar.cc/150?u=vikram',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
    viewCount: 178,
  },
  {
    id: 'prod-6',
    title: 'Mattress - Single Bed',
    description: 'Sleepwell mattress, 6 inch thick. Used for 1 year only. Very comfortable, no stains. Perfect for hostel rooms.',
    price: 2500,
    category: 'furniture',
    condition: 'good',
    images: [
      'https://picsum.photos/seed/mattress1/400/300',
    ],
    sellerId: 'user-1',
    sellerName: 'Rahul Sharma',
    sellerAvatar: 'https://i.pravatar.cc/150?u=rahul',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    viewCount: 145,
  },
  {
    id: 'prod-7',
    title: 'Cricket Kit Complete Set',
    description: 'Full cricket kit with bat, pads, gloves, helmet, and kit bag. SS brand. Used for college team practice. Good condition.',
    price: 6000,
    category: 'sports',
    condition: 'good',
    images: [
      'https://picsum.photos/seed/cricket1/400/300',
      'https://picsum.photos/seed/cricket2/400/300',
    ],
    sellerId: 'user-2',
    sellerName: 'Priya Patel',
    sellerAvatar: 'https://i.pravatar.cc/150?u=priya',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'sold',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(6),
    viewCount: 267,
  },
  {
    id: 'prod-8',
    title: 'Induction Cooktop + Cookware',
    description: 'Prestige induction cooktop with 3 utensils (kadai, pan, and pot). Great for hostel cooking. Works perfectly.',
    price: 2000,
    category: 'kitchen',
    condition: 'good',
    images: [
      'https://picsum.photos/seed/kitchen1/400/300',
    ],
    sellerId: 'user-3',
    sellerName: 'Amit Kumar',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
    viewCount: 98,
  },
  {
    id: 'prod-9',
    title: 'LED Desk Lamp with USB',
    description: 'Adjustable LED desk lamp with USB charging port. 3 brightness levels. Eye-care technology. Perfect for late night study.',
    price: 700,
    category: 'decor',
    condition: 'like_new',
    images: [
      'https://picsum.photos/seed/lamp1/400/300',
    ],
    sellerId: 'user-4',
    sellerName: 'Sneha Reddy',
    sellerAvatar: 'https://i.pravatar.cc/150?u=sneha',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
    viewCount: 67,
  },
  {
    id: 'prod-10',
    title: 'Winter Jacket - XL Size',
    description: 'Woodland winter jacket, XL size. Water resistant, very warm. Worn for one winter only. Perfect for Delhi winters.',
    price: 1800,
    category: 'clothing',
    condition: 'like_new',
    images: [
      'https://picsum.photos/seed/jacket1/400/300',
    ],
    sellerId: 'user-5',
    sellerName: 'Vikram Singh',
    sellerAvatar: 'https://i.pravatar.cc/150?u=vikram',
    collegeId: 'iit-delhi',
    collegeName: 'IIT Delhi',
    status: 'active',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(10),
    viewCount: 123,
  },
];

export const getMockProductById = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.id === id);
};

export const getMockProductsBySeller = (sellerId: string): Product[] => {
  return MOCK_PRODUCTS.filter(p => p.sellerId === sellerId);
};

export const getMockProductsByCollege = (collegeId: string): Product[] => {
  return MOCK_PRODUCTS.filter(p => p.collegeId === collegeId);
};

export const getMockProductsByCategory = (category: ProductCategory): Product[] => {
  return MOCK_PRODUCTS.filter(p => p.category === category);
};
