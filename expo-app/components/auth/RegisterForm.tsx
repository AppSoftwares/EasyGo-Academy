import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export const RegisterForm = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    await register({ name, email, password, phone });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>EG</Text>
        </View>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Text style={styles.subtitle}>Únete a la academia para dominar el inglés</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
          />
        </View>

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
          <Ionicons name="phone-portrait-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Teléfono (opcional)"
            placeholderTextColor="#64748b"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mín. 6 caracteres)"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>CREAR CUENTA</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>O regístrate con</Text>
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
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.linkText}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingVertical: 60 },
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
  registerButton: { backgroundColor: '#e3504a', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  registerButtonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#334155' },
  dividerText: { color: '#64748b', marginHorizontal: 16, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  socialContainer: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, height: 56, borderRadius: 16, backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', borderWeight: 1, borderColor: '#475569' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#94a3b8', fontSize: 14 },
  linkText: { color: '#e3504a', fontWeight: '700', fontSize: 14 },
});
