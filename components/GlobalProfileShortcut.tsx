import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'react-native-feather';
import { colors, shadows, spacing } from '../constants/theme';

const HIDDEN_PATHS = new Set(['/']);
const PROFILE_PATHS = new Set(['/profile']);

export default function GlobalProfileShortcut() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || HIDDEN_PATHS.has(pathname) || PROFILE_PATHS.has(pathname)) {
    return null;
  }

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.safeOverlay}>
      <View pointerEvents="box-none" style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <User width={20} height={20} stroke={colors.primary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: spacing.sm,
    paddingRight: spacing.lg,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
});
