import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { INITIAL_VOCABULARY } from './data';
import { VocabularyItem } from './types';

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'scanner' | 'lessons' | 'community' | 'practice'>('home');
  const [userXp, setUserXp] = useState(1250);
  const [userStreak, setUserStreak] = useState(7);
  const [userLevel, setUserLevel] = useState('A1-A2 Principiante');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);

  const handleOnboardingComplete = () => setIsOnboarded(true);

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>EasyGo Academy</Text>
      <Text style={styles.subtitle}>Bienvenido a tu espacio de práctica</Text>
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>XP</Text>
          <Text style={styles.statValue}>{userXp}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Racha</Text>
          <Text style={styles.statValue}>{userStreak}d</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vocabulario reciente</Text>
        {vocabularyList.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.word}</Text>
            <Text style={styles.cardSubtitle}>{item.translation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  if (!isOnboarded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Comencemos</Text>
        <Text style={styles.subtitle}>Elige tu nivel y descubre tus lecciones</Text>
        <TouchableOpacity style={styles.button} onPress={handleOnboardingComplete}>
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderHome()}
      <View style={styles.tabBar}>
        {['home', 'scanner', 'lessons', 'community', 'practice'].map((tab) => (
          <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab as any)}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
