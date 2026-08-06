import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from './Theme';

interface SettingsViewProps {
  theme: Theme;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  userLevel: string;
  setUserLevel: (val: string) => void;
  userName: string;
  profileImage: string | null;
  setProfileImage: (val: string | null) => void;
}

export const SettingsView = ({
  theme, isDarkMode, setIsDarkMode, userLevel, setUserLevel, userName, profileImage, setProfileImage
}: SettingsViewProps) => {
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const levels = ['A1-A2 Principiante', 'B1-B2 Intermedio', 'C1-C2 Avanzado'];

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const SettingItem = ({ icon, label, rightElement, onPress, color }: any) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.iconContainer, { backgroundColor: (color || theme.primary) + '15' }]}>
        <Ionicons name={icon} size={20} color={color || theme.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      {rightElement || <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
    </TouchableOpacity>
  );

  // --- SUB-VIEWS ---

  const renderPasswordView = () => (
    <View style={styles.subViewContainer}>
      <Text style={[styles.subTitle, { color: theme.text }]}>Cambiar Contraseña</Text>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Contraseña Actual</Text>
        <TextInput
          secureTextEntry
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="••••••••"
          placeholderTextColor={theme.textMuted}
        />
        <Text style={[styles.inputLabel, { color: theme.textMuted, marginTop: 15 }]}>Nueva Contraseña</Text>
        <TextInput
          secureTextEntry
          style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
          placeholder="Mínimo 8 caracteres"
          placeholderTextColor={theme.textMuted}
        />
      </View>
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
        onPress={() => {
          Alert.alert("Éxito", "Contraseña actualizada correctamente");
          setActiveSubView(null);
        }}
      >
        <Text style={styles.primaryBtnText}>Actualizar Contraseña</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPrivacyView = () => (
    <View style={styles.subViewContainer}>
      <Text style={[styles.subTitle, { color: theme.text }]}>Privacidad</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingItem
          icon="eye-off"
          label="Perfil Privado"
          color={theme.secondary}
          rightElement={<Switch value={false} trackColor={{ false: '#767577', true: theme.secondary }} />}
        />
        <SettingItem
          icon="share-social"
          label="Compartir Progreso"
          color={theme.success}
          rightElement={<Switch value={true} trackColor={{ false: '#767577', true: theme.success }} />}
        />
      </View>
      <Text style={[styles.infoText, { color: theme.textMuted }]}>
        Tu información personal nunca se comparte con terceros. Controla quién puede ver tus rachas y medallas en la comunidad.
      </Text>
    </View>
  );

  const renderHelpView = () => (
    <View style={styles.subViewContainer}>
      <Text style={[styles.subTitle, { color: theme.text }]}>Centro de Ayuda</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingItem icon="chatbubbles" label="Soporte por Chat" onPress={() => Alert.alert("Soporte", "Iniciando chat...")} />
        <SettingItem icon="mail" label="Enviar Email" onPress={() => Alert.alert("Soporte", "Abriendo correo...")} />
        <SettingItem icon="document-text" label="Preguntas Frecuentes" />
      </View>
      <View style={[styles.promoBox, { backgroundColor: theme.primary + '10' }]}>
        <Text style={[styles.promoText, { color: theme.primary }]}>¿Tienes problemas con el micrófono?</Text>
        <Text style={[styles.promoSub, { color: theme.textMuted }]}>Revisa los permisos de la app en los ajustes de tu iPhone.</Text>
      </View>
    </View>
  );

  if (activeSubView) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setActiveSubView(null)}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>Volver</Text>
        </TouchableOpacity>
        {activeSubView === 'password' && renderPasswordView()}
        {activeSubView === 'privacy' && renderPrivacyView()}
        {activeSubView === 'help' && renderHelpView()}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Configuración</Text>

      {/* Profile Section */}
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.avatarLarge} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.fullImage} />
          ) : (
            <Text style={styles.avatarText}>{userName[0]}</Text>
          )}
          <View style={styles.editIconBadge}>
             <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>
        <Text style={[styles.userEmail, { color: theme.textMuted }]}>jess.pirela@gmail.com</Text>
        <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.primary + '20' }]} onPress={pickImage}>
          <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 12 }}>Cambiar Foto</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>APARIENCIA Y NOTIFICACIONES</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingItem
          icon="moon"
          label="Modo Oscuro"
          color="#8b5cf6"
          rightElement={<Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#767577', true: '#8b5cf6' }} />}
        />
        <SettingItem
          icon="notifications"
          label="Notificaciones Push"
          color="#10b981"
          rightElement={<Switch value={true} trackColor={{ false: '#767577', true: '#10b981' }} />}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>NIVEL DE INGLÉS</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.levelItem, { borderBottomColor: theme.border }]}
            onPress={() => setUserLevel(level)}
          >
            <Text style={[styles.levelText, { color: userLevel === level ? theme.primary : theme.text }]}>{level}</Text>
            {userLevel === level && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>CUENTA Y SEGURIDAD</Text>
      <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <SettingItem icon="lock-closed" label="Cambiar Contraseña" color={theme.textMuted} onPress={() => setActiveSubView('password')} />
        <SettingItem icon="shield-checkmark" label="Privacidad" color={theme.textMuted} onPress={() => setActiveSubView('privacy')} />
        <SettingItem icon="help-circle" label="Centro de Ayuda" color={theme.textMuted} onPress={() => setActiveSubView('help')} />
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.error + '15' }]}>
        <Ionicons name="log-out" size={20} color={theme.error} />
        <Text style={[styles.logoutText, { color: theme.error }]}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: theme.textMuted }]}>EasyGo Academy v1.0.4 • Build 54</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 24 },
  profileCard: { padding: 24, borderRadius: 24, alignItems: 'center', borderWidth: 1, marginBottom: 30 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative' },
  fullImage: { width: 80, height: 80, borderRadius: 40 },
  editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#8b5cf6', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#1e293b' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
  userName: { fontSize: 20, fontWeight: '800' },
  userEmail: { fontSize: 14, marginBottom: 15 },
  editBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: 10, marginLeft: 10 },
  section: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  levelItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  levelText: { fontSize: 14, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 20, gap: 10, marginTop: 10 },
  logoutText: { fontSize: 16, fontWeight: '800' },
  version: { textAlign: 'center', fontSize: 11, marginTop: 24 },

  // Sub-views styles
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  backText: { fontSize: 16, fontWeight: '700' },
  subViewContainer: { marginTop: 10 },
  subTitle: { fontSize: 24, fontWeight: '800', marginBottom: 25 },
  inputGroup: { marginBottom: 30 },
  inputLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginLeft: 4 },
  input: { padding: 16, borderRadius: 16, borderWidth: 1, fontSize: 16 },
  primaryBtn: { padding: 18, borderRadius: 20, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  infoText: { fontSize: 13, lineHeight: 20, textAlign: 'center', paddingHorizontal: 20 },
  promoBox: { padding: 20, borderRadius: 20, marginTop: 20 },
  promoText: { fontWeight: '800', fontSize: 14, marginBottom: 4 },
  promoSub: { fontSize: 12 },
});
