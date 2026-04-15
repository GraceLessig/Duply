import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Heart, Home, User } from 'react-native-feather';
import { colors, radius, spacing } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.bar,
        tabBarItemStyle: tabStyles.item,
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarAccessibilityLabel: 'Home',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Home width={22} height={22} stroke={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '',
          tabBarAccessibilityLabel: 'Favorites',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <Heart width={22} height={22} stroke={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarAccessibilityLabel: 'Profile',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
              <User width={22} height={22} stroke={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  item: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.sm,
  },
  iconWrap: {
    padding: spacing.sm,
    borderRadius: radius.full,
  },
  iconWrapActive: {
    backgroundColor: colors.tabActiveBg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
