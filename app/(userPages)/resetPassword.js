import React, { useState } from "react";
import { View, Text, ImageBackground, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { Link, useNavigation, router } from "expo-router";
import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';
import fondo from '../../assets/fondo.png';
import logo from '../../assets/logo.png';
import { fetchsito1 } from '../../utils/fetchMethod';   

const ResetPassword = () => {
    const [password, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [error, setError] = useState("");
    const navigation = useNavigation();

    const onResetPasswordPressed = async () => {
        // Validación de los campos
        if (!password || !confirmarContrasena) {
            setError("Por favor, ingresa ambas contraseñas.");
            return;
        }

        if (password !== confirmarContrasena) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        // if (nuevaContrasena.length < 6) {
        //     setError("La contraseña debe tener al menos 6 caracteres.");
        //     return;
        // }

        try {
            // Aquí enviamos la nueva contraseña al backend para actualizarla
            const response = await fetchsito1.patch('/user/changePassword', { password });
            const contentType = response.headers.get("content-type");
            //console.log(contentType)
            const data = await response.json();
            
            if (response.ok) {
                //console.log('aqui')
                
                Alert.alert("Éxito", "Tu contraseña ha sido actualizada.");
                router.navigate("login");  // O redirigir a la página de login
            } else {
                //console.log('aca')
                //console.log(data)
                setError(data.error || "Hubo un problema al actualizar la contraseña.");
            }
        } catch (error) {
            console.error('error en la pantalla:',error);
            setError("Error al conectar con el servidor.");
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

                    <Text style={styles.subTitle1}>Restablecer Contraseña</Text>
                    <Text style={styles.subTitle}>
                        Ingresa tu nueva contraseña para completar el proceso de recuperación.
                    </Text>

                    <View style={styles.container}>
                        <CustomInput
                            placeholder="Nueva Contraseña"
                            value={password}
                            setvalue={setNuevaContrasena}
                            style={styles.input}
                            secureTextEntry
                        />
                        <CustomInput
                            placeholder="Confirmar Contraseña"
                            value={confirmarContrasena}
                            setvalue={setConfirmarContrasena}
                            style={styles.input}
                            secureTextEntry
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <CustomButton text="Restablecer Contraseña" onPress={onResetPasswordPressed} />
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
    input: {
        marginBottom: 15,
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

export default ResetPassword;
