import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Heart, Home, Menu, Search, User } from 'react-native-feather';
import Layout, { styles } from '../components/Layout';
import NavItem from './navigation/NavItem';


const router = useRouter();

export default function Index() {
  
  return (
    <Layout>
      <View style={styles.topBar}>
        <NavItem icon={Menu} label="" href="/categories" />
        <Text style={styles.homeTitle}>
          düply
        </Text>
        <View style={{ width: 40 }} /> 
      </View>
      <LinearGradient
        colors={['#ffebee', '#fce4ec', '#f8bbd0']}
        style={styles.container}
      >
        {/* Heading */}
        <Text style={styles.heading}>
          Find Your Perfect Dupe
        </Text>

        {/* Subheading */}
        <Text style={styles.subheading}>
          Discover affordable alternatives
        </Text>

        {/* Search Bar */}
        {/* shows navigation, will be replaced with function within textinput */}
        <Link href="./search" asChild> 
          <Pressable style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <Search width={32} height={32} stroke="#820933" />
              <TextInput
                onChangeText={() => {}} // will be replaced later
                onSubmitEditing={() => {
                  router.push('/searchResults');
                }}
                placeholder="Search products..."
                placeholderTextColor="#999"
                style={styles.subtitle}
              />
            </View>
          </Pressable>
        </Link>
      </LinearGradient>
      <View style={styles.bottomNav}>
        <NavItem icon={Home} label="Home" href="/" />
        <NavItem icon={Heart} label="Favorites" href="/favorites" />
        <NavItem icon={User} label="Profile" href="/profile" />
      </View>
    </Layout>
    
  );
}
