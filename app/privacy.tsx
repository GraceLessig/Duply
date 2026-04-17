import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft width={24} height={24} stroke={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          This Privacy Policy explains what information Duply may collect, how it is used, and how it may be stored when
          you use the app.
        </Text>

        <Section
          title="1. Information You Provide"
          body="If you create an account or update your profile, Duply may store information such as your email address, display name, and any profile photo you choose to upload."
        />
        <Section
          title="2. App Usage Information"
          body="Duply may store saved products, saved comparisons, recent searches, recent views, and similar app activity to power product features and improve your experience."
        />
        <Section
          title="3. Device and Technical Data"
          body="Duply may process technical information needed to run the service, such as request data, device platform details, and basic diagnostics or error information."
        />
        <Section
          title="4. How Information Is Used"
          body="Information may be used to authenticate users, sync profile settings, provide saved items and recent activity, return product comparisons, show price-match offers, improve the app, and maintain security."
        />
        <Section
          title="5. Third-Party Services"
          body="Duply may rely on third-party providers such as hosting, authentication, database, storage, analytics, or retailer-link services. Those providers may process data according to their own privacy policies."
        />
        <Section
          title="6. Retailer and External Links"
          body="If you open a retailer link from Duply, you leave the app and interact with a third party. Duply is not responsible for the privacy practices of external websites or services."
        />
        <Section
          title="7. Data Retention"
          body="Duply may retain account, profile, and saved-item data for as long as needed to provide the service, comply with legal obligations, resolve disputes, or enforce agreements."
        />
        <Section
          title="8. Data Security"
          body="Duply uses reasonable measures to protect stored information, but no system can guarantee absolute security."
        />
        <Section
          title="9. Your Choices"
          body="You may be able to edit or reset parts of your profile inside the app. You can also choose not to create an account, though some synced features may then be unavailable."
        />
        <Section
          title="10. Children"
          body="Duply is not intended for children under the age required by applicable law to use the service without parental consent."
        />
        <Section
          title="11. Changes to This Policy"
          body="Duply may update this Privacy Policy from time to time. Continued use of the app after an update means you accept the revised policy."
        />
        <Section
          title="12. Contact"
          body="Questions about privacy can be sent through the contact option provided in the app."
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
