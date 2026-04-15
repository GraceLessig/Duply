import { Platform, StyleSheet } from 'react-native';

export const colors = {
  primary: '#820933',
  primaryLight: '#a8123f',
  accent: '#ff99a0',
  accentLight: '#ffe1e4',
  accentDark: '#e57373',

  gradientStart: '#fff8fb',
  gradientMid: '#ffe7ef',
  gradientEnd: '#ffd2df',

  background: '#fffaf7',
  surface: '#ffffff',
  surfaceElevated: '#fffdfc',

  text: '#2a1830',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textOnPrimary: '#ffffff',
  textOnAccent: '#820933',

  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  error: '#ef4444',

  border: '#f7d9e3',
  borderAccent: '#ff99a0',
  divider: '#f4dde6',

  overlay: 'rgba(0,0,0,0.3)',
  cardShadow: 'rgba(130, 9, 51, 0.12)',

  tabInactive: '#9ca3af',
  tabActive: '#820933',
  tabActiveBg: '#ffe4eb',

  skeleton: '#f8e9ee',
  skeletonHighlight: '#f3d9e2',
} as const;

export const gradients = {
  main: [colors.gradientStart, colors.gradientMid, colors.gradientEnd] as const,
  hero: ['#ffdce8', '#ffb9cf', '#ff8fb2'] as const,
  header: ['#ec4899', '#a855f7'] as const,
  card: ['#ffffff', '#fff5f8'] as const,
  matchScore: ['#fff8fb', '#ffe1e4', '#ff99a0'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 34,
  xxxl: 52,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 28,
  full: 999,
} as const;

export const typography = {
  hero: {
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.9,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 19,
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
    fontWeight: '700' as const,
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
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 18,
    },
    android: { elevation: 6 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 1,
      shadowRadius: 28,
    },
    android: { elevation: 10 },
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
