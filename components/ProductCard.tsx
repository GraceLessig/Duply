import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface ProductCardProps {
  name: string;
  brand: string;
  price: number;
  image: string;
  matchPercent?: number;
  originalPrice?: number;
  onPress?: () => void;
}

export default function ProductCard({
  name,
  brand,
  price,
  image,
  matchPercent,
  originalPrice,
  onPress,
}: ProductCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Image
        source={{ uri: image }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
        transition={300}
      />
      <View style={styles.info}>
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.bottom}>
          {matchPercent != null && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{matchPercent}%</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            {originalPrice != null && (
              <Text style={styles.origPrice}>${originalPrice.toFixed(2)}</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: colors.skeleton,
  },
  info: {
    padding: spacing.md,
  },
  brand: {
    ...typography.small,
    color: colors.textMuted,
  },
  name: {
    ...typography.captionBold,
    color: colors.text,
    marginTop: 2,
    minHeight: 36,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  matchBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  matchText: {
    ...typography.smallBold,
    color: colors.primary,
  },
  priceRow: {
    alignItems: 'flex-end',
  },
  price: {
    ...typography.captionBold,
    color: colors.success,
  },
  origPrice: {
    ...typography.small,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
