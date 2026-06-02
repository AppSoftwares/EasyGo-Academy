import React from 'react';
import { useAuthStore } from '../../stores';
import { Avatar, StreakCounter } from '../ui';
import { Home, BookOpen, MessageCircle, Users, Camera, BarChart3, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBack }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-[#120E2E] text-white px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={user?.displayName || 'User'} src={user?.avatarUrl} size="md" className="border-2 border-[#FF5E36]" />
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              EasyGo
            </h1>
            <p className="text-[10px] text-white/60 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
              Academy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/60 uppercase">Nivel</span>
                <span className="text-xs font-bold text-[#FFD700]">Hito 2: Práctico</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-lg">🔥</span>
                <span className="font-bold text-[#FF5E36]">{user.currentStreak}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuthStore();

  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'lessons', icon: BookOpen, label: 'Lecciones' },
    { id: 'practice', icon: MessageCircle, label: 'Práctica' },
    { id: 'community', icon: Users, label: 'Comunidad' },
    { id: 'progress', icon: BarChart3, label: 'Progreso' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#120E2E]/95 backdrop-blur-md border-t border-white/5 px-4 py-2 z-40 safe-area-bottom">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#FF5E36]' : 'text-white/40'
              }`}
            >
              <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
              <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => (
  <main className={`min-h-screen bg-[#120E2E] pb-24 px-4 ${className}`}>
    {children}
  </main>
);

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[#FF5E36] bg-[#FF5E36]/10`}>
      {icon}
    </div>
    <span className="text-[11px] font-semibold text-white/80 uppercase tracking-tight">{label}</span>
  </button>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4 mt-8">
    <div>
      <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h2>
      {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
    </div>
    {action && (
      <button onClick={action.onClick} className="text-xs font-bold text-[#FF5E36] uppercase tracking-wider">
        {action.label}
      </button>
    )}
  </div>
);

export default { Header, BottomNav, PageContainer, QuickActionButton, SectionHeader };