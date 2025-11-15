import React from "react";
import {useNavigation} from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable,ScrollView,ImageBackground,SafeAreaView, Image, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import CustomButton from '../../Components/CustomButton';
import Menu from '../../Components/Menu';
import fondo from '../../assets/fondo.png';
import logo from '../../assets/logo1.png'
import { fetchsito1 } from "../../utils/fetchMethod.js";


const Profile = () => {
  const [correo, setCorreo] = useState('correo@ejemplo.com');
  const [username, setUsername] = useState('Usuario');
  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetchsito1.get('/user/getUser');
        if (response.ok) {
          const {data} = await response.json();
          //console.log(data.username)
          setCorreo(data.email);
          setUsername(data.username);
        } else {
          console.error('Error al obtener la información del usuario');
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
  }, []);

  const handleUpdateUser = async ()=>{
    try{
      const response = await fetchsito1.put('/user/updateUser', {username, email: correo});
      if(response.ok){
        //console.log('fetch ok')
      }else{
        //console.log('fetch no ok')
      }
    }catch(error){
      console.error(error);
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if(isEditing){
      handleUpdateUser();
    }
  };
  

  const handleLogout = async ()=>{
    try{
      Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", onPress: async () => {
          const response = await fetchsito1.post('/user/logout');
          if(response.ok){
              //console.log('fetch ok')
              router.replace('login')
          }else{
              //console.log('fetch no ok')
          }
        } },
      ])
    }catch(error){
        console.error(error);
    }
}

const deleteAccount = async ()=>{
    try{
      Alert.alert("Borrar cuenta", "¿Estás seguro de que deseas borrar tu cuenta?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar mi cuenta", onPress: async () => {
          const response = await fetchsito1.delete('/user/deleteAccount');
          if(response.ok){
            Alert.alert("Cuenta borrada", "Tu cuenta ha sido borrada correctamente", [
              { text: "Aceptar", onPress: () => router.replace('login') },
            ])
              //console.log('fetch ok')
              //router.replace('login')
          }else{
              //console.log('fetch no ok')
          }
        } },
      ])
    }catch(error){
        console.error(error);
       }
    }


  return (
      <ImageBackground source={fondo} style={StyleSheet.absoluteFillObject}>
    <View style={{marginTop: 60 }}>          
        <Menu />
        </View>
        <SafeAreaView style={{ flex: 1, margin: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={logo} style={{ width: 100, height: 80 }} />
            <Text style={styles.Title}>Filmatic</Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <Text style={styles.title}>Perfil de Usuario</Text>
              <Ionicons name="person-circle-outline" size={100} color="white" style={styles.icon} />

              <View style={styles.infoContainer}>
                <View style={styles.editRow}>
                  <Text style={styles.sectionTitle}>Información del Usuario</Text>
                  <Pressable onPress={handleEditToggle}>
                    <Ionicons name={isEditing ? "checkmark" : "pencil"} size={24} color="white" />
                  </Pressable>
                </View>

                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Usuario"
                    />
                    <TextInput
                      style={styles.input}
                      value={correo}
                      onChangeText={setCorreo}
                      placeholder="Correo"
                      keyboardType="email-address"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Usuario: <Text style={styles.value}>{username}</Text></Text>
                    <Text style={styles.label}>Correo: <Text style={styles.value}>{correo}</Text></Text>
                  </>
                )}
                  <Link href="/validateMail">
                    <Text style={styles.signInText}>Cambiar contraseña</Text>
                </Link>
              </View>
              <View style={styles.ContainerButton}>
                <CustomButton
                  onPress={() => handleLogout()}
                  text="Cerrar sesión"
                  bgColor="transparent"
                  fgColor="white"
                />
                <CustomButton
                  onPress={() => deleteAccount()}
                  text="Borrar cuenta"
                  bgColor="transparent"
                  fgColor="white"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  Title: {
    padding: 10,
    fontSize: 30,
    color: 'white',
    marginLeft: 5,
    marginTop: 25,
    fontFamily: 'Bukhari-Script',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Garet',

  },signInText: {
    color: 'white',
    marginTop: 40,
    alignSelf: 'left',
    marginBottom: 20,
    textDecorationLine: 'overline',
    fontSize: 11,
},
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  icon: {
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#414141',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  value: {
    fontWeight: 'bold',
    color: 'white',
  },
  
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dd',
    fontSize: 16,
    paddingVertical: 5,
    marginBottom: 15,
    color: 'white',
  },
  ContainerButton: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default Profile;