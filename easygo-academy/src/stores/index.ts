import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, UserSettings, LessonProgress, DailyProgress } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addXp: (amount: number) => void;
  updateStreak: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateSettings: (settings) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              settings: { ...user.settings, ...settings },
            },
          });
        }
      },

      addXp: (amount) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              totalXp: user.totalXp + amount,
            },
          });
        }
      },

      updateStreak: () => {
        const { user } = get();
        if (user) {
          const today = new Date().toISOString().split('T')[0];
          const lastActive = user.lastActiveDate;

          if (lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let newStreak = user.currentStreak;
            if (lastActive === yesterdayStr) {
              newStreak += 1;
            } else if (lastActive !== today) {
              newStreak = 1;
            }

            const longestStreak = Math.max(user.longestStreak, newStreak);

            set({
              user: {
                ...user,
                currentStreak: newStreak,
                longestStreak,
                lastActiveDate: today,
              },
            });
          }
        }
      },
    }),
    {
      name: 'easygo-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Progress Store
interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  dailyProgress: DailyProgress[];
  completedLessons: string[];
  addLessonProgress: (lessonId: string, progress: LessonProgress) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  getTodayProgress: () => DailyProgress | null;
  updateDailyProgress: (update: Partial<DailyProgress>) => void;
  addCompletedLesson: (lessonId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessonProgress: {},
      dailyProgress: [],
      completedLessons: [],

      addLessonProgress: (lessonId, progress) => {
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: progress,
          },
        }));
      },

      getLessonProgress: (lessonId) => get().lessonProgress[lessonId],

      getTodayProgress: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().dailyProgress.find((p) => p.date === today) || null;
      },

      updateDailyProgress: (update) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const existing = state.dailyProgress.find((p) => p.date === today);
          if (existing) {
            return {
              dailyProgress: state.dailyProgress.map((p) =>
                p.date === today ? { ...p, ...update } : p
              ),
            };
          }
          return {
            dailyProgress: [
              ...state.dailyProgress,
              {
                date: today,
                lessonsCompleted: 0,
                xpEarned: 0,
                minutesPracticed: 0,
                missionsCompleted: 0,
                wordsLearned: 0,
                ...update,
              },
            ],
          };
        });
      },

      addCompletedLesson: (lessonId) => {
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        }));
      },
    }),
    {
      name: 'easygo-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Vocabulary Store
interface VocabularyState {
  vocabulary: any[];
  customWords: any[];
  addVocabulary: (word: any) => void;
  removeVocabulary: (id: string) => void;
  updateMastery: (id: string, mastery: number) => void;
  getVocabularyByCategory: (category: string) => any[];
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      vocabulary: [],
      customWords: [],

      addVocabulary: (word) => {
        set((state) => ({
          vocabulary: [...state.vocabulary, word],
        }));
      },

      removeVocabulary: (id) => {
        set((state) => ({
          vocabulary: state.vocabulary.filter((v) => v.id !== id),
        }));
      },

      updateMastery: (id, mastery) => {
        set((state) => ({
          vocabulary: state.vocabulary.map((v) =>
            v.id === id ? { ...v, masteryLevel: mastery } : v
          ),
        }));
      },

      getVocabularyByCategory: (category) => {
        return get().vocabulary.filter((v) => v.category === category);
      },
    }),
    {
      name: 'easygo-vocabulary',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Gamification Store
interface GamificationState {
  achievements: any[];
  badges: any[];
  dailyMissions: any[];
  xpHistory: { date: string; xp: number }[];
  unlockAchievement: (achievement: any) => void;
  earnBadge: (badge: any) => void;
  completeMission: (missionId: string) => void;
  addXpToHistory: (xp: number) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      achievements: [],
      badges: [],
      dailyMissions: [],
      xpHistory: [],

      unlockAchievement: (achievement) => {
        set((state) => ({
          achievements: [...state.achievements, { ...achievement, unlockedAt: new Date().toISOString() }],
        }));
      },

      earnBadge: (badge) => {
        set((state) => ({
          badges: [...state.badges, { ...badge, earnedAt: new Date().toISOString() }],
        }));
      },

      completeMission: (missionId) => {
        set((state) => ({
          dailyMissions: state.dailyMissions.map((m) =>
            m.id === missionId ? { ...m, completed: true } : m
          ),
        }));
      },

      addXpToHistory: (xp) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const existing = state.xpHistory.find((h) => h.date === today);
          if (existing) {
            return {
              xpHistory: state.xpHistory.map((h) =>
                h.date === today ? { ...h, xp: h.xp + xp } : h
              ),
            };
          }
          return {
            xpHistory: [...state.xpHistory, { date: today, xp }],
          };
        });
      },
    }),
    {
      name: 'easygo-gamification',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Community Store
interface CommunityState {
  posts: any[];
  comments: Record<string, any[]>;
  addPost: (post: any) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, comment: any) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: [],
      comments: {},

      addPost: (post) => {
        set((state) => ({
          posts: [post, ...state.posts],
        }));
      },

      likePost: (postId) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, likesCount: p.likesCount + 1, isLiked: true } : p
          ),
        }));
      },

      addComment: (postId, comment) => {
        set((state) => ({
          comments: {
            ...state.comments,
            [postId]: [...(state.comments[postId] || []), comment],
          },
        }));
      },
    }),
    {
      name: 'easygo-community',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// App Store (Global)
interface AppState {
  isOnline: boolean;
  syncStatus: 'synced' | 'pending' | 'error';
  currentLanguage: 'en' | 'es';
  setOnlineStatus: (status: boolean) => void;
  setSyncStatus: (status: 'synced' | 'pending' | 'error') => void;
  setLanguage: (lang: 'en' | 'es') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: navigator.onLine,
      syncStatus: 'synced',
      currentLanguage: 'es',

      setOnlineStatus: (status) => set({ isOnline: status }),
      setSyncStatus: (status) => set({ syncStatus: status }),
      setLanguage: (lang) => set({ currentLanguage: lang }),
    }),
    {
      name: 'easygo-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentLanguage: state.currentLanguage }),
    }
  )
);