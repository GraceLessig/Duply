import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Menu, Search, TrendingUp } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/ProductCard';
import { DupeCardSkeleton } from '../../components/SkeletonLoader';
import { colors, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useFeaturedDupes } from '../../hooks/useProducts';

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { data: featured, loading } = useFeaturedDupes();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push('/categories')} style={styles.menuBtn}>
          <Menu width={24} height={24} stroke={colors.primary} />
        </Pressable>
        <Text style={styles.brand}>düply</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[...gradients.hero]} style={styles.hero}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text style={styles.heading}>Find Your{'\n'}Perfect Dupe</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(250).duration(500)}>
            <Text style={styles.sub}>
              Discover affordable alternatives to your favorite beauty products
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ width: '100%' }}>
            <View style={styles.searchBar}>
              <Search width={20} height={20} stroke={colors.accent} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => {
                  if (query.trim()) {
                    router.push({ pathname: '/searchResults', params: { q: query.trim() } });
                    setQuery('');
                  }
                }}
                placeholder="Search products..."
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                style={styles.searchInput}
              />
            </View>
          </Animated.View>
        </LinearGradient>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp width={20} height={20} stroke={colors.primary} />
            <Text style={styles.sectionTitle}>Trending Dupes</Text>
          </View>

          {loading ? (
            <FlatList
              horizontal
              data={[1, 2, 3]}
              keyExtractor={i => String(i)}
              renderItem={() => <DupeCardSkeleton />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <FlatList
              horizontal
              data={featured || []}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ProductCard
                  name={item.dupe.name}
                  brand={item.dupe.brand}
                  price={item.dupe.price}
                  image={item.dupe.image}
                  matchPercent={item.similarity}
                  originalPrice={item.original.price}
                  onPress={() =>
                    router.push({
                      pathname: '/productDetails',
                      params: { id: item.id, fromFeatured: '1' },
                    })
                  }
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
            />
          )}
        </Animated.View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuBtn: {
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  brand: {
    ...typography.hero,
    color: colors.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl + 10,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sub: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    maxWidth: 280,
    lineHeight: 22,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.accentLight,
    ...shadows.lg,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.primary,
    padding: 0,
  },
  section: {
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
  },
});
