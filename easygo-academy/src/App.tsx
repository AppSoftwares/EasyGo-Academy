import React, { useState, useEffect } from 'react';
import { Header, BottomNav, PageContainer, SectionHeader, QuickActionButton } from './components/layout';
import { Card, Button, Badge, Modal } from './components/ui';
import { DailyProgressCard } from './components/lessons';
import { Roadmap } from './components/lessons/Roadmap';
import { ConversationPractice, PronunciationFeedback } from './components/practice';
import { ObjectScanner } from './components/scanner';
import { CommunityFeed } from './components/community';
import { StatsDashboard, VocabularyTracker } from './components/progress';
import { XPAndLevel, StreakDisplay, AchievementsGrid, LeaderboardPreview } from './components/gamification';
import { SettingsPage } from './components/settings';
import { useAuthStore, useVocabularyStore } from './stores';
import {
  Mic, Camera, BookOpen, MessageCircle, Users, Settings as SettingsIcon,
  Play, Clock, Star, BarChart3, TrendingUp, Users as UsersIcon, BookIcon,
  Plus, MessageSquare, Download, RefreshCw
} from 'lucide-react';

// Sample data
const sampleLessons = [
  { id: '1', title: 'Saludos Básicos', description: 'Aprende a saludar y presentarte en inglés', category: 'daily-conversations', durationMinutes: 15, xpReward: 100, completed: true, progress: 100 },
  { id: '2', title: 'En el Restaurante', description: 'Ordena comida y pide la cuenta con confianza', category: 'daily-conversations', durationMinutes: 20, xpReward: 150, completed: false, progress: 60 },
  { id: '3', title: 'Pronunciación del TH', description: 'Domina los sonidos "th" en inglés', category: 'pronunciation-mastery', durationMinutes: 25, xpReward: 200, completed: false, progress: 0 },
  { id: '4', title: 'Present Simple', description: 'Estructura gramatical básica para describir rutinas', category: 'grammar-essentials', durationMinutes: 30, xpReward: 250, completed: false, progress: 0 },
];

const sampleVocabulary = [
  { id: '1', word: 'Hello', translation: 'Hola', phonetic: 'həˈloʊ', masteryLevel: 5 },
  { id: '2', word: 'Thank you', translation: 'Gracias', phonetic: 'θæŋk juː', masteryLevel: 4 },
  { id: '3', word: 'Please', translation: 'Por favor', phonetic: 'pliːz', masteryLevel: 3 },
];

const pricingPlans = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: '$0',
    cycle: '/ mes',
    features: ['5 lecciones al mes', 'Acceso a vocabulario básico'],
    lockedFeatures: ['Sin práctica de IA', 'Sin misiones avanzadas'],
    badge: 'Gratis',
    variant: 'outline',
  },
  {
    id: 'monthly',
    name: 'Plan Mensual',
    price: '$150.00',
    cycle: '/ mes',
    features: ['Acceso ilimitado a lecciones', 'Conversación con IA ilimitada', 'Misiones y gamificación', 'Reconocimiento de voz avanzado'],
    badge: 'Recomendado',
    variant: 'primary',
  },
  {
    id: 'quarterly',
    name: 'Plan Trimestral',
    price: '$420.00',
    cycle: '/ 3 meses',
    features: ['Todo lo del plan Mensual', 'Soporte prioritario 24/7', 'Certificados de finalización'],
    badge: 'Más Popular',
    variant: 'highlight',
  },
  {
    id: 'semiannual',
    name: 'Plan Semestral',
    price: '$780.00',
    cycle: '/ 6 meses',
    features: ['Todo lo del plan Trimestral', 'Masterclasses en vivo', 'Kit de bienvenida digital'],
    badge: 'Mejor Valor',
    variant: 'secondary',
  },
];

