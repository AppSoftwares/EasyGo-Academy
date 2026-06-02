import React from 'react';
import { Card, ProgressBar, Badge } from '../ui';
import { useAuthStore, useProgressStore, useVocabularyStore } from '../../stores';
import { TrendingUp, Target, BookOpen, Award, Calendar, Volume2 } from 'lucide-react';

interface StatsDashboardProps {}

export const StatsDashboard: React.FC<StatsDashboardProps> = () => {
  const { user } = useAuthStore();
  const { dailyProgress, completedLessons } = useProgressStore();
  const { vocabulary } = useVocabularyStore();

  const totalXp = user?.totalXp || 0;
  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;
  const lessonsCompleted = completedLessons.length;
  const wordsLearned = vocabulary.length;

  // Weekly data for simple bar chart
  const weeklyData = [
    { day: 'Lun', minutes: 25 },
    { day: 'Mar', minutes: 30 },
    { day: 'Mié', minutes: 20 },
    { day: 'Jue', minutes: 35 },
    { day: 'Vie', minutes: 40 },
    { day: 'Sáb', minutes: 45 },
    { day: 'Dom', minutes: 30 },
  ];

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

  // Skills data
  const skillsData = [
    { name: 'Speaking', value: 75 },
    { name: 'Listening', value: 60 },
    { name: 'Reading', value: 85 },
    { name: 'Writing', value: 55 },
  ];

  // Vocabulary mastery
  const vocabularyMastery = [
    { name: 'Nuevo', value: 20, color: '#FF5E36' },
    { name: 'Aprendiendo', value: 45, color: '#FFD700' },
    { name: 'Revisando', value: 25, color: '#5D26C1' },
    { name: 'Dominado', value: 10, color: '#00E676' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center group" variant="flat">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
          <p className="text-3xl font-black text-white">{currentStreak}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Días de racha</p>
          <p className="text-[10px] text-[#FF5E36] font-bold mt-1">RECORD: {longestStreak}</p>
        </Card>
        <Card className="text-center group" variant="flat">
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⭐</div>
          <p className="text-3xl font-black text-[#FFD700]">{totalXp.toLocaleString()}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">XP Total</p>
          <p className="text-[10px] text-[#00E676] font-bold mt-1 uppercase">Nivel {user?.level || 'Principiante'}</p>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="flat" className="bg-white/5 border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5D26C1]/20 flex items-center justify-center border border-[#5D26C1]/20">
              <BookOpen className="text-[#5D26C1]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{lessonsCompleted}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase">Lecciones</p>
            </div>
          </div>
        </Card>
        <Card variant="flat" className="bg-white/5 border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5E36]/20 flex items-center justify-center border border-[#FF5E36]/20">
              <Target className="text-[#FF5E36]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{wordsLearned}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase">Palabras</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card variant="elevated">
        <h4 className="font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
          <TrendingUp className="text-[#FF5E36]" size={16} />
          Actividad Semanal
        </h4>
        <div className="flex items-end justify-between gap-2 h-32 px-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div
                className="w-full bg-gradient-to-t from-[#5D26C1] to-[#FF5E36] rounded-t-lg transition-all group-hover:opacity-100 opacity-60"
                style={{ height: `${(day.minutes / maxMinutes) * 100}%`, minHeight: '10%' }}
              />
              <span className="text-[10px] font-bold text-white/30 mt-3">{day.day.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Progress */}
      <Card variant="flat">
        <h4 className="font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
          <Award className="text-[#FFD700]" size={16} />
          Mis Habilidades
        </h4>
        <div className="space-y-5">
          {skillsData.map((skill, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white/60 uppercase">{skill.name}</span>
                <span className="text-xs font-black text-[#FF5E36]">{skill.value}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#5D26C1] to-[#FF5E36] rounded-full"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Vocabulary Mastery */}
      <Card>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="text-purple-500" size={20} />
          Dominio de Vocabulario
        </h4>
        <div className="flex items-center justify-center gap-4 py-4">
          {vocabularyMastery.map((item, index) => (
            <div key={index} className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: item.color }}
              >
                {item.value}%
              </div>
              <p className="text-xs text-gray-500 mt-2">{item.name}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Calendar Heatmap */}
      <Card variant="flat">
        <h4 className="font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
          <Calendar className="text-[#FF5E36]" size={16} />
          Tu Actividad
        </h4>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => {
            const intensity = Math.random();
            const color = intensity > 0.7 ? '#FF5E36' : intensity > 0.4 ? 'rgba(255,94,54,0.4)' : 'rgba(255,255,255,0.05)';
            return (
              <div
                key={i}
                className="aspect-square rounded-[4px] border border-white/5"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2 mt-4 text-[8px] font-bold text-white/20 uppercase tracking-widest">
          <span>Menos</span>
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-[#FF5E36]/40" />
          <div className="w-3 h-3 rounded-sm bg-[#FF5E36]" />
          <span>Más</span>
        </div>
      </Card>

      {/* Level Progress */}
      <Card>
        <h4 className="font-semibold text-gray-900 mb-4">Tu Progreso</h4>
        <div className="space-y-4">
          {['beginner', 'intermediate', 'advanced'].map((level, index) => {
            const isCurrentLevel = user?.level === level;
            const progress = isCurrentLevel ? 60 : index < ['beginner', 'intermediate', 'advanced'].indexOf(user?.level || 'beginner') ? 100 : 0;
            return (
              <div key={level} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isCurrentLevel ? 'bg-purple-500 text-white' : progress === 100 ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 capitalize">{level}</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

interface VocabularyTrackerProps {
  category?: string;
}

export const VocabularyTracker: React.FC<VocabularyTrackerProps> = ({ category }) => {
  const { vocabulary } = useVocabularyStore();

  const filteredVocab = category
    ? vocabulary.filter(v => v.category === category)
    : vocabulary;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Mi Vocabulario</h3>
        <Badge className="bg-[#FF5E36]/10 text-[#FF5E36] border-none font-black">{filteredVocab.length} PALABRAS</Badge>
      </div>

      {filteredVocab.length === 0 ? (
        <Card className="text-center py-12 bg-white/5 border-dashed border-white/10" variant="flat">
          <div className="text-5xl mb-4 opacity-30">📚</div>
          <p className="text-white/60 font-bold">No tienes palabras guardadas</p>
          <p className="text-[10px] text-white/20 uppercase tracking-wider mt-1">Escanea objetos para empezar a aprender</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredVocab.map((word) => (
            <Card key={word.id} variant="flat" className="bg-white/5 border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-lg leading-tight capitalize">{word.word}</h4>
                  <p className="text-sm text-[#FF5E36] font-bold">{word.translation}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">/{word.phonetic}/</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-1.5 h-6 rounded-full ${
                          level <= (word.masteryLevel || 0)
                            ? 'bg-gradient-to-t from-[#5D26C1] to-[#FF5E36]'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(word.word);
                      utterance.lang = 'en-US';
                      speechSynthesis.speak(utterance);
                    }}
                    className="w-10 h-10 rounded-full bg-[#FF5E36]/10 text-[#FF5E36] flex items-center justify-center hover:bg-[#FF5E36]/20 transition-all active:scale-90"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default { StatsDashboard, VocabularyTracker };