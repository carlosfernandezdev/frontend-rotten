import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Link, router } from 'expo-router';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import logo from '../../assets/logo.png';
import { fetchsito1 } from '../../utils/fetchMethod';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onRegisterPressed = async () => {
    if (!username || !email || !password) {
      setError('Por favor, llena todos los campos');
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(email)) {
      setError('Por favor, ingresa un correo válido');
      return;
    }

    try {
      const response = await fetchsito1.post('/user/register', {
        username,
        email,
        password,
      });
      const data = await response.json?.();

      if (response.ok) {
        setError('');
        router.replace('login');
      } else {
        setError(data?.error || 'No se pudo completar el registro');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.logoWrapper}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.appTitle}>RedMeter</Text>
              <Text style={styles.appTagline}>Crea tu cuenta para puntuar</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Registro</Text>

          {/* Form */}
          <View style={styles.form}>
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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton text="Crear cuenta" onPress={onRegisterPressed} />
          </View>

          {/* Links */}
          <View style={styles.linksBlock}>
            <Link href="/login">
              <Text style={styles.linkText}>
                ¿Ya tienes cuenta?{' '}
                <Text style={styles.linkAccent}>Inicia sesión</Text>
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // MISMO ESTILO CLARO QUE EL LOGIN NUEVO
  screen: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // CARD PRINCIPAL
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  logoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
  },
  appTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
  appTagline: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },

  // TÍTULO
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
  },

  // FORM
  form: {
    width: '100%',
    gap: 10,
    marginBottom: 18,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },

  // LINKS
  linksBlock: {
    marginTop: 6,
  },
  linkText: {
    color: '#4B5563',
    fontSize: 13,
  },
  linkAccent: {
    color: '#3B82F6', // azul suave bonito
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

export default Register;