const scenarios = [
  { id: '1', title: 'En el Restaurante', description: 'Ordena comida y resuelve problemas', icon: '🍽️', context: 'Practica pedir comida, hacer preguntas sobre el menú.' },
  { id: '2', title: 'En la Tienda', description: 'Compra ropa y accesorios', icon: '🛍️', context: 'Practica describir tallas, colores y presupuestos.' },
  { id: '3', title: 'Entrevista de Trabajo', description: 'Responde preguntas comunes', icon: '💼', context: 'Prepárate para preguntas de empleo.' },
  { id: '4', title: 'Doctor Appointment', description: 'Describe síntomas y problemas', icon: '🏥', context: 'Aprende a explicar síntomas médicos.' },
];

// Home Page Component
const HomePage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const missions = [
    { id: '1', title: 'Practica 5 frases de voz', reward: '50 XP', icon: '🎙️', completed: false },
    { id: '2', title: 'Completa 2 lecciones', reward: '100 XP', icon: '✅', completed: true },
    { id: '3', title: 'Comparte un logro', reward: '30 XP', icon: '🏆', completed: false },
  ];

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 uppercase tracking-[0.28em] text-[10px]">Bienvenido de nuevo</p>
            <h2 className="mt-2 text-3xl font-black text-white leading-tight">¡Hola, {user?.displayName || 'Aprendedor'} 👋</h2>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[32px] px-4 py-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] flex items-center justify-center text-white text-lg font-black">E</div>
            <div>
              <p className="text-xs text-white/50">Tu racha</p>
              <p className="text-lg font-bold text-white">{user?.currentStreak || 0} días</p>
            </div>
          </div>
        </div>
      </div>

      <DailyProgressCard />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <QuickActionButton icon={<Mic size={24} />} label="Hablar" onClick={() => onNavigate('practice')} color="bg-purple-100" />
        <QuickActionButton icon={<Camera size={24} />} label="Escanear" onClick={() => onNavigate('scanner')} color="bg-orange-100" />
        <QuickActionButton icon={<BookOpen size={24} />} label="Lecciones" onClick={() => onNavigate('lessons')} color="bg-blue-100" />
        <QuickActionButton icon={<Users size={24} />} label="Comunidad" onClick={() => onNavigate('community')} color="bg-green-100" />
        <QuickActionButton icon={<Star size={24} />} label="Planes" onClick={() => onNavigate('plans')} color="bg-red-100" />
      </div>

      <Card className="mb-6 bg-[#1B0D2E] border border-white/10 shadow-[0_20px_40px_rgba(255,94,54,0.15)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5E36]/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col gap-4 p-6">
          <div>
            <p className="text-sm text-white/60 uppercase tracking-[0.24em]">Mejora tu experiencia</p>
            <h3 className="text-2xl font-black text-white">Planes Premium</h3>
          </div>
          <p className="text-sm text-white/60 max-w-xl">Accede a ejercicios ilimitados, práctica con IA, misiones avanzadas y soporte prioritario desde un plan diseñado para tus metas.</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#FFB39A]">Desde</p>
              <p className="text-3xl font-black text-white">$150<small className="text-sm text-white/60">/ mes</small></p>
            </div>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#FF5E36] to-[#5D26C1] text-white" onClick={() => onNavigate('plans')}>Ver Planes</Button>
          </div>
        </div>
      </Card>

      <SectionHeader title="Continúa Aprendiendo" action={{ label: 'Ver todo', onClick: () => onNavigate('lessons') }} />
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-6">
        {sampleLessons.filter((lesson) => !lesson.completed).slice(0, 2).map((lesson) => (
          <Card key={lesson.id} className="min-w-[240px] shrink-0 p-4" variant="flat">
            <div className="h-36 rounded-3xl overflow-hidden mb-4 bg-white/5 border border-white/10">
              <div className="h-full w-full bg-gradient-to-br from-[#FF5E36]/20 to-[#5D26C1]/10 flex items-end p-4">
                <span className="text-4xl">📘</span>
              </div>
            </div>
            <h3 className="font-semibold text-white mb-1">{lesson.title}</h3>
            <p className="text-sm text-white/60 mb-4">{lesson.description}</p>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-[#FF5E36] to-[#5D26C1]" style={{ width: `${lesson.progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/50">
              <span>{lesson.durationMinutes} min</span>
              <span>+{lesson.xpReward} XP</span>
            </div>
          </Card>
        ))}
      </div>

      <SectionHeader title="Misiones del Día" action={{ label: 'Ver todas', onClick: () => {} }} />
      <div className="space-y-3 mb-6">
        {missions.map((mission) => (
          <div key={mission.id} className={`flex items-center gap-4 p-4 rounded-3xl border ${mission.completed ? 'border-[#00E676]/30 bg-[#00E676]/10' : 'border-white/10 bg-white/5'}`}>
            <div className="w-12 h-12 rounded-3xl bg-white/10 flex items-center justify-center text-xl text-[#FF5E36]">
              {mission.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{mission.title}</p>
              <p className="text-[12px] text-white/50">Recompensa: {mission.reward}</p>
            </div>
            {mission.completed ? <span className="text-[#00E676] font-bold">Hecho</span> : <Button variant="ghost" size="sm">IR</Button>}
          </div>
        ))}
      </div>

      <SectionHeader title="Liga Diamante" />
      <LeaderboardPreview onViewAll={() => onNavigate('progress')} />
    </PageContainer>
  );
};

