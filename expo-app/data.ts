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

export const INITIAL_VOCABULARY: VocabularyItem[] = [
  {
    id: 'vocab-1',
    word: 'Appointment',
    translation: 'Cita (médica, profesional)',
    phonetic: '/əˈpɔɪnt.mənt/',
    category: 'General',
    difficulty: 'medium',
    masteryLevel: 4,
    timesCorrect: 8,
    timesIncorrect: 1
  },
  {
    id: 'vocab-2',
    word: 'Groceries',
    translation: 'Mercadería, alimentos del supermercado',
    phonetic: '/ˈɡroʊ.sə.ris/',
    category: 'Leisure/Shopping',
    difficulty: 'medium',
    masteryLevel: 3,
    timesCorrect: 4,
    timesIncorrect: 2
  },
  {
    id: 'vocab-3',
    word: 'Sublease',
    translation: 'Subarrendar',
    phonetic: '/ˈsʌb.liːs/',
    category: 'Housing',
    difficulty: 'hard',
    masteryLevel: 1,
    timesCorrect: 1,
    timesIncorrect: 3
  }
];
