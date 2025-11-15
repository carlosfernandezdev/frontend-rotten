import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { Link, useNavigation, router } from "expo-router";
import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';
import fondo from '../../assets/fondo.png';
import logo from '../../assets/logo.png';
import { fetchsito1 } from '../../utils/fetchMethod';

const ForgotPassword = () => {
    const [pregunta, setPregunta] = useState("");
    const [answer, setRespuesta] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        // Recuperar la pregunta de seguridad desde el backend
        const fetchQuestion = async () => {
            try {
                const response = await fetchsito1.get('/user/getSecurityQuesiton');
                //const response = await fetch('http://192.168.0.103:3000/user/getSecurityQuestion')
                ////console.log(response)
                
                ////console.log('data essssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', data)
                const contentType = response.headers.get("content-type");
                //console.log(contentType)
                
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    if (response.ok) {
                        setPregunta(data.question);  // Asume que el backend devuelve la pregunta
                    } else {
                        setError("Error al recuperar la pregunta de seguridad");
                    }
                } else {
                    setError("Respuesta inesperada del servidor");
                }
            } catch (error) {
                console.error(error);
                setError("Hubo un problema al conectar con el servidor");
            }
        };

        fetchQuestion();
    }, []);

    const onSendPressed = async () => {
        // Validar que se haya ingresado una respuesta
        if (!answer) {
            setError("Por favor, ingresa tu respuesta");
            return;
        }

        try {
            // Validar la respuesta con el backend
            const response = await fetchsito1.post("/user/answerSecurityQuestion", { answer });
            const contentType = response.headers.get("content-type");
            //console.log(contentType)
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    setError("");
                    Alert.alert("Verificación exitosa", "La respuesta es correcta.");
                    // Aquí puedes redirigir al usuario a la siguiente pantalla
                    router.navigate("resetPassword");
                } else {
                    setError(data.error || "Respuesta incorrecta");
                }
            } else {
                setError("Respuesta inesperada del servidor");
            }
        } catch (error) {
            console.error(error);
            setError("Error al validar la respuesta. Intenta nuevamente.");
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

                    <Text style={styles.subTitle1}>Cambio de Contraseña</Text>
                    <Text style={styles.subTitle}>Por favor, responde la pregunta de seguridad para continuar</Text>

                    <View style={styles.container}>
                        <Text style={styles.securityQuestion}>{`¿${pregunta}?` || "Cargando pregunta de seguridad..."}</Text>

                        <CustomInput
                            placeholder="Ingrese su respuesta"
                            value={answer}
                            setvalue={setRespuesta}
                            style={styles.input}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <CustomButton text="Enviar" onPress={onSendPressed} />
                    </View>

                    <Link href="/login" style={styles.signInLink}>Ir a login</Link>
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
    subTitle1: {
        color: 'white',
        fontSize: 25,
        marginBottom: 20,
        marginLeft: 15,
        marginTop: 10,
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
    securityQuestion: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    signInLink: {
        color: 'white',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});

export default ForgotPassword;
