import React, { useState } from "react";
import { View, Text, ImageBackground, StyleSheet, ScrollView, Image } from "react-native";
import { Link, useLocalSearchParams, router } from "expo-router";
import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';
import fondo from '../../assets/fondo.png';
import logo from '../../assets/logo.png';
import { fetchsito1 } from '../../utils/fetchMethod';

const ForgotPassword = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnwser] = useState("");
    const [error, setError] = useState("");
    const { email } = useLocalSearchParams(); // Recibe el parámetro email
    //console.log(email);

    const onSendPressed = async () => {
        try {
            if (!question || !answer) {
                setError("Por favor, llena todos los campos");
                return;
            }
            //console.log(question, answer);
            const response = await fetchsito1.post("/user/setSecurityQuestion", { email, question, answer });
            const data = await response.json();
            if (response.ok) {
                router.navigate("login");
            } else {
                setError(data.error);
            }
            //console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageBackground source={fondo} style={styles.background}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.root}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={logo} style={{ width: 100, height: 80 }} />
                        <Text style={styles.Title}>Filmatic</Text>
                    </View>
                    <Text style={styles.subTitle1}>Registro Paso 2</Text>
                    <Text style={styles.subTitle}>Para terminar el proceso de registro ingrese una pregunta y respuesta en caso de pérdida para recuperar la contraseña</Text>
                    <View style={{ ...styles.container, width: "100%" }}>
                        <CustomInput
                            placeholder="Ingrese la pregunta"
                            value={question}
                            setvalue={setQuestion}
                            style={styles.input}
                        />
                        <CustomInput
                            placeholder="Ingrese la respuesta"
                            value={answer}
                            setvalue={setAnwser}
                            style={styles.input}
                        />
                        <CustomButton text="Enviar" onPress={onSendPressed} />
                    </View>
                    {/* <Link href="/login" style={styles.signInLink}>Ir a login</Link> */}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        marginTop: 100,
    },
    Title: {
        padding: 10,
        fontSize: 30,
        color: 'white',
        marginLeft: 5,
        marginTop: 25,
        fontFamily: 'Bukhari-Script',
      },
    title: {
        color: 'white',
        fontSize: 30,
        alignSelf: 'center',
        fontFamily: 'Garet',
        marginBottom: 40,
        marginTop: 50,
    },
    subTitle: {
        color: 'white',
        fontSize: 16,
        alignSelf: 'center',
        padding: 20,
    },
    container: {
        justifyContent: 'center',
        padding: 1,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    subTitle1: {
        color: 'white',
        fontSize: 25,
        marginBottom: 20,
        marginLeft: 15,
        marginTop: 10,
    },
    text: {
        fontSize: 24,
        color: 'white',
    },
    signInLink: {
        color: 'white',
        textDecorationLine: 'underline',
        marginLeft: 10,  
    },
});

export default ForgotPassword;