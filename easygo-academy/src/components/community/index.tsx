import React, { useState } from 'react';
import { Card, Button, Avatar, Badge } from '../ui';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, TrendingUp, Users, Award } from 'lucide-react';
import { useCommunityStore } from '../../stores';

interface CommunityFeedProps {
  onPostClick?: (postId: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ onPostClick }) => {
  const { posts, likePost } = useCommunityStore();
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample posts for demo
  const samplePosts = [
    {
      id: '1',
      userId: 'user1',
      userName: 'María García',
      userAvatar: '',
      title: 'Mi primera semana aprendiendo inglés',
      content: 'Hoy cumplí 7 días de práctica consecutivos. Me siento tan orgullosa. Gracias a EasyGo ahora puedo entender a mis hijos cuando hablan con sus amigos. 🏆',
      category: 'success-stories',
      likesCount: 24,
      commentsCount: 8,
      createdAt: new Date().toISOString(),
      isLiked: false,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Carlos Mendoza',
      userAvatar: '',
      title: 'Tip: Cómo practicar pronunciación',
      content: 'Aquí les comparto mi truco: uso la función de escanear objetos para aprender palabras nuevas. Es muy útil porque ves el objeto real y escuchas cómo se pronuncia. anyone else using this method?',
      category: 'tips',
      likesCount: 18,
      commentsCount: 12,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isLiked: false,
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Ana Rodríguez',
      userAvatar: '',
      content: '¿Alguien sabe la diferencia entre "make" y "do"? Siempre las confundo 😓',
      category: 'questions',
      likesCount: 5,
      commentsCount: 15,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isLiked: false,
    },
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: '📢' },
    { id: 'tips', label: 'Tips', icon: '💡' },
    { id: 'success-stories', label: 'Historias', icon: '🌟' },
    { id: 'questions', label: 'Preguntas', icon: '❓' },
  ];

  const filteredPosts = activeCategory === 'all' ? samplePosts : samplePosts.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
              activeCategory === cat.id
                ? 'bg-[#FF5E36] border-[#FF5E36] text-white shadow-[0_8px_16px_rgba(255,94,54,0.3)]'
                : 'bg-white/5 border-white/10 text-white/50'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Create Post Button */}
      <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-white/40">
        <span className="text-sm font-medium">Comparte algo con la comunidad...</span>
        <div className="p-2 bg-[#FF5E36]/10 rounded-xl text-[#FF5E36]">
          <Send size={18} />
        </div>
      </button>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} onClick={() => onPostClick?.(post.id)} variant="flat" className="group">
            <div className="flex items-start gap-3 mb-4">
              <Avatar name={post.userName} src={post.userAvatar} size="md" className="border-2 border-white/10" />
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{post.userName}</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Hace 2 horas</p>
              </div>
              <button className="p-2 text-white/20 hover:text-white/60">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {post.title && (
              <h3 className="font-bold text-white text-lg mb-2 leading-snug">{post.title}</h3>
            )}

            <p className="text-white/60 text-sm mb-6 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  likePost(post.id);
                }}
                className={`flex items-center gap-2 transition-all ${
                  post.isLiked ? 'text-[#FF5E36]' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} className={post.isLiked ? 'animate-bounce' : ''} />
                <span className="text-xs font-bold">{post.likesCount}</span>
              </button>

              <button className="flex items-center gap-2 text-white/40 hover:text-white/60">
                <MessageCircle size={18} />
                <span className="text-xs font-bold">{post.commentsCount}</span>
              </button>

              <button className="ml-auto text-white/20 hover:text-[#FFD700]">
                <Bookmark size={18} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface StudyGroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    members: number;
    level: string;
    isJoined: boolean;
  };
  onJoin?: () => void;
}

export const StudyGroupCard: React.FC<StudyGroupCardProps> = ({ group, onJoin }) => (
  <Card className="bg-[#1A153D] border border-white/10">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white text-xl">
        {group.level.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white">{group.name}</h4>
        <p className="text-xs text-white/40">Nivel: {group.level}</p>
      </div>
    </div>
    <p className="text-sm text-white/50 mb-3">{group.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/40 flex items-center gap-1">
        <Users size={14} />
        {group.members} miembros
      </span>
      <Button
        variant={group.isJoined ? 'secondary' : 'primary'}
        size="sm"
        onClick={onJoin}
      >
        {group.isJoined ? 'Salir' : 'Unirse'}
      </Button>
    </div>
  </Card>
);

interface LeaderboardCardProps {
  users: Array<{
    id: string;
    displayName: string;
    totalXp: number;
    currentStreak: number;
    level: number;
  }>;
  currentUserId?: string;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ users, currentUserId }) => {
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Card variant="elevated" className="bg-[#1A153D] border border-white/10">
      <h4 className="font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
        <Award className="text-[#FFD700]" size={16} />
        Top Estudiantes
      </h4>
      <div className="space-y-4">
        {users.slice(0, 5).map((user, index) => {
          const isTop3 = index < 3;
          const isCurrent = user.id === currentUserId;

          return (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-2xl relative transition-all ${
                isTop3 ? 'bg-gradient-to-r from-white/10 to-transparent border border-white/10 shadow-lg' : 'bg-white/5'
              } ${isCurrent ? 'ring-2 ring-[#FF5E36]' : ''}`}
            >
              {isTop3 && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-[#FFD700] rounded-full flex items-center justify-center text-[10px] font-black text-[#120E2E] shadow-lg">
                  {index + 1}
                </div>
              )}

              <Avatar name={user.displayName} size="md" className={isTop3 ? 'ring-2 ring-[#FFD700]/50' : ''} />

              <div className="flex-1">
                <p className="font-bold text-white text-sm">{user.displayName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-[#FF5E36]">🔥 {user.currentStreak} DÍAS</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-[10px] font-bold text-white/40 uppercase">LVL {user.level}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-black text-white">{user.totalXp.toLocaleString()}</p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Puntos XP</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

interface CommunityStatsProps {
  stats: {
    totalPosts: number;
    activeUsers: number;
    questionsAnswered: number;
  };
}

export const CommunityStats: React.FC<CommunityStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-[#1A153D] rounded-xl p-4 text-center shadow-sm border border-white/10">
      <div className="text-2xl mb-1">📝</div>
      <p className="text-2xl font-bold text-white">{stats.totalPosts}</p>
      <p className="text-xs text-white/40">Posts</p>
    </div>
    <div className="bg-[#1A153D] rounded-xl p-4 text-center shadow-sm border border-white/10">
      <div className="text-2xl mb-1">👥</div>
      <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
      <p className="text-xs text-white/40">Activos</p>
    </div>
    <div className="bg-[#1A153D] rounded-xl p-4 text-center shadow-sm border border-white/10">
      <div className="text-2xl mb-1">✅</div>
      <p className="text-2xl font-bold text-white">{stats.questionsAnswered}</p>
      <p className="text-xs text-white/40">Respondidas</p>
    </div>
  </div>
);

export default {
  CommunityFeed,
  StudyGroupCard,
  LeaderboardCard,
  CommunityStats,
};