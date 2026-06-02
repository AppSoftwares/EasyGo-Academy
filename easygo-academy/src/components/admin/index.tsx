import React, { useState } from 'react';
import { Card, Button, Badge, Avatar } from '../ui';
import { useAuthStore } from '../../stores';
import { GRADIENT_CSS } from '../../utils/colors';
import {
  Users, BookOpen, TrendingUp, Award, MessageCircle, Activity,
  Settings, Bell, Search, Filter, Download, RefreshCw,
  Edit, Trash2, Eye, UserPlus, Mail, Shield, Plus, MessageSquare
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  totalLessonsCompleted: number;
  averageStreak: number;
}

export const AdminDashboard: React.FC<{ activeSection?: string }> = ({ activeSection = 'overview' }) => {
  const { user } = useAuthStore();

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <Card className="max-w-md mx-auto text-center py-12">
          <Shield size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-500">No tienes permisos para acceder al panel de administración.</p>
        </Card>
      </div>
    );
  }

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
          {[
            { id: 'overview', label: 'Resumen', icon: <BarChart3 size={20} /> },
            { id: 'users', label: 'Usuarios', icon: <Users size={20} /> },
            { id: 'lessons', label: 'Lecciones', icon: <BookOpen size={20} /> },
            { id: 'analytics', label: 'Análisis', icon: <TrendingUp size={20} /> },
            { id: 'community', label: 'Comunidad', icon: <MessageSquare size={20} /> },
            { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
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
        {activeSection === 'overview' && <AdminOverview />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'lessons' && <AdminLessons />}
        {activeSection === 'analytics' && <AdminAnalytics />}
        {activeSection === 'community' && <AdminCommunity />}
        {activeSection === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

const BarChart3: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
);

const AdminOverview: React.FC = () => {
  const stats: AdminStats = {
    totalUsers: 12847,
    activeUsersToday: 3456,
    totalLessonsCompleted: 89432,
    averageStreak: 12,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-purple-500 text-white"><p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p><p className="text-white/80">Usuarios</p></Card>
        <Card className="bg-orange-500 text-white"><p className="text-3xl font-bold">{stats.activeUsersToday.toLocaleString()}</p><p className="text-white/80">Activos Hoy</p></Card>
        <Card className="bg-green-500 text-white"><p className="text-3xl font-bold">{stats.totalLessonsCompleted.toLocaleString()}</p><p className="text-white/80">Lecciones</p></Card>
        <Card className="bg-blue-500 text-white"><p className="text-3xl font-bold">{stats.averageStreak}</p><p className="text-white/80">Racha Prom.</p></Card>
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="text-yellow-500" />Mejores Aprendedores</h3>
        <div className="space-y-3">
          {[
            { name: 'María García', xp: 15420, streak: 45, level: 8 },
            { name: 'Carlos Mendoza', xp: 12350, streak: 32, level: 7 },
            { name: 'Ana Rodríguez', xp: 10890, streak: 28, level: 6 },
            { name: 'Pedro López', xp: 9450, streak: 21, level: 5 },
            { name: 'Laura Sánchez', xp: 8920, streak: 19, level: 5 },
          ].map((learner, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-lg w-8 text-center">{['🥇', '🥈', '🥉'][index] || `#${index + 1}`}</span>
              <Avatar name={learner.name} size="sm" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{learner.name}</p>
                <p className="text-xs text-gray-500">🔥 {learner.streak} días</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-purple-600">{learner.xp.toLocaleString()}</p>
                <p className="text-xs text-gray-400">XP</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const AdminUsers: React.FC = () => {
  const users = [
    { name: 'María García', email: 'maria@email.com', level: 'intermediate', xp: 15420, streak: 45 },
    { name: 'Carlos Mendoza', email: 'carlos@email.com', level: 'advanced', xp: 12350, streak: 32 },
    { name: 'Ana Rodríguez', email: 'ana@email.com', level: 'beginner', xp: 8920, streak: 15 },
    { name: 'Pedro López', email: 'pedro@email.com', level: 'intermediate', xp: 9450, streak: 21 },
    { name: 'Laura Sánchez', email: 'laura@email.com', level: 'advanced', xp: 10890, streak: 28 },
  ];

  return (
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
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3"><Badge variant={user.level === 'beginner' ? 'info' : user.level === 'intermediate' ? 'success' : 'warning'}>{user.level}</Badge></td>
                <td className="py-3 font-bold text-purple-600">{user.xp.toLocaleString()}</td>
                <td className="py-3 text-orange-500">🔥 {user.streak}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Eye size={16} /></Button>
                    <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500"><Trash2 size={16} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdminLessons: React.FC = () => {
  const lessons = [
    { title: 'Saludos Básicos', category: 'Conversaciones', level: 'beginner', duration: 15, xp: 100 },
    { title: 'En el Restaurante', category: 'Conversaciones', level: 'beginner', duration: 20, xp: 150 },
    { title: 'Pronunciación TH', category: 'Pronunciación', level: 'intermediate', duration: 25, xp: 200 },
    { title: 'Present Simple', category: 'Gramática', level: 'beginner', duration: 30, xp: 250 },
    { title: 'Vocabulary: Medical', category: 'Vocabulario', level: 'advanced', duration: 20, xp: 180 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Lecciones</h2>
        <Button><Plus size={18} className="mr-2" />Nueva Lección</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {lessons.map((lesson, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between mb-2">
              <Badge variant={lesson.level === 'beginner' ? 'success' : lesson.level === 'intermediate' ? 'warning' : 'error'}>{lesson.level}</Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm"><Edit size={16} /></Button>
                <Button variant="ghost" size="sm" className="text-red-500"><Trash2 size={16} /></Button>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
            <p className="text-sm text-gray-500 mb-3">{lesson.category}</p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>⏱ {lesson.duration} min</span>
              <span>⭐ {lesson.xp} XP</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminAnalytics: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Análisis Detallado</h2>
    <div className="grid grid-cols-4 gap-4">
      <Card className="text-center p-6"><p className="text-3xl font-bold text-purple-600">78%</p><p className="text-sm text-gray-500">Tasa de Retención</p></Card>
      <Card className="text-center p-6"><p className="text-3xl font-bold text-orange-600">12.5</p><p className="text-sm text-gray-500">Min/Sesión</p></Card>
      <Card className="text-center p-6"><p className="text-3xl font-bold text-green-600">4.7</p><p className="text-sm text-gray-500">Lecciones/Semana</p></Card>
      <Card className="text-center p-6"><p className="text-3xl font-bold text-blue-600">85%</p><p className="text-sm text-gray-500">Tutorial Completo</p></Card>
    </div>
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">Distribución de Niveles</h3>
      <div className="flex gap-8 justify-center py-8">
        <div className="text-center"><p className="text-4xl font-bold text-green-500">45%</p><p className="text-sm text-gray-500">Principiante</p></div>
        <div className="text-center"><p className="text-4xl font-bold text-yellow-500">35%</p><p className="text-sm text-gray-500">Intermedio</p></div>
        <div className="text-center"><p className="text-4xl font-bold text-purple-500">20%</p><p className="text-sm text-gray-500">Avanzado</p></div>
      </div>
    </Card>
  </div>
);

const AdminCommunity: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Gestión Comunitaria</h2>
    <div className="grid grid-cols-4 gap-4">
      <Card className="text-center p-4"><p className="text-2xl font-bold">8,234</p><p className="text-sm text-gray-500">Posts Totales</p></Card>
      <Card className="text-center p-4"><p className="text-2xl font-bold">23,456</p><p className="text-sm text-gray-500">Comentarios</p></Card>
      <Card className="text-center p-4"><p className="text-2xl font-bold">156</p><p className="text-sm text-gray-500">Reportes Resueltos</p></Card>
      <Card className="text-center p-4"><p className="text-2xl font-bold">8</p><p className="text-sm text-gray-500">Suspendidos</p></Card>
    </div>
    <Card>
      <h4 className="font-semibold text-gray-900 mb-4">Reportes Recientes</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div><p className="font-medium">@Usuario123</p><p className="text-sm text-gray-500">Spam</p></div>
          <div className="flex gap-2"><Button size="sm" variant="outline">Ignorar</Button><Button size="sm" variant="danger">Revisar</Button></div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div><p className="font-medium">@Usuario456</p><p className="text-sm text-gray-500">Contenido inapropiado</p></div>
          <div className="flex gap-2"><Button size="sm" variant="outline">Ignorar</Button><Button size="sm" variant="danger">Revisar</Button></div>
        </div>
      </div>
    </Card>
  </div>
);

const AdminSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
    <Card>
      <h4 className="font-semibold text-gray-900 mb-4">Configuración General</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-600">Modo Mantenimiento</span>
          <Button variant="outline" size="sm">Desactivado</Button>
        </div>
        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-600">Registro de Nuevos Usuarios</span>
          <Button variant="outline" size="sm">Activado</Button>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-gray-600">Notificaciones Push</span>
          <Button variant="outline" size="sm">Activado</Button>
        </div>
      </div>
    </Card>
    <Card>
      <h4 className="font-semibold text-gray-900 mb-4">Respaldos</h4>
      <div className="space-y-3">
        <Button variant="outline" className="w-full"><Download size={18} className="mr-2" />Respaldar Base de Datos</Button>
        <Button variant="outline" className="w-full"><RefreshCw size={18} className="mr-2" />Sincronizar Datos</Button>
      </div>
    </Card>
  </div>
);

export default { AdminDashboard };