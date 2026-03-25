import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{
        headerShown: false,
        headerTitle: 'Duply',
        headerBackVisible: false,
      }}
    />
    <Stack.Screen
      name="categories"
      options={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
        headerTitle: 'Categories',
      }}
    />
    <Stack.Screen
      name="search"
      options={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
        headerTitle: 'Search Products',

      }}
    />
    <Stack.Screen
      name="searchResults"
      options={{
        headerShown: false,
        headerBackVisible: false,
        headerTitle: 'Search Results',
      }}
    />
    <Stack.Screen
      name="productDetails"
      options={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
        headerTitle: 'Product Details',
      }}
    />
    <Stack.Screen
      name="favorites"
      options={{
        headerShown: false,
        headerBackVisible: false,
        headerTitle: 'Your Favorites',
      }}
    />
    <Stack.Screen
      name="profile"
      options={{
        headerShown: false,
        headerBackVisible: false,
        headerTitle: 'Your Profile',
      }}
    />
  </Stack>;
}
