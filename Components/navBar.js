import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

export const NAVBAR_HEIGHT = 72;

export function NavBar() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.navbar}>
        {/* Home */}
        <Link href="/home" asChild>
          <Pressable style={styles.iconButton}>
            <Ionicons name="home-outline" size={24} color="#4B5563" />
          </Pressable>
        </Link>

        {/* Pelis */}
        <Link href="/Movies" asChild>
          <Pressable style={styles.iconButton}>
            <MaterialCommunityIcons
              name="movie-open-outline"
              size={24}
              color="#4B5563"
            />
          </Pressable>
        </Link>

        {/* Series */}
        <Link href="/series" asChild>
          <Pressable style={styles.iconButton}>
            <Feather name="tv" size={24} color="#4B5563" />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor absoluto abajo
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 8, // un poquito de aire
  },
  // Barra flotante
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    height: NAVBAR_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    marginHorizontal: 16,
    paddingHorizontal: 16,

    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
});

export default NavBar;
