// backend/seeders/seedGrammar.js
const db = require('../models');
const { GrammarTopic } = db;

const grammarData = [
  // ==================== NIVEL A1 (PRINCIPIANTE) - 100% ESPAÑOL ====================
  {
    title: "Verbo 'to be' - Presente Simple",
    slug: "verb-to-be-present",
    level: "A1",
    category: "Verbos Básicos",
    description: "Aprende a usar el verbo más importante en inglés para describir estados, características y ubicaciones.",
    formula: "Sujeto + am/is/are + complemento",
    icon: "📖",
    unitId: 1,
    order: 1,
    sections: [
      { title: "Forma Afirmativa", content: "El verbo 'to be' significa 'ser' o 'estar'. Se conjuga así: I am (yo soy/estoy), You are (tú eres/estás), He/She/It is (él/ella/ello es/está), We are (nosotros somos/estamos), They are (ellos son/están).", examples: ["I am a student. (Yo soy estudiante)", "She is my teacher. (Ella es mi profesora)", "They are from Mexico. (Ellos son de México)"] },
      { title: "Forma Negativa", content: "Para hacer la forma negativa, añade 'not' después del verbo. Las contracciones son muy comunes: am not, is not (isn't), are not (aren't).", examples: ["I am not tired. (No estoy cansado)", "He isn't from Spain. (Él no es de España)", "We aren't late. (No llegamos tarde)"] },
      { title: "Forma Interrogativa (Preguntas)", content: "Para hacer preguntas, el verbo va antes del sujeto. Es como darle la vuelta a la oración.", examples: ["Are you happy? (¿Estás feliz?)", "Is she your sister? (¿Ella es tu hermana?)", "Are they coming? (¿Ellos vienen?)"] }
    ],
    tips: ["Usa 'am' SOLO con la palabra 'I' (yo)", "Las contracciones son muy comunes en inglés hablado", "En preguntas, el verbo va primero"],
    commonMistakes: ["❌ She are my friend → ✅ She is my friend (Ella ES mi amiga)", "❌ I is a teacher → ✅ I am a teacher (Yo SOY profesor)"],
    questions: [
      { question: "She ___ my best friend.", options: ["am", "is", "are", "be"], correct: "is", type: "multiple-choice", explanation: "'She' (ella) usa el verbo 'is'" },
      { question: "They ___ from Colombia.", options: ["am", "is", "are", "be"], correct: "are", type: "multiple-choice", explanation: "'They' (ellos) usa el verbo 'are'" },
      { question: "I ___ a doctor.", options: ["am", "is", "are", "be"], correct: "am", type: "multiple-choice", explanation: "'I' (yo) usa el verbo 'am'" },
      { question: "We ___ (not) ready for the test.", options: ["isn't", "aren't", "am not", "not are"], correct: "aren't", type: "multiple-choice", explanation: "'We' (nosotros) usa 'aren't' para negativo" },
      { question: "Completa: He ___ my brother.", answer: "is", type: "fill-blank", explanation: "'He' (él) usa el verbo 'is'", correct: "is"}
    ]
  },
  {
    title: "Adjetivos Posesivos",
    slug: "possessive-adjectives",
    level: "A1",
    category: "Adjetivos",
    description: "Aprende a expresar posesión usando my, your, his, her, its, our, their (mi, tu, su, nuestro, etc.).",
    formula: "Adjetivo posesivo + sustantivo",
    icon: "🔑",
    unitId: 2,
    order: 2,
    sections: [
      { title: "¿Qué son los Adjetivos Posesivos?", content: "Los adjetivos posesivos muestran quién es el dueño de algo. En español serían: mi, tu, su, nuestro, vuestro, su. En inglés son: my, your, his, her, its, our, their.", examples: ["This is my house. (Esta es mi casa)", "Is that your car? (¿Ese es tu carro?)", "Her name is Maria. (Su nombre es María)"] },
      { title: "Diferencia con Pronombres Posesivos", content: "Los adjetivos posesivos SIEMPRE van ANTES de un sustantivo. Los pronombres posesivos reemplazan al sustantivo.", examples: ["It's my book. (Es mi libro) - NO 'mine book'", "The book is mine. (El libro es mío) - pronombre posesivo"] }
    ],
    tips: ["Los adjetivos posesivos NUNCA llevan apóstrofe", "'Its' muestra posesión (sin apóstrofe)", "'It's' significa 'it is' (es/está)"],
    commonMistakes: ["❌ This is mine car → ✅ This is my car (Este es MI carro)", "❌ The dog is playing with it's toy → ✅ The dog is playing with its toy (El perro juega con SU juguete)"],
    questions: [
      { question: "This is ___ (Maria) phone.", options: ["her", "his", "your", "my"], correct: "her", type: "multiple-choice", explanation: "María es mujer, usamos 'her' (su)" },
      { question: "We love ___ new teacher.", options: ["our", "us", "we", "ours"], correct: "our", type: "multiple-choice", explanation: "'We' (nosotros) usa 'our' (nuestro)" },
      { question: "The dog is playing with ___ toy.", options: ["its", "it's", "his", "her"], correct: "its", type: "multiple-choice", explanation: "Para animales/objetos usamos 'its'" },
      { question: "That's ___ (John) car over there.", options: ["his", "her", "your", "my"], correct: "his", type: "multiple-choice", explanation: "John es hombre, usamos 'his'" },
      { question: "Completa: ___ (We) teacher is very kind.", answer: "Our", type: "fill-blank", explanation: "Para 'we' (nosotros) usamos 'our' (nuestro)", correct: "Our"}
    ]
  },
  {
    title: "Presente Simple",
    slug: "present-simple",
    level: "A1",
    category: "Tiempos Verbales",
    description: "Aprende a hablar sobre rutinas, hábitos y verdades generales en inglés.",
    formula: "Sujeto + verbo (+s/es para he/she/it)",
    icon: "⏰",
    unitId: 3,
    order: 3,
    sections: [
      { title: "¿Cuándo usar el Presente Simple?", content: "Usamos el presente simple para hablar de hábitos, rutinas, verdades generales y situaciones permanentes.", examples: ["I wake up at 7 AM every day. (Me despierto a las 7 AM todos los días)", "Water boils at 100°C. (El agua hierve a 100°C)", "She works in a bank. (Ella trabaja en un banco)"] },
      { title: "La Tercera Persona (He/She/It)", content: "Para 'él', 'ella' o 'ello', añadimos -s, -es, o -ies al verbo.", examples: ["I eat → He eats", "I go → She goes", "I study → He studies"] },
      { title: "Forma Negativa", content: "Usamos 'don't' (do not) para I/you/we/they, y 'doesn't' (does not) para he/she/it.", examples: ["I don't like coffee.", "She doesn't work on Sundays.", "They don't live here."] }
    ],
    tips: ["Para hábitos, busca adverbios de frecuencia (always, usually, sometimes)", "La 's' de tercera persona es el error más común", "Usa 'does' para preguntas y negativos con he/she/it"],
    commonMistakes: ["❌ She go to school → ✅ She goes to school", "❌ He don't like pizza → ✅ He doesn't like pizza"],
    questions: [
      { question: "She ___ to the gym every Monday.", options: ["go", "goes", "going", "gone"], correct: "goes", type: "multiple-choice", explanation: "Tercera persona 'she' necesita 'goes'" },
      { question: "They ___ (not) eat meat.", options: ["don't", "doesn't", "aren't", "isn't"], correct: "don't", type: "multiple-choice", explanation: "Para 'they' usamos 'don't'" },
      { question: "___ he speak Spanish?", options: ["Do", "Does", "Is", "Are"], correct: "Does", type: "multiple-choice", explanation: "'He' necesita 'does' en preguntas" },
      { question: "The sun ___ in the east.", options: ["rise", "rises", "rising", "rised"], correct: "rises", type: "multiple-choice", explanation: "Verdad general → presente simple con -s" },
      { question: "Completa: My sister ___ (study) at the university.", answer: "studies", type: "fill-blank", explanation: "Tercera persona: cambia 'y' por 'ies'", correct: "studies"}
    ]
  },
  {
    title: "Presente Continuo",
    slug: "present-continuous",
    level: "A1",
    category: "Tiempos Verbales",
    description: "Aprende a describir acciones que están ocurriendo ahora mismo o alrededor del momento presente.",
    formula: "Sujeto + am/is/are + verbo-ing",
    icon: "🔄",
    unitId: 4,
    order: 4,
    sections: [
      { title: "¿Cuándo usar el Presente Continuo?", content: "Usamos el presente continuo para acciones que están ocurriendo AHORA o cerca del momento presente, y para situaciones temporales.", examples: ["I am reading a book right now. (Estoy leyendo un libro ahora mismo)", "She is studying for her exam this week. (Ella está estudiando para su examen esta semana)", "They are living in London temporarily. (Ellos están viviendo en Londres temporalmente)"] },
      { title: "Estructura", content: "Sujeto + am/is/are + verbo terminado en -ing", examples: ["I am working. (Estoy trabajando)", "He is sleeping. (Él está durmiendo)", "We are eating. (Nosotros estamos comiendo)"] },
      { title: "Reglas de Ortografía para -ing", content: "La mayoría de verbos añaden -ing. Verbos terminados en -e: quitan la -e. Verbos de una sílaba CVC: doblan la consonante final.", examples: ["run → running", "write → writing", "play → playing"] }
    ],
    tips: ["Verbos de estado (know, believe, like) NO se usan en continuo", "Palabras clave: now, right now, at the moment", "El español usa el presente continuo más frecuentemente que el inglés"],
    commonMistakes: ["❌ I am knowing the answer → ✅ I know the answer", "❌ She is study → ✅ She is studying"],
    questions: [
      { question: "She ___ (watch) TV right now.", options: ["watch", "watches", "is watching", "are watching"], correct: "is watching", type: "multiple-choice", explanation: "Acción ahora → presente continuo con 'is'" },
      { question: "They ___ playing soccer at the moment.", options: ["am", "is", "are", "be"], correct: "are", type: "multiple-choice", explanation: "'They' usa 'are'" },
      { question: "What ___ you doing?", options: ["am", "is", "are", "be"], correct: "are", type: "multiple-choice", explanation: "'You' usa 'are'" },
      { question: "He ___ (write) an email right now.", options: ["write", "writes", "is write", "is writing"], correct: "is writing", type: "multiple-choice", explanation: "Quita la 'e' antes de añadir -ing" },
      { question: "Completa: The children ___ (play) in the garden now.", answer: "are playing", type: "fill-blank", explanation: "Sujeto plural + are + verbo-ing", correct: "are playing"}
    ]
  },
  {
    title: "Pasado Simple - Verbos Regulares",
    slug: "simple-past-regular",
    level: "A1",
    category: "Tiempos Verbales",
    description: "Aprende a hablar sobre acciones completadas en el pasado usando verbos regulares.",
    formula: "Sujeto + verbo-ed",
    icon: "⏪",
    unitId: 5,
    order: 5,
    sections: [
      { title: "Formando el Pasado Simple", content: "Para la mayoría de verbos, añadimos -ed al final.", examples: ["work → worked", "play → played", "want → wanted"] },
      { title: "Pronunciación de -ed", content: "Se pronuncia /t/ después de sonidos sordos, /d/ después de sonidos sonidos, /ɪd/ después de t o d.", examples: ["walked (walkt)", "cleaned (cleand)", "visited (visitɪd)"] },
      { title: "Reglas de Ortografía", content: "Verbos terminados en -e: añade solo -d. Verbos CVC: dobla la consonante. Consonante + y: cambia a -ied.", examples: ["plan → planned", "try → tried", "dance → danced"] }
    ],
    tips: ["Expresiones de tiempo: yesterday, last week, in 2020, ago", "Negativo: didn't + verbo base", "Preguntas: Did + sujeto + verbo base?"],
    commonMistakes: ["❌ I didn't watched → ✅ I didn't watch", "❌ She studyed → ✅ She studied"],
    questions: [
      { question: "I ___ (watch) a movie yesterday.", options: ["watch", "watched", "watching", "watches"], correct: "watched", type: "multiple-choice", explanation: "Acción pasada → añade -ed" },
      { question: "She ___ (not/like) the food.", options: ["didn't liked", "didn't like", "don't like", "doesn't liked"], correct: "didn't like", type: "multiple-choice", explanation: "Negativo pasado: didn't + verbo base" },
      { question: "___ you visit your grandmother last weekend?", options: ["Did", "Do", "Does", "Were"], correct: "Did", type: "multiple-choice", explanation: "Pregunta pasada → Did + sujeto + verbo base" },
      { question: "They ___ (stop) the car suddenly.", options: ["stop", "stoped", "stopped", "stoppped"], correct: "stopped", type: "multiple-choice", explanation: "CVC → dobla la consonante final" },
      { question: "Completa: We ___ (study) for three hours last night.", answer: "studied", type: "fill-blank", explanation: "Consonante + y → cambia a -ied", correct: "studied"}
    ]
  },
  {
    title: "Pasado Simple - Verbos Irregulares",
    slug: "simple-past-irregular",
    level: "A1",
    category: "Tiempos Verbales",
    description: "Aprende los verbos irregulares más comunes en pasado. Estos verbos NO siguen la regla de añadir -ed.",
    formula: "Sujeto + verbo en pasado (forma irregular)",
    icon: "🔄",
    unitId: 6,
    order: 6,
    sections: [
      { title: "Verbos Irregulares Comunes", content: "Los verbos irregulares no añaden -ed. Cambian su forma completamente. Es importante memorizarlos.", examples: ["go → went (ir)", "eat → ate (comer)", "see → saw (ver)", "buy → bought (comprar)", "drink → drank (beber)"] },
      { title: "Grupos de Verbos Irregulares", content: "Podemos agruparlos por patrones para facilitar su memorización.", examples: ["A-A-A: cut-cut-cut, put-put-put", "A-B-A: come-came-come", "A-B-B: bring-brought-brought", "A-B-C: begin-began-begun"] }
    ],
    tips: ["Memoriza primero los 50 verbos irregulares más comunes", "Usa canciones o rimas para recordarlos", "El participio pasado será importante para el Presente Perfecto"],
    commonMistakes: ["❌ Yesterday I go → ✅ Yesterday I went", "❌ She eated → ✅ She ate"],
    questions: [
      { question: "Yesterday I ___ (go) to the supermarket.", options: ["goed", "went", "gone", "go"], correct: "went", type: "multiple-choice", explanation: "'Go' es irregular → went" },
      { question: "She ___ (eat) all the cookies.", options: ["eated", "ate", "eaten", "eat"], correct: "ate", type: "multiple-choice", explanation: "'Eat' → ate" },
      { question: "They ___ (buy) a new car last month.", options: ["buyed", "bought", "buy", "brought"], correct: "bought", type: "multiple-choice", explanation: "'Buy' → bought" },
      { question: "I ___ (see) a great movie last night.", options: ["seed", "saw", "seen", "see"], correct: "saw", type: "multiple-choice", explanation: "'See' → saw" },
      { question: "Completa: We ___ (drink) coffee this morning.", answer: "drank", type: "fill-blank", explanation: "'Drink' → drank", correct: "drank"}
    ]
  },
  {
    title: "Sustantivos: Singular y Plural",
    slug: "nouns-singular-plural",
    level: "A1",
    category: "Sustantivos",
    description: "Aprende a formar el plural de los sustantivos en inglés.",
    formula: "Regular: +s/+es, Irregular: varias formas",
    icon: "📚",
    unitId: 7,
    order: 7,
    sections: [
      { title: "Plurales Regulares", content: "La mayoría de sustantivos añaden -s. Los que terminan en s, sh, ch, x, z añaden -es.", examples: ["cat→cats", "dog→dogs", "bus→buses", "box→boxes", "watch→watches"] },
      { title: "Sustantivos terminados en -y y -f", content: "Consonante + y → ies, vocal + y → s, algunos -f/-fe → -ves", examples: ["baby→babies", "day→days", "knife→knives", "wife→wives"] },
      { title: "Plurales Irregulares", content: "Plurales comunes que no siguen las reglas.", examples: ["man→men", "woman→women", "child→children", "tooth→teeth", "foot→feet", "mouse→mice"] }
    ],
    tips: ["Algunos sustantivos son iguales en singular y plural (sheep, fish)", "Algunos sustantivos son siempre plurales (scissors, glasses, pants)", "Los sustantivos incontables no tienen plural (water, rice, information)"],
    commonMistakes: ["❌ Two childs → ✅ Two children", "❌ Three knifes → ✅ Three knives"],
    questions: [
      { question: "I have two ___ (dog).", options: ["dog", "dogs", "doges", "dog's"], correct: "dogs", type: "multiple-choice", explanation: "La mayoría de sustantivos añaden -s" },
      { question: "She bought three ___ (dress).", options: ["dress", "dresses", "dress's", "dresss"], correct: "dresses", type: "multiple-choice", explanation: "Sustantivos terminados en -ss añaden -es" },
      { question: "How many ___ (child) are there?", options: ["childs", "children", "childes", "childrens"], correct: "children", type: "multiple-choice", explanation: "'Child' tiene plural irregular → children" },
      { question: "I need two ___ (knife) for the kitchen.", options: ["knifes", "knives", "knife's", "knife"], correct: "knives", type: "multiple-choice", explanation: "-fe cambia a -ves" },
      { question: "Completa: Both ___ (woman) are doctors.", answer: "women", type: "fill-blank", explanation: "Plural irregular: woman → women", correct: "women"}
    ]
  },
  {
    title: "Preposiciones Básicas: In, On, At",
    slug: "prepositions-in-on-at",
    level: "A1",
    category: "Preposiciones",
    description: "Aprende a usar las preposiciones básicas de tiempo y lugar.",
    formula: "in + mes/año/ciudad, on + día/fecha, at + hora específica/lugar específico",
    icon: "📍",
    unitId: 8,
    order: 8,
    sections: [
      { title: "Preposiciones de TIEMPO", content: "Usa IN para meses, años, estaciones; ON para días y fechas; AT para horas específicas.", examples: ["in May, in 2024, in summer", "on Monday, on July 4th", "at 5 PM, at night, at noon"] },
      { title: "Preposiciones de LUGAR", content: "Usa IN para espacios cerrados, ON para superficies, AT para puntos específicos.", examples: ["in the room, in the car", "on the table, on the wall", "at the door, at the bus stop"] },
      { title: "Expresiones Comunes", content: "Expresiones fijas con preposiciones.", examples: ["in the morning/afternoon/evening", "at night", "on time"] }
    ],
    tips: ["Sin preposición antes de 'last', 'next', 'every', 'this'", "AT para direcciones (at 123 Main St), ON para nombres de calles (on Main St)", "IN para ciudades y países (in New York, in Spain)"],
    commonMistakes: ["❌ I wake up in 7 AM → ✅ I wake up at 7 AM", "❌ Let's meet in Monday → ✅ Let's meet on Monday"],
    questions: [
      { question: "I wake up ___ 7 AM.", options: ["in", "on", "at", "for"], correct: "at", type: "multiple-choice", explanation: "Hora específica → at" },
      { question: "Let's meet ___ Monday.", options: ["in", "on", "at", "by"], correct: "on", type: "multiple-choice", explanation: "Día de la semana → on" },
      { question: "She lives ___ New York.", options: ["in", "on", "at", "to"], correct: "in", type: "multiple-choice", explanation: "Ciudad → in" },
      { question: "The book is ___ the table.", options: ["in", "on", "at", "under"], correct: "on", type: "multiple-choice", explanation: "Superficie → on" },
      { question: "Completa: I was born ___ 1995.", answer: "in", type: "fill-blank", explanation: "Año → in", correct: "in"}
    ]
  },
  {
    title: "Demostrativos: This, That, These, Those",
    slug: "demonstratives",
    level: "A1",
    category: "Determinantes",
    description: "Aprende a señalar objetos según su distancia y número.",
    formula: "This/That + sustantivo singular, These/Those + sustantivo plural",
    icon: "👉",
    unitId: 9,
    order: 9,
    sections: [
      { title: "Cerca vs Lejos", content: "THIS/THESE para cosas cerca del hablante, THAT/THOSE para cosas lejanas.", examples: ["This is my phone (en mi mano)", "That is your car (al otro lado de la calle)", "These are my keys (aquí)", "Those are your shoes (allá)"] },
      { title: "Como Pronombres y Determinantes", content: "Pueden usarse solos o antes de sustantivos.", examples: ["This is delicious (pronombre)", "This cake is delicious (determinante)", "I like these (pronombre)", "I like these shoes (determinante)"] }
    ],
    tips: ["Usa 'this/these' para cosas que puedes tocar", "Usa 'that/those' para cosas que ves pero no tocas", "En llamadas telefónicas: 'Hello, this is Maria speaking'"],
    commonMistakes: ["❌ These is my book → ✅ This is my book", "❌ That shoes are nice → ✅ Those shoes are nice"],
    questions: [
      { question: "___ is my book here.", options: ["This", "That", "These", "Those"], correct: "This", type: "multiple-choice", explanation: "Cerca del hablante, singular → This" },
      { question: "___ are my keys right here.", options: ["This", "That", "These", "Those"], correct: "These", type: "multiple-choice", explanation: "Cerca del hablante, plural → These" },
      { question: "Look at ___ birds in the sky!", options: ["this", "that", "these", "those"], correct: "those", type: "multiple-choice", explanation: "Lejos, plural → Those" },
      { question: "___ restaurant over there looks expensive.", options: ["This", "That", "These", "Those"], correct: "That", type: "multiple-choice", explanation: "Lejos del hablante, singular → That" },
      { question: "Completa: Can you pass me ___ pen next to you?", answer: "that", type: "fill-blank", explanation: "Lejos del hablante, singular → that", correct: "that"}
    ]
  },
  {
    title: "Palabras para Preguntar",
    slug: "question-words",
    level: "A1",
    category: "Preguntas",
    description: "Aprende a hacer preguntas usando Who, What, Where, When, Why, How.",
    formula: "Palabra de pregunta + auxiliar + sujeto + verbo?",
    icon: "❓",
    unitId: 10,
    order: 10,
    sections: [
      { title: "Palabras para Preguntar", content: "WHO (persona), WHAT (cosa/información), WHERE (lugar), WHEN (tiempo), WHY (razón), HOW (manera/condición).", examples: ["Who is that? (¿Quién es ese?)", "What is this? (¿Qué es esto?)", "Where do you live? (¿Dónde vives?)", "When is the party? (¿Cuándo es la fiesta?)", "Why are you late? (¿Por qué llegas tarde?)", "How are you? (¿Cómo estás?)"] },
      { title: "Frases Comunes con How", content: "HOW + adjetivo/adverbio para información específica.", examples: ["How old are you? (¿Cuántos años tienes?)", "How much does it cost? (¿Cuánto cuesta?)", "How many people are there? (¿Cuántas personas hay?)", "How often do you exercise? (¿Con qué frecuencia haces ejercicio?)"] }
    ],
    tips: ["What se usa para definiciones (What is a doctor?)", "Which se usa para opciones (Which color do you prefer?)", "Las palabras de pregunta pueden ser el sujeto (Who called you?)"],
    commonMistakes: ["❌ What is your age old? → ✅ How old are you?", "❌ Where is the party at? → ✅ Where is the party?"],
    questions: [
      { question: "___ is your name?", options: ["Who", "What", "Where", "Why"], correct: "What", type: "multiple-choice", explanation: "Preguntando por información → What" },
      { question: "___ is the nearest bank?", options: ["Who", "What", "Where", "When"], correct: "Where", type: "multiple-choice", explanation: "Preguntando por ubicación → Where" },
      { question: "___ didn't you come to the party?", options: ["Where", "When", "Why", "How"], correct: "Why", type: "multiple-choice", explanation: "Preguntando por razón → Why" },
      { question: "___ are you? I'm fine, thanks.", options: ["Who", "What", "Where", "How"], correct: "How", type: "multiple-choice", explanation: "Preguntando por estado → How" },
      { question: "Completa: ___ one do you want, the red or the blue?", answer: "Which", type: "fill-blank", explanation: "Preguntando por elección → Which", correct: "Which"}
    ]
  },

  // ==================== NIVEL A2 (BÁSICO) - 10 TEMAS ====================
  {
    title: "Adjetivos Comparativos y Superlativos",
    slug: "comparative-superlative",
    level: "A2",
    category: "Adjetivos",
    description: "Aprende a comparar personas, objetos y lugares usando adjetivos.",
    formula: "Comparativo: adj-er/more + adj, Superlativo: the adj-est/the most + adj",
    icon: "📊",
    unitId: 11,
    order: 11,
    sections: [
      { title: "Adjetivos Comparativos", content: "Comparan dos cosas. Adjetivos cortos: añaden -er. Adjetivos largos: usan 'more'.", examples: ["John is taller than Mark. (John es más alto que Mark)", "This book is more interesting than that one. (Este libro es más interesante que ese)", "Your English is better than mine. (Tu inglés es mejor que el mío)"] },
      { title: "Adjetivos Superlativos", content: "Comparan tres o más cosas. Adjetivos cortos: añaden -est. Adjetivos largos: usan 'most'.", examples: ["Maria is the tallest in the class. (María es la más alta de la clase)", "This is the most expensive restaurant. (Este es el restaurante más caro)", "That was the best day of my life. (Ese fue el mejor día de mi vida)"] },
      { title: "Reglas de Ortografía", content: "CVC: dobla la consonante. Terminados en y: cambian a -ier. Terminados en e: añaden -r.", examples: ["hot → hotter → hottest", "easy → easier → easiest", "large → larger → largest"] }
    ],
    tips: ["Usa 'than' después de comparativos", "Usa 'the' antes de superlativos", "Adjetivos de 2 sílabas terminados en -y usan -er/-est"],
    commonMistakes: ["❌ This is more easier → ✅ This is easier", "❌ She is the more tall → ✅ She is the tallest"],
    questions: [
      { question: "This exercise is ___ (easy) than the last one.", options: ["easy", "easier", "more easy", "easiest"], correct: "easier", type: "multiple-choice", explanation: "2 sílabas terminado en -y → -ier" },
      { question: "Mount Everest is the ___ mountain.", options: ["high", "higher", "highest", "most high"], correct: "highest", type: "multiple-choice", explanation: "Superlativo de adjetivo corto → -est" },
      { question: "This movie is ___ (interesting) than the other.", options: ["interesting", "interestinger", "more interesting", "most interesting"], correct: "more interesting", type: "multiple-choice", explanation: "3+ sílabas usan 'more'" },
      { question: "That's the ___ cake I've ever eaten!", options: ["good", "better", "best", "more good"], correct: "best", type: "multiple-choice", explanation: "Superlativo irregular de 'good' → best" },
      { question: "Completa: My apartment is ___ (small) than yours.", answer: "smaller", type: "fill-blank", explanation: "Adjetivo corto + -er" }
    ]
  },
  {
    title: "Futuro con 'Going to'",
    slug: "future-going-to",
    level: "A2",
    category: "Tiempos Verbales",
    description: "Aprende a expresar planes y predicciones en el futuro usando 'going to'.",
    formula: "Sujeto + am/is/are + going to + verbo base",
    icon: "🔮",
    unitId: 12,
    order: 12,
    sections: [
      { title: "Usos de 'Going to'", content: "Planes e intenciones, predicciones con evidencia.", examples: ["I'm going to study medicine. (Voy a estudiar medicina - plan)", "Look at those clouds! It's going to rain. (¡Mira esas nubes! Va a llover - predicción)"] },
      { title: "Estructura", content: "Sujeto + am/is/are + going to + verbo base", examples: ["She is going to travel to Europe. (Ella va a viajar a Europa)", "They are going to buy a house. (Ellos van a comprar una casa)", "I'm not going to eat that. (No voy a comer eso)"] },
      { title: "Preguntas", content: "Invierte am/is/are y el sujeto.", examples: ["Are you going to call him? (¿Vas a llamarle?)", "What are you going to do tomorrow? (¿Qué vas a hacer mañana?)"] }
    ],
    tips: ["No uses 'going to' con 'go' (I'm going to go es correcto pero repetitivo)", "En inglés hablado, 'going to' se convierte en 'gonna'", "Usa para planes definidos, no decisiones espontáneas"],
    commonMistakes: ["❌ She going to buy → ✅ She is going to buy", "❌ What you are going to do? → ✅ What are you going to do?"],
    questions: [
      { question: "She ___ going to buy a new car.", options: ["am", "is", "are", "be"], correct: "is", type: "multiple-choice", explanation: "'She' usa 'is'" },
      { question: "What ___ you going to do tonight?", options: ["am", "is", "are", "be"], correct: "are", type: "multiple-choice", explanation: "'You' usa 'are'" },
      { question: "Look at those dark clouds! It ___ rain.", options: ["is going to", "are going to", "going to", "go to"], correct: "is going to", type: "multiple-choice", explanation: "Predicción con evidencia" },
      { question: "They ___ (not/watch) TV tonight.", options: ["aren't going to watch", "isn't going to watch", "don't going to watch", "not going to watch"], correct: "aren't going to watch", type: "multiple-choice", explanation: "Negativo: aren't + going to + verbo" },
      { question: "Completa: We ___ (have) a party next Saturday.", answer: "are going to have", type: "fill-blank", explanation: "Plan → are going to + verbo" }
    ]
  },
  {
    title: "Futuro con 'Will'",
    slug: "future-will",
    level: "A2",
    category: "Tiempos Verbales",
    description: "Aprende a usar 'will' para decisiones espontáneas, promesas y predicciones.",
    formula: "Sujeto + will + verbo base",
    icon: "✨",
    unitId: 13,
    order: 13,
    sections: [
      { title: "Usos de 'Will'", content: "Decisiones espontáneas, promesas, ofrecimientos, predicciones sin evidencia.", examples: ["I'll answer the phone. (Responderé el teléfono - espontáneo)", "I'll always love you. (Siempre te amaré - promesa)", "I'll help you with that. (Te ayudaré con eso - ofrecimiento)", "I think it will rain tomorrow. (Creo que lloverá mañana - predicción)"] },
      { title: "Negativo y Preguntas", content: "Negativo: will not/won't, Preguntas: will + sujeto", examples: ["She won't be late. (Ella no llegará tarde)", "Will you marry me? (¿Te casarás conmigo?)", "Where will they go? (¿Dónde irán?)"] }
    ],
    tips: ["Usa 'will' para decisiones rápidas (no planeadas)", "Usa 'going to' para acciones planeadas", "Contracciones: I'll, you'll, he'll, she'll, we'll, they'll"],
    commonMistakes: ["❌ She will to come → ✅ She will come", "❌ He won't be not late → ✅ He won't be late"],
    questions: [
      { question: "The phone is ringing. I ___ get it!", options: ["am going to", "will", "go to", "am"], correct: "will", type: "multiple-choice", explanation: "Decisión espontánea → will" },
      { question: "I promise I ___ call you tomorrow.", options: ["will", "am going to", "would", "may"], correct: "will", type: "multiple-choice", explanation: "Promesa → will" },
      { question: "She ___ (not/be) late for the meeting.", options: ["won't be", "willn't be", "isn't being", "doesn't be"], correct: "won't be", type: "multiple-choice", explanation: "Negativo futuro → won't + verbo" },
      { question: "___ you help me with this heavy box?", options: ["Are", "Will", "Do", "Have"], correct: "Will", type: "multiple-choice", explanation: "Ofrecimiento/petición cortés → Will" },
      { question: "Completa: I think it ___ (rain) tomorrow.", answer: "will rain", type: "fill-blank", explanation: "Predicción sin evidencia → will" }
    ]
  },
  {
    title: "Pasado Continuo",
    slug: "past-continuous",
    level: "A2",
    category: "Tiempos Verbales",
    description: "Aprende a describir acciones en progreso en el pasado.",
    formula: "Sujeto + was/were + verbo-ing",
    icon: "⏮️",
    unitId: 14,
    order: 14,
    sections: [
      { title: "¿Cuándo usar el Pasado Continuo?", content: "Acciones en progreso en un momento específico del pasado, acciones de fondo, acciones interrumpidas.", examples: ["I was watching TV at 8 PM last night. (Estaba viendo TV anoche a las 8)", "The sun was shining when we left. (El sol brillaba cuando salimos)", "While I was cooking, the phone rang. (Mientras cocinaba, sonó el teléfono)"] },
      { title: "Pasado Continuo vs Pasado Simple", content: "Continuo = acción larga (fondo). Pasado Simple = acción corta (interrupción).", examples: ["I was walking home when I saw John. (Caminaba a casa cuando vi a John)", "While I was driving, I heard a strange noise. (Mientras conducía, escuché un ruido extraño)"] }
    ],
    tips: ["Usa 'while' con pasado continuo", "Usa 'when' con pasado simple", "El pasado continuo describe la 'escena', el pasado simple la 'acción'"],
    commonMistakes: ["❌ I was watch TV → ✅ I was watching TV", "❌ When I was arriving, he left → ✅ When I arrived, he left"],
    questions: [
      { question: "At 10 PM yesterday, I ___ (sleep).", options: ["slept", "was sleeping", "were sleeping", "sleeping"], correct: "was sleeping", type: "multiple-choice", explanation: "Momento específico en pasado → pasado continuo" },
      { question: "While I ___ (walk), it started to rain.", options: ["walked", "was walking", "were walking", "walk"], correct: "was walking", type: "multiple-choice", explanation: "Acción de fondo → pasado continuo" },
      { question: "They ___ playing soccer when it started.", options: ["was", "were", "is", "are"], correct: "were", type: "multiple-choice", explanation: "'They' usa 'were'" },
      { question: "I ___ (study) when you called.", options: ["studied", "was studying", "were studying", "study"], correct: "was studying", type: "multiple-choice", explanation: "Acción interrumpida → pasado continuo" },
      { question: "Completa: The children ___ (play) when I saw them.", answer: "were playing", type: "fill-blank", explanation: "Sujeto plural + were + verbo-ing" }
    ]
  },
  {
    title: "Verbos Modales: Can, Could, May, Might",
    slug: "modal-verbs-basic",
    level: "A2",
    category: "Verbos Modales",
    description: "Aprende a expresar habilidad, permiso, posibilidad y cortesía con verbos modales.",
    formula: "Modal + verbo base (sin 'to')",
    icon: "🎯",
    unitId: 15,
    order: 15,
    sections: [
      { title: "Can - Habilidad y Permiso", content: "Habilidad en presente, permiso informal.", examples: ["I can speak three languages. (Puedo hablar tres idiomas)", "You can sit here. (Puedes sentarte aquí)"] },
      { title: "Could - Habilidad Pasada y Peticiones Corteses", content: "Habilidad en pasado, peticiones corteses, sugerencias.", examples: ["When I was young, I could run fast. (Cuando era joven, podía correr rápido)", "Could you help me, please? (¿Podrías ayudarme, por favor?)"] },
      { title: "May/Might - Posibilidad", content: "May = más probable (50%), Might = menos probable (30%).", examples: ["It may rain later. (Puede que llueva más tarde)", "She might come to the party. (Quizás venga a la fiesta)"] }
    ],
    tips: ["Los verbos modales van seguidos de verbo base (SIN 'to')", "Los verbos modales no añaden 's' para tercera persona", "Negativo: añade 'not' (can't, couldn't, may not, might not)"],
    commonMistakes: ["❌ She can to swim → ✅ She can swim", "❌ He cans play → ✅ He can play"],
    questions: [
      { question: "___ you speak Japanese?", options: ["Can", "May", "Could", "Might"], correct: "Can", type: "multiple-choice", explanation: "Preguntando por habilidad → Can" },
      { question: "When I was a child, I ___ run fast.", options: ["can", "could", "may", "might"], correct: "could", type: "multiple-choice", explanation: "Habilidad pasada → could" },
      { question: "It's cloudy. It ___ rain later.", options: ["can", "could", "may", "must"], correct: "may", type: "multiple-choice", explanation: "Posibilidad (50%) → may" },
      { question: "___ you pass me the salt, please?", options: ["Can", "May", "Could", "Must"], correct: "Could", type: "multiple-choice", explanation: "Petición cortés → Could" },
      { question: "Completa: She ___ (can) swim when she was 5.", answer: "could", type: "fill-blank", explanation: "Habilidad pasada → could" }
    ]
  },
  {
    title: "Verbos Modales: Must, Have to, Should",
    slug: "modal-obligation-advice",
    level: "A2",
    category: "Verbos Modales",
    description: "Aprende a expresar obligación, necesidad y dar consejos.",
    formula: "Modal + verbo base",
    icon: "⚠️",
    unitId: 16,
    order: 16,
    sections: [
      { title: "Must vs Have to - Obligación", content: "MUST = obligación interna/del hablante, HAVE TO = obligación externa/regla.", examples: ["I must study more (Yo digo)", "You have to wear a uniform (regla de la escuela)"] },
      { title: "Should - Consejos", content: "Da recomendaciones y opiniones.", examples: ["You should see a doctor. (Deberías ver un doctor)", "She should study more. (Ella debería estudiar más)"] },
      { title: "Formas Negativas", content: "Must not (prohibición), Don't/Doesn't have to (sin necesidad), Should not (consejo negativo).", examples: ["You must not smoke here. (No puedes fumar aquí)", "You don't have to come. (No necesitas venir)", "You shouldn't worry. (No deberías preocuparte)"] }
    ],
    tips: ["Must no cambia de forma (no 'to', no 's')", "Have to cambia para tercera persona (has to)", "No confundas 'must not' (prohibido) con 'don't have to' (no necesario)"],
    commonMistakes: ["❌ She must to go → ✅ She must go", "❌ He doesn't must go → ✅ He doesn't have to go"],
    questions: [
      { question: "You ___ drive on the right side in the US.", options: ["must", "have to", "should", "may"], correct: "have to", type: "multiple-choice", explanation: "Ley/regla externa → have to" },
      { question: "I ___ finish this report today. My boss needs it.", options: ["must", "have to", "should", "can"], correct: "have to", type: "multiple-choice", explanation: "Obligación externa → have to" },
      { question: "You look sick. You ___ see a doctor.", options: ["must", "have to", "should", "need"], correct: "should", type: "multiple-choice", explanation: "Recomendación → should" },
      { question: "You ___ eat in the library. It's not allowed.", options: ["must", "mustn't", "don't have to", "shouldn't"], correct: "mustn't", type: "multiple-choice", explanation: "Prohibición → mustn't" },
      { question: "Completa: You ___ (not/have to) come if you're busy.", answer: "don't have to", type: "fill-blank", explanation: "Sin necesidad → don't have to" }
    ]
  },
  {
    title: "Adverbios de Frecuencia",
    slug: "adverbs-frequency",
    level: "A2",
    category: "Adverbios",
    description: "Aprende a expresar con qué frecuencia realizas acciones.",
    formula: "Sujeto + adverbio + verbo principal, Sujeto + verbo to be + adverbio",
    icon: "📅",
    unitId: 17,
    order: 17,
    sections: [
      { title: "Adverbios de Frecuencia", content: "Always (100%), Usually (90%), Often (70%), Sometimes (50%), Occasionally (30%), Seldom (10%), Never (0%).", examples: ["I always brush my teeth. (Siempre me lavo los dientes)", "She is usually on time. (Ella suele llegar a tiempo)", "They sometimes eat out. (A veces comen fuera)"] },
      { title: "Posición en la Oración", content: "Antes de verbos principales, después del verbo 'to be'.", examples: ["I often go to the gym. (A menudo voy al gimnasio)", "She is always happy. (Ella está siempre feliz)", "We have never been to Paris. (Nunca hemos estado en París)"] }
    ],
    tips: ["Usa 'how often' para hacer preguntas", "Nunca uses doble negativo (I don't never → I never)", "Sometimes puede ir al principio de la oración"],
    commonMistakes: ["❌ I go always → ✅ I always go", "❌ She is never late? → ✅ Is she never late?"],
    questions: [
      { question: "I ___ (100%) eat breakfast.", options: ["always", "usually", "sometimes", "never"], correct: "always", type: "multiple-choice", explanation: "100% del tiempo → always" },
      { question: "She is ___ (90%) on time.", options: ["always", "usually", "sometimes", "never"], correct: "usually", type: "multiple-choice", explanation: "90% → usually" },
      { question: "We ___ (0%) eat meat. We're vegetarian.", options: ["always", "often", "sometimes", "never"], correct: "never", type: "multiple-choice", explanation: "0% → never" },
      { question: "He ___ (70%) plays soccer on weekends.", options: ["always", "often", "sometimes", "never"], correct: "often", type: "multiple-choice", explanation: "70% → often" },
      { question: "Completa: I ___ (50%) go to the cinema on Fridays.", answer: "sometimes", type: "fill-blank", explanation: "50% → sometimes" }
    ]
  },
  {
    title: "Sustantivos Contables e Incontables",
    slug: "countable-uncountable",
    level: "A2",
    category: "Sustantivos",
    description: "Aprende a diferenciar sustantivos contables e incontables en inglés.",
    formula: "Contables: a/an, números; Incontables: some, any, much, little",
    icon: "🔢",
    unitId: 18,
    order: 18,
    sections: [
      { title: "Sustantivos Contables", content: "Cosas que puedes contar. Tienen forma singular y plural.", examples: ["one apple, two apples (una manzana, dos manzanas)", "a car, many cars (un carro, muchos carros)", "an hour, three hours (una hora, tres horas)"] },
      { title: "Sustantivos Incontables", content: "Cosas que no puedes contar. Solo tienen forma singular.", examples: ["water, rice, information, advice, money, furniture (agua, arroz, información, consejo, dinero, muebles)", "some water, much rice, little information (algo de agua, mucho arroz, poca información)"] },
      { title: "Cuantificadores", content: "Cómo cuantificar sustantivos incontables.", examples: ["a glass of water (un vaso de agua)", "a piece of advice (un consejo)", "a cup of coffee (una taza de café)", "a lot of money (mucho dinero)"] }
    ],
    tips: ["Usa 'many' con contables, 'much' con incontables", "Usa 'a few' con contables, 'a little' con incontables", "Algunos sustantivos pueden ser ambos: coffee (bebida incontable), a coffee (taza contable)"],
    commonMistakes: ["❌ I have many money → ✅ I have much money", "❌ A few water → ✅ A little water"],
    questions: [
      { question: "How ___ apples do you need?", options: ["many", "much", "lot", "any"], correct: "many", type: "multiple-choice", explanation: "Apples es contable → many" },
      { question: "How ___ water should I drink?", options: ["many", "much", "lot", "any"], correct: "much", type: "multiple-choice", explanation: "Water es incontable → much" },
      { question: "I have ___ money in my pocket.", options: ["a few", "a little", "many", "several"], correct: "a little", type: "multiple-choice", explanation: "Money es incontable → a little" },
      { question: "There are ___ students in the class.", options: ["a little", "much", "a few", "any"], correct: "a few", type: "multiple-choice", explanation: "Students es contable → a few" },
      { question: "Completa: Can I have ___ (some/any) sugar, please?", answer: "some", type: "fill-blank", explanation: "Petición positiva → some" }
    ]
  },
  {
    title: "Pronombres Posesivos",
    slug: "possessive-pronouns",
    level: "A2",
    category: "Pronombres",
    description: "Aprende a usar pronombres posesivos para evitar repeticiones.",
    formula: "mine, yours, his, hers, its, ours, theirs",
    icon: "🔐",
    unitId: 19,
    order: 19,
    sections: [
      { title: "Pronombres Posesivos", content: "Reemplazan adjetivo posesivo + sustantivo para evitar repetición.", examples: ["This is my book → This is mine. (Este es mi libro → Este es mío)", "Is that your car? → Is that yours? (¿Ese es tu carro? → ¿Ese es tuyo?)"] },
      { title: "Diferencia con Adjetivos Posesivos", content: "Los adjetivos posesivos van antes de sustantivos, los pronombres posesivos van solos.", examples: ["It's my phone. (adjetivo + sustantivo)", "The phone is mine. (pronombre solo)"] }
    ],
    tips: ["Los pronombres posesivos NUNCA llevan apóstrofe", "Its rara vez se usa como pronombre posesivo", "Whose es la forma de pregunta (Whose is this?)"],
    commonMistakes: ["❌ This is her's → ✅ This is hers", "❌ That car is our → ✅ That car is ours"],
    questions: [
      { question: "This is not your pen. It's ___ (my pen).", options: ["my", "mine", "me", "I's"], correct: "mine", type: "multiple-choice", explanation: "Pronombre posesivo → mine" },
      { question: "Is that your car or ___ (her car)?", options: ["she", "her", "hers", "she's"], correct: "hers", type: "multiple-choice", explanation: "Pronombre posesivo para 'her car' → hers" },
      { question: "These are their books. The books are ___.", options: ["their", "theirs", "them", "they"], correct: "theirs", type: "multiple-choice", explanation: "Pronombre posesivo para 'their books' → theirs" },
      { question: "That coat belongs to me. It's ___.", options: ["my", "mine", "me", "I's"], correct: "mine", type: "multiple-choice", explanation: "Pronombre posesivo → mine" },
      { question: "Completa: This is our house. This house is ___.", answer: "ours", type: "fill-blank", explanation: "Pronombre posesivo para 'our house' → ours" }
    ]
  },
  {
    title: "Pronombres Indefinidos: Some, Any, No",
    slug: "indefinite-pronouns",
    level: "A2",
    category: "Pronombres",
    description: "Aprende a usar some, any, no y sus compuestos (someone, anything, nothing).",
    formula: "Some + afirmativo, Any + preguntas/negativos, No + verbo positivo = significado negativo",
    icon: "❌",
    unitId: 20,
    order: 20,
    sections: [
      { title: "Some y Any", content: "SOME en oraciones afirmativas, ANY en negativos y preguntas.", examples: ["I have some money. (Tengo algo de dinero)", "I don't have any money. (No tengo dinero)", "Do you have any questions? (¿Tienes alguna pregunta?)"] },
      { title: "Compuestos", content: "someone/somebody, something, somewhere; anyone/anybody, anything, anywhere; no one/nobody, nothing, nowhere.", examples: ["Someone is at the door. (Alguien está en la puerta)", "I don't know anyone here. (No conozco a nadie aquí)", "There's nothing to eat. (No hay nada para comer)"] }
    ],
    tips: ["No + verbo positivo = significado negativo (I have no time = No tengo tiempo)", "Usa 'no one' no 'no anybody'", "Los compuestos son singulares (Everyone is here, NOT Everyone are here)"],
    commonMistakes: ["❌ I don't have no money → ✅ I don't have any money", "❌ Anybody are here → ✅ Anybody is here"],
    questions: [
      { question: "I have ___ money in my wallet.", options: ["some", "any", "no", "none"], correct: "some", type: "multiple-choice", explanation: "Oración afirmativa → some" },
      { question: "There isn't ___ milk in the fridge.", options: ["some", "any", "no", "none"], correct: "any", type: "multiple-choice", explanation: "Oración negativa → any" },
      { question: "___ called while you were out.", options: ["Anyone", "Someone", "Anything", "Something"], correct: "Someone", type: "multiple-choice", explanation: "Afirmativo, persona → someone" },
      { question: "I don't know ___ about computers.", options: ["nothing", "something", "anything", "everything"], correct: "anything", type: "multiple-choice", explanation: "Oración negativa → anything" },
      { question: "Completa: There's ___ (no/any) food left. We need to shop.", answer: "no", type: "fill-blank", explanation: "Significado negativo con verbo positivo → no" }
    ]
  },

  // ==================== NIVEL B1 (INTERMEDIO) - 10 TEMAS ====================
  // Nota: Para B1, el contenido comienza a tener más inglés
  {
    title: "Present Perfect - Presente Perfecto",
    slug: "present-perfect",
    level: "B1",
    category: "Tenses",
    description: "The Present Perfect connects the past with the present. Learn when to use 'have/has + past participle'.",
    formula: "Subject + have/has + past participle",
    icon: "🔄",
    unitId: 21,
    order: 21,
    sections: [
      { title: "When to use the Present Perfect", content: "Use the Present Perfect for: 1) Life experiences (no specific time), 2) Past actions with present results, 3) Actions that started in the past and continue now.", examples: ["I have visited Paris. (He visitado París - experience)", "She has lost her keys. (Ella ha perdido sus llaves - present result)", "I have worked here for 5 years. (He trabajado aquí por 5 años - still working)"] },
      { title: "Signal Words", content: "Common words used with Present Perfect: ever, never, already, yet, just, for, since, so far, recently.", examples: ["Have you ever been to London?", "I haven't finished yet.", "She has just left."] }
    ],
    tips: ["Don't use specific past time words (yesterday, last week) with Present Perfect", "Use 'for' + period of time, 'since' + specific point", "Past participle of regular verbs = -ed, irregulars vary"],
    commonMistakes: ["❌ I have seen her yesterday → ✅ I saw her yesterday", "❌ She has went → ✅ She has gone"],
    questions: [
      { question: "I ___ (visit) Mexico three times.", options: ["have visited", "visited", "has visited", "visit"], correct: "have visited", type: "multiple-choice", explanation: "Life experience → Present Perfect" },
      { question: "She ___ (not/finish) her homework yet.", options: ["didn't finish", "hasn't finished", "haven't finished", "doesn't finish"], correct: "hasn't finished", type: "multiple-choice", explanation: "'She' + has + not + past participle" },
      { question: "Have you ___ eaten Thai food?", options: ["ever", "never", "yet", "just"], correct: "ever", type: "multiple-choice", explanation: "Question about experience → ever" },
      { question: "I have lived here ___ 2010.", options: ["for", "since", "from", "during"], correct: "since", type: "multiple-choice", explanation: "Specific point in time → since" },
      { question: "Complete: They ___ (be) married for 10 years.", answer: "have been", type: "fill-blank", explanation: "Duration from past to present → Present Perfect" }
    ]
  },
  {
    title: "Present Perfect vs Simple Past",
    slug: "present-perfect-vs-past",
    level: "B1",
    category: "Tenses",
    description: "Learn when to use Present Perfect vs Simple Past. The key difference is connection to the present.",
    formula: "Present Perfect: have/has + PP, Simple Past: verb-ed/irregular",
    icon: "⚖️",
    unitId: 22,
    order: 22,
    sections: [
      { title: "Key Differences", content: "Present perfect = connection to present. Simple past = finished past action with specific time.", examples: ["I have lost my phone. (I still don't have it)", "I lost my phone yesterday. (specific time)"] },
      { title: "Time Expressions", content: "Simple past: yesterday, last week, in 2020, ago. Present perfect: ever, never, already, yet, for, since.", examples: ["She went to London last year.", "She has been to London."] }
    ],
    tips: ["If time is mentioned or implied, use simple past", "News often starts with present perfect, then continues with simple past", "Questions about 'when' use simple past"],
    commonMistakes: ["❌ I have eaten breakfast at 8 AM → ✅ I ate breakfast at 8 AM", "❌ She has been to Paris last year → ✅ She went to Paris last year"],
    questions: [
      { question: "I ___ (see) that movie last week.", options: ["have seen", "saw", "see", "was seeing"], correct: "saw", type: "multiple-choice", explanation: "Specific time → simple past" },
      { question: "She ___ (live) in Madrid since 2015.", options: ["lived", "has lived", "was living", "live"], correct: "has lived", type: "multiple-choice", explanation: "Since + point → present perfect" },
      { question: "When ___ you arrive?", options: ["have", "did", "do", "are"], correct: "did", type: "multiple-choice", explanation: "Question with 'when' → simple past" },
      { question: "I ___ never ___ sushi.", options: ["have/eaten", "did/eat", "was/eating", "had/eaten"], correct: "have/eaten", type: "multiple-choice", explanation: "Life experience with 'never' → present perfect" },
      { question: "Complete: They ___ (move) here two years ago.", answer: "moved", type: "fill-blank", explanation: "Time expression → simple past" }
    ]
  },
  {
    title: "Present Perfect Continuous",
    slug: "present-perfect-continuous",
    level: "B1",
    category: "Tenses",
    description: "Learn to emphasize the duration of actions that started in the past and continue to the present.",
    formula: "Subject + have/has + been + verb-ing",
    icon: "⏱️",
    unitId: 23,
    order: 23,
    sections: [
      { title: "When to Use", content: "Emphasize duration of an action that started in the past and continues now. Focus on the activity, not the result.", examples: ["I have been studying for 3 hours. (He estado estudiando por 3 horas)", "She has been waiting since 9 AM. (Ella ha estado esperando desde las 9 AM)"] },
      { title: "Present Perfect Simple vs Continuous", content: "Simple = result/completion, Continuous = duration/activity.", examples: ["I've painted the room. (completed - he pintado la habitación)", "I've been painting the room. (activity, maybe not finished - he estado pintando)"] }
    ],
    tips: ["Use 'for' + duration, 'since' + starting point", "Stative verbs not used in continuous", "Continuous emphasizes the action, not the result"],
    commonMistakes: ["❌ I have been knowing her → ✅ I have known her", "❌ She has been being tired → ✅ She has been tired"],
    questions: [
      { question: "I ___ (study) all morning.", options: ["have studied", "have been studying", "studied", "was studying"], correct: "have been studying", type: "multiple-choice", explanation: "Emphasizing duration → present perfect continuous" },
      { question: "She ___ (work) here since 2018.", options: ["works", "has worked", "has been working", "worked"], correct: "has been working", type: "multiple-choice", explanation: "Duration from past to present → has been working" },
      { question: "How long ___ you ___ (wait) for me?", options: ["have/waiting", "have/been waiting", "did/wait", "are/waiting"], correct: "have/been waiting", type: "multiple-choice", explanation: "Question about duration → present perfect continuous" },
      { question: "I'm tired because I ___ (run).", options: ["ran", "have been running", "was running", "had run"], correct: "have been running", type: "multiple-choice", explanation: "Result of continuous action → present perfect continuous" },
      { question: "Complete: He ___ (play) video games for 5 hours!", answer: "has been playing", type: "fill-blank", explanation: "Duration emphasized → has been playing" }
    ]
  },
  {
    title: "First Conditional",
    slug: "first-conditional",
    level: "B1",
    category: "Conditionals",
    description: "Learn to express real and possible situations in the future.",
    formula: "If + present simple, will + base verb",
    icon: "🎲",
    unitId: 24,
    order: 24,
    sections: [
      { title: "Structure and Use", content: "Real possible situations in the future. The condition is likely to happen.", examples: ["If it rains, we will stay home. (Si llueve, nos quedaremos en casa)", "You will pass if you study. (Aprobarás si estudias)"] },
      { title: "Variations", content: "can, may, might, imperative instead of 'will'.", examples: ["If you finish early, you can leave. (Si terminas temprano, puedes irte)", "If you see John, tell him to call me. (Si ves a John, dile que me llame)"] }
    ],
    tips: ["Use present simple in 'if' clause, NOT 'will'", "First conditional = possible, real situations", "Can use 'unless' = 'if not'"],
    commonMistakes: ["❌ If it will rain, we will stay → ✅ If it rains, we will stay", "❌ If you won't study, you fail → ✅ If you don't study, you will fail"],
    questions: [
      { question: "If it ___ (rain), we will cancel the picnic.", options: ["rain", "rains", "will rain", "rained"], correct: "rains", type: "multiple-choice", explanation: "Present simple in 'if' clause" },
      { question: "She ___ (be) late if she doesn't hurry.", options: ["is", "will be", "would be", "was"], correct: "will be", type: "multiple-choice", explanation: "'Will' in result clause" },
      { question: "If you don't study, you ___ pass.", options: ["won't", "will", "don't", "aren't"], correct: "won't", type: "multiple-choice", explanation: "Negative result → won't" },
      { question: "___ he comes, we'll start.", options: ["If", "When", "Unless", "Whether"], correct: "If", type: "multiple-choice", explanation: "Possible condition → If" },
      { question: "Complete: If we ___ (leave) now, we'll arrive on time.", answer: "leave", type: "fill-blank", explanation: "Present simple in 'if' clause" }
    ]
  },
  {
    title: "Second Conditional",
    slug: "second-conditional",
    level: "B1",
    category: "Conditionals",
    description: "Learn to express imaginary or unlikely situations in the present or future.",
    formula: "If + past simple, would + base verb",
    icon: "💭",
    unitId: 25,
    order: 25,
    sections: [
      { title: "Structure and Use", content: "Imaginary, unreal, or unlikely situations. The condition is not true or probable.", examples: ["If I won the lottery, I would travel the world. (Si ganara la lotería, viajaría por el mundo)", "What would you do if you saw a ghost? (¿Qué harías si vieras un fantasma?)"] },
      { title: "Verb 'to be'", content: "Use 'were' for all persons (formal). This is the subjunctive form.", examples: ["If I were you, I would apologize. (Si yo fuera tú, me disculparía)", "If he were rich, he'd buy a yacht. (Si él fuera rico, compraría un yate)"] }
    ],
    tips: ["Second conditional = imaginary, contrary to present reality", "Use for advice: 'If I were you...'", "Past simple in 'if' clause refers to present/future, not past"],
    commonMistakes: ["❌ If I would be you → ✅ If I were you", "❌ If she will come → ✅ If she came"],
    questions: [
      { question: "If I ___ (be) you, I would take the job.", options: ["am", "is", "were", "are"], correct: "were", type: "multiple-choice", explanation: "'If I were you' is standard for advice" },
      { question: "She would travel more if she ___ (have) more money.", options: ["has", "had", "have", "having"], correct: "had", type: "multiple-choice", explanation: "Past simple in 'if' clause" },
      { question: "What would you do if you ___ a million dollars?", options: ["win", "won", "will win", "would win"], correct: "won", type: "multiple-choice", explanation: "Unreal present → past simple" },
      { question: "If they ___ me, I would go.", options: ["invite", "invited", "invites", "will invite"], correct: "invited", type: "multiple-choice", explanation: "Imaginary situation → past simple" },
      { question: "Complete: If we ___ (live) closer, we would visit more.", answer: "lived", type: "fill-blank", explanation: "Past simple for unreal situation" }
    ]
  },
  {
    title: "Passive Voice - Present and Past",
    slug: "passive-voice",
    level: "B1",
    category: "Voice",
    description: "Learn to change the focus of the sentence to the receiver of the action.",
    formula: "Subject + to be + past participle",
    icon: "🔄",
    unitId: 26,
    order: 26,
    sections: [
      { title: "When to Use", content: "When the action is more important than the doer, or the doer is unknown.", examples: ["The window was broken. (La ventana fue rota)", "Mistakes were made. (Se cometieron errores)", "This wine is made in France. (Este vino es hecho en Francia)"] },
      { title: "Structure", content: "Object becomes subject. Add 'by + agent' if important.", examples: ["Active: Shakespeare wrote Hamlet. (Shakespeare escribió Hamlet)", "Passive: Hamlet was written by Shakespeare. (Hamlet fue escrito por Shakespeare)"] }
    ],
    tips: ["Only transitive verbs can be passive", "Use passive in formal, scientific writing", "Omit 'by someone' when unnecessary"],
    commonMistakes: ["❌ The house was build → ✅ The house was built", "❌ English speak all over the world → ✅ English is spoken all over the world"],
    questions: [
      { question: "English ___ (speak) worldwide.", options: ["is spoken", "speaks", "is speak", "spoken"], correct: "is spoken", type: "multiple-choice", explanation: "Present passive: is + past participle" },
      { question: "The Mona Lisa ___ (paint) by da Vinci.", options: ["painted", "was painted", "is painted", "were painted"], correct: "was painted", type: "multiple-choice", explanation: "Past passive: was + past participle" },
      { question: "The letters ___ (send) yesterday.", options: ["are sent", "were sent", "was sent", "sent"], correct: "were sent", type: "multiple-choice", explanation: "Plural subject → were + past participle" },
      { question: "A new hospital ___ (build) next year.", options: ["is built", "was built", "will be built", "builds"], correct: "will be built", type: "multiple-choice", explanation: "Future passive: will be + past participle" },
      { question: "Complete: The car ___ (repair) at the moment.", answer: "is being repaired", type: "fill-blank", explanation: "Present continuous passive: is being + past participle" }
    ]
  },
  {
    title: "Past Perfect",
    slug: "past-perfect",
    level: "B1",
    category: "Tenses",
    description: "Learn to express actions that happened before another action in the past.",
    formula: "Subject + had + past participle",
    icon: "⏮️",
    unitId: 27,
    order: 27,
    sections: [
      { title: "When to Use", content: "To show which action happened first in the past. The past perfect is the 'past of the past'.", examples: ["When I arrived, the movie had already started. (Cuando llegué, la película ya había empezado)", "She had finished work before she went out. (Ella había terminado el trabajo antes de salir)"] },
      { title: "Past Perfect vs Simple Past", content: "Past perfect = earlier action, simple past = later action.", examples: ["He had eaten before I arrived. (Él había comido antes de que yo llegara)", "He ate after I arrived. (Él comió después de que yo llegara)"] }
    ],
    tips: ["Use 'already' or 'just' between had and past participle", "Use 'never' before past participle", "Time expressions: before, after, by the time, already, just, never"],
    commonMistakes: ["❌ When I arrived, the movie already started → ✅ When I arrived, the movie had already started", "❌ She had went → ✅ She had gone"],
    questions: [
      { question: "When we arrived, the movie ___ (start) already.", options: ["started", "had started", "has started", "was starting"], correct: "had started", type: "multiple-choice", explanation: "Earlier past action → past perfect" },
      { question: "She ___ (never/see) such a beautiful sunset.", options: ["never saw", "had never seen", "has never seen", "was never seeing"], correct: "had never seen", type: "multiple-choice", explanation: "Experience before a past time → past perfect" },
      { question: "After he ___ (finish) work, he went home.", options: ["finished", "had finished", "has finished", "was finishing"], correct: "had finished", type: "multiple-choice", explanation: "Action completed before another → past perfect" },
      { question: "I realized I ___ (leave) my phone at home.", options: ["left", "had left", "has left", "was leaving"], correct: "had left", type: "multiple-choice", explanation: "Action before realization → past perfect" },
      { question: "Complete: By the time we got there, they ___ (already/eat).", answer: "had already eaten", type: "fill-blank", explanation: "Completed action before a past time → past perfect" }
    ]
  },
  {
    title: "Reported Speech (Statements)",
    slug: "reported-speech-statements",
    level: "B1",
    category: "Reported Speech",
    description: "Learn to report what someone said. Change tenses, pronouns, and time expressions.",
    formula: "Reporting verb + (that) + clause with tense changes",
    icon: "💬",
    unitId: 28,
    order: 28,
    sections: [
      { title: "Tense Changes", content: "Present → Past, Past → Past Perfect, Will → Would, Can → Could.", examples: ["Direct: 'I work hard.' → Reported: He said he worked hard.", "Direct: 'I will call you.' → Reported: She said she would call me."] },
      { title: "Reporting Verbs", content: "said, told (+ object), explained, admitted, claimed.", examples: ["She told me (that) she was leaving.", "He explained why he was late."] }
    ],
    tips: ["Use 'that' - optional but common", "Don't change tense if statement is still true", "Change time expressions: today → that day, tomorrow → the next day, now → then"],
    commonMistakes: ["❌ He said me that... → ✅ He told me that...", "❌ She said that she is coming → ✅ She said that she was coming (if reporting past)"],
    questions: [
      { question: "'I live in New York,' she said. → She said that she ___ in NY.", options: ["lives", "lived", "live", "living"], correct: "lived", type: "multiple-choice", explanation: "Present → past in reported speech" },
      { question: "'I will help you,' he said. → He said he ___ help me.", options: ["will", "would", "can", "could"], correct: "would", type: "multiple-choice", explanation: "'Will' becomes 'would'" },
      { question: "'I'm watching TV,' she said. → She said she ___ TV.", options: ["watches", "was watching", "is watching", "watched"], correct: "was watching", type: "multiple-choice", explanation: "Present continuous → past continuous" },
      { question: "'We have finished,' they said. → They said they ___ finished.", options: ["have", "had", "has", "having"], correct: "had", type: "multiple-choice", explanation: "Present perfect → past perfect" },
      { question: "Complete: 'I can swim,' he said. → He said he ___ swim.", answer: "could", type: "fill-blank", explanation: "'Can' becomes 'could'" }
    ]
  },
  {
    title: "Relative Clauses (Defining)",
    slug: "relative-clauses-defining",
    level: "B1",
    category: "Clauses",
    description: "Learn to join sentences using relative pronouns to give essential information.",
    formula: "Noun + relative pronoun + clause",
    icon: "🔗",
    unitId: 29,
    order: 29,
    sections: [
      { title: "Relative Pronouns", content: "who (people), which (things), that (people/things), whose (possession), where (places), when (times).", examples: ["The man who called you is my brother. (El hombre que te llamó es mi hermano)", "This is the book that changed my life. (Este es el libro que cambió mi vida)"] },
      { title: "Object Pronouns (Optional)", content: "When the pronoun is the object, you can omit it.", examples: ["The book (that) I read was great. (El libro que leí era genial)", "The woman (who) I saw was tall. (La mujer que vi era alta)"] }
    ],
    tips: ["In defining clauses, you can omit the pronoun when it's the object", "Never use 'that' in non-defining clauses", "'Whose' is used for possession (not 'who's')"],
    commonMistakes: ["❌ The book which I read it was good → ✅ The book which I read was good", "❌ That's the restaurant that we met → ✅ That's the restaurant where we met"],
    questions: [
      { question: "The woman ___ lives next door is a teacher.", options: ["which", "who", "whose", "where"], correct: "who", type: "multiple-choice", explanation: "'Who' for people as subject" },
      { question: "This is the house ___ I grew up.", options: ["which", "that", "where", "who"], correct: "where", type: "multiple-choice", explanation: "'Where' for places" },
      { question: "The man ___ dog bit me apologized.", options: ["who", "which", "whose", "that's"], correct: "whose", type: "multiple-choice", explanation: "'Whose' shows possession" },
      { question: "This is the movie ___ I told you about.", options: ["who", "where", "whose", "that"], correct: "that", type: "multiple-choice", explanation: "Object relative pronoun → that/which (can be omitted)" },
      { question: "Complete: That's the restaurant ___ we had our first date.", answer: "where", type: "fill-blank", explanation: "'Where' for places" }
    ]
  },
  {
    title: "Used to / Would for Past Habits",
    slug: "used-to-past-habits",
    level: "B1",
    category: "Past Habits",
    description: "Learn to talk about past habits and states that are no longer true.",
    formula: "Used to + base verb, Would + base verb (for actions only)",
    icon: "🕰️",
    unitId: 30,
    order: 30,
    sections: [
      { title: "Used to", content: "For past habits AND past states that are no longer true.", examples: ["I used to smoke, but I quit. (Solía fumar, pero lo dejé)", "She used to live in New York. (Ella solía vivir en Nueva York - state)", "There used to be a cinema here. (Solía haber un cine aquí)"] },
      { title: "Would", content: "For past habits ONLY (not states). Describes repeated actions in the past.", examples: ["When I was a child, I would play outside every day. (Cuando era niño, jugaba afuera todos los días)", "My grandfather would always tell us stories. (Mi abuelo siempre nos contaba historias)"] },
      { title: "Negative and Questions", content: "didn't use to, Did you use to...?", examples: ["I didn't use to like vegetables. (No solía gustarme las verduras)", "Did you use to have long hair? (¿Solías tener el pelo largo?)"] }
    ],
    tips: ["Use 'used to' for states (have, be, live, work)", "Use 'would' for repeated actions only", "Don't confuse 'used to' (habit) with 'be used to' (accustomed to)"],
    commonMistakes: ["❌ I used to went → ✅ I used to go", "❌ Did you used to? → ✅ Did you use to?"],
    questions: [
      { question: "I ___ (smoke), but I quit 5 years ago.", options: ["used to smoke", "would smoke", "was smoking", "had smoked"], correct: "used to smoke", type: "multiple-choice", explanation: "Past habit no longer true → used to" },
      { question: "She ___ (live) in Paris, but now she lives in London.", options: ["used to live", "would live", "was living", "had lived"], correct: "used to live", type: "multiple-choice", explanation: "Past state no longer true → used to" },
      { question: "When I was young, we ___ go fishing every weekend.", options: ["used to", "would", "were going", "had gone"], correct: "would", type: "multiple-choice", explanation: "Past repeated action → would" },
      { question: "I ___ (not/like) coffee, but now I love it.", options: ["didn't use to like", "wouldn't like", "wasn't liking", "hadn't liked"], correct: "didn't use to like", type: "multiple-choice", explanation: "Negative past habit → didn't use to" },
      { question: "Complete: ___ you ___ (play) the piano when you were a child?", answer: "Did you use to play", type: "fill-blank", explanation: "Question about past habit → Did + subject + use to + verb" }
    ]
  },

  // ==================== NIVEL B2 (INTERMEDIO ALTO) - 10 TEMAS (CONTINUACIÓN) ====================
  {
    title: "Third Conditional",
    slug: "third-conditional",
    level: "B2",
    category: "Conditionals",
    description: "Learn to express regret about past situations that cannot be changed. Used for imagining a different past.",
    formula: "If + past perfect, would have + past participle",
    icon: "😔",
    unitId: 31,
    order: 31,
    sections: [
      { title: "Structure and Use", content: "The Third Conditional talks about imaginary past situations (impossible to change). Use it to express regret or criticize past actions.", examples: ["If I had studied, I would have passed. (Si hubiera estudiado, habría aprobado)", "If they had left earlier, they wouldn't have missed the flight. (Si hubieran salido antes, no habrían perdido el vuelo)"] },
      { title: "Mixed Conditionals", content: "Combine Second and Third Conditional to show different time relationships: past condition with present result.", examples: ["If I had studied (past), I would be a doctor now (present).", "If I were rich (present), I would have bought that car (past)."] }
    ],
    tips: ["Third conditional = 0% possibility (it's in the past)", "Use 'could have' or 'might have' instead of 'would have'", "Often expresses regret: 'If only I had...'"],
    commonMistakes: ["❌ If I would have known → ✅ If I had known", "❌ I would have been go → ✅ I would have gone"],
    questions: [
      { question: "If you ___ (tell) me, I would have helped.", options: ["told", "had told", "have told", "would tell"], correct: "had told", type: "multiple-choice", explanation: "Past perfect in 'if' clause" },
      { question: "She ___ if she had studied more.", options: ["would pass", "would have passed", "passed", "had passed"], correct: "would have passed", type: "multiple-choice", explanation: "Would have + past participle" },
      { question: "If we hadn't taken a taxi, we ___ the plane.", options: ["would miss", "would have missed", "missed", "had missed"], correct: "would have missed", type: "multiple-choice", explanation: "Would have + past participle in result" },
      { question: "I ___ (not/be) late if I hadn't overslept.", options: ["wouldn't be", "wouldn't have been", "wasn't", "hadn't been"], correct: "wouldn't have been", type: "multiple-choice", explanation: "Negative result of unreal past" },
      { question: "Complete: If he ___ (practice) more, he would have won.", answer: "had practiced", type: "fill-blank", explanation: "Past perfect for unreal past condition" }
    ]
  },
  {
    title: "Reported Speech (Questions and Commands)",
    slug: "reported-questions-commands",
    level: "B2",
    category: "Reported Speech",
    description: "Learn to report questions and commands using 'ask' and 'tell' with appropriate structures.",
    icon: "❓",
    unitId: 32,
    order: 32,
    sections: [
      { title: "Reported Questions", content: "Use 'ask' + if/whether for yes/no questions, question word for wh- questions. No question mark, no inversion.", examples: ["Direct: 'Do you like coffee?' → Reported: She asked if I liked coffee.", "Direct: 'Where do you live?' → Reported: He asked where I lived."] },
      { title: "Reported Commands", content: "Use 'tell' + object + (not) + to + infinitive.", examples: ["Direct: 'Sit down.' → Reported: He told me to sit down.", "Direct: 'Don't be late.' → Reported: She told me not to be late."] }
    ],
    tips: ["No question mark in reported questions", "Normal word order (subject before verb) in reported questions", "Use 'asked' for questions, 'told' for commands"],
    commonMistakes: ["❌ She asked me where did I live → ✅ She asked me where I lived", "❌ He told me that sit down → ✅ He told me to sit down"],
    questions: [
      { question: "'Do you speak Spanish?' She asked ___ I spoke Spanish.", options: ["if", "that", "what", "when"], correct: "if", type: "multiple-choice", explanation: "Yes/no question → if/whether" },
      { question: "'Where do you live?' He asked me where ___ lived.", options: ["I", "you", "he", "she"], correct: "I", type: "multiple-choice", explanation: "Pronoun change and normal word order" },
      { question: "'Close the door.' She told me ___ the door.", options: ["close", "to close", "closing", "closed"], correct: "to close", type: "multiple-choice", explanation: "Command → told + to + infinitive" },
      { question: "'Don't be late.' He told me ___ be late.", options: ["to", "not to", "don't", "didn't"], correct: "not to", type: "multiple-choice", explanation: "Negative command → not to + infinitive" },
      { question: "Complete: 'What time is it?' → He asked me what time ___ ___.", answer: "it was", type: "fill-blank", explanation: "Normal word order in reported question" }
    ]
  },
  {
    title: "Modal Verbs of Deduction (Past)",
    slug: "modal-deduction-past",
    level: "B2",
    category: "Modals",
    description: "Learn to make deductions and draw conclusions about past events using modal verbs.",
    formula: "Modal + have + past participle",
    icon: "🕵️",
    unitId: 33,
    order: 33,
    sections: [
      { title: "Must have - Certainty (90-100%)", content: "Logical conclusion about the past. You are almost sure.", examples: ["She must have been tired. She worked all day. (Ella debe haber estado cansada)", "He must have taken the wrong turn. (Él debe haber tomado la salida equivocada)"] },
      { title: "May have/Might have/Could have - Possibility (30-70%)", content: "Possible past actions, but not certain.", examples: ["He might have gotten stuck in traffic. (Él podría haberse quedado atrapado en el tráfico)", "She could have forgotten the appointment. (Ella podría haber olvidado la cita)"] },
      { title: "Can't have/Couldn't have - Negative Deduction (0-5%)", content: "Almost impossible. You are sure it didn't happen.", examples: ["She can't have left already. It's too early. (Ella no puede haberse ido ya)", "He couldn't have done it. He wasn't there. (Él no pudo haberlo hecho)"] }
    ],
    tips: ["Use 'must have' for strong deductions", "Use 'might have' for weak possibilities", "The opposite of 'must have' is 'can't have', not 'mustn't have'"],
    commonMistakes: ["❌ She must have went → ✅ She must have gone", "❌ He can't have went → ✅ He can't have gone"],
    questions: [
      { question: "She's not answering. She ___ (go) to sleep already.", options: ["must have gone", "might have gone", "can have gone", "should have gone"], correct: "must have gone", type: "multiple-choice", explanation: "Strong logical conclusion → must have" },
      { question: "I'm not sure, but he ___ (take) the wrong bus.", options: ["must have taken", "might have taken", "can have taken", "will have taken"], correct: "might have taken", type: "multiple-choice", explanation: "Possibility (not certain) → might have" },
      { question: "He's only 20. He ___ (finish) university already.", options: ["must have finished", "might have finished", "can't have finished", "should have finished"], correct: "can't have finished", type: "multiple-choice", explanation: "Impossible → can't have" },
      { question: "The ground is wet. It ___ (rain) last night.", options: ["must have rained", "might have rained", "could have rained", "should have rained"], correct: "must have rained", type: "multiple-choice", explanation: "Evidence → must have rained" },
      { question: "Complete: She's really good. She ___ (practice) a lot.", answer: "must have practiced", type: "fill-blank", explanation: "Strong deduction → must have + past participle" }
    ]
  },
  {
    title: "Gerunds and Infinitives (Advanced)",
    slug: "gerunds-infinitives-advanced",
    level: "B2",
    category: "Verb Patterns",
    description: "Learn advanced rules for using gerunds and infinitives, including verbs that change meaning.",
    icon: "📝",
    unitId: 34,
    order: 34,
    sections: [
      { title: "Verbs with Both (Change in Meaning)", content: "remember, forget, stop, try, regret, go on, mean change meaning depending on gerund or infinitive.", examples: ["I remember locking the door. (past memory - recuerdo haber cerrado)", "Remember to lock the door. (future reminder - recuerda cerrar)", "He stopped smoking. (quit - dejó de fumar)", "He stopped to smoke. (pause to do something else - se detuvo para fumar)"] },
      { title: "Verbs + Object + Infinitive", content: "want, ask, tell, expect, allow, enable, force, get.", examples: ["I want you to help me. (Quiero que me ayudes)", "She told me to wait. (Ella me dijo que esperara)", "They allowed us to leave early. (Nos permitieron irnos temprano)"] },
      { title: "Preposition + Gerund", content: "After prepositions, always use gerund.", examples: ["Thank you for helping me. (Gracias por ayudarme)", "I'm interested in learning Chinese. (Estoy interesado en aprender chino)", "She's good at solving problems. (Ella es buena resolviendo problemas)"] }
    ],
    tips: ["Some verbs change meaning completely", "Use gerund after prepositions (for, of, about, in, at, with)", "Use infinitive after adjectives (happy to see, difficult to understand)"],
    commonMistakes: ["❌ I look forward to see you → ✅ I look forward to seeing you", "❌ She suggested to go → ✅ She suggested going"],
    questions: [
      { question: "I remember ___ (meet) her before.", options: ["meet", "meeting", "to meet", "met"], correct: "meeting", type: "multiple-choice", explanation: "Past memory → gerund" },
      { question: "Please remember ___ (buy) milk.", options: ["buy", "buying", "to buy", "bought"], correct: "to buy", type: "multiple-choice", explanation: "Future reminder → infinitive" },
      { question: "Thank you for ___ (help) me.", options: ["help", "helping", "to help", "helped"], correct: "helping", type: "multiple-choice", explanation: "After preposition 'for' → gerund" },
      { question: "I want you ___ (come) early tomorrow.", options: ["come", "coming", "to come", "came"], correct: "to come", type: "multiple-choice", explanation: "Want + object + to infinitive" },
      { question: "Complete: I'm interested in ___ (learn) Japanese.", answer: "learning", type: "fill-blank", explanation: "After preposition 'in' → gerund" }
    ]
  },
  {
    title: "Wish and If Only",
    slug: "wish-if-only",
    level: "B2",
    category: "Expressing Wishes",
    description: "Learn to express wishes and regrets about the present, past, and future using 'wish' and 'if only'.",
    icon: "⭐",
    unitId: 35,
    order: 35,
    sections: [
      { title: "Wish + Past Simple (Present Wishes)", content: "For wishes about the present that are not true.", examples: ["I wish I had more time. (Desearía tener más tiempo)", "She wishes she lived in Paris. (Ella desearía vivir en París)", "I wish I were taller. (Desearía ser más alto)"] },
      { title: "Wish + Past Perfect (Past Wishes)", content: "For regrets about the past. Things that cannot be changed.", examples: ["I wish I had studied harder. (Desearía haber estudiado más)", "She wishes she hadn't said that. (Ella desearía no haber dicho eso)"] },
      { title: "Wish + Would (Future Wishes)", content: "For wishes about other people's behavior or things we want to change.", examples: ["I wish you would stop smoking. (Desearía que dejaras de fumar)", "She wishes he would call more often. (Ella desearía que él llamara más seguido)"] }
    ],
    tips: ["Use 'were' for all persons in present wishes (I wish I were)", "Past perfect for past regrets", "Use 'would' for complaints about other people's habits"],
    commonMistakes: ["❌ I wish I was taller → ✅ I wish I were taller (formal)", "❌ I wish I would have studied → ✅ I wish I had studied"],
    questions: [
      { question: "I wish I ___ (have) a better job.", options: ["have", "had", "have had", "would have"], correct: "had", type: "multiple-choice", explanation: "Present wish → past simple" },
      { question: "She wishes she ___ (not/say) that yesterday.", options: ["didn't say", "hadn't said", "wouldn't say", "hasn't said"], correct: "hadn't said", type: "multiple-choice", explanation: "Past regret → past perfect" },
      { question: "I wish you ___ (stop) making so much noise.", options: ["stop", "stopped", "would stop", "had stopped"], correct: "would stop", type: "multiple-choice", explanation: "Complaint about behavior → would" },
      { question: "If only I ___ (be) taller!", options: ["am", "is", "were", "are"], correct: "were", type: "multiple-choice", explanation: "'Were' for all persons in present wishes" },
      { question: "Complete: I wish I ___ (study) medicine at university.", answer: "had studied", type: "fill-blank", explanation: "Past regret → past perfect" }
    ]
  },
  {
    title: "Causative Have/Get",
    slug: "causative-have-get",
    level: "B2",
    category: "Causatives",
    description: "Learn to express that someone does something for you or that something happens to you.",
    formula: "have/get + object + past participle",
    icon: "⚙️",
    unitId: 36,
    order: 36,
    sections: [
      { title: "Causative 'Have'", content: "Arrange for someone to do something for you. More formal.", examples: ["I had my car repaired yesterday. (Hice reparar mi carro ayer)", "She had her hair cut. (Ella se cortó el pelo)", "We're having a new kitchen installed. (Estamos instalando una cocina nueva)"] },
      { title: "Causative 'Get'", content: "Same meaning as 'have', more informal. Can also use 'get someone to do'.", examples: ["I got my car repaired. (Hice reparar mi carro)", "I got him to fix the computer. (Convencí a que arreglara la computadora)"] },
      { title: "Negative Experiences", content: "Can also be used for bad things that happen to you.", examples: ["He had his wallet stolen. (Le robaron la cartera)", "She got her phone broken. (Le rompieron el teléfono)"] }
    ],
    tips: ["'Have' is more common in British English", "'Get' is more common in American English", "The past participle never changes form"],
    commonMistakes: ["❌ I had my car to repair → ✅ I had my car repaired", "❌ She got cut her hair → ✅ She got her hair cut"],
    questions: [
      { question: "I ___ my house painted last month.", options: ["had", "got", "made", "let"], correct: "had", type: "multiple-choice", explanation: "Causative 'have' + object + past participle" },
      { question: "She needs to ___ her eyes tested.", options: ["have", "get", "make", "let"], correct: "have", type: "multiple-choice", explanation: "Arrange a service → have/get" },
      { question: "I ___ my phone stolen yesterday.", options: ["had", "got", "made", "did"], correct: "had", type: "multiple-choice", explanation: "Negative experience → had" },
      { question: "We ___ the plumber fix the leak.", options: ["had", "got", "made", "caused"], correct: "got", type: "multiple-choice", explanation: "Get + person + to + verb" },
      { question: "Complete: You should ___ (get/check) your teeth regularly.", answer: "get your teeth checked", type: "fill-blank", explanation: "Causative get + object + past participle" }
    ]
  },
  {
    title: "Future Perfect and Future Continuous",
    slug: "future-perfect-continuous",
    level: "B2",
    category: "Tenses",
    description: "Learn to express actions that will be in progress or completed at a specific time in the future.",
    icon: "🔮",
    unitId: 37,
    order: 37,
    sections: [
      { title: "Future Continuous", content: "Actions in progress at a specific time in the future.", examples: ["This time tomorrow, I'll be flying to Paris. (Mañana a esta hora, estaré volando a París)", "Don't call at 8 PM, we'll be having dinner. (No llames a las 8 PM, estaremos cenando)"] },
      { title: "Future Perfect", content: "Actions that will be completed before a specific future time.", examples: ["I will have finished the report by Friday. (Habré terminado el informe para el viernes)", "She will have left by the time you arrive. (Ella se habrá ido para cuando llegues)"] },
      { title: "Time Expressions", content: "by, by the time, before, in (time), this time next...", examples: ["By next year, I will have graduated. (Para el próximo año, me habré graduado)", "This time next week, we'll be lying on the beach. (La próxima semana a esta hora, estaremos en la playa)"] }
    ],
    tips: ["Future continuous = in progress at a future time", "Future perfect = completed before a future time", "Use 'by' with future perfect"],
    commonMistakes: ["❌ I will have finish → ✅ I will have finished", "❌ She will be finish → ✅ She will be finishing"],
    questions: [
      { question: "This time tomorrow, I ___ (fly) to London.", options: ["will fly", "will be flying", "am flying", "fly"], correct: "will be flying", type: "multiple-choice", explanation: "In progress at a future time → future continuous" },
      { question: "By 2025, I ___ (graduate) from university.", options: ["will graduate", "will have graduated", "am graduating", "graduate"], correct: "will have graduated", type: "multiple-choice", explanation: "Completed before a future time → future perfect" },
      { question: "Don't call at 9 PM, we ___ (have) dinner.", options: ["will have", "will be having", "have", "are having"], correct: "will be having", type: "multiple-choice", explanation: "Action in progress → future continuous" },
      { question: "She ___ (work) here for 10 years by next month.", options: ["will work", "will have worked", "will be working", "works"], correct: "will have worked", type: "multiple-choice", explanation: "Completed duration by a future time → future perfect" },
      { question: "Complete: By the time you arrive, we ___ (eat) dinner.", answer: "will have eaten", type: "fill-blank", explanation: "Completed before a future time → future perfect" }
    ]
  },
  {
    title: "Non-defining Relative Clauses",
    slug: "relative-clauses-non-defining",
    level: "B2",
    category: "Clauses",
    description: "Learn to add extra information using commas. The information is not essential to identify the noun.",
    icon: "📝",
    unitId: 38,
    order: 38,
    sections: [
      { title: "Structure", content: "Extra information, not essential. Use commas. CANNOT use 'that'.", examples: ["My brother, who lives in Texas, is a doctor. (Mi hermano, que vive en Texas, es doctor)", "Paris, which is the capital of France, is beautiful. (París, que es la capital de Francia, es hermosa)"] },
      { title: "Omitting Pronouns", content: "You cannot omit the relative pronoun in non-defining clauses.", examples: ["Incorrect: My brother lives in Texas is a doctor.", "Correct: My brother, who lives in Texas, is a doctor."] }
    ],
    tips: ["Always use commas", "Never use 'that' in non-defining clauses", "You cannot omit the relative pronoun"],
    commonMistakes: ["❌ My brother that lives in Texas is a doctor → ✅ My brother, who lives in Texas, is a doctor", "❌ The car which is red is mine → ✅ The car, which is red, is mine"],
    questions: [
      { question: "My mother, ___ is a doctor, works at the hospital.", options: ["who", "that", "which", "whose"], correct: "who", type: "multiple-choice", explanation: "Non-defining clause → who (not that)" },
      { question: "London, ___ is the capital of England, is very old.", options: ["who", "that", "which", "where"], correct: "which", type: "multiple-choice", explanation: "Non-defining clause → which (not that)" },
      { question: "My car, ___ is very old, still runs well.", options: ["who", "that", "which", "whose"], correct: "which", type: "multiple-choice", explanation: "'That' cannot be used in non-defining clauses" },
      { question: "John, ___ car was stolen, called the police.", options: ["who", "which", "whose", "that"], correct: "whose", type: "multiple-choice", explanation: "'Whose' for possession in non-defining clause" },
      { question: "Complete: My sister, ___ lives in New York, is coming to visit.", answer: "who", type: "fill-blank", explanation: "Non-defining clause → who" }
    ]
  },
  {
    title: "Inversion with Negative Adverbials",
    slug: "inversion-negative-adverbials",
    level: "B2",
    category: "Inversion",
    description: "Learn to invert the subject and auxiliary verb for emphasis in formal English.",
    icon: "🔄",
    unitId: 39,
    order: 39,
    sections: [
      { title: "Negative Adverbials", content: "Never, rarely, seldom, hardly ever, no sooner, not only.", examples: ["Never have I seen such beauty. (Nunca he visto tanta belleza)", "Rarely does he arrive on time. (Rara vez llega a tiempo)", "No sooner had I arrived than it started raining. (Apenas había llegado cuando empezó a llover)"] },
      { title: "Time Expressions", content: "Only then, only later, only after, only when.", examples: ["Only after I arrived did I realize my mistake. (Solo después de que llegué me di cuenta de mi error)", "Only then did I understand the truth. (Solo entonces entendí la verdad)"] }
    ],
    tips: ["Inversion = question word order after negative adverb", "Used for emphasis, more common in formal/literary English", "Only use when the negative adverb starts the sentence"],
    commonMistakes: ["❌ Never I have seen → ✅ Never have I seen", "❌ Only then I realized → ✅ Only then did I realize"],
    questions: [
      { question: "Never ___ I seen such a beautiful view.", options: ["have", "has", "had", "did"], correct: "have", type: "multiple-choice", explanation: "Inversion after 'never' → auxiliary + subject" },
      { question: "Rarely ___ he arrive on time.", options: ["do", "does", "did", "has"], correct: "does", type: "multiple-choice", explanation: "Present simple inversion → does + he" },
      { question: "No sooner ___ I arrived than it started raining.", options: ["have", "has", "had", "did"], correct: "had", type: "multiple-choice", explanation: "Past perfect inversion after 'no sooner'" },
      { question: "Only after I got home ___ I realize my wallet was missing.", options: ["did", "had", "have", "was"], correct: "did", type: "multiple-choice", explanation: "Past simple inversion after 'only after'" },
      { question: "Complete: Little ___ she know the truth.", answer: "did", type: "fill-blank", explanation: "Inversion after 'little' → did + she" }
    ]
  },
  {
    title: "Mixed Conditionals (Advanced)",
    slug: "mixed-conditionals-advanced",
    level: "B2",
    category: "Conditionals",
    description: "Learn to combine different tenses in conditionals to show complex time relationships.",
    icon: "🔄",
    unitId: 40,
    order: 40,
    sections: [
      { title: "Past Condition → Present Result", content: "If + past perfect, would + base verb. A past action affecting the present.", examples: ["If I had studied medicine, I would be a doctor now. (Si hubiera estudiado medicina, ahora sería doctor)", "She wouldn't be so tired if she had slept more. (Ella no estaría tan cansada si hubiera dormido más)"] },
      { title: "Present Condition → Past Result", content: "If + past simple, would have + past participle. A general truth affecting the past.", examples: ["If I were more organized, I would have finished the project. (Si fuera más organizado, habría terminado el proyecto)", "If he wasn't so lazy, he would have gotten the promotion. (Si no fuera tan vago, habría conseguido el ascenso)"] }
    ],
    tips: ["Mixed conditionals show complex time relationships", "Very common in advanced English", "Used for expressing regret about present due to past"],
    commonMistakes: ["❌ If I would have studied, I would be a doctor → ✅ If I had studied, I would be a doctor", "❌ If I was taller, I would have been a player → ✅ If I were taller, I would have been a player"],
    questions: [
      { question: "If I had taken the job, I ___ in London now.", options: ["would live", "would have lived", "lived", "had lived"], correct: "would live", type: "multiple-choice", explanation: "Past condition → present result" },
      { question: "If I ___ taller, I would have been a basketball player.", options: ["was", "were", "am", "had been"], correct: "were", type: "multiple-choice", explanation: "Present condition → past result" },
      { question: "She wouldn't be so good if she ___ abroad.", options: ["didn't live", "hadn't lived", "doesn't live", "wouldn't live"], correct: "hadn't lived", type: "multiple-choice", explanation: "Past experience affecting present" },
      { question: "If he wasn't so selfish, he ___ more friends.", options: ["would have", "would have had", "has", "had"], correct: "would have", type: "multiple-choice", explanation: "Present characteristic → would have" },
      { question: "Complete: If she ___ (not/be) so shy, she would have given the speech.", answer: "weren't", type: "fill-blank", explanation: "Present condition → past result, use past simple" }
    ]
  },

  // ==================== NIVEL C1 (AVANZADO) - 10 TEMAS ====================
  {
    title: "Inversion in Conditional Sentences",
    slug: "inversion-conditionals",
    level: "C1",
    category: "Inversion",
    description: "Learn to omit 'if' and invert the subject and auxiliary verb in formal conditional sentences.",
    icon: "🔄",
    unitId: 41,
    order: 41,
    sections: [
      { title: "Inversion with 'Should' (First Conditional)", content: "For formal or emphatic conditions. Omit 'if' and invert 'should' and the subject.", examples: ["Should you need help, call me. (If you need help)", "Should he arrive early, ask him to wait."] },
      { title: "Inversion with 'Were' (Second Conditional)", content: "For imaginary or unreal situations. Omit 'if' and invert 'were' and the subject.", examples: ["Were I rich, I would travel the world. (If I were rich)", "Were he to win, he'd be surprised."] },
      { title: "Inversion with 'Had' (Third Conditional)", content: "For unreal past situations. Omit 'if' and invert 'had' and the subject.", examples: ["Had I known, I would have told you. (If I had known)", "Had she studied, she would have passed."] }
    ],
    tips: ["Very formal - used in academic and literary English", "Never use contracted forms after inversion", "Common in fixed expressions: 'Had I known...'"],
    commonMistakes: ["❌ Had I would know → ✅ Had I known", "❌ Were I to be rich → ✅ Were I rich"],
    questions: [
      { question: "___ you need anything, please let me know.", options: ["If", "Should", "Were", "Had"], correct: "Should", type: "multiple-choice", explanation: "First conditional inversion → Should + subject" },
      { question: "___ I known about the party, I would have gone.", options: ["If", "Should", "Were", "Had"], correct: "Had", type: "multiple-choice", explanation: "Third conditional inversion → Had + subject" },
      { question: "___ he to ask for help, we would support him.", options: ["Should", "Had", "Were", "If"], correct: "Were", type: "multiple-choice", explanation: "Second conditional inversion → Were + subject + to" },
      { question: "___ she more careful, she wouldn't have broken it.", options: ["Should", "Had", "Were", "If"], correct: "Had", type: "multiple-choice", explanation: "Third conditional → Had + subject + past participle" },
      { question: "Complete: ___ (have) we left earlier, we wouldn't be stuck now.", answer: "Had", type: "fill-blank", explanation: "Third conditional inversion → Had" }
    ]
  },
  {
    title: "Advanced Passive Structures",
    slug: "advanced-passive",
    level: "C1",
    category: "Voice",
    description: "Learn advanced passive structures for formal writing, including impersonal passive and passive reporting verbs.",
    icon: "📜",
    unitId: 42,
    order: 42,
    sections: [
      { title: "Impersonal Passive", content: "It + passive + that clause. Used in formal/reporting contexts.", examples: ["It is said that he is a genius. (Se dice que es un genio)", "It has been announced that the president will resign. (Se ha anunciado que el presidente renunciará)"] },
      { title: "Passive with Reporting Verbs", content: "Subject + passive reporting verb + to infinitive.", examples: ["He is said to be very wealthy. (Se dice que es muy rico)", "The suspect is believed to have fled. (Se cree que el sospechoso huyó)"] }
    ],
    tips: ["Use impersonal passive for opinions, beliefs, news reporting", "Use perfect infinitive for past actions (to have done)", "Very common in academic and journalistic writing"],
    commonMistakes: ["❌ It is said that he is rich → ✅ Correct", "❌ He is said that he is rich → ✅ He is said to be rich"],
    questions: [
      { question: "It ___ that more than 100 people attended.", options: ["is reporting", "reports", "is reported", "reporting"], correct: "is reported", type: "multiple-choice", explanation: "Impersonal passive: It + is + reported" },
      { question: "She ___ (believe) to have left the country.", options: ["believes", "is believed", "is believing", "believed"], correct: "is believed", type: "multiple-choice", explanation: "Passive reporting verb + to infinitive" },
      { question: "The company ___ (expect) to announce profits today.", options: ["expects", "is expected", "expecting", "has expected"], correct: "is expected", type: "multiple-choice", explanation: "Subject + passive reporting verb + to infinitive" },
      { question: "It ___ (think) that the situation is improving.", options: ["thinks", "is thought", "thinking", "thought"], correct: "is thought", type: "multiple-choice", explanation: "Impersonal passive → It is thought that" },
      { question: "Complete: He ___ (say) to be 100 years old.", answer: "is said", type: "fill-blank", explanation: "Passive reporting → is said to be" }
    ]
  },
  {
    title: "Emphatic Structures (Cleft Sentences)",
    slug: "cleft-sentences",
    level: "C1",
    category: "Emphasis",
    description: "Learn to emphasize different parts of a sentence using 'it' and 'what' cleft structures.",
    icon: "💪",
    unitId: 43,
    order: 43,
    sections: [
      { title: "It-cleft Sentences", content: "It is/was + emphasized element + that/who clause.", examples: ["It was John who called you. (Fue John quien te llamó)", "It's Spanish that I want to learn. (Es español lo que quiero aprender)"] },
      { title: "What-cleft Sentences", content: "What + subject + do/does/did + is/was + emphasized information.", examples: ["What I need is a vacation. (Lo que necesito son unas vacaciones)", "What she did was apologize. (Lo que hizo fue disculparse)"] },
      { title: "All-cleft Sentences", content: "All + subject + do/does/did + is/was + infinitive.", examples: ["All I want is to be happy. (Todo lo que quiero es ser feliz)", "All you need to do is call me. (Todo lo que necesitas hacer es llamarme)"] }
    ],
    tips: ["Use cleft sentences to emphasize specific information", "Very common in spoken English for contrast", "Helps organize information in complex sentences"],
    commonMistakes: ["❌ It was me who did it → ✅ It was I who did it (formal)", "❌ What I need is a vacation → ✅ Correct"],
    questions: [
      { question: "It was ___ who broke the window.", options: ["he", "him", "his", "he's"], correct: "he", type: "multiple-choice", explanation: "Subject pronoun after 'it was'" },
      { question: "What I ___ is some peace.", options: ["need", "needs", "needing", "to need"], correct: "need", type: "multiple-choice", explanation: "What-cleft: What + subject + verb" },
      { question: "All you need to ___ is be yourself.", options: ["do", "does", "doing", "done"], correct: "do", type: "multiple-choice", explanation: "All-cleft: All + subject + do + is + infinitive" },
      { question: "It was because of the rain ___ the game was cancelled.", options: ["why", "that", "which", "who"], correct: "that", type: "multiple-choice", explanation: "It-cleft requires 'that' (or 'who' for people)" },
      { question: "Complete: What she ___ (do) was quit her job.", answer: "did", type: "fill-blank", explanation: "Past tense: What + subject + did + was" }
    ]
  },
  {
    title: "Subjunctive Mood",
    slug: "subjunctive",
    level: "C1",
    category: "Mood",
    description: "Learn to use the subjunctive mood in English for formal situations, wishes, and demands.",
    icon: "✨",
    unitId: 44,
    order: 44,
    sections: [
      { title: "Present Subjunctive", content: "Used after verbs like suggest, recommend, demand, insist. Use base form (no -s).", examples: ["I suggest that he study more. (Sugiero que él estudie más)", "They recommended that she not go alone. (Recomendaron que ella no fuera sola)", "It is important that everyone be on time. (Es importante que todos lleguen a tiempo)"] },
      { title: "Fixed Expressions", content: "Come what may, God save the Queen, be that as it may.", examples: ["Come what may, I'll support you. (Pase lo que pase, te apoyaré)", "Be that as it may, we still need to decide. (Sea como sea, aún debemos decidir)"] },
      { title: "Past Subjunctive ('Were')", content: "Using 'were' for all persons in unreal conditions and wishes.", examples: ["I wish I were richer. (Desearía ser más rico)", "If only she were here. (Ojalá ella estuviera aquí)", "He acts as if he were the boss. (Actúa como si fuera el jefe)"] }
    ],
    tips: ["Subjunctive is more common in American English", "In British English, 'should' + infinitive is often used", "The subjunctive has NO 's' for third person"],
    commonMistakes: ["❌ I suggest that he studies → ✅ I suggest that he study", "❌ It's important that she is on time → ✅ It's important that she be on time"],
    questions: [
      { question: "I suggest that he ___ a doctor immediately.", options: ["sees", "see", "saw", "has seen"], correct: "see", type: "multiple-choice", explanation: "Subjunctive after 'suggest' → base form" },
      { question: "It's essential that she ___ on time.", options: ["is", "are", "be", "being"], correct: "be", type: "multiple-choice", explanation: "Subjunctive in adjective clauses → be" },
      { question: "I wish I ___ taller.", options: ["was", "were", "am", "is"], correct: "were", type: "multiple-choice", explanation: "'Were' for all persons in wishes" },
      { question: "They demanded that the meeting ___ cancelled.", options: ["was", "were", "be", "is"], correct: "be", type: "multiple-choice", explanation: "Subjunctive after 'demand' → be" },
      { question: "Complete: The teacher recommends that every student ___ (read) the book.", answer: "read", type: "fill-blank", explanation: "Subjunctive after 'recommends' → base form" }
    ]
  },
  {
    title: "Ellipsis and Substitution",
    slug: "ellipsis-substitution",
    level: "C1",
    category: "Discourse",
    description: "Learn to avoid repetition using ellipsis (leaving words out) and substitution (using 'do/so/one').",
    icon: "✂️",
    unitId: 45,
    order: 45,
    sections: [
      { title: "Ellipsis (Leaving Words Out)", content: "Omit repeated words in coordinated clauses and comparative structures.", examples: ["She can speak French and (she can) sing beautifully.", "He is taller than I (am).", "I wanted to leave, but he didn't (want to leave)."] },
      { title: "Substitution with 'Do/So/It'", content: "Use 'do' or 'so' to avoid repeating verbs.", examples: ["She asked me to call, so I did. (Ella me pidió que llamara, y lo hice)", "He said he would help, but he didn't do so. (Dijo que ayudaría, pero no lo hizo)"] },
      { title: "Substitution with 'One/Ones'", content: "Use 'one' to avoid repeating nouns.", examples: ["I need a new phone. This one is broken. (Necesito un teléfono nuevo. Este está roto)", "Which shoes do you want? The red ones. (¿Qué zapatos quieres? Los rojos)"] }
    ],
    tips: ["Ellipsis makes speech more natural and less repetitive", "Common in responses (A: Do you like it? B: I do.)", "Use 'so' after verbs like think, hope, expect, suppose"],
    commonMistakes: ["❌ I think so → ✅ Correct", "❌ She can sing and can dance → ✅ She can sing and dance"],
    questions: [
      { question: "She can play guitar and ___ sing.", options: ["she can", "can", "she", "does"], correct: "can", type: "multiple-choice", explanation: "Ellipsis of repeated auxiliary" },
      { question: "I wanted to call, but I ___ have time.", options: ["didn't", "wasn't", "don't", "hadn't"], correct: "didn't", type: "multiple-choice", explanation: "Ellipsis of 'didn't have time'" },
      { question: "A: Do you like it? B: Yes, I ___ .", options: ["like", "do", "am", "have"], correct: "do", type: "multiple-choice", explanation: "Substitution with 'do'" },
      { question: "I need a new computer. This ___ is too slow.", options: ["computer", "one", "it", "that"], correct: "one", type: "multiple-choice", explanation: "Substitution with 'one' for singular noun" },
      { question: "Complete: I thought it would rain, and it ___ .", answer: "did", type: "fill-blank", explanation: "Substitution with 'did' for past action" }
    ]
  },
  {
    title: "Fronting and Inversion",
    slug: "fronting-inversion",
    level: "C1",
    category: "Discourse",
    description: "Learn to change word order for emphasis by moving elements to the front of the sentence.",
    icon: "🎯",
    unitId: 46,
    order: 46,
    sections: [
      { title: "Fronting (Moving to the Front)", content: "Move object or complement to the beginning for emphasis.", examples: ["A wonderful time we had! (¡Un tiempo maravilloso tuvimos!)", "His name I can never remember. (Su nombre nunca puedo recordar)"] },
      { title: "Inversion after Place Adverbials", content: "When place expressions start the sentence, invert subject and verb.", examples: ["On the table was a book. (Sobre la mesa había un libro)", "In the garden stood a statue. (En el jardín había una estatua)"] }
    ],
    tips: ["Fronting is common in storytelling and narrative", "Inversion after place adverbials is more formal/literary", "Use with verbs of movement or position (sit, stand, lie, live, come, go)"],
    commonMistakes: ["❌ Into the room walked he → ✅ Into the room he walked OR Into the room walked the man", "❌ On the table it was → ✅ On the table was a book"],
    questions: [
      { question: "___ time we had at the beach!", options: ["What a wonderful", "How wonderful", "So wonderful", "Wonderfully"], correct: "What a wonderful", type: "multiple-choice", explanation: "Fronting for emphasis → What + adjective + noun" },
      { question: "On the table ___ a vase of flowers.", options: ["was", "there was", "is being", "had"], correct: "was", type: "multiple-choice", explanation: "Inversion after place expression" },
      { question: "Into the room ___ three policemen.", options: ["walked", "did walk", "walking", "were walking"], correct: "walked", type: "multiple-choice", explanation: "Inversion with movement verb" },
      { question: "Such ___ the beauty of the sunset that everyone stopped.", options: ["was", "were", "is", "are"], correct: "was", type: "multiple-choice", explanation: "Inversion with 'such'" },
      { question: "Complete: In the middle of the forest ___ (stand) an ancient castle.", answer: "stood", type: "fill-blank", explanation: "Inversion after place expression" }
    ]
  },
  {
    title: "Advanced Modal Verbs",
    slug: "advanced-modals",
    level: "C1",
    category: "Modals",
    description: "Learn advanced uses of modal verbs including modal perfects for regret and criticism.",
    icon: "🎓",
    unitId: 47,
    order: 47,
    sections: [
      { title: "Modal Perfects for Regret", content: "Should have, could have, might have for missed opportunities and regret.", examples: ["I should have studied harder. (Debería haber estudiado más - regret)", "You could have told me! (¡Podrías habérmelo dicho! - annoyance)", "We might have won if we'd tried harder. (Podríamos haber ganado si hubiéramos intentado más)"] },
      { title: "Needn't have vs Didn't need to", content: "Needn't have = did but was unnecessary, Didn't need to = may or may not have done.", examples: ["I needn't have cooked. They ordered pizza. (No necesitaba haber cocinado - pero cociné)", "I didn't need to buy milk. We had some. (No necesitaba comprar leche - no compré)"] },
      { title: "Would rather/Would sooner", content: "Express preference.", examples: ["I'd rather stay home than go out. (Prefiero quedarme en casa que salir)", "I'd sooner die than apologize. (Antes morir que disculparme)"] }
    ],
    tips: ["Modal perfect = modal + have + past participle", "Use for criticism, regret, and missed opportunities", "'Needn't have' shows unnecessary past action"],
    commonMistakes: ["❌ I should have went → ✅ I should have gone", "❌ I needn't have went → ✅ I needn't have gone"],
    questions: [
      { question: "I ___ studied more for the exam. I failed.", options: ["should have", "would have", "could have", "might have"], correct: "should have", type: "multiple-choice", explanation: "Regret about past → should have" },
      { question: "You ___ told me you were coming! I would have waited.", options: ["should have", "could have", "might have", "must have"], correct: "could have", type: "multiple-choice", explanation: "Missed opportunity → could have" },
      { question: "I ___ cooked dinner. They brought food.", options: ["needn't have", "didn't need to", "shouldn't have", "wouldn't have"], correct: "needn't have", type: "multiple-choice", explanation: "Unnecessary past action → needn't have" },
      { question: "I'd rather ___ at home tonight.", options: ["stay", "to stay", "staying", "stayed"], correct: "stay", type: "multiple-choice", explanation: "Would rather + base verb" },
      { question: "Complete: She ___ (should/not/say) that. It was very rude.", answer: "shouldn't have said", type: "fill-blank", explanation: "Past regret → shouldn't have + past participle" }
    ]
  },
  {
    title: "Participle Clauses",
    slug: "participle-clauses",
    level: "C1",
    category: "Clauses",
    description: "Learn to use participles to create more concise and sophisticated sentences.",
    icon: "📝",
    unitId: 48,
    order: 48,
    sections: [
      { title: "Present Participle Clauses", content: "-ing clauses to show active or simultaneous actions.", examples: ["Walking home, I saw an accident. (While I was walking)", "Feeling tired, she went to bed early. (Because she felt tired)"] },
      { title: "Past Participle Clauses", content: "-ed clauses to show passive meaning.", examples: ["Exhausted by the journey, he fell asleep. (Because he was exhausted)", "Given more time, I would have finished. (If I had been given)"] },
      { title: "Perfect Participle Clauses", content: "Having + past participle to show one action before another.", examples: ["Having finished work, he went home. (After he finished work)", "Having been warned, they were careful. (Because they had been warned)"] }
    ],
    tips: ["Participle clauses are more common in writing than speech", "The subject of the participle clause must be the same as the main clause", "Can replace time, reason, condition, or result clauses"],
    commonMistakes: ["❌ Walking home, the accident happened → ✅ Walking home, I saw an accident (the subject 'I' is needed)", "❌ Having finished work, the pub was visited → ✅ Having finished work, he visited the pub"],
    questions: [
      { question: "___ home, I saw an accident.", options: ["Walked", "Walking", "Was walking", "Had walked"], correct: "Walking", type: "multiple-choice", explanation: "Present participle for simultaneous action" },
      { question: "___ tired, she went to bed.", options: ["Feeling", "Felt", "Was feeling", "Had felt"], correct: "Feeling", type: "multiple-choice", explanation: "Present participle for reason" },
      { question: "___ by the long journey, he fell asleep.", options: ["Exhausting", "Exhausted", "Being exhausted", "Having exhausted"], correct: "Exhausted", type: "multiple-choice", explanation: "Past participle for passive meaning" },
      { question: "___ finished work, he went home.", options: ["Having", "Had", "Has", "Was"], correct: "Having", type: "multiple-choice", explanation: "Perfect participle for action before another" },
      { question: "Complete: ___ (give) the choice, she would have stayed home.", answer: "Given", type: "fill-blank", explanation: "Past participle conditional → Given" }
    ]
  },
  {
    title: "Advanced Comparison Structures",
    slug: "advanced-comparison",
    level: "C1",
    category: "Comparatives",
    description: "Learn advanced comparative structures and idiomatic expressions for comparing things.",
    icon: "📈",
    unitId: 49,
    order: 49,
    sections: [
      { title: "Correlative Comparatives", content: "The + comparative, the + comparative (parallel increase).", examples: ["The more you study, the more you learn. (Cuanto más estudias, más aprendes)", "The older I get, the wiser I become. (Cuanto más viejo me hago, más sabio me vuelvo)"] },
      { title: "Gradual Increase", content: "Comparative and comparative (more and more, better and better).", examples: ["He's getting better and better at English. (Está mejorando cada vez más en inglés)", "It's becoming more and more difficult. (Se está volviendo cada vez más difícil)"] },
      { title: "Other Comparison Structures", content: "As...as, not so...as, just as...as, twice/three times as.", examples: ["She's as tall as her brother. (Ella es tan alta como su hermano)", "This book is twice as expensive as that one. (Este libro es dos veces más caro que ese)"] }
    ],
    tips: ["The...the structure uses a comma, not a conjunction", "Double comparatives show continuous change", "Use 'as...as' for equality, 'not as...as' for inequality"],
    commonMistakes: ["❌ More you study, more you learn → ✅ The more you study, the more you learn", "❌ He is more taller than me → ✅ He is taller than me"],
    questions: [
      { question: "___ you study, ___ you'll learn.", options: ["More/more", "The more/the more", "If more/then more", "When more/so more"], correct: "The more/the more", type: "multiple-choice", explanation: "Correlative comparative → The + comparative + the + comparative" },
      { question: "He's getting ___ and ___ at English.", options: ["good/good", "better/better", "well/well", "best/best"], correct: "better/better", type: "multiple-choice", explanation: "Gradual increase → comparative and comparative" },
      { question: "She's ___ as her sister.", options: ["as tall", "taller than", "so tall", "tall so"], correct: "as tall", type: "multiple-choice", explanation: "Equality → as + adjective + as" },
      { question: "This is ___ as that one.", options: ["twice as expensive", "twice more expensive", "two times expensive", "expensive twice"], correct: "twice as expensive", type: "multiple-choice", explanation: "Multiples → twice/three times + as + adjective + as" },
      { question: "Complete: The ___ (fast) you drive, the more dangerous it is.", answer: "faster", type: "fill-blank", explanation: "Correlative comparative → The + comparative" }
    ]
  },
  {
    title: "Discourse Markers",
    slug: "discourse-markers",
    level: "C1",
    category: "Discourse",
    description: "Learn to use discourse markers to connect ideas and improve writing fluency.",
    icon: "🔗",
    unitId: 50,
    order: 50,
    sections: [
      { title: "Adding Information", content: "Moreover, furthermore, in addition, additionally, besides.", examples: ["The hotel was expensive. Moreover, it was far from the beach. (El hotel era caro. Además, estaba lejos de la playa)", "He's an excellent teacher. Furthermore, he's very patient. (Es un excelente profesor. Además, es muy paciente)"] },
      { title: "Contrasting", content: "However, nevertheless, on the other hand, in contrast, whereas.", examples: ["The weather was bad. However, we enjoyed our trip. (El clima era malo. Sin embargo, disfrutamos el viaje)", "She loves action movies, whereas he prefers comedies. (A ella le encantan las películas de acción, mientras que él prefiere las comedias)"] },
      { title: "Giving Examples", content: "For instance, for example, such as, in particular.", examples: ["Many countries, such as France and Italy, produce good wine. (Muchos países, como Francia e Italia, producen buen vino)", "I love outdoor activities; for instance, hiking and camping. (Amo las actividades al aire libre; por ejemplo, senderismo y camping)"] },
      { title: "Showing Result", content: "Therefore, consequently, as a result, thus, hence.", examples: ["He didn't study. Therefore, he failed. (No estudió. Por lo tanto, reprobó)", "The company lost money. Consequently, they had to lay off staff. (La empresa perdió dinero. En consecuencia, tuvieron que despedir personal)"] }
    ],
    tips: ["Discourse markers improve writing coherence", "More formal markers are used in academic writing", "Position varies: beginning, middle, or end of sentence"],
    commonMistakes: ["❌ However, it was expensive → ✅ Correct (at beginning)", "❌ It was expensive, however → ✅ It was expensive, however (with commas if in middle)"],
    questions: [
      { question: "The hotel was nice. ___, it was very expensive.", options: ["However", "Moreover", "Therefore", "For example"], correct: "However", type: "multiple-choice", explanation: "Contrast → However" },
      { question: "He's very talented. ___, he works extremely hard.", options: ["However", "Nevertheless", "Moreover", "Consequently"], correct: "Moreover", type: "multiple-choice", explanation: "Adding information → Moreover" },
      { question: "He didn't save any money. ___, he couldn't buy the car.", options: ["However", "Furthermore", "Therefore", "For instance"], correct: "Therefore", type: "multiple-choice", explanation: "Showing result → Therefore" },
      { question: "I love sports, ___ soccer and basketball.", options: ["for example", "however", "therefore", "nevertheless"], correct: "for example", type: "multiple-choice", explanation: "Giving examples → for example" },
      { question: "Complete: She's very kind. ___ (contrast), her sister is quite rude.", answer: "In contrast", type: "fill-blank", explanation: "Contrast marker → In contrast" }
    ]
  }
];

