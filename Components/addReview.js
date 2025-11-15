import React, { useState } from "react";
import { TextInput, Button, StyleSheet, View, Text, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const AddReview = ({ onSubmitReviewAndScore }) => {
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState("");

  const handleReviewSubmit = () => {
    if (!reviewText || !score) {
      alert("Por favor, complete tanto la reseña como la calificación.");
      return;
    }

    if (score >= 1 && score <= 10) {
      onSubmitReviewAndScore(reviewText, score);
      setReviewText("");
      setScore("");
    } else {
      alert("La calificación debe ser un número entre 1 y 10.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agrega una reseña y calificación</Text>
      <View style={styles.containerInput}>
        <MaterialCommunityIcons name="chat-plus-outline" size={30} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Escribe tu reseña"
          placeholderTextColor="gray"
          value={reviewText}
          onChangeText={setReviewText}
          multiline
          maxHeight={100}
          scrollEnabled
        />
        <View style={styles.scoreContainer}>
          <TextInput
            style={styles.scoreInput}
            placeholder="1-10"
            placeholderTextColor="white"
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
        </View>
      </View>
      <Button title="Enviar reseña y calificación" onPress={handleReviewSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#151715",
    borderRadius: 8,
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151715",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingVertical: 5,
    fontSize: 16,
  },
  scoreContainer: {
    backgroundColor: "#3b3c39",
    borderRadius: 10,
    padding: 8,
    marginLeft: 10,
  },
  scoreInput: {
    color: "#fff",
    textAlign: "center",
    width: 40,
  },
});

export default AddReview;