import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({
  onPress,
  text,
  type = "Primary",
  bgColor,
  fgColor,
}) => {
  const containerStyle = styles[`container_${type}`] || styles.container_Primary;
  const textStyle = styles[`text_${type}`] || styles.text_Primary;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.containerBase,
        containerStyle,
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
    >
      <Text
        style={[
          styles.textBase,
          textStyle,
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({

  containerBase: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  // ⭐ BOTÓN CON COLOR FIJO SIEMPRE
  container_Primary: {
    backgroundColor: "#FF4B5C",   // 🔥 ROJO
    borderColor: "#FF4B5C",
  },

  container_Secondary: {
    backgroundColor: "#4C6FFF",
    borderColor: "#4C6FFF",
  },

  container_Tertiary: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },

  textBase: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },

  text_Primary: {
    color: "white",
  },

  text_Secondary: {
    color: "white",
  },

  text_Tertiary: {
    color: "#9ca3af",
  },
});

export default CustomButton;
