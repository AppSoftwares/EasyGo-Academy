import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export const ForgotPasswordForm = ({ onBackToLogin }: { onBackToLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { forgotPassword, isLoading, error } = useAuthStore();

  const handleReset = async () => {
    if (!email) return;
    const result = await forgotPassword(email);
    if (result.success) {
      setSuccessMessage(result.message || 'Se han enviado instrucciones a tu correo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>EG</Text>
        </View>
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitle}>No te preocupes, dinos tu correo y te ayudaremos.</Text>
      </View>

      {error && (
        <View style={[styles.messageContainer, styles.errorBg]}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {successMessage && (
        <View style={[styles.messageContainer, styles.successBg]}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {!successMessage ? (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>ENVIAR INSTRUCCIONES</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.resetButton} onPress={onBackToLogin}>
          <Text style={styles.resetButtonText}>VOLVER AL LOGIN</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 64, height: 64, backgroundColor: '#5B2ECC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  messageContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 24, gap: 8 },
  errorBg: { backgroundColor: '#ef444415' },
  successBg: { backgroundColor: '#10b98115' },
  errorText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  successText: { color: '#10b981', fontSize: 13, fontWeight: '600' },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, padding: 16, color: '#fff', fontSize: 15 },
  resetButton: { backgroundColor: '#5B2ECC', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  resetButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  backButton: { alignItems: 'center', marginTop: 16 },
  backButtonText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
});
