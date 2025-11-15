import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {fetchsito1} from '../utils/fetchMethod.js';

const { height } = Dimensions.get('window');

const menuWidth = Dimensions.get('window').width * 0.4;

const Menu = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [slideAnim] = useState(new Animated.Value(menuWidth));

    const handleLogout = async ()=>{
        try {
            //console.log('hare el fetch')
            const response = await fetchsito1.post('/user/logout');
            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                //console.log('fetch ok')
                router.navigate('login');
            }
        } catch (error) {
            console.error(error);

        }
    }

    const toggleMenu = () => {
        if (isOpen) {
            Animated.timing(slideAnim, {
                toValue: menuWidth, 
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsOpen(false));
        } else {
            setIsOpen(true);
            Animated.timing(slideAnim, {
                toValue: 0, 
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={toggleMenu} style={styles.iconButton}>
                <SimpleLineIcons name="menu" size={24} color="white" />
            </Pressable>
            {isOpen && (
                <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
                    <Pressable onPress={toggleMenu} style={styles.iconButton1}>
                        <SimpleLineIcons name="menu" size={26} color="white" />
                    </Pressable>
                    

                    <Link href="/home" style={styles.menuItem}>
                        <Text style={styles.menuText}>Inicio</Text>
                    </Link>



                    <Link href="/Movies" style={styles.menuItem}>
                        <Text style={styles.menuText}>Peliculas</Text>
                    </Link>

                    <Link href="/series" style={styles.menuItem}>
                        <Text style={styles.menuText}>Series</Text>
                    </Link>

                    <Link href="/watchListScreen" style={styles.menuItem}>
                        <Text style={styles.menuText}>Por ver</Text>
                    </Link>

                    <Link href="/profile" style={styles.menuItem}>
                        <Text style={styles.menuText}>Perfil</Text>
                    </Link>
                    
                    <Pressable onPress={handleLogout} style={styles.menuItem}>
                        <Text style={styles.menuText}>Cerrar sesion</Text>
                    </Pressable>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0, 
        top: 0,
        zIndex: 10,
    },
    iconButton: {
        padding: 10,
    },
    iconButton1: {
        padding: 10,
        marginTop: -30,
    },
    menu: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: menuWidth, 
        height: height, 
        backgroundColor: '#151715', 
        paddingTop: 40,
        zIndex: 100, 
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    menuText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Menu;