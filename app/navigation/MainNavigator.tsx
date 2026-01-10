/**
 * Main Navigator
 * Bottom tab navigator for authenticated users
 */

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, View, Platform, Animated, Easing } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MainTabParamList,
  HomeStackParamList,
  CreateListingStackParamList,
  MyListingsStackParamList,
  ProfileStackParamList,
  ChatStackParamList,
} from '@types/navigation.types';
import { colors, spacing } from '@theme/index';

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
import EditProfileScreen from '@screens/profile/EditProfileScreen';

// Chat Stack Screens
import ChatListScreen from '@screens/chat/ChatListScreen';
import ChatDetailScreen from '@screens/chat/ChatDetailScreen';

// Stack Navigators
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CreateStack = createNativeStackNavigator<CreateListingStackParamList>();
const MyListingsStack = createNativeStackNavigator<MyListingsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();

// Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// Smooth transition animation config
const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
  animation: 'fade_from_bottom' as const,
  animationDuration: 200,
};

// Home Stack Navigator
const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="HomeList" component={HomeListScreen} />
    <HomeStack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </HomeStack.Navigator>
);

// Create Listing Stack Navigator
const CreateStackNavigator: React.FC = () => (
  <CreateStack.Navigator screenOptions={screenOptions}>
    <CreateStack.Screen name="CreateForm" component={CreateFormScreen} />
    <CreateStack.Screen
      name="ReviewListing"
      component={ReviewListingScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <CreateStack.Screen
      name="Payment"
      component={PaymentScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <CreateStack.Screen
      name="Success"
      component={SuccessScreen}
      options={{ animation: 'fade' }}
    />
  </CreateStack.Navigator>
);

// My Listings Stack Navigator
const MyListingsStackNavigator: React.FC = () => (
  <MyListingsStack.Navigator screenOptions={screenOptions}>
    <MyListingsStack.Screen name="ListingsList" component={ListingsListScreen} />
    <MyListingsStack.Screen
      name="EditListing"
      component={EditListingScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </MyListingsStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator: React.FC = () => (
  <ProfileStack.Navigator screenOptions={screenOptions}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileMainScreen} />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </ProfileStack.Navigator>
);

// Chat Stack Navigator
const ChatStackNavigator: React.FC = () => (
  <ChatStack.Navigator screenOptions={screenOptions}>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} />
    <ChatStack.Screen
      name="ChatDetail"
      component={ChatDetailScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </ChatStack.Navigator>
);

// Custom SVG-like Tab Icon using Views
interface TabIconProps {
  focused: boolean;
  label: string;
  type: 'home' | 'sell' | 'items' | 'chat' | 'profile';
  unreadCount?: number;
}

// Animation config
const ANIMATION_DURATION = 200;
const ANIMATION_EASING = Easing.bezier(0.4, 0, 0.2, 1);

// Animated wrapper for tab icons
const AnimatedTabIcon: React.FC<{ focused: boolean; children: React.ReactNode }> = ({ focused, children }) => {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: focused ? 1 : 0.9,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.7,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
      {children}
    </Animated.View>
  );
};

// Home Icon - Grid of 4 squares
const HomeIcon: React.FC<{ focused: boolean }> = ({ focused }) => (
  <AnimatedTabIcon focused={focused}>
    <View style={[styles.iconGrid, focused && styles.iconGridFocused]}>
      <View style={[styles.gridSquare, focused && styles.gridSquareFocused]} />
      <View style={[styles.gridSquare, focused && styles.gridSquareFocused]} />
      <View style={[styles.gridSquare, focused && styles.gridSquareFocused]} />
      <View style={[styles.gridSquare, focused && styles.gridSquareFocused]} />
    </View>
  </AnimatedTabIcon>
);

// Sell Icon - Slightly elevated with connection to tab bar (with bounce animation)
const SellIcon: React.FC<{ focused: boolean }> = ({ focused }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const labelColorAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    if (focused) {
      // Bounce scale animation when focused (no translateY to avoid layout shifts)
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 150,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          easing: ANIMATION_EASING,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
        useNativeDriver: true,
      }).start();
    }

    // Animate label color
    Animated.timing(labelColorAnim, {
      toValue: focused ? 1 : 0,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const animatedLabelColor = labelColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.primaryDark],
  });

  return (
    <View style={styles.sellButtonContainer}>
      {/* Connection arc behind the button */}
      <View style={styles.sellButtonArc} />
      {/* Main button */}
      <Animated.View
        style={[
          styles.sellButton,
          focused && styles.sellButtonFocused,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={[styles.sellPlusVertical, focused && styles.sellPlusFocused]} />
        <View style={[styles.sellPlusHorizontal, focused && styles.sellPlusFocused]} />
      </Animated.View>
      <Animated.Text style={[styles.sellLabel, { color: animatedLabelColor }]}>Sell</Animated.Text>
    </View>
  );
};

// Items Icon - List/document
const ItemsIcon: React.FC<{ focused: boolean }> = ({ focused }) => (
  <AnimatedTabIcon focused={focused}>
    <View style={[styles.listIcon, focused && styles.listIconFocused]}>
      <View style={[styles.listLine, focused && styles.listLineFocused]} />
      <View style={[styles.listLine, styles.listLineShort, focused && styles.listLineFocused]} />
      <View style={[styles.listLine, focused && styles.listLineFocused]} />
    </View>
  </AnimatedTabIcon>
);

// Profile Icon - Person silhouette
const ProfileIcon: React.FC<{ focused: boolean }> = ({ focused }) => (
  <AnimatedTabIcon focused={focused}>
    <View style={styles.iconContainer}>
      <View style={[styles.profileHead, focused && styles.profileFocused]} />
      <View style={[styles.profileBody, focused && styles.profileFocused]} />
    </View>
  </AnimatedTabIcon>
);

// Chat Icon - Message bubble with tail
const ChatIcon: React.FC<{ focused: boolean; unreadCount?: number }> = ({ focused, unreadCount = 0 }) => (
  <AnimatedTabIcon focused={focused}>
    <View style={styles.chatIconContainer}>
      {/* Main bubble */}
      <View style={[styles.chatBubble, focused && styles.chatBubbleFocused]}>
        {/* Three lines inside bubble to represent text */}
        <View style={styles.chatLines}>
          <View style={[styles.chatLine, focused && styles.chatLineFocused]} />
          <View style={[styles.chatLine, styles.chatLineShort, focused && styles.chatLineFocused]} />
        </View>
      </View>
      {/* Tail */}
      <View style={[styles.chatTail, focused && styles.chatTailFocused]} />
      {/* Unread badge */}
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </View>
  </AnimatedTabIcon>
);

// Animated label for tab icons
const AnimatedLabel: React.FC<{ focused: boolean; label: string }> = ({ focused, label }) => {
  const colorAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: focused ? 1 : 0,
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
      useNativeDriver: false, // Color animation needs JS driver
    }).start();
  }, [focused]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textTertiary, colors.primary],
  });

  return (
    <Animated.Text style={[styles.tabLabel, { color: animatedColor }]}>
      {label}
    </Animated.Text>
  );
};

