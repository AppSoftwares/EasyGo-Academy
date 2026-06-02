import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import LessonsView from './components/LessonsView';
import ConversationPractice from './components/ConversationPractice';
import ObjectScanner from './components/ObjectScanner';
import CommunityView from './components/CommunityView';
import ProgressView from './components/ProgressView';
import AdminDashboard from './components/AdminDashboard';
import { VocabularyItem } from './types';
import { INITIAL_VOCABULARY } from './data';
import { 
  Flame, Trophy, BookOpen, Mic, Camera, Users, BarChart3, Home, ShieldAlert,
  Menu, Bell, UserCheck, Star, Sparkles, CheckCircle2, ChevronRight, GraduationCap
} from 'lucide-react';

export default function App() {
  // Master states
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // User statistics state
  const [userXp, setUserXp] = useState<number>(1250);
  const [userStreak, setUserStreak] = useState<number>(7);
  const [userLevel, setUserLevel] = useState<string>('A1-A2 Principiante');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);

  // States for daily mission checklist
  const [missions, setMissions] = useState([
    { id: 1, title: 'Presencia de Show: AI Trivia 🌟', desc: 'Responde una trivia de tu Host elegido', completed: false, xpReward: 50 },
    { id: 2, title: 'Escaneo Lente: EasyGo Lens 🛒', desc: 'Guarda 1 nuevo objeto real con la cámara', completed: false, xpReward: 50 },
    { id: 3, title: 'Práctica Rápida de Hitos 📖', desc: 'Completa cualquier lección del plan survival', completed: false, xpReward: 50 }
  ]);

  const handleEarnXp = (amount: number) => {
    setUserXp(prev => prev + amount);
    // Check if any missions completed based on actions
    if (amount === 100) { // Trivia/Lesson completes
      completeMission(1);
    } else if (amount === 20) { // Scanner saves
      completeMission(2);
    } else if (amount === 150 || amount === 200 || amount === 250) {
      completeMission(3);
    }
  };

  const completeMission = (id: number) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.completed) {
        setUserXp(x => x + m.xpReward);
        return { ...m, completed: true };
      }
      return m;
    }));
  };

  const handleAddVocabulary = (newItem: VocabularyItem) => {
    setVocabularyList(prev => {
      // Avoid duplicates
      if (prev.some(item => item.word.toLowerCase() === newItem.word.toLowerCase())) {
        return prev;
      }
      return [newItem, ...prev];
    });
  };

  const handleOnboardingComplete = (selectedLevel: 'A1-A2 Principiante' | 'B1-B2 Intermedio' | 'C1-C2 Avanzado') => {
    setUserLevel(selectedLevel);
    setIsOnboarded(true);
    // Set active tab to home
    setActiveTab('home');
  };

  // 1. RENDER ONBOARDING IF NOT COMPLETED
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 2. RENDER ADMIN DASHBOARD IN FULLSCREEN MODE
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col text-slate-100">
        {/* Admin Bar to return back */}
        <div className="bg-slate-900 px-6 py-3.5 border-b border-white/5 flex justify-between items-center z-30 font-sans">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-orange" />
            <span className="text-xs font-bold font-mono tracking-wider text-slate-300">MODO ADMINISTRACIÓN ACTIVO</span>
          </div>
          <button
            onClick={() => setIsAdminMode(false)}
            className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-coral text-xs font-semibold text-white pointer transition-all shadow-md active:scale-95"
          >
            ← Volver a App Estudiante
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div id="student-universe-root" className="min-h-screen bg-brand-dark text-slate-100 flex flex-col justify-between relative overflow-x-hidden font-sans">
      
      {/* Background ambient blurs */}
      <div className="absolute top-[-250px] right-[-200px] w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-brand-orange/10 blur-3xl pointer-events-none z-0"></div>

      {/* Main Student Header block */}
      <header className="bg-brand-dark/40 border-b border-white/5 p-4 sticky top-0 backdrop-blur-md z-20">
        <div className="max-w-md mx-auto flex justify-between items-center select-none">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="font-display font-black text-white text-lg tracking-wider">EasyGo</span>
            <span className="font-academy text-brand-orange text-sm font-semibold font-italic rotate-[-6deg] ml-0.5">Academy</span>
          </div>

          {/* Top Info Icons */}
          <div className="flex items-center gap-3 text-xs font-semibold font-mono">
            {/* Streak Golden Fire Flame */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-full" title="Racha consecutiva">
              <Flame className="w-4 h-4 text-brand-orange animate-pulse" />
              <span className="text-white font-bold">{userStreak}d</span>
            </div>

            {/* XP Medal */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-full" title="Tus XP">
              <Trophy className="w-4 h-4 text-brand-violet" />
              <span className="text-white font-bold">{userXp} XP</span>
            </div>

            {/* Admin toggle overlay avatar */}
            <div 
              onClick={() => setIsAdminMode(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-orange to-brand-purple flex items-center justify-center text-xs font-bold cursor-pointer border border-white/10 hover:shadow-lg hover:scale-105 transition-all text-white"
              title="Panel Administrador"
            >
              👑
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Student Frame viewport (max-width 448px centered) */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 pb-24 z-10">
        
        {/* HOME TAB DISPLAY */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in text-left">
            
            {/* 1. Daily Progress Dashboard Card */}
            <div className="glass rounded-3xl p-5 border border-white/10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Nivel de Conversación</span>
                  <h2 className="text-lg font-bold text-white font-display mt-0.5 flex items-center gap-1.5">
                    {userLevel} <GraduationCap className="w-5 h-5 text-brand-orange shrink-0" />
                  </h2>
                </div>
                <span className="text-[10px] bg-brand-violet/20 border border-brand-violet/30 px-2.5 py-1 text-brand-violet font-semibold rounded-full uppercase">
                  PWA Activa
                </span>
              </div>

              {/* Weekly XP completion progress bar indicator */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Próximo Hito Survival:</span>
                  <span className="font-bold text-white">{Math.round((userXp % 1000) / 10)}%</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-brand-orange to-brand-purple h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(userXp % 1000) / 10}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 font-sans">Siguiente nivel de calle en {1000 - (userXp % 1000)} XP</span>
              </div>
            </div>

            {/* 2. Quick Action Circular Grid Buttons */}
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { tab: 'practice', label: 'Hablar Show', icon: Mic, bg: 'bg-brand-orange/10 hover:bg-brand-orange/20 border-brand-orange/20 text-brand-orange' },
                { tab: 'scanner', label: 'Escanear', icon: Camera, bg: 'bg-indigo-950/40 hover:bg-indigo-900/50 border-indigo-500/25 text-indigo-400' },
                { tab: 'lessons', label: 'Lecciones', icon: BookOpen, bg: 'bg-brand-purple/10 hover:bg-brand-purple/20 border-brand-violet/20 text-brand-violet' },
                { tab: 'community', label: 'Comunidad', icon: Users, bg: 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-500/20 text-emerald-400' }
              ].map((act) => {
                const IconComp = act.icon;
                return (
                  <button
                    key={act.tab}
                    onClick={() => setActiveTab(act.tab)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group active:scale-95"
                  >
                    <div className={`p-3.5 rounded-full border transition-transform group-hover:scale-110 ${act.bg}`}>
                      <IconComp className="w-5 h-5 shrink-0" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 leading-none">{act.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Daily Missions panel checklists */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3.5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white font-display">Tus Misiones Diarias 🎯</h3>
                <span className="text-[10px] font-mono text-slate-400">Restablece en 8h</span>
              </div>

              <div className="space-y-2.5">
                {missions.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl flex items-start gap-3 border transition-all ${
                      m.completed 
                        ? 'bg-brand-success/10 border-brand-success/20 text-slate-400' 
                        : 'bg-white/5 border-white/5 text-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={m.completed}
                      disabled
                      className="accent-brand-success mt-1 scale-105 shrink-0 cursor-not-allowed"
                    />
                    <div className="flex-1 text-left">
                      <span className={`text-xs font-bold block ${m.completed && 'line-through text-slate-400'}`}>
                        {m.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-normal">{m.desc}</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono text-brand-orange shrink-0">
                      +{m.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Continue Learning Highlight Banner */}
            <div className="glass hover:border-slate-700 bg-gradient-to-r from-brand-purple/20 to-brand-orange/5 border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-orange">Siguiente parada survival</span>
                <h4 className="text-sm font-extrabold text-white">Reunion Escolar: Padres y Maestros 🏫</h4>
                <p className="text-[10px] text-slate-400">Aprende a dialogar sobre las calificaciones de tus hijos</p>
              </div>

              <button
                onClick={() => setActiveTab('lessons')}
                className="p-2 bg-brand-orange hover:bg-brand-coral shrink-0 rounded-full text-white pointer transition-all shadow-md active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 5. Leaderboard top 5 list */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3.5">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-white font-display">Tabla de Clasificación 🏆</h3>
                <span className="text-[10px] text-brand-violet font-bold font-mono">Ver liga de Texas</span>
              </div>

              <div className="space-y-2">
                {[
                  { pos: '🥇', name: 'Marcos Rivas', streak: '89d', xp: '22.4K' },
                  { pos: '🥈', name: 'Gabriela Torres', streak: '38d', xp: '18.5K' },
                  { pos: '🥉', name: 'Ignacio Ortiz', streak: '45d', xp: '14.1K' },
                  { pos: '4', name: 'Tú', streak: `${userStreak}d`, xp: `${(userXp / 1000).toFixed(1)}K`, user: true }
                ].map((row, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-2.5 rounded-xl text-xs font-semibold ${
                      row.user 
                        ? 'bg-brand-orange/20 border border-brand-orange text-white' 
                        : 'bg-white/5 border border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono w-5 text-center shrink-0">{row.pos}</span>
                      <span className="font-bold text-white">{row.name}</span>
                    </div>

                    <div className="flex items-center gap-3.5 font-mono text-[10px]">
                      <span className="text-slate-400">🔥 {row.streak}</span>
                      <span className="text-brand-violet font-bold">{row.xp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* LESSONS VIEW */}
        {activeTab === 'lessons' && (
          <LessonsView userLevel={userLevel} onEarnXp={handleEarnXp} />
        )}

        {/* PRACTICE CHAT & AI SHOW MODULE */}
        {activeTab === 'practice' && (
          <ConversationPractice userLevel={userLevel} onEarnXp={handleEarnXp} />
        )}

        {/* CAMERA OBJECT SCANNER LENS */}
        {activeTab === 'scanner' && (
          <ObjectScanner onEarnXp={handleEarnXp} onAddVocabulary={handleAddVocabulary} />
        )}

        {/* DISCUSSION FORUM & CHALLENGES */}
        {activeTab === 'community' && (
          <CommunityView onEarnXp={handleEarnXp} userEmail="jess.pirela@gmail.com" userName="Jess Pirela" />
        )}

        {/* PROGRESS CHARTS & SPACE DECK & STRIPE SUB */}
        {activeTab === 'progress' && (
          <ProgressView 
            onEarnXp={handleEarnXp} 
            vocabularyList={vocabularyList} 
            userXp={userXp} 
            userStreak={userStreak} 
          />
        )}
      </main>

      {/* Persistent Fluid Mobile Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 bg-brand-dark/95 border-t border-white/5 backdrop-blur-md z-20">
        <div className="max-w-md mx-auto flex justify-around items-center px-4 select-none">
          {[
            { id: 'home', label: 'Inicio', icon: Home },
            { id: 'lessons', label: 'Lecciones', icon: BookOpen },
            { id: 'practice', label: 'Hablar', icon: Mic },
            { id: 'scanner', label: 'Scanner', icon: Camera },
            { id: 'community', label: 'Comunidad', icon: Users },
            { id: 'progress', label: 'Progreso', icon: BarChart3 }
          ].map((nav) => {
            const IconComp = nav.icon;
            const isSelected = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  isSelected ? 'text-brand-orange scale-105' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <IconComp className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-bold tracking-wide">{nav.label}</span>
              </button>
            );
          })}
        </div>
      </footer>

    </div>
  );
}
