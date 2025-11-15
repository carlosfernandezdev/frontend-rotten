import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAllMovies, searchMovieByName } from '../api/movies';
import { AnimatedCustomMovie } from '../Components/Movie';
import Logo from '../Components/Logo';
import { useFonts } from 'expo-font';
import Menu from '../Components/Menu';
import { NavBar } from '../Components/navBar';
import { SearchBar } from '../Components/SearchBar';

const Movies = () => {
  const [loadedFont] = useFonts({
    'Bukhari-Script': require('../assets/fonts/bukhari_script/Bukhari_Script.ttf'),
  });

  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // Para controlar la carga adicional
  const [page, setPage] = useState(1); // Página actual
  const [hasMore, setHasMore] = useState(true); // Controla si hay más datos
  const [reload, setReload] = useState(false);  

  useEffect(() => {
    if (searchQuery === '') {
      setFilms([]); // Limpiar las películas actuales
      setFilteredFilms([]); // Limpiar las películas filtradas
      setPage(1); // Reiniciar la página a 1
      loadMovies(1); // Cargar las películas desde la primera página
    } else {
      filterFilms(searchQuery);
    }
  }, [searchQuery]);

  const loadMovies = async (page) => {
    if (loadingMore) return; // Evita múltiples cargas simultáneas
    setLoadingMore(true);

    try {
      const newMovies = await getAllMovies(page); // Llama a la función con la página actual

      if (newMovies.length === 0) {
        setHasMore(false); // Si no hay más películas, detén la paginación
      } else {
        const uniqueMovies = newMovies.filter(
          (movie) => !films.some((film) => film.slug === movie.slug)
        );
        setFilms((prev) => [...prev, ...uniqueMovies]); // Añade las películas al estado existente
        setFilteredFilms((prev) => [...prev, ...uniqueMovies]); // Sincroniza con las filtradas
      }
    } catch (error) {
      console.error("Error al cargar películas:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return; // No cargar si no hay más datos o ya está cargando
    const nextPage = page + 1;
    setPage(nextPage); // Incrementa la página
    loadMovies(nextPage); // Carga la siguiente página
  };

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      await filterFilms(query);
    } catch (error) {
      console.error("Error al manejar el filtrado de las peliculas filtrar películas:", error);
    }
  };

  const filterFilms = async (query) => {
    try {
      const result = await searchMovieByName(query);
      setFilms(result); // Actualizamos el estado general
      setFilteredFilms(result); // Actualizamos lo que se muestra
    } catch (error) {
      console.error("Error al filtrar películas:", error);
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
                  data={filteredFilms}
                  keyExtractor={(film, index) => `${film.slug}-${index}`} // Combina slug e índice para garantizar unicidad
                  ListHeaderComponent={() => (
                    <Text style={styles.Title1}>Películas disponibles</Text>
                  )}
                  renderItem={({ item, index }) => (
                    <AnimatedCustomMovie movie={item} index={index} />
                  )}
                  onEndReached={handleLoadMore} // Detectar el final de la lista
                  onEndReachedThreshold={0.5} // Activar antes de llegar al final
                  ListFooterComponent={() => (
                    loadingMore ? (
                      <View style={styles.loadingMoreContainer}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={styles.loadingText}>Cargando más películas...</Text>
                      </View>
                    ) : !hasMore ? (
                      <Text style={styles.noMoreText}>No hay más películas para mostrar.</Text>
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
    paddingVertical: 20,
    alignItems: 'center',
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

export default Movies;