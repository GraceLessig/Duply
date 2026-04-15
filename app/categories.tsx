import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../components/SkeletonLoader';
import { colors, gradients, radius, shadows, spacing, typography } from '../constants/theme';
import { useCategories } from '../hooks/useProducts';

export default function CategoriesScreen() {
  const router = useRouter();
  const { data: categories, loading } = useCategories();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft width={24} height={24} stroke={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <LinearGradient colors={[...gradients.main]} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <Skeleton key={i} width="100%" height={120} borderRadius={radius.lg} style={{ marginBottom: spacing.lg }} />
            ))
          ) : (
            (categories || []).map((cat, i) => (
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
                  <LinearGradient
                    colors={[cat.color, '#f7d9e3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <Text style={styles.cardText}>{cat.name}</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </LinearGradient>
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
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  title: {
    ...typography.h3,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardGradient: {
    height: 124,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  cardText: {
    ...typography.h2,
    color: colors.primary,
  },
});
