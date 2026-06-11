import { Lesson, VocabularyItem, StudyGroup, PersonalityHost, ObjectDetectionDemo, CommunityPost } from "./types";

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
      },
      {
        question: "Which of the following words has the VOICED 'TH' sound (/ð/ - which triggers throat vibration)?",
        options: [
          "A) Thursday",
          "B) There",
          "C) Teeth",
          "D) Bath"
        ],
        answer: "B",
        explanation: "'There' (junto con 'with', 'father', 'the') vibran las cuerdas vocales, haciéndolo un sonido TH sonoro.",
        audioText: "There... father... weather."
      }
    ]
  },
  {
    id: "lesson-3",
    level: "intermediate",
    category: "cultural-immersion",
    title: "Conversación escolar: Padres y Maestros 🏫",
    description: "Cómo comunicarte con confianza en la reunión de padres para abogar por tus hijos.",
    durationMinutes: 10,
    xpReward: 250,
    content: [
      {
        question: "How should you ask a teacher about your children's progression in reading?",
        options: [
          "A) Why does my kid not read good?",
          "B) How is my child progressing in reading and where can we improve?",
          "C) Fix my kid's reading grades fast.",
          "D) Tell me reading grades."
        ],
        answer: "B",
        explanation: "'How is my child progressing in reading...' is a constructive, warm way to show parental interest and collaborate.",
        audioText: "How is my child progressing in reading?"
      }
    ]
  },
  {
    id: "lesson-4",
    level: "intermediate",
    category: "pronunciation-mastery",
    title: "La 'R' en inglés americano 🇺🇸",
    description: "Evita usar la 'R' española vibrante y descubre cómo arrastrarla de forma natural.",
    durationMinutes: 7,
    xpReward: 180,
    content: [
      {
        question: "What is the key secret to pronouncing the American 'R' as in 'Car' or 'Red'?",
        options: [
          "A) Vibrate the tip of your tongue against your front teeth.",
          "B) Pull your tongue back slightly, sides touching your upper molars, without touching the roof of your mouth.",
          "C) Keep your lips completely wide open and breathe outwards.",
          "D) Vibrate the back of your throat like the French R."
        ],
        answer: "B",
        explanation: "The American 'R' is retroflex (or bunched); the tip of your tongue never actually touches the palate, avoiding the trilling spanish 'R'.",
        audioText: "Red car... Robert runs."
      }
    ]
  },
  {
    id: "lesson-5",
    level: "advanced",
    category: "professional-english",
    title: "La Entrevista Laboral 💼",
    description: "Respuestas clave para convencer al reclutador y brillar en tu próximo empleo en los EE. UU.",
    durationMinutes: 12,
    xpReward: 300,
    content: [
      {
        question: "What is a professional way to answer: 'Why should we hire you?'",
        options: [
          "A) I need the money very bad.",
          "B) Because I am the best person in this city.",
          "C) I bring strong dedication, matching skills, and a desire to contribute value to your team from day one.",
          "D) You will make a mistake if you do not hire me."
        ],
        answer: "C",
        explanation: "Highlighting skills, teamwork, and contributing value represents a balanced, professional manner of pitching yourself.",
        audioText: "I bring strong dedication and matching skills."
      }
    ]
  },
  {
    id: "lesson-6",
    level: "advanced",
    category: "grammar-essentials",
    title: "Condicionales en el Trabajo 📝",
    description: "Estructura hipótesis profesionales con 'If I were you' y 'would have'.",
    durationMinutes: 10,
    xpReward: 240,
    content: [
      {
        question: "Complete the sentence to suggest a past improvement politely: 'If we ______ sooner, we would have met the deadline.'",
        options: [
          "A) start",
          "B) would start",
          "C) had started",
          "D) starting"
        ],
        answer: "C",
        explanation: "In third conditionals (past-unfulfilled hypotheses), we use 'had + past participle' in the if-clause.",
        audioText: "If we had started sooner, we would have met the deadline."
      }
    ]
  }
];

export const INITIAL_VOCABULARY: VocabularyItem[] = [
  {
    id: "vocab-1",
    word: "Appointment",
    translation: "Cita (médica, profesional)",
    phonetic: "/əˈpɔɪnt.mənt/",
    category: "General",
    difficulty: "medium",
    masteryLevel: 4,
    timesCorrect: 8,
    timesIncorrect: 1
  },
  {
    id: "vocab-2",
    word: "Groceries",
    translation: "Mercadería, alimentos del supermercado",
    phonetic: "/ˈɡroʊ.sə.ris/",
    category: "Leisure/Shopping",
    difficulty: "medium",
    masteryLevel: 3,
    timesCorrect: 4,
    timesIncorrect: 2
  },
  {
    id: "vocab-3",
    word: "Sublease",
    translation: "Subarrendar",
    phonetic: "/ˈsʌb.liːs/",
    category: "Housing",
    difficulty: "hard",
    masteryLevel: 1,
    timesCorrect: 1,
    timesIncorrect: 3
  },
  {
    id: "vocab-4",
    word: "Fringe benefits",
    translation: "Beneficios adicionales / prestaciones",
    phonetic: "/frɪndʒ ˈben.ɪ.fɪts/",
    category: "Workplace",
    difficulty: "hard",
    masteryLevel: 2,
    timesCorrect: 2,
    timesIncorrect: 1
  },
  {
    id: "vocab-5",
    word: "Landlord",
    translation: "Arrendador / Dueño de casa",
    phonetic: "/ˈlænd.lɔːrd/",
    category: "Housing",
    difficulty: "easy",
    masteryLevel: 5,
    timesCorrect: 12,
    timesIncorrect: 0
  },
  {
    id: "vocab-6",
    word: "Lease",
    translation: "Contrato de arrendamiento",
    phonetic: "/liːs/",
    category: "Housing",
    difficulty: "medium",
    masteryLevel: 4,
    timesCorrect: 9,
    timesIncorrect: 1
  }
];

