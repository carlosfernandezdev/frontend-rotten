import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import logo from '../assets/logo.png';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.title}>RedMeter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // SIN fondo, que lo maneje el contenedor donde se use
    backgroundColor: 'transparent',
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  title: {
    marginLeft: 8,
    fontSize: 24,
    color: '#111827',           // texto oscuro para el tema claro
    fontFamily: 'Bukhari-Script',
  },
});

export default Logo;