// Función para ejecutar el seed (con actualización si existe)
module.exports = async () => {
  try {
    console.log('🌱 Iniciando seed completo de gramática (contenido adaptado por nivel)...');
    console.log('📊 Estrategia de contenido:');
    console.log('   - A1: 100% Español (para principiantes)');
    console.log('   - A2: 90% Español, 10% Inglés');
    console.log('   - B1: 50% Español, 50% Inglés');
    console.log('   - B2: 30% Español, 70% Inglés');
    console.log('   - C1: 100% Inglés (para avanzados)');
    console.log('');
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const topic of grammarData) {
      // Buscar si ya existe por slug
      const existing = await GrammarTopic.findOne({
        where: { slug: topic.slug }
      });
      
      if (existing) {
        // Actualizar el tema existente con la nueva información
        await existing.update({
          title: topic.title,
          level: topic.level,
          category: topic.category,
          description: topic.description,
          formula: topic.formula,
          icon: topic.icon,
          unitId: topic.unitId,
          order: topic.order,
          sections: JSON.stringify(topic.sections),
          tips: JSON.stringify(topic.tips),
          commonMistakes: topic.commonMistakes ? JSON.stringify(topic.commonMistakes) : null,
          questions: JSON.stringify(topic.questions),
          active: true
        });
        console.log(`🔄 ACTUALIZADO [${topic.level}]: ${topic.title}`);
        updatedCount++;
      } else {
        // Crear nuevo tema
        await GrammarTopic.create({
          ...topic,
          sections: JSON.stringify(topic.sections),
          tips: JSON.stringify(topic.tips),
          questions: JSON.stringify(topic.questions),
          commonMistakes: topic.commonMistakes ? JSON.stringify(topic.commonMistakes) : null
        });
        console.log(`✅ CREADO [${topic.level}]: ${topic.title}`);
        createdCount++;
      }
    }
    
    console.log('\n✨ Seed completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - Creados: ${createdCount}`);
    console.log(`   - Actualizados: ${updatedCount}`);
    console.log(`   - Total: ${grammarData.length} temas`);
    console.log(`\n📈 Distribución por nivel:`);
    console.log(`   - A1: ${grammarData.filter(t => t.level === 'A1').length} temas`);
    console.log(`   - A2: ${grammarData.filter(t => t.level === 'A2').length} temas`);
    console.log(`   - B1: ${grammarData.filter(t => t.level === 'B1').length} temas`);
    console.log(`   - B2: ${grammarData.filter(t => t.level === 'B2').length} temas`);
    console.log(`   - C1: ${grammarData.filter(t => t.level === 'C1').length} temas`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    console.error('Detalles:', error.original || error);
    process.exit(1);
  }
}
