import Layout from "@/components/Layout";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { ArrowLeft, Heart, Home, User } from "react-native-feather";
import { styles } from "../components/Layout";
import NavItem from "./navigation/NavItem";

export default function Categories() {
  const categories = [
    { name: "Eyes", color: "#ff99a0" },
    { name: "Lips", color: "#820933" },
    { name: "Face", color: "#ff99a0" },
    { name: "Skin", color: "#820933" }
  ];

  return (
    <Layout>
        <LinearGradient
        colors={["#ffebee", "#fce4ec", "#f8bbd0"]}
        style={{ flex: 1 }}
        >
        
            {/* Top Bar */}
            <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconButton}>
                <NavItem icon={ArrowLeft} label="" href="/" />
            </TouchableOpacity>

            <Text style={styles.title}>Categories</Text>

            <View style={{ width: 40 }} />
            </View>

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
            {categories.map((category, index) => (
                <TouchableOpacity
                key={index}
                style={[
                    styles.categoryCard,
                    { backgroundColor: category.color }
                ]}
                activeOpacity={0.8}
                >
                <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
            ))}
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