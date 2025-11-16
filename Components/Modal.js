import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const ModalEditReview = ({ isVisible, onClose, onSave, review }) => {
  const [editedReview, setEditedReview] = useState(review.quote);
  const [editedScore, setEditedScore] = useState(review.rating.toString());

  useEffect(() => {
    setEditedReview(review.quote);
    setEditedScore(review.rating.toString());
  }, [review]);

  const handleSave = () => {
    onSave(editedReview, editedScore);
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar reseña</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Escribe tu reseña..."
              placeholderTextColor="#9CA3AF"
              value={editedReview}
              onChangeText={setEditedReview}
              maxHeight={120}
              scrollEnabled
              multiline
            />

            <TextInput
              style={styles.scoreInput}
              placeholder="1-10"
              placeholderTextColor="#6B7280"
              value={editedScore}
              onChangeText={(input) => {
                const validScore = /^[0-9]$|^10$/.test(input);
                if (validScore || input === "") {
                  setEditedScore(input);
                }
              }}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.modalActions}>
            <View style={styles.buttonWrapper}>
              <Button title="Cancelar" onPress={onClose} color="#9CA3AF" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Guardar" onPress={handleSave} color="#4F46E5" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.55)", // overlay más suave
  },
  modalContainer: {
    width: "90%",
    maxWidth: 360,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  reviewInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    color: "#111827",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 80,
  },
  scoreInput: {
    width: 60,
    backgroundColor: "#EEF2FF",
    color: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonWrapper: {
    marginLeft: 10,
  },
});

export default ModalEditReview;