// Lessons Page
const LessonsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'roadmap'>('roadmap');

  const categories = [
    { id: 'all', label: 'Todos', icon: '📚' },
    { id: 'daily-conversations', label: 'Conversaciones', icon: '💬' },
    { id: 'pronunciation-mastery', label: 'Pronunciación', icon: '🎤' },
    { id: 'vocabulary-building', label: 'Vocabulario', icon: '📖' },
    { id: 'grammar-essentials', label: 'Gramática', icon: '📝' },
    { id: 'cultural-immersion', label: 'Cultura', icon: '🌎' },
  ];

  const filteredLessons = selectedCategory === 'all' ? sampleLessons : sampleLessons.filter(l => l.category === selectedCategory);

  return (
    <PageContainer>
      <SectionHeader
        title="Plan de Estudios"
        subtitle="Elige tu camino de aprendizaje paso a paso"
      />

      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#1A153D] border border-white/10 rounded-3xl p-2">
        <button
          onClick={() => setViewMode('roadmap')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${viewMode === 'roadmap' ? 'bg-[#FF5E36] text-white' : 'text-white/50 hover:text-white'}`}
        >
          ROADMAP
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[#FF5E36] text-white' : 'text-white/50 hover:text-white'}`}
        >
          LISTA
        </button>
      </div>

      {viewMode === 'roadmap' ? (
        <Roadmap />
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5E36] border-[#FF5E36] text-white shadow-[0_10px_30px_rgba(255,94,54,0.18)]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer group bg-[#1A153D] border border-white/10" variant="flat">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${lesson.completed ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-white/5 text-white/70'} transition-all group-hover:scale-[1.01]`}>
                    {lesson.completed ? '✓' : '💬'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-lg">{lesson.title}</h3>
                      {lesson.completed && <Badge variant="success" className="bg-[#00E676]/20 text-[#00E676] border-none">HECHO</Badge>}
                    </div>
                    <p className="text-sm text-white/50 mt-1">{lesson.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/10">{lesson.category.replace('-', ' ')}</span>
                      <span className="text-[10px] font-bold text-[#FF5E36] uppercase tracking-[0.2em] bg-[#FF5E36]/10 px-3 py-1 rounded-full border border-[#FF5E36]/10">+{lesson.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
};

// Practice Page
const PracticePage: React.FC = () => {
  const [isPracticing, setIsPracticing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<typeof scenarios[0] | null>(null);
  const [showPronunciation, setShowPronunciation] = useState(false);

  return (
    <PageContainer>
      <SectionHeader
        title="Práctica de Conversación"
        subtitle="Habla con confianza usando escenarios reales"
      />

      {!isPracticing ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => { setSelectedScenario(scenario); setIsPracticing(true); }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-[#FF5E36]/40 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#120E2E] to-transparent opacity-20" />
                <div className="relative z-10 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-3xl bg-[#FF5E36]/10 flex items-center justify-center text-white text-2xl shadow-sm">{scenario.icon}</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Escenario</p>
                    <h4 className="text-white font-semibold">{scenario.title}</h4>
                    <p className="text-[11px] text-white/50 mt-1">{scenario.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Card className="p-4 mb-6 bg-white/5 border border-white/10">
            <h3 className="font-bold text-white text-lg mb-2">Retroalimentación instantánea</h3>
            <p className="text-sm text-white/60">Practica pronunciación, frases comunes y revisa tus respuestas para mejorar palabra por palabra.</p>
          </Card>

          <button
            onClick={() => setShowPronunciation(true)}
            className="w-full rounded-3xl bg-[#FF5E36] px-4 py-4 text-white font-bold uppercase tracking-[0.18em] transition-all hover:bg-[#ff7a55]"
          >
            Practica Pronunciación
          </button>
        </>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setIsPracticing(false)}>← Volver</Button>
            {selectedScenario && <Badge variant="gradient">{selectedScenario.title}</Badge>}
          </div>
          <div className="rounded-[32px] overflow-hidden border border-white/10 bg-[#0F0B2C] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <ConversationPractice scenario={selectedScenario || undefined} onComplete={(score) => console.log('Score:', score)} />
          </div>
        </div>
      )}

      <Modal isOpen={showPronunciation} onClose={() => setShowPronunciation(false)} title="Practica Pronunciación">
        <PronunciationFeedback targetWord="Thursday" phonetic="ˈθɜːrzdeɪ" userAttempt="" onRetry={() => {}} />
      </Modal>
    </PageContainer>
  );
};

// Plans Page
const PlansPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 uppercase tracking-[0.28em] text-[10px]">Planes de Suscripción</p>
            <h2 className="mt-2 text-3xl font-black text-white leading-tight">Invierte en tu futuro</h2>
          </div>
          <div className="px-3 py-2 rounded-3xl bg-white/5 border border-white/10 text-sm text-white/70">Sin contratos</div>
        </div>
      </div>

      <div className="space-y-4">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative overflow-hidden rounded-[32px] border p-6 ${plan.variant === 'highlight' ? 'border-[#6C39D0] bg-[#1F0F43] shadow-[0_20px_60px_rgba(93,38,193,0.25)]' : 'border-white/10 bg-white/5'}`}
          >
            {plan.badge && (
              <div className={`absolute top-4 right-4 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] ${plan.variant === 'highlight' ? 'bg-[#6C39D0] text-white' : 'bg-white/10 text-white/70'}`}>
                {plan.badge}
              </div>
            )}
            <div className="mb-6">
              <h3 className={`text-xl font-bold ${plan.variant === 'highlight' ? 'text-[#FFFFFF]' : 'text-white'}`}>{plan.name}</h3>
              <div className="flex items-end gap-2 mt-3">
                <span className={`text-4xl font-black ${plan.variant === 'highlight' ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                <span className="text-sm text-white/50">{plan.cycle}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="text-[#00E676]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
              {plan.lockedFeatures?.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-white/40 text-sm opacity-50">
                  <span className="text-white/40">🔒</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${plan.variant === 'outline' ? 'bg-transparent border border-white/10 text-white' : ''} ${plan.variant === 'highlight' ? 'bg-gradient-to-r from-[#FF5E36] to-[#5D26C1] text-white border-none shadow-xl shadow-[#5D26C1]/20 hover:brightness-105' : ''}`}
              variant={plan.variant === 'outline' ? 'ghost' : 'primary'}
            >
              {plan.variant === 'outline' ? 'Continuar Gratis' : plan.variant === 'highlight' ? 'Elegir Plan Popular' : 'Comenzar Ahora'}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-white/50">
        <p>Cancela en cualquier momento desde la app. Sin contratos obligatorios.</p>
      </div>
    </PageContainer>
  );
};

// Community Page
const CommunityPage: React.FC = () => {
  return (
    <PageContainer>
      <SectionHeader
        title="Comunidad"
        subtitle="Conéctate con otros aprendices y comparte tus avances"
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1A153D] rounded-3xl p-4 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)] border border-white/10">
          <div className="text-2xl mb-1">📝</div>
          <p className="text-2xl font-bold text-white">8,234</p>
          <p className="text-xs text-white/50">Posts</p>
        </div>
        <div className="bg-[#1A153D] rounded-3xl p-4 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)] border border-white/10">
          <div className="text-2xl mb-1">👥</div>
          <p className="text-2xl font-bold text-white">1,256</p>
          <p className="text-xs text-white/50">Activos</p>
        </div>
        <div className="bg-[#1A153D] rounded-3xl p-4 text-center shadow-[0_18px_40px_rgba(0,0,0,0.18)] border border-white/10">
          <div className="text-2xl mb-1">✅</div>
          <p className="text-2xl font-bold text-white">4,567</p>
          <p className="text-xs text-white/50">Respondidas</p>
        </div>
      </div>

      <CommunityFeed onPostClick={(id) => console.log('Post:', id)} />

      <div className="mt-6">
        <SectionHeader title="Grupos de Estudio" />
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center cursor-pointer hover:shadow-lg bg-[#1A153D] border border-white/10">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-3xl text-white mb-3">B</div>
            <h4 className="font-semibold text-white">Beginners</h4>
            <p className="text-sm text-white/50 mt-1">245 miembros</p>
            <Badge variant="success" className="mt-2">Unirse</Badge>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg bg-[#1A153D] border border-white/10">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-[#5D26C1] to-[#FF5E36] flex items-center justify-center text-3xl text-white mb-3">I</div>
            <h4 className="font-semibold text-white">Intermediate</h4>
            <p className="text-sm text-white/50 mt-1">189 miembros</p>
            <Badge variant="secondary" className="mt-2">Unirse</Badge>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

// Progress Page
const ProgressPage: React.FC = () => {
  return (
    <PageContainer>
      <SectionHeader
        title="Mi Progreso"
        subtitle="Sigue tu crecimiento y celebra cada avance"
      />

      <XPAndLevel />
      <div className="mt-6"><StreakDisplay /></div>
      <div className="mt-6"><AchievementsGrid /></div>
      <div className="mt-6"><StatsDashboard /></div>
      <div className="mt-6"><VocabularyTracker /></div>
    </PageContainer>
  );
};

// Scanner Page
const ScannerPage: React.FC = () => {
  const { addVocabulary } = useVocabularyStore();

  return (
    <PageContainer>
      <SectionHeader
        title="Escáner de Objetos"
        subtitle="Aprende nuevas palabras directamente desde el mundo real"
      />

      <Card className="bg-gradient-to-r from-purple-500 to-orange-500 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">📸</div>
          <div>
            <h3 className="font-bold text-lg">Escanea y Aprende</h3>
            <p className="text-white/80 text-sm">Apunta la cámara a cualquier objeto para aprender su nombre en inglés</p>
          </div>
        </div>
      </Card>

      <ObjectScanner onObjectDetected={(obj) => console.log('Detected:', obj)} onSaveToVocabulary={(obj) => addVocabulary(obj)} />
    </PageContainer>
  );
};

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { user } = useAuthStore();

  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Usuarios', icon: <UsersIcon size={20} /> },
    { id: 'lessons', label: 'Lecciones', icon: <BookIcon size={20} /> },
    { id: 'analytics', label: 'Análisis', icon: <TrendingUp size={20} /> },
    { id: 'community', label: 'Comunidad', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Configuración', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#120E2E] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#160F37] border-r border-white/10 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="font-bold text-white">EasyGo</h1>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id ? 'bg-purple-500 text-white' : 'text-white/60 hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Resumen General</h2>
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-purple-500 text-white"><p className="text-3xl font-bold">12,847</p><p className="text-white/80">Usuarios</p></Card>
              <Card className="bg-orange-500 text-white"><p className="text-3xl font-bold">3,456</p><p className="text-white/80">Activos Hoy</p></Card>
              <Card className="bg-green-500 text-white"><p className="text-3xl font-bold">89,432</p><p className="text-white/80">Lecciones</p></Card>
              <Card className="bg-blue-500 text-white"><p className="text-3xl font-bold">12</p><p className="text-white/80">Racha Prom.</p></Card>
            </div>
          </div>
        )}
        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
              <Button><Plus size={18} className="mr-2" />Agregar Usuario</Button>
            </div>
            <Card>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input type="text" placeholder="Buscar usuarios..." className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-[#120E2E] text-white placeholder:text-white/40" />
                </div>
                <Button variant="outline"><Filter size={18} /></Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-white/60 border-b">
                    <th className="pb-3">Usuario</th>
                    <th className="pb-3">Nivel</th>
                    <th className="pb-3">XP</th>
                    <th className="pb-3">Racha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-3">María García</td><td><Badge variant="success">Intermedio</Badge></td><td className="text-purple-600 font-bold">15,420</td><td>🔥 45</td></tr>
                  <tr className="border-b"><td className="py-3">Carlos Mendoza</td><td><Badge variant="warning">Avanzado</Badge></td><td className="text-purple-600 font-bold">12,350</td><td>🔥 32</td></tr>
                  <tr className="border-b"><td className="py-3">Ana Rodríguez</td><td><Badge variant="info">Principiante</Badge></td><td className="text-purple-600 font-bold">8,920</td><td>🔥 15</td></tr>
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {activeSection === 'lessons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Gestión de Lecciones</h2>
              <Button><Plus size={18} className="mr-2" />Nueva Lección</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card><h4 className="font-semibold">Saludos Básicos</h4><p className="text-sm text-white/60">Principiante • 15 min</p><p className="text-purple-600 font-bold mt-2">+100 XP</p></Card>
              <Card><h4 className="font-semibold">En el Restaurante</h4><p className="text-sm text-white/60">Principiante • 20 min</p><p className="text-purple-600 font-bold mt-2">+150 XP</p></Card>
              <Card><h4 className="font-semibold">Pronunciación TH</h4><p className="text-sm text-white/60">Intermedio • 25 min</p><p className="text-purple-600 font-bold mt-2">+200 XP</p></Card>
            </div>
          </div>
        )}
        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Análisis Detallado</h2>
            <Card><p className="text-white/60">Gráficos de engagement, retención y métricas...</p></Card>
          </div>
        )}
        {activeSection === 'community' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gestión Comunitaria</h2>
            <Card>
              <h4 className="font-semibold mb-4">Reportes Recientes</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#1B143B] rounded-3xl">
                  <div><p className="font-medium text-white">@Usuario123</p><p className="text-sm text-white/60">Spam</p></div>
                  <div className="flex gap-2"><Button size="sm" variant="outline">Ignorar</Button><Button size="sm" variant="danger">Revisar</Button></div>
                </div>
              </div>
            </Card>
          </div>
        )}
        {activeSection === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Modo Mantenimiento</span>
                  <Button variant="outline" size="sm">Desactivado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Registro de Nuevos Usuarios</span>
                  <Button variant="outline" size="sm">Activado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notificaciones Push</span>
                  <Button variant="outline" size="sm">Activado</Button>
                </div>
              </div>
            </Card>
            <Card>
              <h4 className="font-semibold mb-4">Respaldos</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full"><Download size={18} className="mr-2" />Respaldar Base de Datos</Button>
                <Button variant="outline" className="w-full"><RefreshCw size={18} className="mr-2" />Sincronizar Datos</Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

// Onboarding Screen
const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { setUser } = useAuthStore();

  const slides = [
    { emoji: '🚀', title: 'Domina el Inglés Real', description: 'Aprende el inglés que realmente usas en el supermercado, el trabajo y con tus hijos.' },
    { emoji: '🎤', title: 'Pierde el Miedo a Hablar', description: 'Practica con nuestra IA que te corrige suavemente para ganar confianza.' },
    { emoji: '📸', title: 'Aprende del Mundo', description: 'Apunta tu cámara a cualquier objeto y descubre cómo se dice en inglés al instante.' },
    { emoji: '🔥', title: 'Únete a la Comunidad', description: 'Miles de hispanos como tú ya están logrando sus metas. ¡Empieza hoy!' },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setUser({
        id: '1', email: 'demo@easygo.com', displayName: 'Nuevo Aprendedor', level: 'beginner',
        totalXp: 0, currentStreak: 0, longestStreak: 0, streakFreezes: 0,
        createdAt: new Date().toISOString(), lastActiveDate: new Date().toISOString(), isAdmin: false,
        settings: { darkMode: true, notifications: true, dailyGoalMinutes: 30, preferredVoice: 'default', showPronunciationTips: true },
      });
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-visible bg-[#120E2E]">
      {/* Animated Background Gradients */}
      <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-[#FF5E36]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="hidden md:block absolute bottom-[-10%] left-[-10%] w-[80%] h-[40%] bg-[#5D26C1]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="flex-1 flex flex-col items-center justify-center p-10 text-white relative z-10">
        <div className="text-9xl mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-bounce-slow">
          {slides[step].emoji}
        </div>
        <h1 className="text-4xl font-black text-center mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {slides[step].title}
        </h1>
        <p className="text-white/60 text-center text-lg leading-relaxed max-w-[280px]">
          {slides[step].description}
        </p>
      </div>

      <div className="p-10 relative z-10">
        <div className="flex justify-center gap-3 mb-10">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'bg-[#FF5E36] w-10' : 'bg-white/10 w-4'}`}
            />
          ))}
        </div>
        <Button
          onClick={handleNext}
          className="w-full h-16 text-lg shadow-[0_15px_30px_rgba(255,94,54,0.3)]"
          size="lg"
        >
          {step === slides.length - 1 ? '¡VAMOS ALLÁ!' : 'SIGUIENTE'}
        </Button>
        {step < slides.length - 1 && (
          <button onClick={() => setStep(slides.length - 1)} className="w-full mt-6 text-white/30 text-sm font-bold uppercase tracking-widest">
            Saltar Intro
          </button>
        )}
      </div>
    </div>
  );
};

// Settings Page Route
const Settings: React.FC = () => {
  return <SettingsPage />;
};

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setUser({
        id: '1', email: 'admin@easygo.com', displayName: 'Admin User', level: 'advanced',
        totalXp: 25000, currentStreak: 45, longestStreak: 60, streakFreezes: 5,
        createdAt: new Date().toISOString(), lastActiveDate: new Date().toISOString(), isAdmin: true,
        settings: { darkMode: false, notifications: true, dailyGoalMinutes: 30, preferredVoice: 'default', showPronunciationTips: true },
      });
    }
  }, []);

  const handleLogin = () => setShowOnboarding(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'admin') {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
      setActiveTab(tab);
    }
  };

  if (showOnboarding) return <OnboardingScreen onComplete={handleLogin} />;
  if (isAdminMode) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-[#120E2E] text-white">
      <Header />
      <div className="max-w-lg mx-auto">
        {activeTab === 'home' && <HomePage onNavigate={handleTabChange} />}
        {activeTab === 'lessons' && <LessonsPage />}
        {activeTab === 'practice' && <PracticePage />}
        {activeTab === 'community' && <CommunityPage />}
        {activeTab === 'progress' && <ProgressPage />}
        {activeTab === 'scanner' && <ScannerPage />}
        {activeTab === 'plans' && <PlansPage />}
        {activeTab === 'settings' && <Settings />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;
