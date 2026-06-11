export interface Lesson {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  title: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  isDownloaded?: boolean;
  content: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    audioText?: string;
  }[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number; // 0 to 5
  timesCorrect: number;
  timesIncorrect: number;
  lastReviewed?: string;
  nextReview?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  level: 'A1-A2 Principiante' | 'B1-B2 Intermedio' | 'C1-C2 Avanzado';
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  isAdmin: boolean;
  isSubscribed: boolean;
  subscriptionType?: 'monthly' | 'quarterly' | 'semiannual';
  subscriptionExpiry?: string;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  level: string;
  membersCount: number;
  joined: boolean;
}

export interface CommunityPost {
  id: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  category: 'Tips' | 'Historias' | 'Preguntas' | 'General';
  title?: string;
  content: string;
  likes: number;
  commentsCount: number;
  comments: {
    userName: string;
    content: string;
    createdAt: string;
  }[];
  likedByUser?: boolean;
  createdAt: string;
}

export interface ObjectDetectionDemo {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
}

export interface PersonalityHost {
  id: string;
  name: string;
  emoji: string;
  roleDescription: string;
  systemInstruction: string;
}
