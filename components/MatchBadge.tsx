import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../constants/theme';

interface MatchBadgeProps {
  percent: number;
  size?: 'sm' | 'lg';
  animate?: boolean;
}

export default function MatchBadge({ percent, size = 'sm', animate = false }: MatchBadgeProps) {
  const scale = useSharedValue(animate ? 0.5 : 1);
  const displayValue = useSharedValue(animate ? 0 : percent);

  useEffect(() => {
    if (animate) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      displayValue.value = withTiming(percent, { duration: 800 });
    }
  }, [percent, animate]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isLg = size === 'lg';

  return (
    <Animated.View style={[styles.badge, isLg && styles.badgeLg, animStyle]}>
      <Text style={[styles.percent, isLg && styles.percentLg]}>
        {percent}%
      </Text>
      {isLg && <Text style={styles.label}>match</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  badgeLg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  percent: {
    ...typography.smallBold,
    color: colors.primary,
  },
  percentLg: {
    fontSize: 28,
    fontWeight: '800',
  },
  label: {
    ...typography.small,
    color: colors.primary,
    marginTop: 2,
  },
});
