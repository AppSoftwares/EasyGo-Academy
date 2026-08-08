import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity,
  View, Dimensions, Switch, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator,
  BackHandler
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Layers (Capa de Datos y Estilos)
import { INITIAL_VOCABULARY, INITIAL_LESSONS, Lesson } from './data';
import { VocabularyItem } from './types';
import { getTheme } from './Theme';
import { SettingsView } from './SettingsView';

// Auth & Store
import { useAuthStore } from './store/useAuthStore';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';

const { width, height } = Dimensions.get('window');

export default function App() {
  // Auth State
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Capa de Estado
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);

  // Derivados de Auth
  const userXp = user?.points || 0;
  const userStreak = user?.streak || 0;
  const userLevel = user?.assignedLevel || 'A1-A2 Principiante';
  const userName = user?.name || 'Estudiante';
  const profileImage = user?.photo || null;

  // Theme Layer
  const theme = getTheme(isDarkMode);

  // Quiz state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Scanner state
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Community state
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    const backAction = () => {
      if (activeLesson) {
        setActiveLesson(null);
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [activeLesson, activeTab]);

  const triggerTTS = (text: string) => {
    Speech.speak(text, { language: 'en-US', rate: 0.9 });
  };

  // Pantalla de Carga
  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a041e', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B2ECC" />
      </View>
    );
  }

  // Pantallas de Autenticación
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0a041e' }}>
          <StatusBar style="light" />
          {authMode === 'login' ? (
            <LoginForm
              onSwitchToRegister={() => setAuthMode('register')}
              onForgotPassword={() => setAuthMode('forgot-password')}
            />
          ) : authMode === 'register' ? (
            <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
          ) : (
            <ForgotPasswordForm onBackToLogin={() => setAuthMode('login')} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const renderContent = () => {
    if (activeLesson) return renderQuiz();

    switch (activeTab) {
      case 'home': return renderHome();
      case 'lessons': return renderLessons();
      case 'practice': return renderPractice();
      case 'scanner': return renderScanner();
      case 'community': return renderCommunity();
      case 'progress': return renderStats();
      case 'profile': return (
        <SettingsView
          theme={theme}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          userLevel={userLevel}
          setUserLevel={() => {}} // Bloqueado por auth real
          userName={userName}
          profileImage={profileImage}
          setProfileImage={() => {}} // Bloqueado por auth real
        />
      );
      default: return renderHome();
    }
  };

  const renderHome = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.brandText, { color: theme.text }]}>EasyGo <Text style={{color: theme.primary}}>Academy</Text></Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>¡Hola, {userName.split(' ')[0]}!</Text>
        </View>
        <View style={styles.headerIcons}>
          <View style={[styles.miniStat, { backgroundColor: theme.card }]}>
             <Ionicons name="flame" size={16} color={theme.primary} />
             <Text style={[styles.miniStatText, { color: theme.text }]}>{userStreak}d</Text>
          </View>
          <View style={[styles.miniStat, { backgroundColor: theme.card }]}>
             <Ionicons name="trophy" size={16} color={theme.secondary} />
             <Text style={[styles.miniStatText, { color: theme.text }]}>{userXp}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.dashboardCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.statLabel}>NIVEL DE CONVERSACIÓN</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{userLevel} 🎓</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>PRO</Text></View>
        </View>

        <View style={styles.progressContainer}>
           <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Próximo Hito Survival:</Text>
              <Text style={[styles.progressText, { fontWeight: '700', color: theme.text }]}>{Math.round((userXp % 1000) / 10)}%</Text>
           </View>
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(userXp % 1000) / 10}%` }]} />
           </View>
           <Text style={styles.progressSub}>Siguiente nivel en {1000 - (userXp % 1000)} XP</Text>
        </View>
      </View>

      <View style={styles.actionGrid}>
        {[
          { id: 'practice', label: 'Hablar', icon: 'mic', color: theme.primary },
          { id: 'scanner', label: 'Escanear', icon: 'camera', color: '#818cf8' },
          { id: 'lessons', label: 'Lecciones', icon: 'book', color: theme.secondary },
          { id: 'community', label: 'Comunidad', icon: 'people', color: '#10b981' }
        ].map(item => (
          <TouchableOpacity key={item.id} style={styles.actionItem} onPress={() => setActiveTab(item.id)}>
            <View style={[styles.actionIcon, { backgroundColor: item.color + '20', borderColor: item.color + '40' }]}>
               <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.textMuted }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: theme.card, borderRadius: 24, padding: 20, marginTop: 20 }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Misiones Diarias 🎯</Text>
        {[
          { id: 1, title: 'AI Trivia 🌟', desc: 'Responde una trivia de tu Host', xp: 50, done: false },
          { id: 2, title: 'EasyGo Lens 🛒', desc: 'Escanea 1 nuevo objeto', xp: 50, done: true },
          { id: 3, title: 'Práctica Survival 📖', desc: 'Completa 1 lección', xp: 50, done: false }
        ].map(m => (
          <View key={m.id} style={[styles.missionItem, { borderColor: theme.border }]}>
            <Ionicons name={m.done ? "checkmark-circle" : "ellipse-outline"} size={22} color={m.done ? theme.success : theme.textMuted} />
            <View style={{flex: 1, marginLeft: 12}}>
              <Text style={[styles.missionTitle, { color: theme.text, textDecorationLine: m.done ? 'line-through' : 'none' }]}>{m.title}</Text>
              <Text style={[styles.missionDesc, { color: theme.textMuted }]}>{m.desc}</Text>
            </View>
            <Text style={[styles.missionXp, { color: theme.primary }]}>+{m.xp} XP</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderPractice = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.title, { color: theme.text }]}>Pierde el Miedo</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>Práctica Oral Interactiva</Text>

      <View style={[styles.practiceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
         <View style={styles.hostAvatar}>
            <Text style={{fontSize: 40}}>🤙</Text>
         </View>
         <Text style={[styles.hostName, { color: theme.text }]}>Santi, El Amigazo</Text>
         <Text style={[styles.hostMsg, { color: theme.textMuted }]}>"¡Hola, parce! ¿Listo para soltar la lengua hoy? Vamos a practicar inglés de la calle."</Text>
         <TouchableOpacity style={styles.button} onPress={() => triggerTTS("Hello bro, are you ready to practice English today?")}>
            <Text style={styles.buttonText}>Empezar Conversación</Text>
         </TouchableOpacity>
      </View>

      <View style={{marginTop: 24}}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Escenarios de Rol</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -20, paddingHorizontal: 20}}>
          {['Restaurante 🍽️', 'Supermercado 🛍️', 'Entrevista 💼', 'Doctor 🏥'].map(scen => (
            <TouchableOpacity key={scen} style={[styles.scenarioChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.scenarioText, { color: theme.text }]}>{scen}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );

  const renderScanner = () => {
    if (showCamera && permission?.granted) {
      return (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="back">
             <View style={styles.hudContainer}>
                <View style={styles.hudFrame}>
                   <View style={[styles.hudCorner, { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 }]} />
                   <View style={[styles.hudCorner, { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 }]} />
                   <View style={[styles.hudCorner, { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 }]} />
                   <View style={[styles.hudCorner, { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 }]} />
                </View>
                <TouchableOpacity style={styles.closeCamera} onPress={() => setShowCamera(false)}>
                   <Ionicons name="close-circle" size={44} color="#fff" />
                </TouchableOpacity>
             </View>
          </CameraView>
        </View>
      );
    }

    return (
      <View style={[styles.scrollContent, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="camera-outline" size={100} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>EasyGo Lens</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted, textAlign: 'center', paddingHorizontal: 40 }]}>
          Apunta a un objeto para descubrir su nombre y pronunciación.
        </Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 30 }]}
          onPress={async () => {
            const { status } = await requestPermission();
            if (status === 'granted') setShowCamera(true);
            else alert('Necesitamos permiso para usar la cámara');
          }}
        >
          <Text style={styles.buttonText}>Activar Cámara Real</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCommunity = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.title, { color: theme.text }]}>Comunidad</Text>

      <View style={[styles.challengeCard, { backgroundColor: theme.primary }]}>
         <Ionicons name="star" size={30} color="#fff" />
         <View style={{flex: 1, marginLeft: 15}}>
            <Text style={styles.challengeTitle}>RETO SEMANAL</Text>
            <Text style={styles.challengeDesc}>Graba un saludo para tus vecinos. +500 XP</Text>
         </View>
         <TouchableOpacity style={styles.challengeBtn}>
            <Text style={{color: theme.primary, fontWeight: '800'}}>IR</Text>
         </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {['Todos', 'Tips', 'Preguntas', 'Historias'].map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.filterChip, { backgroundColor: activeCategory === cat ? theme.primary : theme.card }]}
          >
            <Text style={[styles.filterText, { color: activeCategory === cat ? '#fff' : theme.text }]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {[
        { user: 'Carlos M.', msg: '¿Cómo dicen "me das un aventón" en Texas?', likes: 12 },
        { user: 'Maria G.', msg: 'Hoy logré pedir mi café sola sin usar el traductor. ¡VIVA!', likes: 45 }
      ].map((post, i) => (
        <View key={i} style={[styles.postCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.postHeader}>
            <View style={styles.avatar}><Text style={{color:'#fff', fontWeight:'800'}}>{post.user[0]}</Text></View>
            <Text style={[styles.postUser, { color: theme.text }]}>{post.user}</Text>
          </View>
          <Text style={[styles.postMsg, { color: theme.textMuted }]}>{post.msg}</Text>
          <View style={styles.postFooter}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
               <Ionicons name="heart-outline" size={16} color={theme.textMuted} />
               <Text style={{color: theme.textMuted, marginLeft: 4}}>{post.likes}</Text>
            </TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={16} color={theme.textMuted} />
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderStats = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.title, { color: theme.text }]}>Tu Progreso</Text>

      <View style={styles.statsGrid}>
         <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNum, { color: theme.primary }]}>{userStreak}</Text>
            <Text style={[styles.statLabelSmall, { color: theme.textMuted }]}>Días Activo</Text>
         </View>
         <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNum, { color: theme.secondary }]}>{vocabularyList.length}</Text>
            <Text style={[styles.statLabelSmall, { color: theme.textMuted }]}>Palabras</Text>
         </View>
      </View>

      <View style={[styles.chartBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
         <Text style={[styles.chartTitle, { color: theme.text }]}>Actividad Semanal</Text>
         <View style={styles.barsContainer}>
            {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h, backgroundColor: i === 3 ? theme.primary : theme.secondary + '40' }]} />
            ))}
         </View>
         <View style={styles.daysContainer}>
            {['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'].map(d => <Text key={d} style={{color: theme.textMuted, fontSize: 10}}>{d}</Text>)}
         </View>
      </View>

      <TouchableOpacity style={[styles.button, { marginTop: 24, backgroundColor: theme.error }]} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLessons = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.title, { color: theme.text }]}>Tus Lecciones</Text>
      {INITIAL_LESSONS.map((lesson) => (
        <TouchableOpacity
          key={lesson.id}
          style={[styles.lessonCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => {
            setActiveLesson(lesson);
            setCurrentStep(0);
          }}
        >
          <View style={styles.lessonHeader}>
            <Text style={[styles.categoryBadge, { color: theme.primary, backgroundColor: theme.primary + '10' }]}>{lesson.category.toUpperCase()}</Text>
            <Text style={[styles.duration, { color: theme.textMuted }]}>{lesson.durationMinutes} min</Text>
          </View>
          <Text style={[styles.lessonTitle, { color: theme.text }]}>{lesson.title}</Text>
          <Text style={[styles.lessonDesc, { color: theme.textMuted }]}>{lesson.description}</Text>
          <View style={styles.lessonFooter}>
             <Text style={[styles.reward, { color: theme.secondary }]}>🏆 +{lesson.xpReward} XP</Text>
             <Ionicons name="arrow-forward" size={18} color={theme.primary} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderQuiz = () => {
    if (!activeLesson) return null;
    const step = activeLesson.content[currentStep];
    const progress = ((currentStep + 1) / activeLesson.content.length) * 100;

    return (
      <View style={[styles.quizContainer, { backgroundColor: theme.bg }]}>
        <View style={styles.quizHeader}>
          <TouchableOpacity onPress={() => setActiveLesson(null)}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
          <View style={styles.quizProgressBg}>
             <View style={[styles.quizProgressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.quizStepText, { color: theme.text }]}>{currentStep + 1}/{activeLesson.content.length}</Text>
        </View>

        <View style={styles.quizContent}>
          <Text style={styles.stepLabel}>PASO {currentStep + 1}</Text>
          <Text style={[styles.quizQuestion, { color: theme.text }]}>{step.question}</Text>
          {step.options.map((opt, i) => (
            <TouchableOpacity key={i} style={[styles.optionButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
               <Text style={[styles.optionText, { color: theme.text }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.quizMainButton}
          onPress={() => {
            if (currentStep < activeLesson.content.length - 1) setCurrentStep(currentStep + 1);
            else { setActiveLesson(null); }
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
          <View style={styles.mainContainer}>
            {renderContent()}
          </View>

          {isAuthenticated && !activeLesson && !showCamera && (
            <View style={[styles.tabBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
              {[
                { id: 'home', icon: 'home', label: 'Inicio' },
                { id: 'lessons', icon: 'book', label: 'Lecciones' },
                { id: 'practice', icon: 'mic', label: 'Hablar' },
                { id: 'scanner', icon: 'camera', label: 'Lente' },
                { id: 'community', icon: 'people', label: 'Comuna' },
                { id: 'progress', icon: 'bar-chart', label: 'Stats' },
                { id: 'profile', icon: 'settings', label: 'Ajustes' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={styles.tabButton}
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.tabIconContainer,
                      isActive && { backgroundColor: theme.primary + '15' }
                    ]}>
                      <Ionicons
                        name={(isActive ? tab.icon : tab.icon + '-outline') as any}
                        size={20}
                        color={isActive ? theme.primary : theme.textMuted}
                      />
                    </View>
                    <Text style={[
                      styles.tabText,
                      { color: isActive ? theme.primary : theme.textMuted },
                      isActive && { fontWeight: '800' }
                    ]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContainer: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  brandText: { fontSize: 22, fontWeight: '900' },
  headerIcons: { flexDirection: 'row', gap: 8 },
  miniStat: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4 },
  miniStatText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 10 },
  dashboardCard: { padding: 20, borderRadius: 32, borderWidth: 1 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  statValue: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  badge: { backgroundColor: '#8b5cf620', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#8b5cf6', fontSize: 10, fontWeight: '900' },
  progressContainer: { marginTop: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 12, color: '#94a3b8' },
  progressBarBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 5 },
  progressSub: { fontSize: 10, color: '#64748b', marginTop: 6 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  actionItem: { alignItems: 'center', flex: 1 },
  actionIcon: { width: 56, height: 56, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  missionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  missionTitle: { fontSize: 14, fontWeight: '700' },
  missionDesc: { fontSize: 11, marginTop: 2 },
  missionXp: { fontSize: 12, fontWeight: '800' },
  lessonCard: { padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1 },
  lessonHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  categoryBadge: { fontSize: 10, fontWeight: '900', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  duration: { fontSize: 11, fontWeight: '600' },
  lessonTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  lessonDesc: { fontSize: 13, lineHeight: 18, marginBottom: 16 },
  lessonFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reward: { fontSize: 13, fontWeight: '800' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: Platform.OS === 'ios' ? 30 : 15, borderTopWidth: 1, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tabButton: { alignItems: 'center', flex: 1 },
  tabIconContainer: { padding: 6, borderRadius: 12, marginBottom: 2 },
  tabText: { fontSize: 9, fontWeight: '600' },
  button: { backgroundColor: '#f59e0b', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
  practiceCard: { padding: 30, borderRadius: 32, alignItems: 'center', borderWidth: 1, marginTop: 10 },
  hostAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f59e0b20', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  hostName: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  hostMsg: { textAlign: 'center', fontSize: 14, marginBottom: 20, fontStyle: 'italic' },
  scenarioChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, marginRight: 10, borderWidth: 1 },
  scenarioText: { fontSize: 13, fontWeight: '700' },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  hudContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hudFrame: { width: 250, height: 250, position: 'relative' },
  hudCorner: { position: 'absolute', width: 40, height: 40, borderColor: '#f59e0b' },
  closeCamera: { position: 'absolute', top: 50, right: 30 },
  challengeCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginBottom: 20 },
  challengeTitle: { color: '#fff', fontSize: 12, fontWeight: '900' },
  challengeDesc: { color: '#fff', fontSize: 14, fontWeight: '600' },
  challengeBtn: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  filterRow: { flexDirection: 'row', marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  filterText: { fontSize: 12, fontWeight: '700' },
  postCard: { padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#8b5cf6', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  postUser: { fontWeight: '800', fontSize: 14 },
  postMsg: { fontSize: 14, lineHeight: 20 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '900' },
  statLabelSmall: { fontSize: 10, fontWeight: '800', marginTop: 4 },
  chartBox: { padding: 20, borderRadius: 24, borderWidth: 1 },
  chartTitle: { fontSize: 16, fontWeight: '800', marginBottom: 20 },
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  bar: { width: 25, borderRadius: 6 },
  daysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5 },
  quizContainer: { flex: 1, padding: 20 },
  quizHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30 },
  quizProgressBg: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
  quizProgressFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 4 },
  quizStepText: { fontSize: 12, fontWeight: '700' },
  quizContent: { flex: 1 },
  stepLabel: { color: '#f59e0b', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  quizQuestion: { fontSize: 22, fontWeight: '800', marginBottom: 24, lineHeight: 30 },
  optionButton: { padding: 18, borderRadius: 18, borderWidth: 1, marginBottom: 12 },
  optionText: { fontSize: 16, fontWeight: '600' },
  quizMainButton: { backgroundColor: '#f59e0b', padding: 18, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '700' },
});