const TabIcon: React.FC<TabIconProps> = ({ focused, label, type, unreadCount }) => {
  const renderIcon = () => {
    switch (type) {
      case 'home':
        return <HomeIcon focused={focused} />;
      case 'sell':
        return <SellIcon focused={focused} />;
      case 'items':
        return <ItemsIcon focused={focused} />;
      case 'chat':
        return <ChatIcon focused={focused} unreadCount={unreadCount} />;
      case 'profile':
        return <ProfileIcon focused={focused} />;
    }
  };

  // Special layout for sell button - no label, elevated
  if (type === 'sell') {
    return renderIcon();
  }

  return (
    <View style={styles.tabIconContainer}>
      {renderIcon()}
      <AnimatedLabel focused={focused} label={label} />
    </View>
  );
};

// Main Tab Navigator
const MainNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 70 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_HEIGHT,
            paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm,
          },
        ],
        tabBarShowLabel: false,
        // Smooth fade transition between tabs
        tabBarHideOnKeyboard: true,
        animation: 'fade',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" type="home" />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Chat" type="chat" unreadCount={3} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Sell" type="sell" />
          ),
        }}
      />
      <Tab.Screen
        name="MyListings"
        component={MyListingsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="My Items" type="items" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" type="profile" />
          ),
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
    paddingTop: spacing.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Position absolute to extend to screen edge
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Fixed height to match sell button container
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Icon container
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Home Icon - 2x2 Grid
  iconGrid: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  iconGridFocused: {},
  gridSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    backgroundColor: 'transparent',
  },
  gridSquareFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  // Sell Icon - Slightly elevated with tab connection
  sellButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50, // Fixed height to prevent layout shifts
    width: 60,
    paddingTop: 0,
  },
  sellButtonArc: {
    position: 'absolute',
    top: -8,
    width: 56,
    height: 28,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 0,
  },
  sellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8, // Slight elevation above tab bar line
    // Subtle shadow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  sellButtonFocused: {
    backgroundColor: colors.primaryDark,
    shadowOpacity: 0.35,
  },
  sellPlusVertical: {
    position: 'absolute',
    width: 2.5,
    height: 18,
    backgroundColor: colors.textInverse,
    borderRadius: 2,
  },
  sellPlusHorizontal: {
    position: 'absolute',
    width: 18,
    height: 2.5,
    backgroundColor: colors.textInverse,
    borderRadius: 2,
  },
  sellPlusFocused: {
    backgroundColor: colors.textInverse,
  },
  sellLabel: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  sellLabelFocused: {
    color: colors.primaryDark,
  },

  // Items Icon - Document/List
  listIcon: {
    width: 18,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 4,
    justifyContent: 'space-between',
  },
  listIconFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  listLine: {
    height: 2,
    backgroundColor: colors.textTertiary,
    borderRadius: 1,
  },
  listLineShort: {
    width: '60%',
  },
  listLineFocused: {
    backgroundColor: colors.primary,
  },

  // Profile Icon - Person
  profileHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  profileBody: {
    width: 16,
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: colors.textTertiary,
    backgroundColor: 'transparent',
  },
  profileFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  // Chat Icon - Message bubble with tail
  chatIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBubble: {
    width: 20,
    height: 16,
    borderWidth: 1.5,
    borderColor: colors.textTertiary,
    borderRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  chatBubbleFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  chatLines: {
    gap: 2,
  },
  chatLine: {
    height: 1.5,
    backgroundColor: colors.textTertiary,
    borderRadius: 1,
  },
  chatLineShort: {
    width: '60%',
  },
  chatLineFocused: {
    backgroundColor: colors.primary,
  },
  chatTail: {
    position: 'absolute',
    bottom: 3,
    left: 1,
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: colors.textTertiary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    backgroundColor: 'transparent',
  },
  chatTailFocused: {
    borderTopColor: colors.primary,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textInverse,
  },
});

export default MainNavigator;
