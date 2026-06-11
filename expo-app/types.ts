export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  masteryLevel: number;
  timesCorrect: number;
  timesIncorrect: number;
}
