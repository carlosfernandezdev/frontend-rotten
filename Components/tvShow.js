import { useRef, useEffect, memo } from 'react';
import { View, Text, Image, StyleSheet, Animated, Pressable } from 'react-native';
import { Score } from './Score';
import { WatchList } from './WatchList';
import { Link } from 'expo-router';
import { RemoveWatchList } from './rmvWatchList';

const Serie = memo(({ serie, source }) => {
  // Aseguramos slug
  serie.slug = serie.slug || serie.idFromAPI;

  const rawTitle = serie.title || serie.name || 'Sin título';
  const title =
    rawTitle.length > 23 ? `${rawTitle.slice(0, 20)}...` : rawTitle;

  const rawDescription =
    serie.description || serie.overview || 'Sin descripción disponible.';
  const description =
    rawDescription.length > 120
      ? `${rawDescription.slice(0, 117)}...`
      : rawDescription;

  return (
    <Link href={`tv/${serie.slug}`} asChild>
      <Pressable>
        <View key={serie.slug} style={styles.card}>
          {/* Poster */}
          <View style={styles.imageContainer}>
            {serie.image ? (
              <Image
                source={{ uri: serie.image }}
                style={styles.image}
                resizeMode="cover"
                onError={(error) =>
                  console.log('Error loading image serie:', error)
                }
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
              </View>
            )}
          </View>

          {/* Contenido */}
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>

            <View style={styles.scoreContainer}>
              <Score score={serie.score} maxScore={10} />
            </View>

            <Text style={styles.description} numberOfLines={4}>
              {description}
            </Text>

            <View style={styles.actionsRow}>
              {source === 'WLScreen' ? (
                <RemoveWatchList item={serie} source="tv" />
              ) : (
                <WatchList item={serie} source="tv" />
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

export function AnimatedCustomSerie({ serie, index, source }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 180,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [opacity, translateY, index]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Serie serie={serie} source={source} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF', // 💡 fondo claro
    borderRadius: 16,
    flexDirection: 'row',
    padding: 10,
    gap: 10,

    // sombra suave tipo app moderna
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageContainer: {
    width: 90,
    height: 135,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 11,
    color: '#6B7280',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  scoreContainer: {
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  actionsRow: {
    marginTop: 4,
  },

  // estilos viejos no usados, los dejo solo si algo externo los usa
  boton: {
    backgroundColor: '#E5E7EB',
    width: 120,
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  Text: {
    color: '#111827',
  },
});

export default Serie;
