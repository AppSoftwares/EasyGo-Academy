import React, { useState, useEffect } from 'react';
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
  console.log('🚀 StudentUniverse: Iniciando renderizado');

  const auth = useAuthStore() as any;
  const user = auth?.user;
  const { isDarkMode } = useThemeStore();

  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [realProgress, setRealProgress] = useState<any>(null);
  const [userXp] = useState<number>(1250);
  const [userStreak] = useState<number>(7);

  // Datos seguros
  const userLevel = user?.assignedLevel || 'A1 Principiante';
  const userEmail = user?.email || 'usuario@easygo.com';
  const userName = user?.name || 'Estudiante';

  useEffect(() => {
    console.log('📡 StudentUniverse: Verificando datos del usuario', user?.email);

    const loadProgress = async () => {
      if (!user || user.id === 999) return; // Ignorar si es el mock de Maria
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

  const homePanelClass = isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200 shadow-sm';

  return (
    <div id="student-universe-root" className={`min-h-screen flex flex-col relative overflow-x-hidden font-sans ${isDarkMode ? 'bg-[#0a041e] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Header Fijo */}
      <header className={`p-4 sticky top-0 backdrop-blur-md z-30 border-b ${isDarkMode ? 'bg-[#0a041e]/80 border-white/5' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="font-black text-white text-lg tracking-wider">EasyGo</span>
            <span className="text-brand-orange text-sm font-semibold italic ml-0.5">Academy</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5">
              <Flame className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-bold text-white">{userStreak}d</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-full border border-white/5">
              <Trophy className="w-4 h-4 text-brand-violet" />
              <span className="text-xs font-bold text-white">{userXp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-28">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Banner de Bienvenida */}
            <div className={`${homePanelClass} rounded-3xl p-6 relative overflow-hidden`}>
              <div className="relative z-10">
                <span className="text-[10px] text-brand-orange uppercase font-black tracking-widest">Tu Progreso</span>
                <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                  {userLevel} <GraduationCap className="w-6 h-6 text-brand-orange" />
                </h2>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Avance Actual</span>
                    <span className="text-brand-orange">{realProgress?.percentComplete || 0}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-brand-orange h-full transition-all duration-1000" style={{ width: `${realProgress?.percentComplete || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'lessons', label: 'Lecciones', icon: BookOpen, color: 'text-brand-violet' },
                { id: 'practice', label: 'Hablar', icon: Mic, color: 'text-brand-orange' },
                { id: 'scanner', label: 'Scanner', icon: Camera, color: 'text-indigo-400' },
                { id: 'community', label: 'Comunidad', icon: Users, color: 'text-emerald-400' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-3xl active:scale-95 transition-all"
                >
                  <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                  <span className="text-xs font-bold text-slate-300">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && <LessonsView userLevel={userLevel} onEarnXp={() => {}} isDarkMode={isDarkMode} />}
        {activeTab === 'practice' && <ConversationPractice userLevel={userLevel} onEarnXp={() => {}} isDarkMode={isDarkMode} />}
        {activeTab === 'scanner' && <ObjectScanner onEarnXp={() => {}} onAddVocabulary={() => {}} isDarkMode={isDarkMode} />}
        {activeTab === 'community' && <CommunityView onEarnXp={() => {}} userEmail={userEmail} userName={userName} isDarkMode={isDarkMode} />}
        {activeTab === 'progress' && <ProgressView onEarnXp={() => {}} vocabularyList={[]} userXp={userXp} userStreak={userStreak} isDarkMode={isDarkMode} />}
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

      {/* Navegación Inferior (Estilo App Nativa) */}
      <nav className={`fixed bottom-0 left-0 right-0 p-3 pb-8 backdrop-blur-lg border-t z-40 ${isDarkMode ? 'bg-[#0a041e]/90 border-white/5' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-md mx-auto flex justify-around items-center">
          {[
            { id: 'home', label: 'Inicio', icon: Home },
            { id: 'lessons', label: 'Cursos', icon: BookOpen },
            { id: 'community', label: 'Comunidad', icon: Users },
            { id: 'profile', label: 'Perfil', icon: UserCheck }
          ].map(nav => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === nav.id ? 'text-brand-orange scale-110' : 'text-slate-500 opacity-60'}`}
            >
              <nav.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold">{nav.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
