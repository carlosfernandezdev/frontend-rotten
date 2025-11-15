import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export function SearchBar({ searchQuery, setSearchQuery, handleSearch }) {

  return (
    <View style={styles.searchContainer}>
      <AntDesign name="search1" size={24} color="white" />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={handleSearch} // Aquí sigue llamando a handleSearch
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#393c39',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingHorizontal: 10,
    height: 40,
  },
});