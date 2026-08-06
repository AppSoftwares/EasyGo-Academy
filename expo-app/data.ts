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

export interface Lesson {
  id: string;
  level: string;
  category: string;
  title: string;
  description: string;
  durationMinutes: number;
  xpReward: number;
  content: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    audioText?: string;
  }[];
}

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    level: "beginner",
    category: "daily-conversations",
    title: "En el Supermercado 🛒",
    description: "Aprende a pedir ayuda al dependiente y pagar en la caja registradora en EE. UU.",
    durationMinutes: 6,
    xpReward: 150,
    content: [
      {
        question: "How do you ask a supermarket clerk politely where to find the milk?",
        options: [
          "A) Yo! Where is the milk?",
          "B) Excuse me, could you tell me where the milk is?",
          "C) Milk, please, now.",
          "D) Give me milk directly."
        ],
        answer: "B",
        explanation: "Using 'Excuse me, could you tell me where...' is extremely polite and standard in American stores.",
        audioText: "Excuse me, could you tell me where the milk is?"
      },
      {
        question: "When checking out, the cashier asks: 'Cash or card?'. What does this mean?",
        options: [
          "A) If you want to take the cart or not.",
          "B) If you will pay with physical bills/coins or with a debit/credit card.",
          "C) If you want a paper bag or a plastic bag.",
          "D) If you want to return the groceries."
        ],
        answer: "B",
        explanation: "'Cash or card' is the standard question asking for your payment method (efectivo o tarjeta).",
        audioText: "Cash or card?"
      }
    ]
  },
  {
    id: "lesson-2",
    level: "beginner",
    category: "phonetics",
    title: "El sonido TH inglés (/ð/ y /θ/) 🔊",
    description: "Domina la pronunciación correcta colocando la lengua entre los dientes para 'think' y 'there'.",
    durationMinutes: 8,
    xpReward: 200,
    content: [
      {
        question: "To pronounce the word 'think' (/θ/ unvoiced), where should you place your tongue?",
        options: [
          "A) Placed flat at the bottom of the mouth behind bottom teeth.",
          "B) Touching the hard palate as if saying an 'S'.",
          "C) Pressed lightly between your upper and lower front teeth while blowing air.",
          "D) Rolled backwards like an 'R'."
        ],
        answer: "C",
        explanation: "Correct! The unvoiced /θ/ sound is made by resting the tongue tip between the teeth and pushing air out without vibration.",
        audioText: "Think... Thanksgiving... Thank you."
      }
    ]
  }
];

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
