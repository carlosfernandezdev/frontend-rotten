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
                    <Text style={styles.modalTitle}>Editar Reseña</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.reviewInput}
                            placeholderTextColor="#ccc"
                            value={editedReview}
                            onChangeText={setEditedReview}
                            maxHeight={100}
                            scrollEnabled
                            multiline
                        />

                        <TextInput
                            style={styles.scoreInput}
                            placeholderTextColor="white"
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
                        <Button title="Cancelar" onPress={onClose} />
                        <Button title="Guardar" onPress={handleSave} />
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "#393c39",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        color: "white",
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    reviewInput: {
        flex: 1,
        backgroundColor: "grey",
        color: "white",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    scoreInput: {
        width: 60,
        backgroundColor: "grey",
        color: "white",
        padding: 10,
        borderRadius: 5,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
});

export default ModalEditReview;