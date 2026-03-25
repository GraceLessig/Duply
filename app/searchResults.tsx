import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import React from "react";
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Heart, Home, User } from 'react-native-feather';
import Layout, { styles } from "../components/Layout";
import NavItem from "./navigation/NavItem";

export default function SearchResults() {
  const navigation = useNavigation();

  const dupes = [
    { name: "e.l.f. Cosmetics Camo Liquid Blush", match: 98, price: "$7.00" },
    { name: "NYX Sweet Cheeks Soft Cheek Tint", match: 95, price: "$8.99" },
    { name: "Milani Cheek Kiss Liquid Blush", match: 92, price: "$9.99" },
    { name: "Flower Beauty Blush Bomb", match: 89, price: "$9.98" },
    { name: "Makeup Revolution Superdewy Liquid Blush", match: 85, price: "$7.00" },
    { name: "Wet n Wild MegaGlo Liquid Blush", match: 78, price: "$4.99" },
    { name: "Physicians Formula Happy Booster Blush", match: 72, price: "$10.95" },
    { name: "Covergirl Clean Fresh Cream Blush", match: 68, price: "$8.47" },
    { name: "L.A. Girl Blush Bomb Liquid Blush", match: 62, price: "$6.99" },
  ];

  const renderItem = ({ item }: any) => (
    <Link href={{ pathname: "/productDetails", params: { id: "d1" } }} asChild>
        <TouchableOpacity style={styles.searchResultsCard}>
        {/* Image Placeholder */}
        <View style={styles.imageBox}>
            <Text style={styles.imageText}>Image</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
            <Text style={styles.searchResultsName}>{item.name}</Text>

            <View style={styles.matchRow}>
            <Text style={styles.match}>{item.match}%</Text>
            <Text style={styles.match}> match</Text>
            </View>
        </View>

        {/* Price */}
        <View style={styles.priceBox}>
            <Text style={styles.price}>{item.price}</Text>
        </View>
        </TouchableOpacity>
    </Link>
  );

  return (
    <Layout>
      <View style={styles.searchContainer}>
        {/* Header */}
        <View style={styles.searchResultsHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#820933" />
          </TouchableOpacity>

          <View style={styles.searchResultsHeaderCenter}>
            <Text style={styles.searchResultsTitle}>Rare Beauty Soft Pinch</Text>
            <Text style={styles.searchResultsSubtitle}>
              {dupes.length} dupes found
            </Text>
          </View>

          <View style={{ width: 24 }} />
        </View>

        {/* List */}
        <FlatList
          data={dupes}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.searchResultsList}
        />
    </View>
        <View style={styles.bottomNav}>
            <NavItem icon={Home} label="Home" href="/" />
            <NavItem icon={Heart} label="Favorites" href="/favorites" />
            <NavItem icon={User} label="Profile" href="/profile" />
        </View>
    </Layout>
  );
}