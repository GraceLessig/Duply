import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = radius.sm, style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton width={64} height={64} borderRadius={radius.md} />
      <View style={skeletonStyles.info}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
        <Skeleton width="30%" height={12} style={{ marginTop: 6 }} />
      </View>
      <View>
        <Skeleton width={50} height={16} />
      </View>
    </View>
  );
}

export function DupeCardSkeleton() {
  return (
    <View style={skeletonStyles.dupeCard}>
      <Skeleton width="100%" height={100} borderRadius={radius.md} />
      <Skeleton width="60%" height={12} style={{ marginTop: spacing.sm }} />
      <Skeleton width="80%" height={14} style={{ marginTop: 4 }} />
      <Skeleton width="40%" height={12} style={{ marginTop: 4 }} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  info: {
    flex: 1,
  },
  dupeCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
  },
});