export const PRESET_DETECTIONS: ObjectDetectionDemo[] = [
  { id: "cam-1", word: "Apple", translation: "Manzana", phonetic: "/ˈæpəl/" },
  { id: "cam-2", word: "Book", translation: "Libro", phonetic: "/bʊk/" },
  { id: "cam-3", word: "Chair", translation: "Silla", phonetic: "/tʃer/" },
  { id: "cam-4", word: "Water", translation: "Agua", phonetic: "/ˈwɔːtər/" },
  { id: "cam-5", word: "Phone", translation: "Teléfono", phonetic: "/foʊn/" },
  { id: "cam-6", word: "Computer", translation: "Computadora", phonetic: "/kəmˈpjuːtər/" },
  { id: "cam-7", word: "Cup", translation: "Taza", phonetic: "/kʌp/" },
  { id: "cam-8", word: "Key", translation: "Llave", phonetic: "/kiː/" }
];

export const STUDY_GROUPS: StudyGroup[] = [
  {
    id: "group-1",
    name: "Camino al Trabajo 💼",
    description: "Grupo para hispanos preparándose para entrevistas de trabajo y vocabulario de oficina.",
    level: "Advanced",
    membersCount: 342,
    joined: false
  },
  {
    id: "group-2",
    name: "Inglés de Callejón y Compras 🗣️",
    description: "Vocabulario de supervivencia para comprar en el mall, pedir direcciones y pedir comida.",
    level: "Beginner",
    membersCount: 812,
    joined: true
  },
  {
    id: "group-3",
    name: "TH Master Club 🔊",
    description: "Dedicado específicamente a practicar la pronunciación de fonemas difíciles del inglés.",
    level: "Intermediate",
    membersCount: 145,
    joined: false
  }
];

export const PLAYABLE_PERSONALITIES: PersonalityHost[] = [
  {
    id: "strict-coach",
    name: "Coach Carlos, El Exigente 🏋️",
    emoji: "🏋️",
    roleDescription: "A loving but very direct coach. He will call you out if you make mistakes, but pushes you to grow rapidly like an expert athlete.",
    systemInstruction: "You represent Coach Carlos. You use direct, strong football coach lines. You demand excellence, point out grammar mistakes in English with funny directness, and then present US questions with energy."
  },
  {
    id: "chill-buddy",
    name: "Santi, El Amigazo 🤙",
    emoji: "🤙",
    roleDescription: "Super friendly, warm, and highly supportive. Uses words like 'parce', 'pana' or 'bro' to keep you relaxed and build absolute confidence.",
    systemInstruction: "You are Santi. You are relaxed, friendly, and very warm. You explain English tips in comfortable 'Spanglish' text, giving high high praise for trying, keeping confidence absolute."
  },
  {
    id: "academic-scholar",
    name: "La Profesora Isabella 👩‍🏫",
    emoji: "👩‍🏫",
    roleDescription: "Extremely educational, elegant, and structured. Focuses deeply on IPA phonetic notations, grammar rules, and cultural backstory.",
    systemInstruction: "You are Profesora Isabella. You speak with high culture and academic rigor. You teach linguistics secrets, explain precise grammar structures, and show English trivia from an intellectual point."
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    userEmail: "carlos.marcano@gmail.com",
    userName: "Carlos Marcano",
    category: "Tips",
    title: "Tip secreto para pronunciar 'Work' vs 'Walk' 🗣️",
    content: "He notado que muchos confundimos 'work' (trabajo) con 'walk' (caminar). Mi profesor me enseñó hoy que para 'work' debes poner la boca en forma de 'O' pero decir una 'E' estirada. ¡Pruébenlo frente al espejo!",
    likes: 42,
    commentsCount: 3,
    comments: [
      { userName: "María P.", content: "¡Hermano, gracias! Al fin tiene sentido.", createdAt: "Hace 2 horas" },
      { userName: "Santi Coach", content: "Excelente tip, Carlos. ¡Sigan practicando!", createdAt: "Hace 1 hora" }
    ],
    likedByUser: false,
    createdAt: "Hace 3 horas"
  },
  {
    id: "post-2",
    userEmail: "claudia.torres@live.com",
    userName: "Claudia Torres",
    category: "Preguntas",
    title: "¿Qué significa exactamente 'Fringe benefits'?",
    content: "Me acaban de enviar una oferta de trabajo en Texas y dice que incluye 'excellent fringe benefits'. ¿Eso incluye seguro médico o qué más?",
    likes: 18,
    commentsCount: 1,
    comments: [
      { userName: "Admin EasyGo", content: "¡Sí, Claudia! Aplica a beneficios adicionales que la empresa provee como el seguro de salud (Health insurance), plan 401K de retiro, y tiempo pagado libre (PTO).", createdAt: "Hace 12 min" }
    ],
    likedByUser: true,
    createdAt: "Hace 5 horas"
  }
];

export const WEEKLY_CHALLENGE = {
  title: "Desafío de la Semana: Saludar a un Vecino 🗣️",
  description: "Graba un audio donde digas: 'Good morning! How is your day going?'. Más de 1,200 hispanos participando hoy.",
  participants: 1247,
  xpBonus: 500
};
