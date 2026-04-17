import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../../components/SkeletonLoader';
import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import { useCategories } from '../../hooks/useProducts';
import { prefetchCategoryPage } from '../../services/api';

const FALLBACK_CATEGORIES = [
  { id: 'eyes', name: 'Eyes', emoji: '', productType: 'eyes', color: '#FFF9F0' },
  { id: 'lips', name: 'Lips', emoji: '', productType: 'lips', color: '#FFE4F0' },
  { id: 'face', name: 'Face', emoji: '', productType: 'face', color: '#F7C6D9' },
  { id: 'skincare', name: 'Skincare', emoji: '', productType: 'skincare', color: '#FFF6F9' },
  { id: 'other', name: 'Other', emoji: '', productType: 'other', color: '#2A0B26' },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const { data: categories, loading } = useCategories();
  const visibleCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  useEffect(() => {
    visibleCategories.forEach(category => {
      void prefetchCategoryPage(category.productType);
    });
  }, [visibleCategories]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Categories</Text>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {visibleCategories.map((cat, i) => (
            <Animated.View key={cat.id} entering={FadeInDown.delay(i * 100).duration(400)}>
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() =>
                  router.push({
                    pathname: '/categoryProducts',
                    params: { category: cat.productType, title: cat.name },
                  })
                }
                >
                  <View style={[styles.cardGradient, { backgroundColor: cat.color }]}>
                    <Text style={[styles.cardText, cat.id === 'other' && styles.cardTextDark]}>{cat.name}</Text>
                    {loading && (!categories || categories.length === 0) ? (
                      <Skeleton width={112} height={16} borderRadius={radius.full} style={styles.countSkeleton} />
                    ) : (
                      <Text style={[styles.cardCount, cat.id === 'other' && styles.cardCountDark]}>
                        Over {cat.count ?? 0} results
                      </Text>
                    )}
                    <Text style={[styles.cardStar, cat.id === 'other' && styles.cardStarDark]}>*</Text>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.pink,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  title: {
    ...typography.h2,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardGradient: {
    height: 124,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardText: {
    ...typography.h2,
    color: colors.text,
    textTransform: 'uppercase',
    zIndex: 1,
  },
  cardCount: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: spacing.xs,
    zIndex: 1,
  },
  countSkeleton: {
    marginTop: spacing.xs,
    zIndex: 1,
  },
  cardCountDark: {
    color: colors.cream,
  },
  cardTextDark: {
    color: colors.surface,
  },
  cardStar: {
    position: 'absolute',
    right: spacing.xl,
    bottom: -4,
    fontSize: 76,
    color: colors.primary,
    lineHeight: 82,
  },
  cardStarDark: {
    color: colors.cream,
  },
});
