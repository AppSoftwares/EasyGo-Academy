import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import AdminDashboard from './components/AdminDashboard';
import { VocabularyItem } from './types';
import { INITIAL_VOCABULARY } from './data';
import {
  Flame,
  BookOpen,
  Mic,
  Camera,
  Users,
  BarChart3,
  Home,
  ShieldAlert,
  ChevronRight,
  GraduationCap,
  Star,
  Trophy as TrophyIcon,
} from 'lucide-react';

type TabId = 'home' | 'lessons' | 'practice' | 'scanner' | 'community' | 'progress';

type Lesson = {
  title: string;
  subtitle: string;
  badge: string;
  progress: number;
  xpReward: number;
};

type Story = {
  user: string;
  message: string;
  badge: string;
};

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [userXp, setUserXp] = useState(2340);
  const [userStreak, setUserStreak] = useState(12);
  const [userLevel, setUserLevel] = useState('B1-B2 Intermedio');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);

  const [missions, setMissions] = useState([
    { id: 1, title: 'Completar un mini show', desc: 'Graba una respuesta en modo práctica', completed: false, xpReward: 70 },
    { id: 2, title: 'Escanear un objeto', desc: 'Guarda una palabra con EasyGo Lens', completed: false, xpReward: 30 },
    { id: 3, title: 'Revisar una lección', desc: 'Avanza una unidad del plan de viaje', completed: false, xpReward: 50 },
  ]);

  const lessons: Lesson[] = [
    { title: 'Conversaciones cotidianas', subtitle: 'Hablar en la cafetería, tienda y aeropuerto', badge: 'Top', progress: 78, xpReward: 130 },
    { title: 'Pronunciación expresiva', subtitle: 'Sonidos naturales y confianza al hablar', badge: 'Nuevo', progress: 46, xpReward: 150 },
    { title: 'Vocabulario útil', subtitle: 'Bloque de frases para viajes y oficina', badge: 'Rápido', progress: 25, xpReward: 90 },
  ];

  const practiceStories: Story[] = [
    { user: 'María', badge: 'Éxito', message: 'Hoy pedí mi comida como si fuera local. ¡No más miedo!' },
    { user: 'Luis', badge: 'Confianza', message: 'La lección de pronunciación me ayudó con mi acento.' },
    { user: 'Carla', badge: 'Reto', message: 'Usé EasyGo Lens para aprender palabras nuevas en la tienda.' },
  ];

  const handleEarnXp = (amount: number) => {
    setUserXp((prev) => prev + amount);

    if (amount >= 100) {
      completeMission(1);
    }
    if (amount === 30) {
      completeMission(2);
    }
    if (amount === 50) {
      completeMission(3);
    }
  };

  const completeMission = (id: number) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.id === id && !mission.completed) {
          return { ...mission, completed: true };
        }
        return mission;
      }),
    );
  };

  const handleAddVocabulary = (newItem: VocabularyItem) => {
    setVocabularyList((prev) => {
      if (prev.some((item) => item.word.toLowerCase() === newItem.word.toLowerCase())) {
        return prev;
      }
      return [newItem, ...prev];
    });
  };

  const handleOnboardingComplete = (selectedLevel: 'A1-A2 Principiante' | 'B1-B2 Intermedio' | 'C1-C2 Avanzado') => {
    setUserLevel(selectedLevel);
    setIsOnboarded(true);
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
            className="px-4 py-2 rounded-xl bg-brand-orange hover:bg-brand-coral text-xs font-semibold text-white transition-all shadow-md active:scale-95"
          >
            ← Volver a App Estudiante
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans overflow-x-hidden relative">
      <div className="absolute top-[-220px] right-[-180px] w-[450px] h-[450px] rounded-full bg-brand-violet/18 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-180px] left-[-180px] w-[420px] h-[420px] rounded-full bg-brand-orange/16 blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-gradient-to-br from-brand-orange to-brand-purple text-white font-black shadow-[0_18px_40px_rgba(255,94,54,0.25)]">
              E&G
            </div>
            <div className="text-left">
              <p className="text-sm font-display font-black text-white">EasyGo Academy</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange">Tu camino en español</p>
            </div>
          </button>

          <button
            onClick={() => setIsAdminMode(true)}
            className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
          >
            ADMIN
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-28 pt-4 space-y-6">
        {activeTab === 'home' && (
          <section className="space-y-6">
            <div className="glass rounded-[2rem] border border-white/10 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-semibold">Progreso Actual</p>
                  <h1 className="mt-2 text-2xl font-display font-black text-white">Hola, Alejandro 👋</h1>
                  <p className="mt-2 text-sm text-slate-300">Tu ruta de inglés para viajar, trabajar y brillar.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-3xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white border border-white/10">
                  <Flame className="w-4 h-4 text-brand-orange" />
                  {userStreak}d racha
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] bg-gradient-to-r from-brand-orange/20 to-brand-purple/20 p-4 border border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300 font-semibold">Nivel</p>
                    <p className="mt-2 text-xl font-bold text-white">{userLevel}</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-white/10 px-4 py-3 text-center">
                    <p className="text-sm font-bold text-white">{userXp} XP</p>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-300">Semana</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-300">
                  <span>Meta: 30 min activos</span>
                  <span>{((userXp % 1000) / 10).toFixed(0)}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-purple transition-all" style={{ width: `${Math.min(100, (userXp % 1000) / 10)}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Hablar', icon: Mic, color: 'from-brand-orange to-[#ff9b72]' },
                { label: 'Explorar', icon: Camera, color: 'from-[#6959ff] to-brand-purple' },
                { label: 'Estudiar', icon: BookOpen, color: 'from-brand-purple to-[#6b4cff]' },
                { label: 'Comunidad', icon: Users, color: 'from-[#36c6ff] to-brand-purple' },
              ].map((action) => {
                const IconComp = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => setActiveTab(action.label === 'Hablar' ? 'practice' : action.label === 'Explorar' ? 'scanner' : action.label === 'Estudiar' ? 'lessons' : 'community')}
                    className={`rounded-[2rem] bg-gradient-to-br ${action.color} p-4 text-left text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all hover:scale-[1.01]`}
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/10 mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em]">{action.label}</p>
                    <p className="mt-2 text-[11px] text-white/70">Accede rápido a tu rutina.</p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">Plan diario</p>
                  <h2 className="text-xl font-bold text-white">Tus retos de hoy</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-2 text-[10px] text-slate-300 uppercase tracking-[0.2em]">{missions.filter((mission) => mission.completed).length}/3 completadas</span>
              </div>

              <div className="space-y-3">
                {missions.map((mission) => (
                  <div key={mission.id} className={`rounded-[2rem] border p-4 ${mission.completed ? 'border-brand-success/30 bg-brand-success/10' : 'border-white/10 bg-white/5'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className={`text-sm font-bold ${mission.completed ? 'text-brand-success' : 'text-white'}`}>{mission.title}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{mission.desc}</p>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-2 text-[10px] text-brand-orange uppercase tracking-[0.18em]">+{mission.xpReward} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'lessons' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-semibold">Ruta de lecciones</p>
                <h2 className="text-3xl font-bold text-white font-display">Aprende con foco</h2>
              </div>
              <button className="rounded-3xl bg-brand-purple px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-violet/20">
                Ver ruta
              </button>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={index} className="glass rounded-[2rem] border border-white/10 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{lesson.title}</p>
                      <p className="mt-2 text-[11px] text-slate-400">{lesson.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-orange">{lesson.badge}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">
                      <span>Progreso</span>
                      <span>{lesson.progress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-purple transition-all" style={{ width: `${lesson.progress}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleEarnXp(lesson.xpReward)}
                    className="w-full rounded-[1.75rem] bg-brand-orange px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-brand-orange/20 hover:bg-brand-coral transition-all"
                  >
                    Completar +{lesson.xpReward} XP
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'practice' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-semibold">Práctica hablada</p>
                <h2 className="text-3xl font-bold text-white font-display">Construye fluidez</h2>
              </div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-300 border border-white/10">
                Live AI
              </span>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 font-semibold">Escenario recomendado</p>
                  <h3 className="mt-2 text-xl font-bold text-white">Pide tu desayuno en el restaurante</h3>
                </div>
                <div className="rounded-full bg-brand-purple/15 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-brand-purple">+130 XP</div>
              </div>

              <div className="space-y-3">
                {practiceStories.map((story, index) => (
                  <div key={index} className="rounded-[1.75rem] bg-white/5 p-4 border border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">{story.user}</span>
                      <span className="text-[10px] text-brand-orange">{story.badge}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-200 leading-6">{story.message}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleEarnXp(80)}
                className="w-full rounded-[1.75rem] bg-brand-purple px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-brand-violet/20 hover:bg-[#5c1dd2] transition-all"
              >
                Iniciar sesión de práctica
              </button>
            </div>
          </section>
        )}

        {activeTab === 'scanner' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-semibold">EasyGo Lens</p>
                <h2 className="text-3xl font-bold text-white font-display">Aprende con tu cámara</h2>
              </div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-300 border border-white/10">
                0 nuevos
              </span>
            </div>

            <div className="glass rounded-[2rem] border border-white/10 p-5 space-y-4">
              <div className="h-[280px] rounded-[2rem] border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-12 h-12 text-brand-orange mb-4" />
                <p className="text-sm font-semibold">Apunta a un objeto real para aprender su palabra</p>
                <p className="mt-2 text-[11px] text-slate-500">Una experiencia tipo scanner que guarda vocabulario útil.</p>
              </div>
              <button
                onClick={() => {
                  handleEarnXp(30);
                  handleAddVocabulary({
                    id: `vocab-${Date.now()}`,
                    word: 'Puerta',
                    translation: 'Door',
                    phonetic: 'ˈdɔːr',
                    category: 'viaje',
                    difficulty: 'easy',
                    masteryLevel: 1,
                    timesCorrect: 0,
                    timesIncorrect: 0,
                  });
                }}
                className="w-full rounded-[1.75rem] bg-brand-orange px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-xl shadow-brand-orange/20 hover:bg-brand-coral transition-all"
              >
                Escanear y guardar palabra
              </button>
            </div>
          </section>
        )}

        {activeTab === 'community' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-semibold">Comunidad</p>
                <h2 className="text-3xl font-bold text-white font-display">Historias de la comunidad</h2>
              </div>
              <button className="rounded-3xl bg-brand-orange px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-coral transition-all">
                Nuevo post
              </button>
            </div>

            <div className="space-y-4">
              {practiceStories.map((story, index) => (
                <div key={index} className="glass rounded-[2rem] border border-white/10 p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-bold text-white">{story.user}</p>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{story.badge}</p>
                    </div>
                    <span className="rounded-full bg-brand-purple/15 px-3 py-2 text-[10px] text-brand-purple uppercase tracking-[0.18em]">+5 XP</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-6">{story.message}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'progress' && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-semibold">Resumen</p>
                <h2 className="text-3xl font-bold text-white font-display">Tu progreso real</h2>
              </div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-300 border border-white/10">
                {userLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Meta diaria', value: '30 min', icon: Flame },
                { label: 'Racha', value: `${userStreak} días`, icon: TrophyIcon },
                { label: 'XP total', value: `${userXp}`, icon: Star },
                { label: 'Lecciones', value: '14', icon: BookOpen },
              ].map((metric, index) => {
                const IconComp = metric.icon;
                return (
                  <div key={index} className="glass rounded-[2rem] border border-white/10 p-4 text-center">
                    <IconComp className="mx-auto mb-3 h-5 w-5 text-brand-orange" />
                    <p className="text-lg font-bold text-white">{metric.value}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="glass rounded-[2rem] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold">Plan actual</p>
                  <h3 className="text-lg font-bold text-white">EasyGo Premium</h3>
                </div>
                <span className="rounded-full bg-brand-orange/15 px-3 py-2 text-[10px] text-brand-orange uppercase tracking-[0.18em]">Recomendado</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Clases en vivo', 'Informe semanal', 'Voz instantánea', 'Reto diario'].map((item, index) => (
                  <div key={index} className="rounded-[1.75rem] bg-white/5 p-4 border border-white/10">
                    <p className="text-[11px] font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Vocabulario guardado</h3>
                <button
                  onClick={() => handleEarnXp(25)}
                  className="rounded-3xl bg-brand-purple px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white shadow-lg shadow-brand-violet/20 hover:bg-[#4c1ea4] transition-all"
                >
                  Actualizar XP
                </button>
              </div>
              <div className="space-y-3">
                {vocabularyList.slice(0, 3).map((item, index) => (
                  <div key={index} className="glass rounded-[2rem] border border-white/10 p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">{item.word}</p>
                      <p className="text-[11px] text-slate-400">{item.translation}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-brand-violet">{item.phonetic}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-brand-dark/95 backdrop-blur-xl py-3">
        <div className="max-w-md mx-auto flex items-center justify-between px-4">
          {[
            { id: 'home', label: 'Inicio', icon: Home },
            { id: 'lessons', label: 'Lecciones', icon: BookOpen },
            { id: 'practice', label: 'Hablar', icon: Mic },
            { id: 'scanner', label: 'Lens', icon: Camera },
            { id: 'community', label: 'Comunidad', icon: Users },
            { id: 'progress', label: 'Progreso', icon: BarChart3 },
          ].map((nav) => {
            const IconComp = nav.icon;
            const selected = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`flex flex-col items-center gap-1 text-[9px] font-semibold transition-all ${
                  selected ? 'text-brand-orange scale-110' : 'text-slate-400 hover:text-white'
                }`}
              >
                <IconComp className="w-5 h-5" />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
