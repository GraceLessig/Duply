import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart, Trash2 } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loaded, removeFavorite } = useFavorites();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <View style={{ width: 40 }} />
        <Text style={styles.title}>Favorites</Text>
        <View style={{ width: 40 }} />
      </View>

      {!loaded ? null : favorites.length === 0 ? (
        <LinearGradient colors={[...gradients.main]} style={styles.emptyContainer}>
          <View style={styles.emptyState}>
            <View style={styles.iconCircle}>
              <Heart width={40} height={40} stroke={colors.accentLight} />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any dupe to save it here
            </Text>
            <Link href="/search" asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Browse Dupes</Text>
              </Pressable>
            </Link>
          </View>
        </LinearGradient>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 80).duration(300)}>
              <Pressable
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
                onPress={() =>
                  router.push({
                    pathname: '/productDetails',
                    params: { id: item.id },
                  })
                }
              >
                <Image
                  source={{ uri: item.dupeImage }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardBrand}>{item.dupeBrand}</Text>
                  <Text style={styles.cardName} numberOfLines={1}>{item.dupeName}</Text>
                  <View style={styles.cardRow}>
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchText}>{item.similarity}% match</Text>
                    </View>
                    <Text style={styles.cardPrice}>${item.dupePrice.toFixed(2)}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => removeFavorite(item.id)}
                  style={styles.removeBtn}
                  hitSlop={12}
                >
                  <Trash2 width={18} height={18} stroke={colors.textMuted} />
                </Pressable>
              </Pressable>
            </Animated.View>
          )}
        />
      )}
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
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 240,
  },
  button: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.textOnPrimary,
    ...typography.captionBold,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
  cardInfo: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  cardBrand: {
    ...typography.small,
    color: colors.textMuted,
  },
  cardName: {
    ...typography.captionBold,
    color: colors.text,
    marginTop: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  matchBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  matchText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  cardPrice: {
    ...typography.captionBold,
    color: colors.success,
  },
  removeBtn: {
    padding: spacing.sm,
    borderRadius: radius.md,
  },
});
