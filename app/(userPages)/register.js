import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Alert, Image } from 'react-native';
import fondo from '../../assets/fondo.png';
import logo from '../../assets/logo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { Link, router } from 'expo-router';
import { fetchsito1 } from '../../utils/fetchMethod';

const Register = () => {
    const [email, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [Error, setError] = useState('');
    const [username, setUsername] = useState('');

    const onRegisterPressed = async () => {
        try {
            //console.log('kklkjlkjlk')
            if (!email || !password || !username) {
                setError('Por favor, llena todos los campos');
                return;
            }
            const response = await fetchsito1.post('/user/register', { username, email, password });
            const data = await response.json();
            //console.log(data);
            if (response.ok) {
                router.push({
                    pathname: 'register2',
                    params: { email }
                });
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ImageBackground source={fondo} style={styles.background}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Image source={logo} style={{ width: 100, height: 80 }} />
                    <Text style={styles.Title}>Filmatic</Text>
                </View>
                <Text style={styles.subTitle1}>Registro Paso 1</Text>

                <CustomInput
                    value={username}
                    setvalue={setUsername}
                    placeholder="Usuario"
                />


                <CustomInput
                    value={email}
                    setvalue={setCorreo}
                    placeholder="Correo"
                />

                <CustomInput
                    value={password}
                    setvalue={setPassword}
                    placeholder="Contraseña"
                    secureTextEntry
                />

                <Text style={styles.errorText}>{Error}</Text>

                <Text style={styles.signInText}>Al registrarte, confirmas que aceptas nuestros términos de uso y política de privacidad.</Text>

                <CustomButton text="Registrarse" onPress={onRegisterPressed} />

                <Link href="/login" style={styles.signInLink}>Volver al login</Link>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginTop: -120,
    },
    subTitle1: {
        color: 'white',
        fontSize: 25,
        marginBottom: 20,
        marginLeft: 15,
        marginTop: 10,
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
        marginBottom: 30,
        marginTop: 50,
    },
    title1: {
        color: 'white',
        fontSize: 25,
        alignSelf: 'center',
        fontFamily: 'Garet',
        marginBottom: 30,
    },
    subTitle: {
        color: 'white',
        fontSize: 25,
        marginBottom: 20,
        marginLeft: 15,
    },
 
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Garet',
    },
    errorText: {
        color: 'red',
    },
    signInText: {
        color: 'white',
        marginTop: 3,        
        alignSelf: 'center',
    },
    signInLink: {
        color: 'white',
        textDecorationLine: 'underline',
        marginTop: 10,
    }
});

export default Register;