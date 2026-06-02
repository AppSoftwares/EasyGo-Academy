// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  level: UserLevel;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  createdAt: string;
  lastActiveDate: string;
  isAdmin: boolean;
  settings: UserSettings;
}

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  dailyGoalMinutes: number;
  preferredVoice: string;
  showPronunciationTips: boolean;
}

// Lesson Types
export interface Lesson {
  id: string;
  level: UserLevel;
  category: LessonCategory;
  title: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  orderIndex: number;
  content: LessonContent;
  audioUrl?: string;
  isDownloaded: boolean;
  lastSynced: string;
}

export type LessonCategory =
  | 'daily-conversations'
  | 'professional-english'
  | 'cultural-immersion'
  | 'grammar-essentials'
  | 'pronunciation-mastery'
  | 'vocabulary-building'
  | 'phonetics';

export interface LessonContent {
  type: 'video' | 'interactive' | 'audio' | 'scenario';
  segments: LessonSegment[];
}

export interface LessonSegment {
  id: string;
  text: string;
  translation: string;
  audioUrl?: string;
  imageUrl?: string;
  quiz?: Quiz;
}

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Vocabulary Types
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
  phoneticAudioUrl?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number;
  lastReviewed?: string;
  nextReview?: string;
  timesCorrect: number;
  timesIncorrect: number;
  examples: string[];
}

export interface UserVocabulary extends VocabularyItem {
  learnedAt: string;
  progress: number;
}

// Progress Types
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  timeSpentSeconds: number;
  completedAt?: string;
}

export interface DailyProgress {
  date: string;
  lessonsCompleted: number;
  xpEarned: number;
  minutesPracticed: number;
  missionsCompleted: number;
  wordsLearned: number;
}

// Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  xpReward: number;
  criteria: AchievementCriteria;
  unlockedAt?: string;
}

export interface AchievementCriteria {
  type: 'streak' | 'lessons' | 'vocabulary' | 'xp' | 'social';
  target: number;
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  icon: string;
  earnedAt?: string;
}

export type BadgeType =
  | 'streak-7' | 'streak-30' | 'streak-100' | 'streak-365'
  | 'first-lesson' | 'vocabulary-100' | 'vocabulary-500' | 'vocabulary-master'
  | 'conversation-starter' | 'social-butterfly' | 'community-helper'
  | 'night-owl' | 'early-bird' | 'weekend-warrior';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
}

export type MissionType =
  | 'lessons' | 'vocabulary' | 'conversation' | 'streak' | 'social';

// Community Types
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title?: string;
  content: string;
  category: PostCategory;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
}

export type PostCategory =
  | 'general' | 'tips' | 'success-stories' | 'questions' | 'cultural-exchange';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

// Scanner Types
export interface ScannedObject {
  id: string;
  name: string;
  translation: string;
  phonetic: string;
  imageUrl?: string;
  scannedAt: string;
  savedToVocabulary: boolean;
}

// Conversation Types
export interface ConversationMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  audioUrl?: string;
  timestamp: string;
  grammarFeedback?: GrammarFeedback;
}

export interface GrammarFeedback {
  isCorrect: boolean;
  corrections: GrammarCorrection[];
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  context: string;
  difficulty: UserLevel;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  totalLessonsCompleted: number;
  totalWordsLearned: number;
  averageStreak: number;
  topLearners: User[];
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}
