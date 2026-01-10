# CAPMATE - College Marketplace App

<p align="center">
  <strong>A modern marketplace for college students to buy and sell items within their campus community</strong>
</p>

<p align="center">
  Built with React Native | Expo | TypeScript
</p>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Approach](#solution-approach)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Mock Data Strategy](#mock-data-strategy)
- [Scalability Plan](#scalability-plan)
- [Coding Standards](#coding-standards)
- [Commit Philosophy](#commit-philosophy)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)

---

## Overview

CAPMATE is a mobile-first marketplace application designed specifically for college communities. The app enables graduating students to sell their belongings (luggage, electronics, furniture, books, etc.) to juniors within the same college, creating a trusted, localized marketplace.

**Current Version:** 1.0.0 (Prototype)

**Status:** Prototype with mock data - Ready for demo and investor pitch

---

## Problem Statement

Every year, thousands of graduating students face the challenge of disposing of items they can't take with them. Simultaneously, incoming students need these same items but often pay premium prices at retail stores.

**Key Challenges:**
- No trusted platform for intra-college commerce
- Sellers resort to random WhatsApp groups or notice boards
- Buyers lack verified seller information
- No quality control or standardized listings
- Security concerns with external marketplaces

---

## Solution Approach

CAPMATE provides a **college-scoped marketplace** where:

1. **Trust is Built-in:** All users are verified college students
2. **Localized Listings:** Products visible only to students of the same college
3. **Pay-to-Post Model:** Small listing fee ensures quality posts and generates revenue
4. **Simple Flow:** Post → Pay → Publish → Sell

**Revenue Model:**
- Pay-per-post: ₹49 per listing (one-time)
- Future: Featured listings, premium accounts

---

## Features

### Authentication (Mock)
- Email/password login and signup
- College selection during onboarding
- Persistent session storage
- Demo account for quick testing

### Home Feed
- Browse products from your college
- Filter by category and price range
- Search functionality
- Pull-to-refresh
- Infinite scroll pagination

### Create Listing
- Multi-image upload (up to 5 photos)
- Detailed product form
- Category and condition selection
- Review before payment
- Mock payment integration
- Success confirmation

### Product Detail
- Image gallery with indicators
- Seller information
- Contact seller CTA
- Share functionality

### My Listings
- View all posted items
- Edit existing listings
- Delete listings
- Mark items as sold
- Status tracking (Active, Sold, Pending)

### Profile
- User information display
- College affiliation
- Settings menu
- Logout functionality

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.76 |
| Platform | Expo SDK 52 (Managed Workflow) |
| Language | TypeScript (Strict Mode) |
| Navigation | React Navigation 7 |
| State Management | Context API + useReducer |
| Storage | AsyncStorage |
| Image Picker | expo-image-picker |
| Styling | StyleSheet (No external library) |
| Linting | ESLint + Prettier |

### Why These Choices?

**Context API over Redux:**
- Prototype scope doesn't require Redux complexity
- Provides Redux-like patterns (actions, reducers, selectors)
- Easier learning curve for team members
- Less boilerplate code
- Can migrate to Redux Toolkit later without major refactoring

**Expo Managed Workflow:**
- Faster development iteration
- OTA updates capability
- Cross-platform consistency
- Easy CI/CD integration with EAS

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                            │
│                    (Provider Wrapper)                       │
├─────────────────────────────────────────────────────────────┤
│  SafeAreaProvider → AuthProvider → ProductProvider          │
├─────────────────────────────────────────────────────────────┤
│                      RootNavigation                         │
│              (Auth Stack / Main Tabs)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Screens   │→ │  Components │→ │   Context   │         │
│  │  (UI Layer) │  │ (Reusable)  │  │   (State)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                                  │                │
│         ▼                                  ▼                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Services Layer                    │   │
│  │  (Abstraction for future AWS integration)            │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Mock Services                       │   │
│  │  (Simulates network calls, delays, errors)           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Purpose | Future Migration |
|-------|---------|------------------|
| Screens | UI rendering, user interaction | Unchanged |
| Components | Reusable UI elements | Unchanged |
| Context | State management | Can swap to Redux |
| Services | Business logic abstraction | Connect to AWS |
| Mock Services | Simulated backend | Replace with real API calls |

---

## Project Structure

```
CAPMATE/
├── app/
│   ├── navigation/           # Navigation configuration
│   │   ├── index.tsx         # Root navigation container
│   │   ├── AuthNavigator.tsx # Auth flow screens
│   │   └── MainNavigator.tsx # Main app with tabs
│   │
│   ├── screens/              # Screen components
│   │   ├── auth/             # Login, Signup, CollegeSelect
│   │   ├── home/             # HomeListScreen
│   │   ├── listing/          # Create, Review, Payment, Success, MyListings
│   │   ├── product/          # ProductDetail
│   │   └── profile/          # ProfileMain
│   │
│   ├── components/           # Shared UI components
│   │   ├── common/           # Button, Input, Card, Badge, Avatar, ProductCard
│   │   ├── layout/           # Container, Header
│   │   └── feedback/         # Loading, EmptyState
│   │
│   ├── context/              # State management
│   │   ├── AuthContext.tsx   # User session state
│   │   └── ProductContext.tsx# Product listings state
│   │
│   ├── services/             # Service abstractions
│   │   ├── auth.service.ts   # Auth operations
│   │   ├── product.service.ts# Product CRUD
│   │   └── payment.service.ts# Payment operations
│   │
│   ├── hooks/                # Custom React hooks
│   │   └── (imported from context)
│   │
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts     # Price, date, text formatting
│   │   ├── validators.ts     # Form validation
│   │   └── helpers.ts        # General utilities
│   │
│   ├── constants/            # App constants
│   │   ├── categories.ts     # Product categories
│   │   ├── conditions.ts     # Item conditions
│   │   └── colleges.ts       # College list
│   │
│   ├── theme/                # Design system
│   │   ├── colors.ts         # Color palette
│   │   ├── typography.ts     # Font styles
│   │   ├── spacing.ts        # Spacing scale
│   │   └── index.ts          # Theme exports
│   │
│   └── types/                # TypeScript definitions
│       ├── user.types.ts     # User, Auth types
│       ├── product.types.ts  # Product, Listing types
│       ├── api.types.ts      # API response types
│       └── navigation.types.ts# Navigation params
│
├── mock/                     # Mock data layer
│   ├── data/
│   │   ├── users.ts          # Sample users
│   │   └── products.ts       # Sample products
│   └── services/
│       ├── auth.mock.ts      # Mock auth operations
│       ├── product.mock.ts   # Mock product CRUD
│       └── payment.mock.ts   # Mock payment flow
│
├── config/                   # App configuration
│   ├── env.ts                # Environment variables
│   └── api.config.ts         # API configuration
│
├── assets/                   # Static assets
│   ├── images/
│   └── icons/
│
├── App.tsx                   # App entry point
├── babel.config.js           # Babel + module resolver
├── tsconfig.json             # TypeScript config
├── .eslintrc.js              # ESLint rules
├── .prettierrc               # Prettier config
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for emulator)
- Expo Go app (for physical device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/capmate.git
cd capmate

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

```bash
# Start Expo development server
npx expo start

# Run on iOS simulator (Mac only)
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Run in web browser
npx expo start --web
```

### Demo Account

For quick testing, use the demo login:
- Click "Try Demo Account" on the login screen
- Email: `rahul.sharma@iitd.ac.in`
- Password: `demo123`

---

## Mock Data Strategy

All data in this prototype comes from the `mock/` directory:

### Mock Services Pattern

```typescript
// Example: mock/services/auth.mock.ts

export const mockLogin = async (credentials: AuthCredentials) => {
  // Simulate network delay
  await delay(800);

  // Simulate validation
  if (!credentials.email) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Email required' }
    };
  }

  // Return mock success
  return {
    success: true,
    data: { user: mockUser, token: 'mock-token-xxx' }
  };
};
```

### Simulated Behaviors

| Behavior | Implementation |
|----------|----------------|
| Network Delay | `await delay(600-1500ms)` |
| Success Rate | 95% success, 5% simulated failures |
| Pagination | Page-based with `hasMore` flag |
| Filtering | In-memory filtering of mock data |
| Persistence | AsyncStorage for session |

### Why This Approach?

1. **Realistic UX:** Users experience realistic loading states and error handling
2. **Easy Replacement:** Services follow the same interface as real APIs
3. **Testable:** Mock data is consistent and predictable
4. **Offline Development:** No backend dependency during development

---

## Scalability Plan

### AWS Architecture (Future)

```
┌────────────────────────────────────────────────────────────┐
│                       CAPMATE App                          │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    AWS Amplify SDK                         │
└────────────────────────────────────────────────────────────┘
           │                  │                    │
           ▼                  ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Cognito    │    │   AppSync    │    │      S3      │
│  (User Auth) │    │  (GraphQL)   │    │   (Images)   │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   DynamoDB   │
                    │  (Database)  │
                    └──────────────┘
```

### Service Migration Map

| Current (Mock) | AWS Service | Notes |
|----------------|-------------|-------|
| `mockLogin()` | Cognito `Auth.signIn()` | User pools for auth |
| `mockSignup()` | Cognito `Auth.signUp()` | Custom attributes for college |
| `mockGetProducts()` | AppSync Query | DynamoDB with GSI |
| `mockCreateProduct()` | AppSync Mutation | S3 for images |
| `mockProcessPayment()` | Razorpay/Stripe | Lambda for verification |
| AsyncStorage | Cognito tokens | Secure token storage |

### Database Schema (DynamoDB)

```
Products Table:
- PK: PRODUCT#<productId>
- SK: COLLEGE#<collegeId>
- GSI1PK: SELLER#<sellerId>
- GSI1SK: <createdAt>
- GSI2PK: COLLEGE#<collegeId>#CATEGORY#<category>
- GSI2SK: <createdAt>

Users Table:
- PK: USER#<userId>
- SK: PROFILE
- GSI1PK: COLLEGE#<collegeId>
- GSI1SK: <createdAt>
```

---

## Coding Standards

### TypeScript

```typescript
// Always use strict types
interface Product {
  id: string;
  title: string;
  price: number;
  // ...
}

// Avoid `any`, use `unknown` if needed
const parseData = (data: unknown): Product => {
  // Type guard implementation
};

// Use type inference where obvious
const [isLoading, setIsLoading] = useState(false); // boolean inferred
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Types | PascalCase with suffix | `User.types.ts` |
| Utils | camelCase | `formatters.ts` |
| Constants | SCREAMING_SNAKE_CASE | `STORAGE_KEYS` |

### Component Structure

```typescript
// 1. Imports (external, internal, types)
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@components/common';
import { Product } from '@types/product.types';

// 2. Type definitions
interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

// 3. Component
export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  // 4. Hooks
  const [isLoading, setIsLoading] = useState(false);

  // 5. Handlers
  const handlePress = () => {
    onPress(product);
  };

  // 6. Render
  return (
    <View>...</View>
  );
};

// 7. Styles
const styles = StyleSheet.create({...});

// 8. Export
export default ProductCard;
```

### SOLID Principles Applied

| Principle | Application |
|-----------|-------------|
| Single Responsibility | Each component does one thing well |
| Open/Closed | Components accept props for customization |
| Liskov Substitution | All buttons follow Button interface |
| Interface Segregation | Small, focused prop interfaces |
| Dependency Inversion | Services abstract data operations |

---

## Commit Philosophy

We follow **Conventional Commits** specification:

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add product filtering` |
| `fix` | Bug fix | `fix: resolve login validation error` |
| `refactor` | Code refactoring | `refactor: extract card component` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Formatting, missing semi-colons | `style: format code with prettier` |
| `test` | Adding tests | `test: add auth flow tests` |
| `chore` | Maintenance | `chore: update dependencies` |

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Example Commits

```bash
feat(auth): implement login screen with validation

- Add email and password validation
- Integrate with mock auth service
- Add demo account login option

Closes #12

---

fix(products): resolve infinite scroll pagination

The products were not loading when reaching the end of the list.
Fixed by properly checking hasMore flag before fetching.

---

refactor(components): extract ProductCard into reusable component

Moved product card logic from HomeScreen to shared component
for reuse in MyListings and search results.
```

---

## Future Roadmap

### Phase 1: MVP (Current)
- [x] User authentication flow
- [x] Product listing and browsing
- [x] Create listing with images
- [x] Product detail view
- [x] Profile management
- [x] Mock payment flow

### Phase 2: Backend Integration
- [ ] AWS Cognito authentication
- [ ] AppSync GraphQL API
- [ ] DynamoDB data storage
- [ ] S3 image uploads
- [ ] Razorpay payment integration

### Phase 3: Enhanced Features
- [ ] Real-time chat between buyers/sellers
- [ ] Push notifications
- [ ] Saved/favorited items
- [ ] Search with Elasticsearch
- [ ] Review and rating system

### Phase 4: Scale
- [ ] Multi-college support
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] A/B testing framework

---

## Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write TypeScript with strict types
- Follow existing code patterns
- Add comments for complex logic
- Update README for significant changes
- Test on both iOS and Android

### Code Review Checklist

- [ ] TypeScript types are strict (no `any`)
- [ ] Components are reusable
- [ ] Styles use theme values
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] Accessibility is considered

---

## License

This project is proprietary and intended for educational/demonstration purposes.

---

## Contact

For questions or support, reach out to:
- Email: support@capmate.app (placeholder)
- GitHub Issues: [Create an issue](https://github.com/yourusername/capmate/issues)

---

<p align="center">
  Built with care for the college community
</p>
