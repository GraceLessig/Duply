import { Platform, StyleSheet } from 'react-native';

export const colors = {
  primary: '#EB4213',
  primaryLight: '#ff6b3b',
  accent: '#826DEE',
  accentLight: '#f0edff',
  accentDark: '#6d56db',
  pink: '#FF99DC',
  lime: '#D8F382',
  red: '#EB4213',
  purple: '#826DEE',

  gradientStart: '#FF99DC',
  gradientMid: '#ffb5e6',
  gradientEnd: '#D8F382',

  background: '#FF99DC',
  surface: '#fff7fd',
  surfaceElevated: '#fff0fb',

  text: '#331029',
  textSecondary: '#6b305b',
  textMuted: '#8d5d80',
  textOnPrimary: '#ffffff',
  textOnAccent: '#331029',

  success: '#617315',
  successLight: '#eefbbb',
  warning: '#EB4213',
  error: '#c91f22',

  border: 'rgba(235,66,19,0.18)',
  borderAccent: '#EB4213',
  divider: 'rgba(130,109,238,0.18)',

  overlay: 'rgba(0,0,0,0.3)',
  cardShadow: 'rgba(235, 66, 19, 0.18)',

  tabInactive: '#8d5d80',
  tabActive: '#EB4213',
  tabActiveBg: '#D8F382',

  skeleton: '#ffc4ea',
  skeletonHighlight: '#ffe7f6',
} as const;

export const gradients = {
  main: [colors.pink, '#ffc1e9', colors.lime] as const,
  hero: [colors.pink, '#ffb1e4', colors.lime] as const,
  header: [colors.pink, colors.lime] as const,
  card: ['#fff7fd', '#fff0fb'] as const,
  matchScore: [colors.lime, '#f2ffb5', colors.pink] as const,
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
    letterSpacing: 0,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0,
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
