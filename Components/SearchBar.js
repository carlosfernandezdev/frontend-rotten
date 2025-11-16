import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export function SearchBar({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <View style={styles.container}>
      <AntDesign name="search1" size={18} color="#6B7280" />
      <TextInput
        style={styles.input}
        placeholder="Buscar películas o series..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,

    // Sombrita ligera
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 4,
  },
});
