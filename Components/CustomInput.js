import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const CustomInput = ({
  value,
  setvalue,
  placeholder,
  secureTextEntry,
  style,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused, style]}>
      <TextInput
        value={value}
        onChangeText={setvalue}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.2,
    borderColor: "#E5E7EB",
    marginBottom: 12,

    // Sombra suave moderna
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  containerFocused: {
    borderColor: "#3B82F6", // azul elegante
    shadowColor: "#3B82F6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  input: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default CustomInput;
