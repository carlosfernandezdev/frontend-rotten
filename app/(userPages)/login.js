import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Link, router } from 'expo-router';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import logo from '../../assets/logo.png';
import { fetchsito1 } from '../../utils/fetchMethod';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSignInPressed = async () => {
    if (!username || !password) {
      setError('Por favor, llena todos los campos');
      return;
    }

    try {
      const response = await fetchsito1.post('/user/login', { username, password });
      const data = await response.json?.();

      if (response.ok) {
        setError('');
        router.replace('home');
      } else {
        setError(data?.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor');
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
              <Text style={styles.appTagline}>Tu medidor de pelis y series</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Iniciar sesión</Text>

          {/* Form */}
          <View style={styles.form}>
            <CustomInput
              value={username}
              setvalue={setUsername}
              placeholder="Usuario"
            />
            <CustomInput
              value={password}
              setvalue={setPassword}
              placeholder="Contraseña"
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <CustomButton text="Acceder" onPress={onSignInPressed} />
          </View>

          {/* Links */}
          <View style={styles.linksBlock}>
            

            <Link href="/register">
              <Text style={styles.linkText}>
                ¿No tienes cuenta?{' '}
                <Text style={styles.linkAccent}>Regístrate</Text>
              </Text>
            </Link>
          </View>

          <Text style={styles.footerHint}>
            ★ Descubre qué tan “fresca” está tu próxima película.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Fondo general clarito, como el home
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

  // Tarjeta principal
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

  // Header con logo + texto
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

  // Título de la sección
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
  },

  // Formulario
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

  // Bloque de links
  linksBlock: {
    marginTop: 4,
    gap: 8,
  },
  linkText: {
    color: '#4B5563',
    fontSize: 13,
  },
  linkAccent: {
    color: '#EF4444',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  // Frase final
  footerHint: {
    marginTop: 18,
    fontSize: 11,
    color: '#9CA3AF',
  },
});

export default Login;
