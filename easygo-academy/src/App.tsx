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
import { GRADIENT_CSS } from './utils/colors';
import {
  Mic, Camera, BookOpen, MessageCircle, Users, Settings as SettingsIcon, ChevronRight,
  Play, Clock, Star, BarChart3, TrendingUp, Users as UsersIcon, BookIcon,
  Plus, MessageSquare, AlertTriangle, Download, RefreshCw, Search, Filter
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

const scenarios = [
  { id: '1', title: 'En el Restaurante', description: 'Ordena comida y resuelve problemas', icon: '🍽️', context: 'Practica pedir comida, hacer preguntas sobre el menú.' },
  { id: '2', title: 'En la Tienda', description: 'Compra ropa y accesorios', icon: '🛍️', context: 'Practica describir tallas, colores y presupuestos.' },
  { id: '3', title: 'Entrevista de Trabajo', description: 'Responde preguntas comunes', icon: '💼', context: 'Prepárate para preguntas de empleo.' },
  { id: '4', title: 'Doctor Appointment', description: 'Describe síntomas y problemas', icon: '🏥', context: 'Aprende a explicar síntomas médicos.' },
];

// Home Page Component
const HomePage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuthStore();

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm">¡Hola,</p>
          <h2 className="text-2xl font-bold text-gray-900">{user?.displayName || 'Aprendedor'}! 👋</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('settings')}>
          <SettingsIcon size={20} />
        </Button>
      </div>

      <DailyProgressCard />

      <SectionHeader title="Acciones Rápidas" />
      <div className="grid grid-cols-4 gap-3 mb-6">
        <QuickActionButton icon={<Mic size={24} />} label="Hablar" onClick={() => onNavigate('practice')} color="bg-purple-100" />
        <QuickActionButton icon={<Camera size={24} />} label="Escanear" onClick={() => onNavigate('scanner')} color="bg-orange-100" />
        <QuickActionButton icon={<BookOpen size={24} />} label="Lecciones" onClick={() => onNavigate('lessons')} color="bg-blue-100" />
        <QuickActionButton icon={<Users size={24} />} label="Comunidad" onClick={() => onNavigate('community')} color="bg-green-100" />
      </div>

      <SectionHeader title="Misiones Diarias" action={{ label: 'Ver todas', onClick: () => {} }} />
      <Card className="bg-gradient-to-r from-purple-500 to-orange-500 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Continúa tu racha</h3>
            <p className="text-white/80 text-sm">Completa una lección para mantener tu racha de {user?.currentStreak || 0} días</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{user?.currentStreak || 0}</p>
            <p className="text-xs text-white/60">días</p>
          </div>
        </div>
        <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white">
          Continuar Aprendiendo
        </Button>
      </Card>

      <SectionHeader title="Continuar Aprendiendo" />
      <div className="space-y-4">
        {sampleLessons.filter(l => !l.completed).slice(0, 2).map((lesson) => (
          <Card key={lesson.id} className="cursor-pointer hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                💬
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                <p className="text-sm text-gray-500">{lesson.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={14} /> {lesson.durationMinutes} min</span>
                  <span className="text-xs text-purple-600 flex items-center gap-1"><Star size={14} /> +{lesson.xpReward} XP</span>
                </div>
              </div>
              <Button size="sm"><Play size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>

      <SectionHeader title="Mi Vocabulario" />
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">📚</div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{sampleVocabulary.length}</p>
            <p className="text-sm text-gray-500">palabras aprendidas</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleVocabulary.map((word) => (
            <Badge key={word.id} variant="gradient">{word.word}</Badge>
          ))}
        </div>
      </Card>

      <LeaderboardPreview onViewAll={() => onNavigate('leaderboard')} />
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Plan de Estudios</h1>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'roadmap' ? 'bg-[#FF5E36] text-white' : 'text-white/40'}`}
          >
            ROADMAP
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-[#FF5E36] text-white' : 'text-white/40'}`}
          >
            LISTA
          </button>
        </div>
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
                    ? 'bg-[#FF5E36] border-[#FF5E36] text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="cursor-pointer group" variant="flat">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${lesson.completed ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-white/5 text-white/40'}`}>
                    {lesson.completed ? '✓' : '💬'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">{lesson.title}</h3>
                      {lesson.completed && <Badge variant="success" className="bg-[#00E676]/20 text-[#00E676] border-none">HECHO</Badge>}
                    </div>
                    <p className="text-sm text-white/40 mt-1">{lesson.description}</p>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Práctica de Conversación</h1>

      {!isPracticing ? (
        <>
          <Card className="bg-gradient-to-r from-purple-500 to-orange-500 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎤</div>
              <div>
                <h3 className="font-bold text-xl">Práctica con IA</h3>
                <p className="text-white/80 text-sm">Conversa con un asistente virtual que te corrige en tiempo real</p>
              </div>
            </div>
          </Card>

          <h3 className="font-semibold text-gray-900 mb-4">Escoge un Escenario</h3>
          <div className="grid grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="cursor-pointer hover:shadow-lg transition-all text-center" onClick={() => { setSelectedScenario(scenario); setIsPracticing(true); }}>
                <div className="text-4xl mb-3">{scenario.icon}</div>
                <h4 className="font-semibold text-gray-900">{scenario.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{scenario.description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Pronunciación</h3>
            <Card onClick={() => setShowPronunciation(true)} className="cursor-pointer hover:shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-3xl">🔊</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Practica Pronunciación</h4>
                  <p className="text-sm text-gray-500">Recibe retroalimentación en tiempo real</p>
                </div>
                <ChevronRight size={24} className="text-gray-400" />
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setIsPracticing(false)}>← Volver</Button>
            {selectedScenario && <Badge variant="gradient">{selectedScenario.title}</Badge>}
          </div>
          <ConversationPractice scenario={selectedScenario || undefined} onComplete={(score) => console.log('Score:', score)} />
        </div>
      )}

      <Modal isOpen={showPronunciation} onClose={() => setShowPronunciation(false)} title="Practica Pronunciación">
        <PronunciationFeedback targetWord="Thursday" phonetic="ˈθɜːrzdeɪ" userAttempt="" onRetry={() => {}} />
      </Modal>
    </PageContainer>
  );
};

// Community Page
const CommunityPage: React.FC = () => {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Comunidad</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">📝</div>
          <p className="text-2xl font-bold text-gray-900">8,234</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">👥</div>
          <p className="text-2xl font-bold text-gray-900">1,256</p>
          <p className="text-xs text-gray-500">Activos</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">✅</div>
          <p className="text-2xl font-bold text-gray-900">4,567</p>
          <p className="text-xs text-gray-500">Respondidas</p>
        </div>
      </div>

      <CommunityFeed onPostClick={(id) => console.log('Post:', id)} />

      <div className="mt-6">
        <SectionHeader title="Grupos de Estudio" />
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center cursor-pointer hover:shadow-lg">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-3xl text-white mb-3">B</div>
            <h4 className="font-semibold text-gray-900">Beginners</h4>
            <p className="text-sm text-gray-500 mt-1">245 miembros</p>
            <Badge variant="success" className="mt-2">Unirse</Badge>
          </Card>
          <Card className="text-center cursor-pointer hover:shadow-lg">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-3xl text-white mb-3">I</div>
            <h4 className="font-semibold text-gray-900">Intermediate</h4>
            <p className="text-sm text-gray-500 mt-1">189 miembros</p>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Progreso</h1>

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Escáner de Objetos</h1>

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">EasyGo</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'
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
            <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
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
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <Button><Plus size={18} className="mr-2" />Agregar Usuario</Button>
            </div>
            <Card>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Buscar usuarios..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200" />
                </div>
                <Button variant="outline"><Filter size={18} /></Button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
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
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Lecciones</h2>
              <Button><Plus size={18} className="mr-2" />Nueva Lección</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card><h4 className="font-semibold">Saludos Básicos</h4><p className="text-sm text-gray-500">Principiante • 15 min</p><p className="text-purple-600 font-bold mt-2">+100 XP</p></Card>
              <Card><h4 className="font-semibold">En el Restaurante</h4><p className="text-sm text-gray-500">Principiante • 20 min</p><p className="text-purple-600 font-bold mt-2">+150 XP</p></Card>
              <Card><h4 className="font-semibold">Pronunciación TH</h4><p className="text-sm text-gray-500">Intermedio • 25 min</p><p className="text-purple-600 font-bold mt-2">+200 XP</p></Card>
            </div>
          </div>
        )}
        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Análisis Detallado</h2>
            <Card><p className="text-gray-500">Gráficos de engagement, retención y métricas...</p></Card>
          </div>
        )}
        {activeSection === 'community' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión Comunitaria</h2>
            <Card>
              <h4 className="font-semibold mb-4">Reportes Recientes</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div><p className="font-medium">@Usuario123</p><p className="text-sm text-gray-500">Spam</p></div>
                  <div className="flex gap-2"><Button size="sm" variant="outline">Ignorar</Button><Button size="sm" variant="danger">Revisar</Button></div>
                </div>
              </div>
            </Card>
          </div>
        )}
        {activeSection === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#120E2E]">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-[#FF5E36]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[40%] bg-[#5D26C1]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-lg mx-auto">
        {activeTab === 'home' && <HomePage onNavigate={handleTabChange} />}
        {activeTab === 'lessons' && <LessonsPage />}
        {activeTab === 'practice' && <PracticePage />}
        {activeTab === 'community' && <CommunityPage />}
        {activeTab === 'progress' && <ProgressPage />}
        {activeTab === 'scanner' && <ScannerPage />}
        {activeTab === 'settings' && <Settings />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;