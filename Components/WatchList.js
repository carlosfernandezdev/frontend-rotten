import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { fetchsito1 } from "../utils/fetchMethod.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function WatchList({ item, source }) {  // 'item' puede ser película o serie
    const [watchList, setWatchList] = useState([]);
    ////console.log(`Puedes añadir a WatchList desde ${source}`);
    ////console.log(item)
    // const loadWatchList = async () => {
    //         const jsonValue = await AsyncStorage.getItem('@watchlist');
    //         const storedWatchList = jsonValue != null ? JSON.parse(jsonValue) : [];
    //         setWatchList(storedWatchList);
    // };

    const addToWatchList = async () => {
        //console.log(item)
        //console.log('hola')
        try {
            // //console.log(item)
            // //console.log(source)
            const response = await fetchsito1.post('/film/postFilm', {...item, fromReview: false, source});
            const data = await response.json();
            //console.log(data);
            //console.log(response.ok)
            if(response.ok){
                Alert.alert(`${item.title} añadido a tu WatchList`);
                //console.log('anadido a tu bd')
            }
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     loadWatchList();
    // }, []);

    return (
        <Pressable
            onPress={addToWatchList}
            style={styles.boton}
            activeOpacity={0.7}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="add-circle-outline" size={18} color="white" />
                
            <Text style={{ color: 'white', marginLeft: 5 }}>WatchList</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    boton: {
        backgroundColor: '#2f2f2f',
        width: 120,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 10,
        alignItems: 'center',
    },
});
