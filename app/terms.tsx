import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft width={24} height={24} stroke={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          These Terms of Service govern use of the Duply app and related services. By using the app, you agree to these
          terms.
        </Text>

        <Section
          title="1. What Duply Does"
          body="Duply helps users search beauty products, compare possible dupes, save products and comparisons, and review live price-match offers from third-party retailers."
        />
        <Section
          title="2. Informational Use"
          body="Duply is provided for informational and shopping-assistance purposes only. Product matches, savings estimates, retailer offers, ratings, and descriptions may change over time and may not always be complete, accurate, or current."
        />
        <Section
          title="3. Third-Party Content"
          body="Some product information, images, links, and retailer pricing may come from third-party sources. Duply does not control those third parties and is not responsible for their content, pricing, availability, or policies."
        />
        <Section
          title="4. Accounts"
          body="If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for activity that happens under your account."
        />
        <Section
          title="5. Acceptable Use"
          body="You agree not to misuse the app, interfere with its operation, attempt unauthorized access, scrape the service at scale, or use Duply in a way that violates applicable law."
        />
        <Section
          title="6. No Purchase Guarantee"
          body="Duply does not sell products directly and does not guarantee that any linked retailer listing will remain available, accurate, or suitable for your needs."
        />
        <Section
          title="7. Intellectual Property"
          body="The Duply app design, branding, and original content belong to Duply or its licensors. Third-party trademarks, product names, and images remain the property of their respective owners."
        />
        <Section
          title="8. Disclaimer of Warranties"
          body="Duply is provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied, to the fullest extent permitted by law."
        />
        <Section
          title="9. Limitation of Liability"
          body="To the fullest extent permitted by law, Duply will not be liable for indirect, incidental, special, consequential, or punitive damages, or for losses arising from reliance on product matches, pricing, retailer listings, or app downtime."
        />
        <Section
          title="10. Changes to These Terms"
          body="Duply may update these Terms from time to time. Continued use of the app after an update means you accept the revised Terms."
        />
        <Section
          title="11. Contact"
          body="Questions about these Terms can be sent through the contact option provided in the app."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.pink,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  backBtn: {
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primary,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  intro: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.primary,
  },
  sectionBody: {
    ...typography.caption,
    color: colors.text,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
});
