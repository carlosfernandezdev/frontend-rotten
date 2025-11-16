import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchsito1 } from "../utils/fetchMethod.js";
import eventEmitter from "../utils/EventEmitter.js";

export function RemoveWatchList({ item, source }) {

  const removeFromWatchList = async () => {
    try {
      const response = await fetchsito1.post('/user/deleteFromWatchlist', { filmId: item._id });
      const data = await response.json();

      if (response.ok) {
        eventEmitter.emit('removeFromWatchList');
        Alert.alert("Listas", `${item.title} fue eliminado de tu Watchlist.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable onPress={removeFromWatchList} style={styles.button}>
      <MaterialIcons name="remove-circle-outline" size={20} color="#B91C1C" />
      <Text style={styles.text}>Quitar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FEE2E2",        // rojito pastel suave
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: "flex-start",
    gap: 6,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    color: "#B91C1C",  // rojo oscuro
    fontSize: 14,
    fontWeight: "600",
  },
});
