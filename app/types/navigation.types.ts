/**
 * Navigation type definitions
 * Type-safe navigation for React Navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Product, CreateProductInput } from './product.types';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  CollegeSelect: { fromSignup?: boolean; onboardingData?: any };
  Celebration: undefined;
};

// Home Stack
export type HomeStackParamList = {
  HomeList: undefined;
  ProductDetail: { productId: string; product?: Product };
};

// Create Listing Stack
export type CreateListingStackParamList = {
  CreateForm: { editProduct?: Product };
  ReviewListing: { product: CreateProductInput; images: string[] };
  Payment: { product: CreateProductInput; images: string[] };
  Success: { productId: string };
};

// My Listings Stack
export type MyListingsStackParamList = {
  ListingsList: undefined;
  EditListing: { product: Product };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};

// Chat Stack
export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { conversationId: string; participantName: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Create: NavigatorScreenParams<CreateListingStackParamList>;
  MyListings: NavigatorScreenParams<MyListingsStackParamList>;
  Chat: NavigatorScreenParams<ChatStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Screen prop types
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  T
>;

export type CreateListingStackScreenProps<T extends keyof CreateListingStackParamList> =
  NativeStackScreenProps<CreateListingStackParamList, T>;

export type MyListingsStackScreenProps<T extends keyof MyListingsStackParamList> =
  NativeStackScreenProps<MyListingsStackParamList, T>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>;

export type ChatStackScreenProps<T extends keyof ChatStackParamList> = NativeStackScreenProps<
  ChatStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;
