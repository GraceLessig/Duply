import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.scrollContainer}>
          {children}
        </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },

/* Home Screen Styles */

  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#820933',
    textAlign: 'center',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  homeTitle: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#820933',
    textAlign: 'center',
    marginBottom: 20,
    
    
  },
  topBar: {
    height: 90,
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ff99a0",
    textAlign: "center",
},
  searchWrapper: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 4,
    borderColor: '#ff99a0',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  searchPlaceholder: {
    fontSize: 18,
    color: '#888888',
  },

/* Categories Screen Styles */

categoriesTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#ff99a0"
  },
  categoriesButton: {
    padding: 8
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#820933",
    marginBottom: 20
  },
  scrollContent: {
    padding: 16,
    gap: 16
  },
  categoryCard: {
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4
  },
  categoryText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold"
  },


/* Search Screen Styles */

  searchContainer: {
    flex: 1,
  },
  topBarSearch: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#ff99a0',
    paddingTop: 40,
    paddingBottom: 12,
    zIndex: 50,
    justifyContent: 'center',
  },
  topBarContent: {
    paddingHorizontal: 16,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 999,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#820933',
    marginLeft: 8,
    justifyContent: 'center',
  },
  searchInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
  },
  searchInput: {
    paddingVertical: 12,
    paddingLeft: 36,
    paddingRight: 16,
    borderWidth: 2,
    borderColor: '#ff99a0',
    borderRadius: 999,
    color: '#820933',
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#820933',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  historyItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#820933',
  },
  historyItemButton: {
    padding: 4,
    borderRadius: 999,
  },


/* Search Results Screen Styles */

  searchResultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ff99a0",
    justifyContent: "space-between",
  },

  searchResultsHeaderCenter: {
    alignItems: "center",
  },

  searchResultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#820933",
  },

  searchResultsSubtitle: {
    fontSize: 12,
    color: "#ff99a0",
  },

  searchResultsList: {
    padding: 16,
  },

  searchResultsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  imageBox: {
    width: 70,
    height: 70,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  imageText: {
    fontSize: 10,
    color: "#999",
  },

  info: {
    flex: 1,
    marginHorizontal: 10,
  },

  searchResultsName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#820933",
  },

  matchRow: {
    flexDirection: "row",
    marginTop: 4,
  },

  match: {
    fontSize: 16,
    color: "#ff99a0",
  },

  priceBox: {
    alignItems: "flex-end",
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#820933",
  },

/* Favorites Screen Styles */



  content: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  favoritesTitle: {
    fontSize: 16,
    color: '#6b7280', // gray-500
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af', // gray-400
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#ec4899', // pink-500 (approx)
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },



  /* Profile Screen Styles */


  profileContainer: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },

  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },

  profileCenter: {
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 32,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  email: {
    fontSize: 14,
    color: '#fbcfe8',
  },

  statsWrapper: {
    marginTop: -20,
    paddingHorizontal: 16,
  },

  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },

  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    backgroundColor: '#fff',
  },

  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  achievementSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  settingsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },

  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  settingsText: {
    fontSize: 14,
  },


/* Product Details Screen Styles */

 matchScore: {
    backgroundColor: "#d946ef",
    padding: 20,
    alignItems: "center",
  },

  matchNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  matchLabel: { color: "#fff" },

  savings: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    alignItems: "center",
  },

  savingsText: { fontWeight: "bold", color: "green" },
  savingsSub: { fontSize: 12 },

  productSectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    margin: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  card: {
    width: "48%",
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },

  labelPink: { color: "hotpink", fontSize: 12 },
  labelGreen: { color: "green", fontSize: 12 },

  brand: { fontSize: 12, color: "gray" },
  productName: { fontWeight: "500" },

  pricePink: { color: "hotpink", fontWeight: "bold" },
  priceGreen: { color: "green", fontWeight: "bold" },

  box: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: "#f3e8ff",
    borderRadius: 10,
  },

  productCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },

  headerTitle: { fontWeight: "600", fontSize: 16 },

  text: { fontSize: 14 },

  listItem: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 4,
  },

  review: {
    marginHorizontal: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  reviewName: { fontWeight: "bold" },

   shadeRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  shade: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 6,
  },

  ratingRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  ingredients: {
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },



/* Reusable Components Styles */

 iconWrapper: {
    padding: 8,
    borderRadius: 12,
  },

  activeIconWrapper: {
    backgroundColor: '#ffe4e6', // light pink highlight
  },

  activeLabel: {
    color: '#820933',
    fontWeight: '600',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ff99a0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 40,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconWrapper: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },

});