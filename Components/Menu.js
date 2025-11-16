import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { fetchsito1 } from '../utils/fetchMethod.js';

const { height, width } = Dimensions.get('window');
const menuWidth = width * 0.7; // un poco más ancho para que se vea cómodo

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(menuWidth));

  const handleLogout = async () => {
    try {
      const response = await fetchsito1.post('/user/logout');
      const data = await response.json();
      if (response.ok) {
        router.navigate('login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: menuWidth,
        duration: 260,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón flotante del menú */}
      <Pressable onPress={toggleMenu} style={styles.iconButton}>
        <SimpleLineIcons name="menu" size={20} color="#111827" />
      </Pressable>

      {isOpen && (
        <>
          {/* Fondo semitransparente para cerrar tocando fuera */}
          <Pressable style={styles.backdrop} onPress={toggleMenu} />

          {/* Panel lateral */}
          <Animated.View
            style={[
              styles.menu,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Pressable onPress={toggleMenu} style={styles.closeButton}>
              <SimpleLineIcons name="close" size={20} color="#111827" />
            </Pressable>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Menú</Text>
              <Text style={styles.menuSubtitle}>Navega por la app</Text>

              <View style={styles.menuList}>
                <Link href="/home" asChild>
                  <Pressable style={styles.menuItem}>
                    <Text style={styles.menuText}>Inicio</Text>
                  </Pressable>
                </Link>

                <Link href="/Movies" asChild>
                  <Pressable style={styles.menuItem}>
                    <Text style={styles.menuText}>Películas</Text>
                  </Pressable>
                </Link>

                <Link href="/series" asChild>
                  <Pressable style={styles.menuItem}>
                    <Text style={styles.menuText}>Series</Text>
                  </Pressable>
                </Link>

                <Link href="/watchListScreen" asChild>
                  <Pressable style={styles.menuItem}>
                    <Text style={styles.menuText}>WatchList</Text>
                  </Pressable>
                </Link>

              </View>

              <View style={styles.footer}>
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                  <Text style={styles.logoutText}>Cerrar sesión</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: 12,
    zIndex: 20,
  },
  // Botón flotante de menú
  iconButton: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Fondo oscuro semitransparente
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    zIndex: 19,
  },

  // Panel del menú
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: menuWidth,
    height: height,
    backgroundColor: '#FFFFFF',
    paddingTop: 32,
    paddingHorizontal: 18,
    paddingBottom: 24,
    zIndex: 20,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: -4, height: 0 },
    elevation: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  menuContent: {
    flex: 1,
    marginTop: 8,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 16,
  },
  menuList: {
    marginTop: 8,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  menuText: {
    color: '#111827',
    fontSize: 16,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  logoutButton: {
    paddingVertical: 10,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default Menu;
