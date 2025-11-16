import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import Menu from '../Components/Menu';
import { fetchsito1 } from "../utils/fetchMethod";
import { NavBar } from '../Components/navBar';
import Logo from '../Components/Logo';
import { AnimatedCustomMovie } from "../Components/Movie";
import { AnimatedCustomSerie } from "../Components/tvShow";
import { SearchBar } from "../Components/SearchBar";
import eventEmitter from "../utils/EventEmitter";

const WatchListScreen = () => {
  const [watchList, setWatchList] = useState([]);
  const [filteredWatchList, setFilteredWatchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rerender = () => setLoading(prev => !prev);
    eventEmitter.on("removeFromWatchList", rerender);

    return () => eventEmitter.off("removeFromWatchList", rerender);
  }, []);

  const loadWatchList = async () => {
    try {
      const response = await fetchsito1.get('/user/getWatchList');
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          setWatchList(data.watchList);
          setFilteredWatchList(data.watchList);
        }
      }
    } catch (error) {
      console.log("Error loading watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchList();
  }, [loading]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = watchList.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWatchList(filtered);
  };

  const renderItem = ({ item, index }) => {
    if (item.type === "Movie")
      return <AnimatedCustomMovie movie={item} index={index} source="WLScreen" />;
    if (item.type === "tv")
      return <AnimatedCustomSerie serie={item} index={index} source="WLScreen" />;
    return null;
  };

  return (
    <View style={styles.screen}>
      
      {/* LOGO SOLO */}
      <View style={styles.logoWrapper}>
        <Logo />
      </View>

      {/* SEARCHBAR DEBAJO */}
      <View style={styles.searchWrapper}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loaderText}>Cargando tu WatchList...</Text>
          </View>
        ) : (
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Tu WatchList</Text>

            <View style={styles.card}>
              {filteredWatchList.length > 0 ? (
                <FlatList
                  data={filteredWatchList}
                  renderItem={renderItem}
                  keyExtractor={(item) =>
                    (item._id || item.movieId || item.tvId || Math.random()).toString()
                  }
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              ) : (
                <Text style={styles.noItemsText}>
                  No tienes elementos en tu lista todavía.
                </Text>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>

      <Menu />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F4F5",
  },

  logoWrapper: {
    paddingTop: 16,
    paddingBottom: 0,
    alignItems: "center",
  },

  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  safeArea: {
    flex: 1,
  },

  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    marginTop: 6,
    color: "#4B5563",
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginVertical: 10,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  noItemsText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});

export default WatchListScreen;
