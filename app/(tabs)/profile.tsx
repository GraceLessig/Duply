import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DollarSign, Heart, Info, Settings, User } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, radius, shadows, spacing, typography } from '../../constants/theme';
import { useFavorites } from '../../hooks/useFavorites';

export default function ProfileScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();

  const userName = 'Beauty Lover';
  const userEmail = 'beauty@example.com';
  const savedDupes = favorites.length;
  const totalSavings = favorites.reduce((sum, f) => sum + f.savings, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[...gradients.header]} style={styles.header}>
          <View style={styles.avatarCircle}>
            <User width={32} height={32} stroke={colors.primary} />
          </View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </LinearGradient>

        <View style={styles.statsWrapper}>
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <StatItem
                icon={Heart}
                value={savedDupes}
                label="Saved Dupes"
                bg={colors.accentLight}
                color={colors.primary}
              />
              <StatItem
                icon={DollarSign}
                value={`$${totalSavings.toFixed(0)}`}
                label="Total Savings"
                bg={colors.successLight}
                color={colors.success}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsBox}>
            <SettingsRow icon={Settings} label="Account Settings" onPress={() => router.push('/settings' as Href)} />
            <SettingsRow icon={Info} label="About" onPress={() => router.push('/about' as Href)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ icon: Icon, value, label, bg, color }: any) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Icon width={22} height={22} stroke={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon: Icon, label, onPress }: any) {
  return (
    <Pressable style={({ pressed }) => [styles.settingsItem, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <View style={styles.settingsLeft}>
        <Icon width={20} height={20} stroke={colors.textMuted} />
        <Text style={styles.settingsText}>{label}</Text>
      </View>
      <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl + 10,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  name: {
    ...typography.h2,
    color: colors.textOnPrimary,
  },
  email: {
    ...typography.caption,
    color: '#fbcfe8',
    marginTop: spacing.xs,
  },
  statsWrapper: {
    marginTop: -20,
    paddingHorizontal: spacing.lg,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingsBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingsText: {
    ...typography.caption,
    color: colors.text,
  },
});
