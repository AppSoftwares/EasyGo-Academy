import React, { useState } from 'react';
import { Card, Button, Badge, ProgressBar } from '../ui';
import { useAuthStore, useGamificationStore } from '../../stores';
import { GRADIENT_CSS } from '../../utils/colors';
import { Trophy, Star, Zap, Flame, Gift, Crown, Target, CheckCircle2 } from 'lucide-react';

interface XPAndLevelProps {}

export const XPAndLevel: React.FC<XPAndLevelProps> = () => {
  const { user } = useAuthStore();

  const level = Math.floor((user?.totalXp || 0) / 1000) + 1;
  const currentLevelXp = (user?.totalXp || 0) % 1000;
  const nextLevelXp = 1000;
  const progress = (currentLevelXp / nextLevelXp) * 100;

  return (
    <Card className="bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] text-white border-none relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
          <Crown size={32} className="text-[#FFD700]" />
        </div>
        <div className="flex-1">
          <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">Nivel {level}</p>
          <h3 className="text-2xl font-black" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user?.displayName || 'Aprendedor'}</h3>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] font-bold mb-1 opacity-70">
              <span>{currentLevelXp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{user?.totalXp || 0}</p>
          <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest">Puntos Totales</p>
        </div>
      </div>
    </Card>
  );
};

interface StreakDisplayProps {
  compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ compact = false }) => {
  const { user } = useAuthStore();
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;

  const getStreakEmoji = () => {
    if (currentStreak >= 365) return '👑';
    if (currentStreak >= 100) return '🔥🔥🔥';
    if (currentStreak >= 30) return '🔥🔥';
    if (currentStreak >= 7) return '🔥';
    return '✨';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-[#FF5E36]">
        <span className="text-xl">{getStreakEmoji()}</span>
        <span className="font-bold">{currentStreak}</span>
      </div>
    );
  }

  return (
    <Card className="text-center relative overflow-hidden" variant="elevated">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5E36] to-[#5D26C1]" />
      <div className="text-6xl mb-4 animate-bounce-slow">{getStreakEmoji()}</div>
      <h3 className="text-5xl font-black text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{currentStreak}</h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Días de racha imparable</p>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/30 uppercase tracking-wider">Record histórico</span>
          <span className="font-black text-[#FFD700] text-lg">{longestStreak} DÍAS</span>
        </div>
      </div>
    </Card>
  );
};

interface DailyMissionsListProps {
  onMissionComplete?: (missionId: string) => void;
}

