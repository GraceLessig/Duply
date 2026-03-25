import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { ArrowLeft, Clock, Heart, Home, Search, User, X } from 'react-native-feather';
import Layout, { styles } from '../components/Layout';
import { searchHistorySample } from '../data/products';
import NavItem from './navigation/NavItem';

export default function SearchScreen() {
  const [searchHistory, setSearchHistory] = useState<string[]>(searchHistorySample);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const removeHistoryItem = (index: number) => {
    setSearchHistory(prev => prev.filter((_, i) => i !== index));
  };

  const addHistoryItem = (item: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((i) => i !== item);
      return [item, ...filtered].slice(0, 10);
    });
  };

  return (
    <Layout>
      <LinearGradient
        colors={['#ffebee', '#fce4ec', '#f8bbd0']}
        style={styles.searchContainer}
      >
        {/* Top Bar */}
        <View style={styles.topBarSearch}>
          <View style={styles.topBarContent}>
            <View style={styles.topBarRow}>
              <Pressable
                onPress={() => router.back()}
                style={styles.iconButton}
              >
                <ArrowLeft width={24} height={24} stroke="#820933" />
              </Pressable>
              <Text style={styles.topBarTitle}>Search Products</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchInputWrapper}>
              <Search width={20} height={20} stroke="#ff99a0" style={styles.searchIcon} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => {
                  if (!query.trim()) return;
                  addHistoryItem(query);
                  router.push('/searchResults');
                }}
                placeholder="Search for products..."
                placeholderTextColor="#999"
                style={styles.searchInput}
              />
            </View>
          </View>
        </View>

        {/* Search History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Searches</Text>
          <FlatList
            data={searchHistory}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <Clock width={20} height={20} stroke="#ff99a0" />
                  <Text style={styles.historyItemText} numberOfLines={1}>{item}</Text>
                </View>
                <Pressable onPress={() => removeHistoryItem(index)} style={styles.historyItemButton}>
                  <X width={16} height={16} stroke="#999" />
                </Pressable>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </View>
      </LinearGradient>

        <View style={styles.bottomNav}>
            <NavItem icon={Home} label="Home" href="/" />
            <NavItem icon={Heart} label="Favorites" href="/favorites" />
            <NavItem icon={User} label="Profile" href="/profile" />
        </View>


    </Layout>
  );
}