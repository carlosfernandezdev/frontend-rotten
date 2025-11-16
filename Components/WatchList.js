import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { fetchsito1 } from "../utils/fetchMethod.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function WatchList({ item, source }) {  // 'item' puede ser película o serie
  const [watchList, setWatchList] = useState([]);

  const addToWatchList = async () => {
    try {
      const response = await fetchsito1.post('/film/postFilm', {
        ...item,
        fromReview: false,
        source,
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert(`${item.title} añadido a tu WatchList`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable
      onPress={addToWatchList}
      style={styles.button}
      android_ripple={{ color: '#E0E7FF' }}
    >
      <View style={styles.contentRow}>
        <MaterialIcons
          name="add-circle-outline"
          size={18}
          color="#4F46E5" // acento violeta
        />
        <Text style={styles.text}>WatchList</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',   // fondo lavanda claro
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,            // pill
    marginTop: 6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#111827',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
});