export const DailyMissionsList: React.FC<DailyMissionsListProps> = ({ onMissionComplete }) => {
  const { completeMission } = useGamificationStore();
  const [missions, setMissions] = useState([
    { id: '1', title: '🔥 Racha activa', description: 'Practica hoy para mantener tu racha', progress: 1, target: 1, xpReward: 20, completed: true, type: 'streak' },
    { id: '2', title: '📚 2 Lecciones', description: 'Completa 2 lecciones hoy', progress: 1, target: 2, xpReward: 50, completed: false, type: 'lessons' },
    { id: '3', title: '💬 5 minutos de conversación', description: 'Practica hablando 5 minutos', progress: 3, target: 5, xpReward: 30, completed: false, type: 'conversation' },
    { id: '4', title: '📝 10 palabras nuevas', description: 'Aprende 10 palabras nuevas', progress: 7, target: 10, xpReward: 40, completed: false, type: 'vocabulary' },
  ]);

  const handleComplete = (missionId: string) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true, progress: m.target } : m));
    completeMission(missionId);
    onMissionComplete?.(missionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs">
          <Target className="text-[#FF5E36]" size={16} />
          Misiones Diarias
        </h3>
        <Badge className="bg-[#FF5E36]/20 text-[#FF5E36] border-none font-black">{missions.filter(m => m.completed).length}/{missions.length}</Badge>
      </div>

      {missions.map((mission) => (
        <Card key={mission.id} className={`transition-all ${mission.completed ? 'bg-[#00E676]/5 border-[#00E676]/30 shadow-[0_0_20px_rgba(0,230,118,0.1)]' : 'bg-white/5 border-white/10'}`} variant="flat">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-2xl transition-colors ${
              mission.completed ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-white/5 text-white/40'
            }`}>
              {mission.completed ? '✓' : mission.type === 'streak' ? '🔥' : mission.type === 'lessons' ? '📚' : mission.type === 'conversation' ? '💬' : '📝'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className="font-bold text-white text-sm">{mission.title}</h4>
                <span className="text-[10px] font-black text-[#FF5E36] bg-[#FF5E36]/10 px-2 py-0.5 rounded-full">+{mission.xpReward} XP</span>
              </div>
              <p className="text-xs text-white/40 mb-3">{mission.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-1000 rounded-full ${mission.completed ? 'bg-[#00E676]' : 'bg-[#FF5E36]'}`}
                    style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/20">
                  {mission.progress}/{mission.target}
                </span>
              </div>
            </div>
          </div>
          {!mission.completed && mission.progress >= mission.target && (
            <Button className="w-full mt-4 h-10 text-[10px]" size="sm" onClick={() => handleComplete(mission.id)}>
              RECLAMAR RECOMPENSA
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

interface AchievementBadgeProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt?: string;
  };
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ badge }) => {
  const isEarned = !!badge.earnedAt;

  return (
    <div className={`p-5 rounded-3xl text-center transition-all border ${isEarned ? 'bg-[#1A153D] border-[#FFD700]/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-30 grayscale'}`}>
      <div className={`text-4xl mb-3 ${isEarned ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]' : ''}`}>{badge.icon}</div>
      <h4 className="font-bold text-white text-[11px] leading-tight uppercase tracking-tight">{badge.name}</h4>
      <p className="text-[9px] text-white/40 mt-1.5 leading-tight">{badge.description}</p>
      {isEarned && (
        <div className="mt-3 flex justify-center">
          <div className="bg-[#00E676]/10 text-[#00E676] p-1 rounded-full border border-[#00E676]/20">
            <CheckCircle2 size={10} />
          </div>
        </div>
      )}
    </div>
  );
};

interface AchievementsGridProps {}

export const AchievementsGrid: React.FC<AchievementsGridProps> = () => {
  const badges = [
    { id: '1', name: 'Primera Palabra', description: 'Aprende tu primera palabra', icon: '📝', earnedAt: new Date().toISOString() },
    { id: '2', name: '7 Días de Racha', description: 'Mantén una racha de 7 días', icon: '🔥', earnedAt: new Date().toISOString() },
    { id: '3', name: 'Primer Conversación', description: 'Completa tu primera práctica', icon: '💬', earnedAt: new Date().toISOString() },
    { id: '4', name: 'Explorador', description: 'Usa 5 categorías diferentes', icon: '🗺️', earnedAt: new Date().toISOString() },
    { id: '5', name: '30 Días de Racha', description: 'Mantén una racha de 30 días', icon: '⭐', earnedAt: undefined },
    { id: '6', name: 'Maestro del Vocabulario', description: 'Aprende 100 palabras', icon: '🏆', earnedAt: undefined },
    { id: '7', name: 'Noctámbulo', description: 'Practica después de las 10pm', icon: '🦉', earnedAt: undefined },
    { id: '8', name: 'Madrugador', description: 'Practica antes de las 7am', icon: '🌅', earnedAt: undefined },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs">
          <Trophy className="text-[#FFD700]" size={16} />
          Mis Logros
        </h3>
        <Badge className="bg-[#FFD700]/10 text-[#FFD700] border-none font-black">{badges.filter(b => b.earnedAt).length}/{badges.length}</Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <AchievementBadge key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};

interface LeaderboardPreviewProps {
  onViewAll?: () => void;
}

export const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({ onViewAll }) => {
  const { user } = useAuthStore();

  const topUsers = [
    { id: '1', displayName: 'María García', totalXp: 15420, currentStreak: 45, level: 8 },
    { id: '2', displayName: 'Carlos Mendoza', totalXp: 12350, currentStreak: 32, level: 7 },
    { id: '3', displayName: 'Ana Rodríguez', totalXp: 10890, currentStreak: 28, level: 6 },
    { id: '4', displayName: 'Pedro López', totalXp: 9450, currentStreak: 21, level: 5 },
    { id: '5', displayName: user?.displayName || 'Tú', totalXp: user?.totalXp || 0, currentStreak: user?.currentStreak || 0, level: Math.floor((user?.totalXp || 0) / 1000) + 1 },
  ];

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Card variant="flat" className="bg-[#1A153D] border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs">
          <Trophy className="text-[#FFD700]" size={16} />
          Top de la Semana
        </h3>
        <button onClick={onViewAll} className="text-[10px] font-black text-[#FF5E36] uppercase tracking-widest">
          VER TODO
        </button>
      </div>

      <div className="space-y-3">
        {topUsers.map((userItem, index) => (
          <div
            key={userItem.id}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
              userItem.displayName === 'Tú' ? 'bg-[#FF5E36]/10 ring-1 ring-[#FF5E36]/30' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="text-lg w-6 text-center">{medals[index] || `#${index + 1}`}</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] flex items-center justify-center text-white font-black text-sm shadow-lg">
              {userItem.displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">{userItem.displayName}</p>
              <p className="text-[10px] text-white/40 font-bold">🔥 {userItem.currentStreak} DÍAS</p>
            </div>
            <div className="text-right">
              <p className="font-black text-white">{userItem.totalXp.toLocaleString()}</p>
              <p className="text-[8px] text-white/20 font-bold uppercase">XP</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

interface RewardsStoreProps {
  onRedeem?: (rewardId: string) => void;
}

export const RewardsStore: React.FC<RewardsStoreProps> = ({ onRedeem }) => {
  const { user } = useAuthStore();

  const rewards = [
    { id: '1', name: '🔥 Congelador de Racha', description: 'Protege tu racha por 1 día', cost: 500, icon: '🧊' },
    { id: '2', name: '⭐ XP Bonus x2', description: 'Duplica tu XP por 1 día', cost: 300, icon: '⚡' },
    { id: '3', name: '🎨 Tema Exclusivo', description: 'Desbloquea un nuevo tema', cost: 1000, icon: '🎨' },
    { id: '4', name: '🏆 Insignia Especial', description: 'Obtén una insignia única', cost: 750, icon: '🏅' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs">
          <Gift className="text-[#FF5E36]" size={16} />
          Tienda de Recompensas
        </h3>
        <div className="flex items-center gap-2 bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/20">
          <Star className="text-[#FFD700]" size={14} fill="currentColor" />
          <span className="font-black text-[#FFD700] text-sm">{user?.totalXp || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="text-center group" variant="flat">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{reward.icon}</div>
            <h4 className="font-bold text-white text-sm mb-1">{reward.name}</h4>
            <p className="text-[10px] text-white/40 mb-4 leading-tight">{reward.description}</p>
            <Button
              size="sm"
              className="w-full h-10 text-[10px]"
              variant={user && user.totalXp >= reward.cost ? 'primary' : 'ghost'}
              disabled={!user || user.totalXp < reward.cost}
              onClick={() => onRedeem?.(reward.id)}
            >
              {reward.cost} XP
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default {
  XPAndLevel,
  StreakDisplay,
  DailyMissionsList,
  AchievementsGrid,
  LeaderboardPreview,
  RewardsStore,
};