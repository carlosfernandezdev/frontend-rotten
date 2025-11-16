import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const AddReview = ({ onSubmitReviewAndScore }) => {
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState("");

  const handleReviewSubmit = () => {
    if (!reviewText || !score) {
      alert("Por favor, completa tanto la reseña como la calificación.");
      return;
    }

    const numericScore = Number(score);

    if (numericScore >= 1 && numericScore <= 10) {
      onSubmitReviewAndScore(reviewText, numericScore);
      setReviewText("");
      setScore("");
    } else {
      alert("La calificación debe ser un número entre 1 y 10.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tu reseña</Text>
      <View style={styles.inputRow}>
        <MaterialCommunityIcons
          name="chat-plus-outline"
          size={22}
          color="#6B7280"
        />
        <TextInput
          style={styles.input}
          placeholder="Escribe qué te pareció..."
          placeholderTextColor="#9CA3AF"
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />
      </View>

      <Text style={styles.label}>Calificación (1–10)</Text>
      <View style={styles.scoreRow}>
        <TextInput
          style={styles.scoreInput}
          placeholder="1-10"
          placeholderTextColor="#9CA3AF"
          value={score}
          onChangeText={(input) => {
            const validScore = /^[0-9]$|^10$/.test(input);
            if (validScore || input === "") {
              setScore(input);
            }
          }}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.scoreHint}>Usa un número entero.</Text>
      </View>

      <Pressable style={styles.button} onPress={handleReviewSubmit}>
        <Text style={styles.buttonText}>Enviar reseña</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    minHeight: 60,
    textAlignVertical: "top",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreInput: {
    width: 60,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    textAlign: "center",
    paddingVertical: 4,
    fontSize: 14,
    color: "#111827",
  },
  scoreHint: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#4F46E5",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AddReview;
