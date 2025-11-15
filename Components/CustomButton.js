import React from "react";
import {View, Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({onPress, text, type= "Primary" , bgColor, fgColor}) => {
    return (
        <Pressable onPress={onPress} 
        style={[styles.container, 
        styles['container_${type}'],
        bgColor ? {backgroundColor : bgColor} : {},
        ]}>

        <Text style={[styles.Text,
        styles['text_${type}'],
        fgColor ? {color : fgColor} : {}
        ]}>{text}</Text>

        </Pressable>
    );
};   

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 30,
        alignSelf: 'center',
        marginTop: 11,
        marginBottom: 7,
    },

    container_Primary: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 30,
        alignSelf: 'center',
        marginTop: 11,
        marginBottom: 7,
    },  

    container_Secundary: {
       backgroundColor: '#faae97',
       borderRadius: 5,
       borderColor: 'white',
       borderWidth: 1,
       paddingVertical: 10,
       paddingHorizontal: 30,
       alignSelf: 'center',
       marginTop: 11,
       marginBottom: 7,
    },  

    Text: {
        color: 'white',
        fontSize: 18,
    },
    Text_Tertiaty: {
        color: 'grey',
        fontSize: 16,
    },
});

export default CustomButton;