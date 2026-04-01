import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowLeft, Clock, Search, X } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { colors, gradients, radius, shadows, spacing, typography } from '../constants/theme';
import { searchHistorySample } from '../data/products';
import { useSearch } from '../hooks/useProducts';

export default function SearchScreen() {
  const [searchHistory, setSearchHistory] = useState<string[]>(searchHistorySample);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { results, loading, search } = useSearch();

  const removeHistoryItem = (index: number) => {
    setSearchHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    search(text);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(i => i !== query);
      return [query, ...filtered].slice(0, 10);
    });
    router.push({ pathname: '/searchResults', params: { q: query } });
  };

  const handleHistoryTap = (item: string) => {
    setQuery(item);
    search(item);
    router.push({ pathname: '/searchResults', params: { q: item } });
  };

  const showingResults = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBarSearch}>
        <View style={styles.topBarRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft width={24} height={24} stroke={colors.primary} />
          </Pressable>
          <Text style={styles.topBarTitle}>Search Products</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Search width={18} height={18} stroke={colors.accent} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            placeholder="Search for products..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoFocus
            returnKeyType="search"
          />
          {loading && (
            <ActivityIndicator
              size="small"
              color={colors.accent}
              style={styles.spinner}
            />
          )}
        </View>
      </View>

      <LinearGradient colors={[...gradients.main]} style={styles.content}>
        {showingResults && results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.resultItem, pressed && { opacity: 0.7 }]}
                onPress={() =>
                  router.push({
                    pathname: '/searchResults',
                    params: { productId: item.id, productName: item.name },
                  })
                }
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.resultImage} contentFit="cover" />
                ) : (
                  <View style={[styles.resultImage, styles.resultImagePlaceholder]}>
                    <Text style={{ fontSize: 20 }}>💄</Text>
                  </View>
                )}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultBrand}>{item.brand}</Text>
                  <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.resultPrice}>${item.price.toFixed(2)}</Text>
                </View>
              </Pressable>
            )}
            contentContainerStyle={{ paddingBottom: 80, paddingTop: spacing.md }}
          />
        ) : showingResults && loading ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Searches</Text>
            </View>
            <FlatList
              data={searchHistory}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Pressable
                  style={({ pressed }) => [styles.historyItem, pressed && { opacity: 0.7 }]}
                  onPress={() => handleHistoryTap(item)}
                >
                  <View style={styles.historyLeft}>
                    <Clock width={18} height={18} stroke={colors.accent} />
                    <Text style={styles.historyText} numberOfLines={1}>{item}</Text>
                  </View>
                  <Pressable onPress={() => removeHistoryItem(index)} hitSlop={12}>
                    <X width={16} height={16} stroke={colors.textMuted} />
                  </Pressable>
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
            />
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBarSearch: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backBtn: {
    padding: spacing.sm,
    borderRadius: radius.md,
    marginLeft: -spacing.sm,
  },
  topBarTitle: {
    ...typography.h3,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  spinner: {
    position: 'absolute',
    right: spacing.md,
  },
  input: {
    paddingVertical: spacing.md,
    paddingLeft: 40,
    paddingRight: 40,
    borderWidth: 2,
    borderColor: colors.accentLight,
    borderRadius: radius.full,
    color: colors.primary,
    ...typography.body,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: spacing.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
  resultImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gradientStart,
  },
  resultInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultBrand: {
    ...typography.small,
    color: colors.textMuted,
  },
  resultName: {
    ...typography.captionBold,
    color: colors.text,
    marginTop: 1,
  },
  resultPrice: {
    ...typography.captionBold,
    color: colors.success,
    marginTop: 2,
  },
  historyHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  historyTitle: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  historyText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});
