import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAllSeries, searchSeriesByName } from '../api/series';
import { AnimatedCustomSerie } from '../Components/tvShow';
import Logo from '../Components/Logo';
import { useFonts } from 'expo-font';
import Menu from '../Components/Menu';
import { NavBar } from '../Components/navBar';
import { SearchBar } from '../Components/SearchBar';

const Series = () => {
  const [loadedFont] = useFonts({
    'Bukhari-Script': require('../assets/fonts/bukhari_script/Bukhari_Script.ttf'),
  });

  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (searchQuery === '') {
      setSeries([]);
      setFilteredSeries([]);
      setPage(1);
      loadSeries(1);
    } else {
      filterSeries(searchQuery);
    }
  }, [searchQuery]);

  const loadSeries = async (page) => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const newSeries = await getAllSeries(page);

      if (newSeries.length === 0) {
        setHasMore(false);
      } else {
        const uniqueSeries = newSeries.filter(
          (serie) => !series.some((item) => item.slug === serie.slug)
        );
        setSeries((prev) => [...prev, ...uniqueSeries]);
        setFilteredSeries((prev) => [...prev, ...uniqueSeries]);
      }
    } catch (error) {
      console.error("Error al cargar series:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadSeries(nextPage);
  };

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      await filterSeries(query);
    } catch (error) {
      console.error("Error al manejar el filtrado de las series:", error);
    }
  };

  const filterSeries = async (query) => {
    try {
      const result = await searchSeriesByName(query);
      setSeries(result);
      setFilteredSeries(result);
    } catch (error) {
      console.error("Error al filtrar series:", error);
    }
  };

  if (!loadedFont) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingTextFont}>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </View>

        {/* Contenido */}
        {loading && page === 1 ? (
          <View style={styles.initialLoader}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Cargando series...</Text>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            <Text style={styles.title}>Series disponibles</Text>
            <View style={styles.listContainer}>
              <FlatList
                data={filteredSeries}
                keyExtractor={(serie, index) => `${serie.slug}-${index}`}
                renderItem={({ item, index }) => (
                  <AnimatedCustomSerie serie={item} index={index} />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() =>
                  loadingMore ? (
                    <View style={styles.loadingMoreContainer}>
                      <ActivityIndicator size="small" />
                      <Text style={styles.loadingText}>Cargando más series...</Text>
                    </View>
                  ) : !hasMore ? (
                    <Text style={styles.noMoreText}>
                      No hay más series para mostrar.
                    </Text>
                  ) : null
                }
              />
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
  // Pantalla base – clara, sin imagen de fondo
  screen: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  safeArea: {
    flex: 1,
  },

  // Header tipo app moderna
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    marginLeft: 8,
  },

  // Loader fuentes
  loadingScreen: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTextFont: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
  },

  // Loader inicial de datos
  initialLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563',
  },

  // Contenido principal
  listWrapper: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  listContainer: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  noMoreText: {
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 13,
  },
});

export default Series;
