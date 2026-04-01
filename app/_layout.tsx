import { Stack } from 'expo-router';
import React from 'react';
import { FavoritesProvider } from '../contexts/FavoritesContext';

export default function RootLayout() {
  return (
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
        <Stack.Screen name="settings" />
        <Stack.Screen name="about" />
      </Stack>
    </FavoritesProvider>
  );
}
