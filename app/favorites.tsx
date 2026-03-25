import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Heart, Home, User } from 'react-native-feather';
import Layout, { styles } from '../components/Layout';
import NavItem from './navigation/NavItem';

export default function Favorites() {
  // In a real app, this would come from state or storage
  const favorites: any[] = [];

  return (
    <Layout>

      <View style={styles.topBar}>
        <View style={{ width: 40 }} />
          <Text style={styles.title}>Favorites</Text>
        <View style={{ width: 40 }} />
      </View>


      <LinearGradient
        colors={['#ffebee', '#fce4ec', '#f8bbd0']}
        style={styles.container} // same style as home container for consistency
      >

        <View style={styles.content}>
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart width={64} height={64} stroke="#d1d5db" style={{ marginBottom: 16 }} />

              <Text style={styles.title}>
                No favorites yet
              </Text>

              <Text style={styles.subtitle}>
                Tap the heart icon on any dupe to save it here
              </Text>

              <Link href="/search" asChild>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>Browse Dupes</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <View style={styles.list}>
              {/* Favorite items would go here */}
              <Text>Favorites list</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <View style={styles.bottomNav}>
        <NavItem icon={Home} label="Home" href="/" />
        <NavItem icon={Heart} label="Favorites" href="/favorites" />
        <NavItem icon={User} label="Profile" href="/profile" />
      </View>
    </Layout>
  );
}