import React, { useState, useEffect, useRef } from 'react';
import Onboarding from '../../components/Onboarding';
import LessonsView from '../../components/LessonsView';
import ConversationPractice from '../../components/ConversationPractice';
import ObjectScanner from '../../components/ObjectScanner';
import CommunityView from '../../components/CommunityView';
import ProgressView from '../../components/ProgressView';
import UserProfileView from '../../components/UserProfileView';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { userService } from '../../services/userService';
import { ProgressCalculator, LevelCode } from '../../utils/ProgressCalculator';
import { INITIAL_VOCABULARY } from '../../data';
import {
  Flame, Trophy, BookOpen, Mic, Camera, Users, BarChart3, Home, ShieldAlert,
  GraduationCap, UserCheck
} from 'lucide-react';

export default function StudentUniverse() {
  const auth = useAuthStore() as any;
  const user = auth?.user;
  const { isDarkMode } = useThemeStore();
  const mainRef = useRef<HTMLDivElement>(null);

  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [realProgress, setRealProgress] = useState<any>(null);
  const [userXp] = useState<number>(1250);
  const [userStreak] = useState<number>(7);

  // Datos seguros
  const userLevel = user?.assignedLevel || 'A1 Principiante';
  const userEmail = user?.email || 'usuario@easygo.com';
  const userName = user?.name || 'Estudiante';

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user || user.id === 999) return;
      try {
        const response = await userService.getCurriculumSnapshot();
        if (response?.data?.success) {
          const snapshot = response.data.snapshot;
          const levelCode = (user?.assignedLevel?.split('-')[0] || 'A1') as LevelCode;
          const planned = ProgressCalculator.plannedDurationMonths(levelCode);
          const result = ProgressCalculator.calculateEstimate(snapshot, planned);
          setRealProgress(result);
        }
      } catch (e) {
        console.warn('⚠️ StudentUniverse: No se pudo cargar el progreso real');
      }
    };
    loadProgress();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a041e] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Cargando experiencia...</p>
          <button onClick={() => window.location.href = '/login'} className="text-primary-light underline">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const cardClass = isDarkMode
    ? 'bg-white/5 border border-white/10'
    : 'bg-white border border-slate-100 shadow-sm';

  const headerClass = isDarkMode
    ? 'bg-[#0a041e]/80 border-white/5'
    : 'bg-white/95 border-slate-100 shadow-sm';

  return (
    <div
      id="student-universe-root"
      className={`min-h-screen w-full max-w-md mx-auto flex flex-col relative overflow-x-hidden font-sans ${isDarkMode ? 'bg-[#0a041e] text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >

      {/* Header Fijo con Safe Area */}
      <header className={`p-4 pt-[calc(env(safe-area-inset-top)+1rem)] sticky top-0 backdrop-blur-md z-40 border-b transition-all duration-300 ${headerClass}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className={`font-black text-lg tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>EasyGo</span>
            <span className="text-brand-orange text-sm font-semibold italic ml-0.5">Academy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
              <Flame className="w-4 h-4 text-brand-orange" />
              <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{userStreak}d</span>
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
              <Trophy className="w-4 h-4 text-brand-violet" />
              <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{userXp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        ref={mainRef}
        className="flex-1 w-full p-5 pb-32"
      >
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Banner de Bienvenida */}
            <div className={`${cardClass} rounded-[2rem] p-7 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="relative z-10">
                <span className="text-[10px] text-brand-orange uppercase font-black tracking-widest">Estado de Aprendizaje</span>
                <h2 className={`text-2xl font-black mt-1 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {userLevel} <GraduationCap className="w-6 h-6 text-brand-orange" />
                </h2>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase tracking-tighter">Avance del Nivel</span>
                    <span className="text-brand-orange">{realProgress?.percentComplete || 0}%</span>
                  </div>
                  <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-orange to-brand-violet h-full transition-all duration-1000 rounded-full"
                      style={{ width: `${realProgress?.percentComplete || 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold italic">
                    🚀 {realProgress?.lessonsRemaining || 0} lecciones para completar este nivel
                  </p>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos (Grid Nativa) */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'lessons', label: 'Lecciones', icon: BookOpen, color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
                { id: 'practice', label: 'Hablar', icon: Mic, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
                { id: 'scanner', label: 'Scanner', icon: Camera, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { id: 'community', label: 'Comunidad', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${cardClass} flex flex-col items-center justify-center p-8 rounded-[2rem] active:scale-95 transition-all`}
                >
                  <div className={`p-4 rounded-2xl ${item.bg} mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-wide ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && <LessonsView userLevel={userLevel} onEarnXp={() => {}} isDarkMode={isDarkMode} />}
        {activeTab === 'practice' && <ConversationPractice userLevel={userLevel} onEarnXp={() => {}} isDarkMode={isDarkMode} />}
        {activeTab === 'scanner' && <ObjectScanner onEarnXp={() => {}} onAddVocabulary={() => {}} isDarkMode={isDarkMode} />}
        {activeTab === 'community' && <CommunityView onEarnXp={() => {}} userEmail={userEmail} userName={userName} isDarkMode={isDarkMode} />}
        {activeTab === 'profile' && (
          <UserProfileView
            userEmail={userEmail}
            userName={userName}
            userLevel={userLevel}
            isDarkMode={isDarkMode}
            onLogout={auth.logout}
          />
        )}
      </main>

      {/* Navegación Inferior (Estilo App Nativa con Safe Area) */}
      <nav className={`fixed bottom-0 left-0 right-0 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-lg border-t z-40 transition-all duration-300 ${isDarkMode ? 'bg-[#0a041e]/90 border-white/5' : 'bg-white/95 border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]'}`}>
        <div className="flex justify-around items-center">
          {[
            { id: 'home', label: 'Inicio', icon: Home },
            { id: 'lessons', label: 'Cursos', icon: BookOpen },
            { id: 'community', label: 'Comunidad', icon: Users },
            { id: 'profile', label: 'Perfil', icon: UserCheck }
          ].map(nav => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`flex flex-col items-center gap-1.5 transition-all px-4 py-1 ${activeTab === nav.id ? 'text-brand-orange scale-110' : 'text-slate-400 opacity-60'}`}
            >
              <nav.icon className={`w-5 h-5 ${activeTab === nav.id ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{nav.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
