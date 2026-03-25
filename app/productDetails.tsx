import { Feather, Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Heart, Home, User } from 'react-native-feather';
import Layout, { styles } from "../components/Layout";
import { dupes } from "../data/products";
import NavItem from "./navigation/NavItem";

// Navigation types
type RootStackParamList = {
  ProductDetail: { id: string };
};

type RouteProps = RouteProp<RootStackParamList, "ProductDetail">;

export default function ProductDetails() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);

  const dupe = dupes.find((d) => d.id === id);

  if (!dupe) {
    return (
      <Layout>
        <View style={styles.productCenter}>
          <Text style={styles.title}>Product not found :c</Text>
        </View>
          <View style={styles.bottomNav}>
            <NavItem icon={Home} label="Home" href="/" />
            <NavItem icon={Heart} label="Favorites" href="/favorites" />
            <NavItem icon={User} label="Profile" href="/profile" />
          </View>
      </Layout>
    );
  }

  const { original, dupe: dupeProduct, similarity, savings } = dupe;

  const enhancedDupe = {
    ...dupeProduct,
    shades: ["#FFB6C1", "#FF69B4", "#FF1493", "#C71585", "#DB7093"],
    ingredients:
      "Water, Cyclopentasiloxane, Phenyl Trimethicone, Dimethicone, Glycerin...",
  };

  return (
    <Layout>

      {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <Text style={styles.title}>Product Details</Text>

          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "hotpink" : "gray"}
            />
          </TouchableOpacity>
        </View>

      <LinearGradient colors={['#ffebee', '#fce4ec', '#f8bbd0']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Match Score */}
        <View style={styles.matchScore}>
          <Text style={styles.matchNumber}>{similarity}%</Text>
          <Text style={styles.matchLabel}>Match Score</Text>
        </View>

        {/* Savings */}
        <View style={styles.savings}>
          <Feather name="check-circle" size={20} color="green" />
          <View>
            <Text style={styles.savingsText}>
              Save ${savings.toFixed(2)}
            </Text>
            <Text style={styles.savingsSub}>
              {Math.round((savings / original.price) * 100)}% off
            </Text>
          </View>
        </View>

        {/* Comparison */}
        <Text style={styles.sectionTitle}>Product Comparison</Text>

        <View style={styles.row}>
          {/* Original */}
          <View style={styles.card}>
            <Image source={{ uri: original.image }} style={styles.image} />
            <Text style={styles.labelPink}>ORIGINAL</Text>
            <Text style={styles.brand}>{original.brand}</Text>
            <Text style={styles.name}>{original.name}</Text>
            <Text style={styles.pricePink}>${original.price}</Text>
          </View>

          {/* Dupe */}
          <View style={styles.card}>
            <Image source={{ uri: enhancedDupe.image }} style={styles.image} />
            <Text style={styles.labelGreen}>DUPE</Text>
            <Text style={styles.brand}>{enhancedDupe.brand}</Text>
            <Text style={styles.name}>{enhancedDupe.name}</Text>
            <Text style={styles.priceGreen}>${enhancedDupe.price}</Text>
          </View>
        </View>

        {/* Shades */}
        {enhancedDupe.shades && (
          <>
            <Text style={styles.sectionTitle}>Available Shades</Text>
            <View style={styles.shadeRow}>
              {enhancedDupe.shades.map((shade, i) => (
                <View
                  key={i}
                  style={[styles.shade, { backgroundColor: shade }]}
                />
              ))}
            </View>
          </>
        )}

        {/* Rating */}
        <Text style={styles.sectionTitle}>Rating</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{enhancedDupe.rating}</Text>
        </View>

        {/* Ingredients */}
        {enhancedDupe.ingredients && (
          <>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.ingredients}>
              {enhancedDupe.ingredients}
            </Text>
          </>
        )}

        {/* Why Match */}
        <Text style={styles.sectionTitle}>Why This Match?</Text>
        <View style={styles.box}>
          {[
            "Formula and finish",
            "Color and pigmentation",
            "Wear time and longevity",
            "Application and texture",
          ].map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Feather name="check" size={16} color="green" />
              <Text>{item}</Text>
            </View>
          ))}
        </View>
        </ScrollView>
      </LinearGradient>
      <View style={styles.bottomNav}>
        <NavItem icon={Home} label="Home" href="/" />
        <NavItem icon={Heart} label="Favorites" href="/favorites" />
        <NavItem icon={User} label="Profile" href="/profile" />
      </View>
    </Layout>
  );
}