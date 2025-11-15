import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';

export function NavBar() {
  return (
    <View style={styles.navbar}>
      <Link href="/home">
        <Ionicons name="home-outline" size={32} color="white" style={styles.icon} />
      </Link>
      <Link href="/Movies">
      <MaterialCommunityIcons name="movie-open-outline" size={32} color="white" />
      </Link>
      <Link href="/series">
      <Feather name="tv" size={32} color="white" style={styles.icon} />
      </Link>
      <Link href="/profile">
        <Ionicons name="person-outline" size={32} color="white" style={styles.icon} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#151715',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 10, 
    zIndex: 10,
  },
  icon: {
    marginHorizontal: 10,
  }
});
