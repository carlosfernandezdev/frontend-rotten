import { View, Text,ImageBackground, StyleSheet, Image } from 'react-native';
import React, {useState} from 'react';
import {Link} from 'expo-router';
import fondo from '../../assets/fondo.png';
import logo from '../../assets/logo.png'
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { fetchsito1 } from '../../utils/fetchMethod.js';
import { router } from 'expo-router';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const navigation = useNavigation();

    async function onSingInPressed() {
        try {
            //console.log('hare el fetch');
            //console.log(username);
            //console.log(password);
            const response = await fetchsito1.post('/user/login', { username, password });
            if(!username || !password){
                setError('Por favor, llena todos los campos');
                return
            }
            //console.log('fetch hecho');
            const data = await response.json();
            //console.log(response);
            if (response.ok) {
                //console.log('ahora deberia llevarte a home');
                router.navigate('home');
                //console.log(data);
            } else {
                //console.log(data);
                console.error(data.error);
                setError(data.error);
            }
            
            //console.log(data);
        } catch (error) {
            console.error(error);
        }
    }


  return (
    <ImageBackground source={fondo} style={styles.background}>
            <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Image source={logo} style={{width: 100, height: 80}} />
            <Text style={styles.Title}>Filmatic</Text>
            </View>
        <Text style={styles.subTitle}>Iniciar sesión</Text>
        <CustomInput
            value={username}
            setvalue={setUsername}
            placeholder="Usuario"
        />
        <CustomInput
            value={password}
            setvalue={setPassword}
            placeholder="Contraseña"
            secureTextEntry // Esto activa la funcionalidad de mostrar/ocultar contraseña
        />

        <Text style={styles.error}>
            {error}
        </Text>

        <CustomButton 
            text="Acceder"
            onPress={onSingInPressed}
        />
        <Link href="/validateMail">
            <Text style={styles.ForgotPassword}>
                ¿Olvidaste tu contraseña? <Text style={styles.signInLink}>Ingresa aquí</Text>
            </Text>
        </Link>
        <Link href="/register">
            <Text style={styles.signInText}> 
                ¿No tienes cuenta? <Text style={styles.signInLink}>Regístrate aquí</Text>
            </Text>
        </Link>
        
        {/* <Link href="/index" >home</Link> */}

    </View>
</ImageBackground>
  )
}
const styles = StyleSheet.create({

background: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
container: {
    width: '80%',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 20,
    marginTop: -120,
},
title: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Garet',
    alignSelf: 'center',
    marginBottom: 40,
},
error: {
    color: 'red',
    marginBottom: 10,
},
Title: {
    padding: 10,
    fontSize: 30,
    color: 'white',
    marginLeft: 5,
    marginTop: 25,
    fontFamily: 'Bukhari-Script',
  },
subTitle: {
    color: 'white',
    fontSize: 25,
    marginBottom: 20,
    marginLeft: 15,
},
button: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
},
buttonText: {
    color: 'white',
    fontSize: 16,
},

ForgotPassword: {
    color: 'white',
    marginTop: 15,
    alignSelf: 'left',
},

signInText: {
    color: 'white',
    marginTop: 40,
    alignSelf: 'left',
    marginBottom: 20,
},
signInLink: {
    marginTop: 10,
    color: 'white',
    textDecorationLine: 'underline',
    marginLeft: 96,    
},
});
export default Login