import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Animated } from 'react-native';
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
  const [loadingMore, setLoadingMore] = useState(false); // Para controlar la carga adicional
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true); // Controla si hay más datos
  const [reload, setReload] = useState(false);
  //console.log(page) 
  //console.log('a')
  useEffect(() => {
    if (searchQuery === '') {
      setSeries([]); // Limpiar las series actuales
      setFilteredSeries([]); // Limpiar las series filtradas
      setPage(1); // Reiniciar la página a 1
      loadSeries(1); // Cargar las series desde la primera página
    } else {
      //console.log(searchQuery)
      filterSeries(searchQuery);
    }
  }, [searchQuery]);

  const loadSeries = async (page) => {
    if (loadingMore) return; // Evita múltiples cargas simultáneas
    setLoadingMore(true);

    try {
      const newSeries = await getAllSeries(page); // Llama a la función con la página actual

      if (newSeries.length === 0) {
        setHasMore(false); // Si no hay más series, detén la paginación
      } else {
        const uniqueSeries = newSeries.filter(
          (serie) => !series.some((film) => film.slug === serie.slug)
        );
        setSeries((prev) => [...prev, ...uniqueSeries]); // Añade las series al estado existente
        setFilteredSeries((prev) => [...prev, ...uniqueSeries]); // Sincroniza con las filtradas
      }
    } catch (error) {
      console.error("Error al cargar series:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return; // No cargar si no hay más datos o ya está cargando
    const nextPage = page + 1;
    setPage(nextPage); // Incrementa la página
    loadSeries(nextPage); // Carga la siguiente página
  };

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      await filterSeries(query);
    } catch (error) {
      console.error("Error al manejar el filtrado de las peliculas filtrar series:", error);
    }
  };

  const filterSeries = async (query) => {
    try {
      const result = await searchSeriesByName(query);
      setSeries(result); // Actualizamos el estado general
      setFilteredSeries(result); // Actualizamos lo que se muestra
    } catch (error) {
      console.error("Error al filtrar series:", error);
    }
  };

  if (loadedFont) {
    return (
      <View style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Logo />
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              handleSearch={handleSearch} 
            />
          </View>
          <SafeAreaView style={styles.safeArea}>
            {loading && page === 1 ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View style={styles.listContainer}>
                <FlatList
                  data={filteredSeries}
                  keyExtractor={(film, index) => `${film.slug}-${index}`} // Combina slug e índice para garantizar unicidad
                  ListHeaderComponent={() => (
                    <Text style={styles.Title1}>Series disponibles</Text>
                  )}
                  renderItem={({ item, index }) => (
                    <AnimatedCustomSerie serie={item} index={index} />
                  )}
                  onEndReached={handleLoadMore} // Detectar el final de la lista
                  onEndReachedThreshold={0.5} // Activar antes de llegar al final
                  ListFooterComponent={() => (
                    loadingMore ? (
                      <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={styles.loadingText}>Cargando más series...</Text>
                      </View>
                    ) : !hasMore ? (
                      <Text style={styles.noMoreText}>No hay más series para mostrar.</Text>
                    ) : null
                  )}
                />
              </View>
            )}
          </SafeAreaView>
        </View>
        <Menu />
        <NavBar />
      </View>
    );
  } else {
    return <Text>AYUDA FONT</Text>;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111211',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#111211', // Fondo consistente con la app
    borderBottomWidth: 1, // Línea inferior para separar el encabezado
    borderBottomColor: '#333',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#111211',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  noMoreText: {
    color: 'white',
    textAlign: 'center',
    paddingVertical: 20,
  },
  Title1: {
    padding: 10,
    fontSize: 20,
    color: 'white',
    marginLeft: 5,
    marginTop: 10,
  },
});

export default Series;