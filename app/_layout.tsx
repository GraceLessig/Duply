import { Stack } from 'expo-router';
import React from 'react';
import AppInstallPrompt from '../components/AppInstallPrompt';
import { ActivityProvider } from '../contexts/ActivityContext';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ProfileProvider } from '../contexts/ProfileContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ActivityProvider>
          <FavoritesProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="categories"
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen name="search" />
              <Stack.Screen name="searchResults" />
              <Stack.Screen name="productDetails" />
              <Stack.Screen name="categoryProducts" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="about" />
            </Stack>
            <AppInstallPrompt />
          </FavoritesProvider>
        </ActivityProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
