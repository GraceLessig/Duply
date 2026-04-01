import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCardSkeleton } from '../components/SkeletonLoader';
import { colors, gradients, radius, shadows, spacing, typography } from '../constants/theme';
import { useFavorites } from '../hooks/useFavorites';
import type { Product } from '../services/api';
import { dataService } from '../services/api';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const params = useLocalSearchParams<{
    id?: string;
    dupeId?: string;
    originalId?: string;
    dupeProductId?: string;
    similarity?: string;
    savings?: string;
    fromFeatured?: string;
  }>();

  const [original, setOriginal] = useState<Product | null>(null);
  const [dupeProduct, setDupeProduct] = useState<Product | null>(null);
  const [similarity, setSimilarity] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.originalId, params.dupeProductId, params.id]);

  async function loadData() {
    setLoading(true);
    try {
      if (params.originalId && params.dupeProductId) {
        const [orig, dupe] = await Promise.all([
          dataService.getProductById(params.originalId),
          dataService.getProductById(params.dupeProductId),
        ]);
        setOriginal(orig);
        setDupeProduct(dupe);
        setSimilarity(Number(params.similarity) || 0);
        setSavingsAmount(Number(params.savings) || 0);
      } else if (params.id) {
        const product = await dataService.getProductById(params.id);
        if (product) {
          setOriginal(product);
          const dupes = await dataService.findDupes(product);
          if (dupes.length > 0) {
            setDupeProduct(dupes[0].dupe);
            setSimilarity(dupes[0].similarity);
            setSavingsAmount(dupes[0].savings);
          }
        }
      }
    } catch {
      // Error loading products
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ padding: spacing.lg }}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (!original) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={{ fontSize: 48, marginBottom: spacing.lg }}>😕</Text>
          <Text style={styles.notFound}>Product not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.goBackBtn}>
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const favoriteId = params.dupeId || params.id || '';
  const isFav = checkFavorite(favoriteId);

  const handleToggleFavorite = () => {
    if (!original) return;
    toggleFavorite({
      id: favoriteId,
      originalName: original.name,
      originalBrand: original.brand,
      originalPrice: original.price,
      originalImage: original.image,
      dupeName: dupeProduct?.name || original.name,
      dupeBrand: dupeProduct?.brand || original.brand,
      dupePrice: dupeProduct?.price || original.price,
      dupeImage: dupeProduct?.image || original.image,
      similarity,
      savings: savingsAmount,
    });
  };

  const savingsPercent = original.price > 0
    ? Math.round((savingsAmount / original.price) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.headerBtn}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <LinearGradient colors={[...gradients.matchScore]} style={styles.matchBanner}>
            <Text style={styles.matchNumber}>{similarity}%</Text>
            <Text style={styles.matchLabel}>Match Score</Text>
          </LinearGradient>
        </Animated.View>

        {savingsAmount > 0 && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.savingsRow}>
              <View style={styles.savingsBadge}>
                <Feather name="check-circle" size={18} color={colors.success} />
                <View>
                  <Text style={styles.savingsAmountText}>Save ${savingsAmount.toFixed(2)}</Text>
                  <Text style={styles.savingsPercent}>{savingsPercent}% less</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>Product Comparison</Text>
          <View style={styles.comparisonRow}>
            <View style={styles.productCard}>
              <Image source={{ uri: original.image }} style={styles.productImage} contentFit="cover" />
              <View style={[styles.labelBadge, { backgroundColor: '#fce4ec' }]}>
                <Text style={[styles.labelText, { color: colors.primary }]}>ORIGINAL</Text>
              </View>
              <Text style={styles.productBrand}>{original.brand}</Text>
              <Text style={styles.productName} numberOfLines={2}>{original.name}</Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>${original.price.toFixed(2)}</Text>
            </View>

            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            {dupeProduct && (
              <View style={styles.productCard}>
                <Image source={{ uri: dupeProduct.image }} style={styles.productImage} contentFit="cover" />
                <View style={[styles.labelBadge, { backgroundColor: colors.successLight }]}>
                  <Text style={[styles.labelText, { color: colors.success }]}>DUPE</Text>
                </View>
                <Text style={styles.productBrand}>{dupeProduct.brand}</Text>
                <Text style={styles.productName} numberOfLines={2}>{dupeProduct.name}</Text>
                <Text style={[styles.productPrice, { color: colors.success }]}>${dupeProduct.price.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {dupeProduct?.colors && dupeProduct.colors.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={styles.sectionTitle}>Available Shades</Text>
            <View style={styles.shadesRow}>
              {dupeProduct.colors.map((c, i) => (
                <View key={i} style={[styles.shade, { backgroundColor: c.hex }]} />
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <Text style={styles.sectionTitle}>Rating</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <Ionicons
                key={star}
                name={star <= Math.round(dupeProduct?.rating || original.rating) ? 'star' : 'star-outline'}
                size={22}
                color="#f59e0b"
              />
            ))}
            <Text style={styles.ratingValue}>{(dupeProduct?.rating || original.rating).toFixed(1)}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(400)}>
          <Text style={styles.sectionTitle}>Why This Match?</Text>
          <View style={styles.reasonsBox}>
            {[
              'Similar formula and finish',
              'Comparable color payoff and pigmentation',
              'Similar wear time and longevity',
              'Comparable application and texture',
            ].map((reason, i) => (
              <View key={i} style={styles.reasonRow}>
                <View style={styles.checkCircle}>
                  <Feather name="check" size={14} color={colors.success} />
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: spacing.xxxl + spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  goBackBtn: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  goBackText: {
    color: colors.textOnPrimary,
    ...typography.captionBold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  matchBanner: {
    paddingVertical: spacing.xl + spacing.sm,
    alignItems: 'center',
  },
  matchNumber: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.textOnPrimary,
    letterSpacing: -1,
  },
  matchLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.xs,
  },
  savingsRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successLight,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  savingsAmountText: {
    ...typography.captionBold,
    color: colors.success,
  },
  savingsPercent: {
    ...typography.small,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  productCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
  },
  labelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginTop: spacing.sm,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  productBrand: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  productName: {
    ...typography.captionBold,
    color: colors.text,
    marginTop: 2,
    minHeight: 36,
  },
  productPrice: {
    ...typography.bodyBold,
    marginTop: spacing.xs,
  },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -4,
    zIndex: 1,
  },
  vsText: {
    ...typography.smallBold,
    color: colors.primary,
  },
  shadesRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  shade: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: 2,
  },
  ratingValue: {
    ...typography.h3,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  reasonsBox: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: '#f5f0ff',
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
});
