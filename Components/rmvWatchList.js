import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchsito1 } from "../utils/fetchMethod.js";
import eventEmitter from "../utils/EventEmitter.js";

export function RemoveWatchList({ item, source }) {

  const removeFromWatchList = async () => {
    //console.log('hola en remove from watchlist');
    try {
      //console.log(item);
      //console.log(source);
      const response = await fetchsito1.post('/user/deleteFromWatchlist', { filmId: item._id });
      const data = await response.json();
      //console.log(data);
      if (response.ok) {
       //console.log('eliminado de watchlist');
       eventEmitter.emit('removeFromWatchList');
       Alert.alert(`${item.title} eliminado de la lista de seguimiento.`); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Pressable onPress={removeFromWatchList} style={styles.boton} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="remove-circle-outline" size={18} color="white" />
          <Text style={{ color: 'white', marginLeft: 5 }}>WatchList</Text>
        </View>
      </Pressable>
    </View>
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