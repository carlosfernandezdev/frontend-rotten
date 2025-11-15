import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getLatestMovies } from '../api/movies';
import { getLatestSeries } from '../api/series';
import { AnimatedCustomMovie } from '../Components/Movie';
import { AnimatedCustomSerie } from '../Components/tvShow';
import Logo from '../Components/Logo';
import { useFonts } from 'expo-font';
import Menu from '../Components/Menu';
import { Link } from 'expo-router';
import { NavBar } from '../Components/navBar';

const Home = () => {
  const [loadedFont] = useFonts({
    'Bukhari-Script': require('../assets/fonts/bukhari_script/Bukhari_Script.ttf'),
  });

  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesData, seriesData] = await Promise.all([
          getLatestMovies(),
          getLatestSeries(),
        ]);
        setMovies(moviesData.slice(0, 1));  // Solo una película
        setSeries(seriesData.slice(0, 1));  // Solo una serie
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!loadedFont) {
    return <Text>AYUDA FONT</Text>;
  }

  if (loading) {
    return <ActivityIndicator size="large" color="white" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111211' }}>
      <SafeAreaView style={{ marginHorizontal: 10 }}>
        <Logo />

        {/* Sección Películas */}
        <Pressable style={[styles.sectionHeader, styles.SectionColor]} activeOpacity={0.8}>
          <Link href="/Movies" style={styles.sectionTitle}>Mira más películas</Link>
        </Pressable>

        <FlatList
          data={movies}
          keyExtractor={(movie) => movie.slug}
          renderItem={({ item, index }) => <AnimatedCustomMovie movie={item} index={index} />}
          numColumns={1}  // Mostrar solo una película
          key={'movies_1_column'}
          contentContainerStyle={styles.flatListContainer}  // Controlar el espaciado dentro de la lista
        />

        {/* Sección Series */}
        <Pressable style={[styles.sectionHeader, styles.SectionColor]} activeOpacity={0.8}>
          <Link href="/series" style={styles.sectionTitle}>Mira más series</Link>
        </Pressable>

        <FlatList
          data={series}
          keyExtractor={(serie) => serie.slug}
          renderItem={({ item, index }) => <AnimatedCustomSerie serie={item} index={index} />}
          numColumns={1}  // Mostrar solo una serie
          key={'series_1_column'}
          contentContainerStyle={styles.flatListContainer}  // Controlar el espaciado dentro de la lista
        />
      </SafeAreaView>

      <Menu />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 5,  // Reducir el espacio entre secciones
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  sectionTitle1: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
    marginTop: 10,
  },
  flatListContainer: {
    paddingBottom: 10,  // Reducir el padding en el fondo de las listas
  },
  SectionColor: {
    backgroundColor: "#393c39",
  },
});

export default Home;
