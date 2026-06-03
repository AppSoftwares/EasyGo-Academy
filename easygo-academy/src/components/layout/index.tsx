import React from 'react';
import { useAuthStore } from '../../stores';
import { Avatar } from '../ui';
import { Home, BookOpen, MessageCircle, Users, Camera, BarChart3, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBack }) => {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-[#120E2E]/95 text-white border-b border-white/10 backdrop-blur-xl px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] text-white font-black shadow-lg shadow-[#FF5E36]/20">
            E&G
          </div>
          <div>
            <h1 className="text-lg font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              EasyGo Academy
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#FFB39A]">Camino de confianza</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 border border-white/10">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-semibold text-[#FF5E36]">{user.currentStreak} días</span>
            </div>
          )}
          <Avatar name={user?.displayName || 'User'} size="md" className="border-2 border-[#FF5E36]" />
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
  const tabs = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'lessons', icon: BookOpen, label: 'Lecciones' },
    { id: 'practice', icon: MessageCircle, label: 'Práctica' },
    { id: 'community', icon: Users, label: 'Comunidad' },
    { id: 'progress', icon: BarChart3, label: 'Progreso' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#120E2E]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-40">
      <div className="w-full max-w-full mx-auto flex justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center gap-1 rounded-3xl px-2 py-2 transition-all ${
                isActive ? 'text-[#FF5E36]' : 'text-white/40'
              }`}
            >
              <Icon size={22} className={isActive ? 'stroke-[2.2px]' : 'stroke-[1.5px]'} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">{tab.label}</span>
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
  <main className={`min-h-screen bg-[#120E2E] pb-28 px-4 ${className}`}>
    <div className="w-full max-w-lg mx-auto">{children}</div>
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
    className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all active:scale-[0.98]"
  >
    <div className={`w-12 h-12 rounded-3xl flex items-center justify-center text-white ${color || 'bg-[#FF5E36]'}`}>
      {icon}
    </div>
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">{label}</span>
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
      {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
    </div>
    {action && (
      <button onClick={action.onClick} className="text-xs font-bold text-[#FF5E36] uppercase tracking-[0.22em]">
        {action.label}
      </button>
    )}
  </div>
);

export default { Header, BottomNav, PageContainer, QuickActionButton, SectionHeader };