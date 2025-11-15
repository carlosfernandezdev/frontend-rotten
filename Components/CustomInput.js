import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomInput = ({ value, setvalue, placeholder, secureTextEntry }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                value={value}
                onChangeText={setvalue}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                placeholderTextColor="white"
            />
            {secureTextEntry && (
                <Pressable
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.iconContainer}
                >
                    <Ionicons
                        name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                        size={24}
                        color="white"
                    />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)", 
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        height: 45,
        color: "white",
        fontSize: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: "white",
    },
    iconContainer: {
        marginLeft: 10,
    },
});

export default CustomInput;
