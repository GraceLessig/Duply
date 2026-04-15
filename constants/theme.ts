import { Platform, StyleSheet } from 'react-native';

export const colors = {
  primary: '#2B134F',
  primaryLight: '#4C1D95',
  accent: '#006D77',
  accentLight: '#B9F6F0',
  accentDark: '#005560',
  pink: '#FFD1E8',
  lime: '#D8F94E',
  red: '#B00020',
  purple: '#6D28D9',
  rose: '#D61F69',
  softSky: '#B9F6F0',
  wine: '#2B134F',
  clottedCream: '#F8FAFC',
  strawberryMilk: '#FFD1E8',

  gradientStart: '#F8FAFC',
  gradientMid: '#D8F94E',
  gradientEnd: '#B9F6F0',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#EEF6FF',

  text: '#111827',
  textSecondary: '#374151',
  textMuted: '#4B5563',
  textOnPrimary: '#ffffff',
  textOnAccent: '#ffffff',

  success: '#13795B',
  successLight: '#DFF8EA',
  warning: '#8A5A00',
  error: '#b00020',

  border: 'rgba(17,24,39,0.24)',
  borderAccent: '#2B134F',
  divider: 'rgba(17,24,39,0.16)',

  overlay: 'rgba(0,0,0,0.3)',
  cardShadow: 'rgba(17, 24, 39, 0.18)',

  tabInactive: '#4B5563',
  tabActive: '#2B134F',
  tabActiveBg: '#D8F94E',

  skeleton: '#D6E3F0',
  skeletonHighlight: '#F8FAFC',
} as const;

export const gradients = {
  main: [colors.background, colors.surfaceElevated, '#F4FFF2'] as const,
  hero: [colors.lime, colors.accentLight, colors.pink] as const,
  header: [colors.lime, colors.accentLight] as const,
  card: [colors.surface, colors.surfaceElevated] as const,
  matchScore: [colors.lime, colors.accentLight, colors.surface] as const,
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
  md: 8,
  lg: 8,
  xl: 8,
  full: 999,
} as const;

export const typography = {
  hero: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  h1: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  h2: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 24,
    fontWeight: '800' as const,
  },
  h3: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 19,
    fontWeight: '800' as const,
  },
  body: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 16,
    fontWeight: '700' as const,
  },
  caption: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 14,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 14,
    fontWeight: '700' as const,
  },
  small: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 12,
    fontWeight: '400' as const,
  },
  smallBold: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 12,
    fontWeight: '700' as const,
  },
  label: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui' }),
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0,
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
    borderWidth: 2,
    borderColor: colors.primary,
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
