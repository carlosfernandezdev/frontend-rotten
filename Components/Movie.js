import React, { useRef, useEffect, memo } from 'react';
import { View, Text, Image, StyleSheet, Animated, Pressable } from 'react-native';
import { Score } from './Score';
import { WatchList } from './WatchList';
import { Link } from 'expo-router';
import { RemoveWatchList } from './rmvWatchList';

const Movie = memo(({ movie, source }) => {
  movie.slug = movie.slug || movie.idFromAPI;
  return (
    <Link href={`movies/${movie.slug}`} asChild>
      <Pressable activeOpacity={0.7}>
        <View key={movie.slug} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: movie.image }} 
              style={styles.image}
              onError={(error) => console.log('Error loading image:', error)}
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{movie.title.slice(0, 20)}...</Text>
            <Score score={movie.score} maxScore={10} />
            <Text style={styles.description}>{movie.description.slice(0, 100)}...</Text>
            {source === 'WLScreen' ? (
              <RemoveWatchList item={movie} source='Movie' />
            ) : (
              <WatchList item={movie} source='Movie' />
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

export function AnimatedCustomMovie({ movie, index, source }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Animated.View style={{ opacity }}>
      <Movie movie={movie} source={source} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: '#151715',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 170,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
    marginLeft: 5
  },
  contentContainer: {
    flexShrink: 1,
    flexWrap: 'wrap',
    flexDirection: 'column',
    width: '100%',
  },
  description: {
    fontSize: 14,
    color: 'white',
    padding: 5,
    marginLeft: 5,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '100%',
  },
  boton: {
    backgroundColor: '#2f2f2f',
    width: 120,
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  Text: {
    color: 'white',
  },
});