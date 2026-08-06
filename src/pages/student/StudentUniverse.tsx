import React, { useState } from 'react';
import Onboarding from '../../components/Onboarding';
import LessonsView from '../../components/LessonsView';
import ConversationPractice from '../../components/ConversationPractice';
import ObjectScanner from '../../components/ObjectScanner';
import CommunityView from '../../components/CommunityView';
import ProgressView from '../../components/ProgressView';
import AdminDashboard from '../../components/AdminDashboard';
import UserProfileView from '../../components/UserProfileView';
import { VocabularyItem } from '../../types';
import { INITIAL_VOCABULARY } from '../../data';
import {
  Flame, Trophy, BookOpen, Mic, Camera, Users, BarChart3, Home, ShieldAlert,
  ChevronRight, GraduationCap, UserCheck
} from 'lucide-react';

export default function StudentUniverse() {
  // Master states
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // User statistics state
  const [userXp, setUserXp] = useState<number>(1250);
  const [userStreak, setUserStreak] = useState<number>(7);
  const [userLevel, setUserLevel] = useState<string>('A1-A2 Principiante');
  const [userEmail] = useState<string>('jess.pirela@gmail.com');
  const [userName, setUserName] = useState<string>('Jess Pirela');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);

  // States for daily mission checklist
  const [missions, setMissions] = useState([
    { id: 1, title: 'Presencia de Show: AI Trivia 🌟', desc: 'Responde una trivia de tu Host elegido', completed: false, xpReward: 50 },
    { id: 2, title: 'Escaneo Lente: EasyGo Lens 🛒', desc: 'Guarda 1 nuevo objeto real con la cámara', completed: false, xpReward: 50 },
    { id: 3, title: 'Práctica Rápida de Hitos 📖', desc: 'Completa cualquier lección del plan survival', completed: false, xpReward: 50 }
  ]);

  const handleEarnXp = (amount: number) => {
    setUserXp(prev => prev + amount);
    if (amount === 100) completeMission(1);
    else if (amount === 20) completeMission(2);
    else if (amount >= 150) completeMission(3);
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
      if (prev.some(item => item.word.toLowerCase() === newItem.word.toLowerCase())) return prev;
      return [newItem, ...prev];
    });
  };

  const handleOnboardingComplete = (selectedLevel: string) => {
    setUserLevel(selectedLevel);
    setIsOnboarded(true);
    setActiveTab('home');
  };

  const handleUpdateProfile = (name: string, email: string, level: string) => {
    setUserName(name);
    setUserLevel(level);
    // email update logic if needed
  };

  const handleLogout = () => {
    setActiveTab('home');
  };

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col text-slate-100">
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

  const homePanelClass = isDarkMode ? 'glass border border-white/10' : 'bg-white/95 border border-slate-200 shadow-sm';

  return (
    <div id="student-universe-root" className={`min-h-screen flex flex-col justify-between relative overflow-x-hidden font-sans ${isDarkMode ? 'bg-brand-dark text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <header className={` ${isDarkMode ? 'bg-brand-dark/40 text-slate-100' : 'bg-slate-100/90 text-slate-900'} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} p-4 sticky top-0 backdrop-blur-md z-20`}>
        <div className="container-custom flex justify-between items-center select-none">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="font-display font-black text-white text-lg tracking-wider">EasyGo</span>
            <span className="font-academy text-brand-orange text-sm font-semibold font-italic rotate-[-6deg] ml-0.5">Academy</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold font-mono">
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-brand-orange animate-pulse" />
              <span className="text-white font-bold">{userStreak}d</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-brand-violet" />
              <span className="text-white font-bold">{userXp} XP</span>
            </div>
            <div onClick={() => setIsAdminMode(true)} className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-orange to-brand-purple flex items-center justify-center text-xs font-bold cursor-pointer border border-white/10 text-white">
              👑
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full container-custom py-6 pb-24 z-10">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className={`${homePanelClass} rounded-3xl p-5 space-y-4 md:col-span-2 lg:col-span-2`}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Nivel de Conversación</span>
                  <h2 className="text-lg font-bold text-white font-display mt-0.5 flex items-center gap-1.5">
                    {userLevel} <GraduationCap className="w-5 h-5 text-brand-orange shrink-0" />
                  </h2>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-gradient-to-r from-brand-orange to-brand-purple h-full transition-all duration-500 rounded-full" style={{ width: `${(userXp % 1000) / 10}%` }} />
                  </div>
                </div>
              </div>

              <div className="glass bg-gradient-to-r from-brand-purple/20 to-brand-orange/5 border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-4 lg:col-span-1">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-orange">Siguiente parada survival</span>
                  <h4 className="text-sm font-extrabold text-white">Reunion Escolar 🏫</h4>
                </div>
                <button onClick={() => setActiveTab('lessons')} className="p-2 bg-brand-orange rounded-full text-white active:scale-95">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid grid-cols-2 gap-4 text-center">
                {[
                  { tab: 'practice', label: 'Hablar Show', icon: Mic, bg: 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange' },
                  { tab: 'scanner', label: 'Escanear', icon: Camera, bg: 'bg-indigo-950/40 border-indigo-500/25 text-indigo-400' },
                  { tab: 'lessons', label: 'Lecciones', icon: BookOpen, bg: 'bg-brand-purple/10 border-brand-violet/20 text-brand-violet' },
                  { tab: 'community', label: 'Comunidad', icon: Users, bg: 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' }
                ].map((act) => {
                  const IconComp = act.icon;
                  return (
                    <button key={act.tab} onClick={() => setActiveTab(act.tab)} className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 active:scale-95 hover:bg-white/10 transition-all">
                      <div className={`p-4 rounded-full border ${act.bg}`}>
                        <IconComp className="w-6 h-6 shrink-0" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 leading-none">{act.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3.5">
                <h3 className="font-bold text-sm text-white font-display">Tus Misiones Diarias 🎯</h3>
                <div className="space-y-2.5">
                  {missions.map((m) => (
                    <div key={m.id} className={`p-3.5 rounded-2xl flex items-start gap-3 border ${m.completed ? 'bg-brand-success/10 border-brand-success/20 text-slate-400' : 'bg-white/5 border-white/5 text-slate-100'}`}>
                      <input type="checkbox" checked={m.completed} disabled className="accent-brand-success mt-1 scale-105 shrink-0" />
                      <div className="flex-1 text-left">
                        <span className={`text-xs font-bold block ${m.completed && 'line-through'}`}>{m.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{m.desc}</span>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-brand-orange">+{m.xpReward} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && <LessonsView userLevel={userLevel} onEarnXp={handleEarnXp} isDarkMode={isDarkMode} />}
        {activeTab === 'practice' && <ConversationPractice userLevel={userLevel} onEarnXp={handleEarnXp} isDarkMode={isDarkMode} />}
        {activeTab === 'scanner' && <ObjectScanner onEarnXp={handleEarnXp} onAddVocabulary={handleAddVocabulary} isDarkMode={isDarkMode} />}
        {activeTab === 'community' && <CommunityView onEarnXp={handleEarnXp} userEmail={userEmail} userName={userName} isDarkMode={isDarkMode} />}
        {activeTab === 'progress' && <ProgressView onEarnXp={handleEarnXp} vocabularyList={vocabularyList} userXp={userXp} userStreak={userStreak} isDarkMode={isDarkMode} />}
        {activeTab === 'profile' && <UserProfileView userEmail={userEmail} userName={userName} userLevel={userLevel} isDarkMode={isDarkMode} onToggleTheme={setIsDarkMode} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} onEarnXp={handleEarnXp} />}
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 py-3 backdrop-blur-md z-20 ${isDarkMode ? 'bg-brand-dark/95 border-t border-white/5' : 'bg-white/90 border-t border-slate-200'}`}>
        <div className="container-custom flex justify-around items-center">
          {[
            { id: 'home', label: 'Inicio', icon: Home },
            { id: 'lessons', label: 'Lecciones', icon: BookOpen },
            { id: 'practice', label: 'Hablar', icon: Mic },
            { id: 'scanner', label: 'Scanner', icon: Camera },
            { id: 'community', label: 'Comunidad', icon: Users },
            { id: 'progress', label: 'Progreso', icon: BarChart3 },
            { id: 'profile', label: 'Perfil', icon: UserCheck }
          ].map((nav) => {
            const IconComp = nav.icon;
            return (
              <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`flex flex-col items-center gap-1 ${activeTab === nav.id ? 'text-brand-orange' : 'text-slate-500'}`}>
                <IconComp className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-bold">{nav.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
