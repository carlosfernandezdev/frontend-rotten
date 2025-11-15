import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import Menu from '../Components/Menu';
import { fetchsito1 } from "../utils/fetchMethod";
import { NavBar } from '../Components/navBar';
import Logo from '../Components/Logo';
import { AnimatedCustomMovie } from "../Components/Movie";
import { AnimatedCustomSerie } from "../Components/tvShow";
import { SearchBar } from "../Components/SearchBar";
import eventEmitter from "../utils/EventEmitter";

const WatchListScreen = () => {
    const [watchList, setWatchList] = useState([]);
    const [filteredWatchList, setFilteredWatchList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const handleRemoveFromWatchList = () => {
            setLoading(!loading);
            //console.log(loading);
        };

        eventEmitter.on('removeFromWatchList', handleRemoveFromWatchList);

        return () => {
            eventEmitter.off('removeFromWatchList', handleRemoveFromWatchList);
        };
    }, [loading]);

    const loadWatchList = async () => {
        try {
            //console.log(loading)
            const response = await fetchsito1.get('/user/getWatchList');
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    setWatchList(data.watchList);
                    setFilteredWatchList(data.watchList);
                } else {
                    //console.log(data.error || 'Error al cargar la lista de seguimiento.');
                }
            } else {
                //console.log("Respuesta inesperada del servidor");
            }
        } catch (error) {
            //console.log('Error loading watchlist:', error);
        } finally {
            //console.log('finallyy')
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWatchList();
    }, [loading]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = watchList.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredWatchList(filtered);
    };

    const renderItem = ({ item, index }) => {
        if (item.type === 'Movie') {
            return <AnimatedCustomMovie movie={item} index={index} source='WLScreen' />;
        } else if (item.type === 'tv') {
            return <AnimatedCustomSerie serie={item} index={index} source='WLScreen' />;
        }
        return null;
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Contenedor para Logo y SearchBar */}
            <View style={styles.header}>
                <Logo />
                <SearchBar 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    handleSearch={handleSearch} 
                />
            </View>

            {/* Contenedor dinámico para el contenido */}
            <SafeAreaView style={styles.safeArea}>
                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <View style={styles.listContainer}>
                        <Text style={styles.title}>Lista de Películas o Series por Ver</Text>
                        {filteredWatchList.length > 0 ? (
                            <FlatList
                                data={filteredWatchList}
                                renderItem={renderItem}
                                keyExtractor={(item) => {
                                    const id = item._id || item.movieId || item.tvId || Date.now();
                                    return id.toString();
                                }}
                            />
                        ) : (
                            <Text style={styles.noItemsText}>No se encontraron ítems.</Text>
                        )}
                    </View>
                )}
            </SafeAreaView>
            <Menu />
            <NavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#111211',
        borderBottomWidth: 1,
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
    title: {
        padding: 10,
        fontSize: 20,
        color: 'white',
        marginLeft: 5,
        marginTop: 10,
    },
    noItemsText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default WatchListScreen;
