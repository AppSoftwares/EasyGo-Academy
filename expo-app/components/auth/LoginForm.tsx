import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export const LoginForm = ({ onSwitchToRegister, onForgotPassword }: { onSwitchToRegister: () => void; onForgotPassword: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>EG</Text>
        </View>
        <Text style={styles.title}>Bienvenido de vuelta</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar aprendiendo</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

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

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O continúa con</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]}>
            <Ionicons name="logo-apple" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text style={styles.linkText}>Regístrate gratis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 64, height: 64, backgroundColor: '#5B2ECC', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef444415', padding: 12, borderRadius: 12, marginBottom: 24, gap: 8 },
  errorText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, padding: 16, color: '#fff', fontSize: 15 },
  forgotPassword: { alignSelf: 'flex-end', marginTop: -8 },
  forgotPasswordText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  loginButton: { backgroundColor: '#5B2ECC', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#334155' },
  dividerText: { color: '#64748b', marginHorizontal: 16, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  socialContainer: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, height: 56, borderRadius: 16, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', borderWeight: 1, borderColor: '#475569' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#94a3b8', fontSize: 14 },
  linkText: { color: '#5B2ECC', fontWeight: '700', fontSize: 14 },
});
