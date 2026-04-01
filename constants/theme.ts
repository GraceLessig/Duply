import { Platform, StyleSheet } from 'react-native';

export const colors = {
  primary: '#820933',
  primaryLight: '#a8123f',
  accent: '#ff99a0',
  accentLight: '#ffcdd2',
  accentDark: '#e57373',

  gradientStart: '#ffebee',
  gradientMid: '#fce4ec',
  gradientEnd: '#f8bbd0',

  background: '#fafafa',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',

  text: '#1a1a2e',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textOnPrimary: '#ffffff',
  textOnAccent: '#820933',

  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  error: '#ef4444',

  border: '#f3f4f6',
  borderAccent: '#ff99a0',
  divider: '#e5e7eb',

  overlay: 'rgba(0,0,0,0.3)',
  cardShadow: 'rgba(130, 9, 51, 0.08)',

  tabInactive: '#9ca3af',
  tabActive: '#820933',
  tabActiveBg: '#fce4ec',

  skeleton: '#f3f4f6',
  skeletonHighlight: '#e5e7eb',
} as const;

export const gradients = {
  main: [colors.gradientStart, colors.gradientMid, colors.gradientEnd] as const,
  hero: ['#fce4ec', '#f8bbd0', '#f48fb1'] as const,
  header: ['#ec4899', '#a855f7'] as const,
  card: ['#ffffff', '#fef7f8'] as const,
  matchScore: ['#d946ef', '#a855f7'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
    default: {},
  }),
} as const;

export const shared = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  pillButtonText: {
    color: colors.textOnPrimary,
    ...typography.captionBold,
  },
});
