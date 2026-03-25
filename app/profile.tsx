import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DollarSign, Heart, Home, Settings, TrendingUp, User } from 'react-native-feather';
import Layout, { styles } from '../components/Layout';
import NavItem from './navigation/NavItem';

export default function Profile() {
  // Mock data
  const userName = "Beauty Lover";
  const userEmail = "beauty@example.com";
  const savedDupes = 12;

  const dupes = [
    { savings: 25 },
    { savings: 40 },
    { savings: 15 },
    { savings: 30}
  ];

  const totalSavings = dupes.reduce((sum, d) => sum + d.savings, 0);

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.profileContainer}>
        {/* Header */}
        <LinearGradient
          colors={['#ec4899', '#a855f7']} // pink → purple
          style={styles.header}
        >
          <View style={styles.profileCenter}>
            <View style={styles.avatar}>
              <User width={35} height={35} />
            </View>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>
          </View>
        </LinearGradient>
        

        {/* Stats */}
        <View style={styles.statsWrapper}>
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <StatItem
                icon={Heart}
                value={savedDupes}
                label="Saved Dupes"
                bg="#fce7f3"
                color="#ec4899"
              />
              <StatItem
                icon={DollarSign}
                value={`$${totalSavings}`}
                label="Total Savings"
                bg="#dcfce7"
                color="#22c55e"
              />
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsBox}>
            <SettingsItem icon={Settings} label="Account Settings" />
            <SettingsItem icon={Heart} label="Preferences" />
            <SettingsItem icon={TrendingUp} label="About" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon={Home} label="Home" href="/" />
        <NavItem icon={Heart} label="Favorites" href="/favorites" />
        <NavItem icon={User} label="Profile" href="/profile" />
      </View>


    </Layout>
  );
}

/* ---------- Reusable Components ---------- */

function StatItem({ icon: Icon, value, label, bg, color }: any) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Icon width={24} height={24} stroke={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsItem({ icon: Icon, label }: any) {
  return (
    <Pressable style={styles.settingsItem}>
      <View style={styles.settingsLeft}>
        <Icon width={20} height={20} stroke="#9ca3af" />
        <Text style={styles.settingsText}>{label}</Text>
      </View>
      <Text style={{ color: '#9ca3af' }}>→</Text>
    </Pressable>
  );
}