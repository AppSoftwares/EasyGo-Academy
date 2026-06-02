import { Card, ProgressBar, Badge, CircularProgressIndicator } from '../ui';
import { useAuthStore, useProgressStore, useGamificationStore } from '../../stores';
import { GRADIENT_CSS } from '../../utils/colors';

interface DailyProgressCardProps {}

export const DailyProgressCard: React.FC<DailyProgressCardProps> = () => {
  const { user } = useAuthStore();
  const { getTodayProgress } = useProgressStore();
  const todayProgress = getTodayProgress();

  const goalMinutes = user?.settings.dailyGoalMinutes || 30;
  const practicedMinutes = todayProgress?.minutesPracticed || 0;
  const progressPercent = (practicedMinutes / goalMinutes) * 100;

  return (
    <Card className="mb-6 overflow-hidden relative" variant="elevated">
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FF5E36]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#5D26C1]/10 rounded-full blur-3xl" />

      <div className="flex items-center gap-6 relative z-10">
        <CircularProgressIndicator progress={progressPercent} size={100} strokeWidth={8} />

        <div className="flex-1">
          <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">Misiones de Hoy</p>
          <h3 className="text-white text-xl font-bold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Tus misiones de hoy para perder el miedo
          </h3>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#FFD700] text-sm font-bold">🔥 {user?.currentStreak || 0} Días</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60 text-xs">{practicedMinutes} / {goalMinutes} min</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    category: string;
    durationMinutes: number;
    xpReward: number;
    completed?: boolean;
    progress?: number;
  };
  onClick?: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => (
  <Card className="mb-4 group" onClick={onClick} variant="flat">
    <div className="flex gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl transition-all group-hover:scale-110 group-hover:bg-[#FF5E36]/10">
        {lesson.category === 'daily-conversations' && '💬'}
        {lesson.category === 'pronunciation-mastery' && '🎤'}
        {lesson.category === 'vocabulary-building' && '📚'}
        {lesson.category === 'grammar-essentials' && '📝'}
        {lesson.category === 'cultural-immersion' && '🌎'}
        {lesson.category === 'phonetics' && '🔊'}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-white text-lg">{lesson.title}</h3>
          {lesson.completed && <Badge variant="success" className="bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30">✓</Badge>}
        </div>
        <p className="text-sm text-white/50 mb-3 line-clamp-1">{lesson.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
            <span className="text-[10px] text-white/40">⏱</span>
            <span className="text-[10px] font-bold text-white/60">{lesson.durationMinutes} MIN</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FF5E36]/10 rounded-lg border border-[#FF5E36]/10">
            <span className="text-[10px] text-[#FF5E36]">⭐</span>
            <span className="text-[10px] font-bold text-[#FF5E36]">+{lesson.xpReward} XP</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

interface AchievementCardProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
    xpReward: number;
    unlockedAt?: string;
  };
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const isUnlocked = !!achievement.unlockedAt;

  return (
    <div className={`p-4 rounded-xl ${isUnlocked ? 'bg-white' : 'bg-gray-100 opacity-60'}`}>
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
        {achievement.iconUrl || '🏆'}
      </div>
      <h4 className="font-semibold text-center text-gray-900">{achievement.name}</h4>
      <p className="text-xs text-center text-gray-500 mt-1">{achievement.description}</p>
      <p className="text-xs text-center text-purple-600 mt-2">+{achievement.xpReward} XP</p>
      {isUnlocked && (
        <Badge variant="success" className="mx-auto mt-2 block">Desbloqueado</Badge>
      )}
    </div>
  );
};

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    xpReward: number;
    completed: boolean;
  };
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission }) => (
  <Card className={`mb-3 relative overflow-hidden ${mission.completed ? 'border-[#00E676]/50 bg-[#00E676]/5' : ''}`} variant="flat">
    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${mission.completed ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-white/5 text-white/80'}`}>
        {mission.completed ? '✓' : '🎯'}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <h4 className="font-bold text-white text-sm">{mission.title}</h4>
          <span className="text-[10px] font-bold text-[#FF5E36] bg-[#FF5E36]/10 px-2 py-0.5 rounded-full">+{mission.xpReward} XP</span>
        </div>
        <p className="text-[11px] text-white/50 mb-3">{mission.description}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-500 rounded-full ${mission.completed ? 'bg-[#00E676]' : 'bg-[#FF5E36]'}`}
              style={{ width: `${(mission.progress / mission.target) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-white/40">{mission.progress}/{mission.target}</span>
        </div>
      </div>
    </div>
  </Card>
);

interface VocabularyWordCardProps {
  word: {
    id: string;
    word: string;
    translation: string;
    phonetic: string;
    masteryLevel: number;
  };
  onPlayAudio?: () => void;
}

export const VocabularyWordCard: React.FC<VocabularyWordCardProps> = ({ word, onPlayAudio }) => (
  <Card className="mb-3">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-gray-900">{word.word}</h4>
        <p className="text-sm text-gray-500">{word.translation}</p>
        <p className="text-xs text-purple-400 mt-1">/{word.phonetic}/</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`w-2 h-6 rounded-full ${level <= word.masteryLevel ? GRADIENT_CSS : 'bg-gray-200'}`}
            />
          ))}
        </div>
        {onPlayAudio && (
          <button
            onClick={onPlayAudio}
            className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-200"
          >
            🔊
          </button>
        )}
      </div>
    </div>
  </Card>
);

interface LeaderboardItemProps {
  rank: number;
  user: {
    displayName: string;
    avatarUrl?: string;
    totalXp: number;
    currentStreak: number;
  };
  isCurrentUser?: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, user, isCurrentUser }) => {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${isCurrentUser ? 'bg-purple-50 border-2 border-purple-400' : 'bg-white'}`}>
      <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
        {medals[rank as keyof typeof medals] || rank}
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold">
        {user.displayName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{user.displayName}</h4>
        <p className="text-xs text-gray-500">🔥 {user.currentStreak} días</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-purple-600">{user.totalXp} XP</p>
      </div>
    </div>
  );
};

export default {
  DailyProgressCard,
  LessonCard,
  AchievementCard,
  MissionCard,
  VocabularyWordCard,
  LeaderboardItem,
};