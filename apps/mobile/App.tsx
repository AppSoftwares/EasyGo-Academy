/* Creado por Jesús Pirela */
/**
 * Punto de entrada principal con In-App Updates y Branding
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, SafeAreaView } from 'react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

export default function App() {
  const version = Constants.expoConfig?.version || '1.0.0';

  // SECCIÓN 10: In-App Updates (Obligatorias/Invitación)
  useEffect(() => {
    async function checkUpdates() {
      if (__DEV__) return; // No chequear en desarrollo

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            "Actualización Disponible",
            "Hemos lanzado mejoras críticas. ¿Deseas actualizar ahora para no perder tu progreso?",
            [
              {
                text: "Actualizar",
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                }
              }
            ]
          );
        }
      } catch (error) {
        console.warn("Error verificando actualizaciones:", error);
      }
    }
    checkUpdates();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* REGLA DEL LOGO: Isotipo si el espacio es reducido */}
        <Image
          source={require('./assets/branding/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Bienvenido a EasyGo Academy</Text>
        <Text style={styles.subtitle}>Tu camino al inglés profesional empieza aquí.</Text>

        {/* SECCIÓN 7: Versión automática */}
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v{version}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>/* Creado por Jesús Pirela */</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // Padding mínimo 16dp
  },
  logo: {
    width: 120, // Tamaño mínimo logo completo
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  versionBadge: {
    marginTop: 32,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
  }
});
