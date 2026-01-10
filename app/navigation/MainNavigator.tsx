/**
 * Main Navigator
 * Bottom tab navigator for authenticated users
 */

import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  MainTabParamList,
  HomeStackParamList,
  CreateListingStackParamList,
  MyListingsStackParamList,
  ProfileStackParamList,
} from '@types/navigation.types';
import { colors, typography, spacing } from '@theme/index';

// Home Stack Screens
import HomeListScreen from '@screens/home/HomeListScreen';
import ProductDetailScreen from '@screens/product/ProductDetailScreen';

// Create Listing Stack Screens
import CreateFormScreen from '@screens/listing/CreateFormScreen';
import ReviewListingScreen from '@screens/listing/ReviewListingScreen';
import PaymentScreen from '@screens/listing/PaymentScreen';
import SuccessScreen from '@screens/listing/SuccessScreen';

// My Listings Stack Screens
import ListingsListScreen from '@screens/listing/ListingsListScreen';
import EditListingScreen from '@screens/listing/EditListingScreen';

// Profile Stack Screens
import ProfileMainScreen from '@screens/profile/ProfileMainScreen';

// Stack Navigators
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CreateStack = createNativeStackNavigator<CreateListingStackParamList>();
const MyListingsStack = createNativeStackNavigator<MyListingsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <HomeStack.Screen name="HomeList" component={HomeListScreen} />
    <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
  </HomeStack.Navigator>
);

// Create Listing Stack Navigator
const CreateStackNavigator: React.FC = () => (
  <CreateStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <CreateStack.Screen name="CreateForm" component={CreateFormScreen} />
    <CreateStack.Screen name="ReviewListing" component={ReviewListingScreen} />
    <CreateStack.Screen name="Payment" component={PaymentScreen} />
    <CreateStack.Screen name="Success" component={SuccessScreen} />
  </CreateStack.Navigator>
);

// My Listings Stack Navigator
const MyListingsStackNavigator: React.FC = () => (
  <MyListingsStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <MyListingsStack.Screen name="ListingsList" component={ListingsListScreen} />
    <MyListingsStack.Screen name="EditListing" component={EditListingScreen} />
  </MyListingsStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator: React.FC = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  >
    <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
  </ProfileStack.Navigator>
);

// Tab Bar Icon Component
interface TabIconProps {
  icon: string;
  focused: boolean;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused, label }) => (
  <View style={styles.tabIconContainer}>
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
  </View>
);

// Main Tab Navigator
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} label="Home" />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="➕" focused={focused} label="Sell" />,
        }}
      />
      <Tab.Screen
        name="MyListings"
        component={MyListingsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📦" focused={focused} label="My Items" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} label="Profile" />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    height: 70,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default MainNavigator;
