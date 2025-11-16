import { 
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
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

const TAB_BAR_HEIGHT = 80;

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
        setMovies(moviesData.slice(0, 1)); // 1 película destacada
        setSeries(seriesData.slice(0, 1)); // 1 serie destacada
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Loader de fuente o de datos
  if (!loadedFont || loading) {
    return (
      <View style={styles.loaderScreen}>
        <Logo />
        <View style={styles.loaderRow}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loaderText}>Buscando qué ver hoy...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header bonito */}
          <View style={styles.headerCard}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Bienvenido</Text>
              <Text style={styles.subtitle}>
                Descubre películas y series para tu próxima maratón.
              </Text>
            </View>
            <View style={styles.headerLogo}>
              <Logo />
            </View>
          </View>

          {/* Película destacada */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <View style={[styles.chip, styles.chipMovies]}>
                  <Text style={styles.chipText}>Película destacada</Text>
                </View>
                <Text style={styles.sectionTitle}>Para ver hoy</Text>
                <Text style={styles.sectionSubtitle}>
                  La recomendación más reciente agregada a la app.
                </Text>
              </View>

              <Link href="/Movies" asChild>
                <Pressable style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Ver todas</Text>
                </Pressable>
              </Link>
            </View>

            <FlatList
              data={movies}
              keyExtractor={(movie) => movie.slug}
              renderItem={({ item, index }) => (
                <AnimatedCustomMovie movie={item} index={index} />
              )}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>

          {/* Serie destacada */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <View style={[styles.chip, styles.chipSeries]}>
                  <Text style={styles.chipText}>Serie destacada</Text>
                </View>
                <Text style={styles.sectionTitle}>Para maratonear</Text>
                <Text style={styles.sectionSubtitle}>
                  Una serie perfecta para empezar esta semana.
                </Text>
              </View>

              <Link href="/series" asChild>
                <Pressable style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Ver todas</Text>
                </Pressable>
              </Link>
            </View>

            <FlatList
              data={series}
              keyExtractor={(serie) => serie.slug}
              renderItem={({ item, index }) => (
                <AnimatedCustomSerie serie={item} index={index} />
              )}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Menu />
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  // Fondo general claro
  screen: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: TAB_BAR_HEIGHT + 16,
  },

  // Loader
  loaderScreen: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  loaderText: {
    color: '#4B5563',
    fontSize: 14,
  },

  // Header card
    headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 18,

    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
  },
  headerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Secciones
  section: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  flatListContainer: {
    paddingTop: 4,
  },

  // Chips
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipMovies: {
    backgroundColor: '#FEE2E2', // rojo pastel
  },
  chipSeries: {
    backgroundColor: '#DBEAFE', // azul pastel
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },

  // Ver todas
  seeAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});

export default Home;
