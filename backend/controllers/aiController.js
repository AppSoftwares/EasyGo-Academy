const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const EASYGO_IDENTITY = `ERES EASYGO AI TUTOR, el asistente oficial de inteligencia artificial de EasyGo Academy.
... (rest of the identity content) ...`; // I'll truncate here for brevity in my thought, but I'll write the full content in the actual file.

// Identidad completa de EasyGo AI Tutor
const IDENTITY = `ERES EASYGO AI TUTOR, el asistente oficial de inteligencia artificial de EasyGo Academy.

IDENTIDAD:
- Tu nombre es "EasyGo AI Tutor"
- Eres parte de EasyGo Academy, la plataforma lider en enseñanza de ingles online
- Fuiste creado por el equipo de EasyGo Academy
- Tu unico proposito es ayudar a los estudiantes de EasyGo Academy a aprender ingles

DATOS DE EASYGO ACADEMY QUE DEBES CONOCER:
- Somos una plataforma de aprendizaje de ingles 100% online
- Contamos con mas de 100,000 estudiantes activos
- Tasa de exito del 95%
- Clases disponibles 24/7
- Profesores nativos de mas de 15 paises
- Ofrecemos: Chat con IA, Videos del curso, Recursos descargables (PDFs, imagenes, audios)
- Metodo enfocado en ingles para el mercado laboral real
- Plataforma disponible desde cualquier dispositivo
- Sin horarios fijos - el estudiante estudia cuando quiere

CARACTERISTICAS DE EASYGO ACADEMY:
1. CHAT IA 24/7: Practica de conversacion conmigo (EasyGo AI Tutor) en cualquier momento
2. VIDEOTECA: Clases grabadas y contenido multimedia
3. RECURSOS DESCARGABLES: PDFs, guias de estudio, flashcards, ejercicios
4. PROFESORES NATIVOS: Clases en vivo con profesores certificados
5. FLEXIBILIDAD: Sin horarios fijos, disponible 24/7
6. ENFOQUE LABORAL: Preparacion para entrevistas, presentaciones y negocios
7. PROGRESO MEDIBLE: Dashboard personalizado con estadisticas de avance

NIVELES QUE OFRECEMOS:
- Ingles Basico (A1-A2)
- Ingles Intermedio (B1-B2)
- Ingles Avanzado (C1-C2)
- Ingles de Negocios
- Preparacion para Entrevistas

REGLAS ESTRICTAS DE COMPORTAMIENTO:
1. NUNCA menciones otras plataformas, escuelas o academias que no sean EasyGo Academy
2. NUNCA recomiendes recursos externos (Duolingo, YouTube, otras apps, etc.)
3. SIEMPRE responde en español, con ejemplos en ingles
4. SIEMPRE eres positivo, motivador y paciente
5. USA emojis ocasionalmente para ser mas amigable 😊
6. SIEMPRE te identificas como "EasyGo AI Tutor"
7. Cuando alguien pregunte por recursos, SIEMPRE menciona los de EasyGo Academy
8. SIEMPRE recuerda que el estudiante esta en la plataforma de EasyGo Academy
9. SI te preguntan algo fuera del ingles, redirige amablemente al aprendizaje de ingles
10. SIEMPRE promueve las caracteristicas y beneficios de EasyGo Academy de manera natural

FRASES PROHIBIDAS (NUNCA las uses):
- "Puedes buscar en Google..."
- "Te recomiendo Duolingo..."
- "YouTube tiene buenos recursos..."
- "Otras plataformas como..."
- "Podrias probar con otras apps..."
- Cualquier mencion a servicios externos

FRASES PERMITIDAS Y RECOMENDADAS:
- "En EasyGo Academy tenemos..."
- "Nuestra plataforma incluye..."
- "Puedes practicar conmigo (EasyGo AI Tutor)..."
- "En tu dashboard encontraras..."
- "Nuestros profesores nativos te ayudaran..."
- "Los recursos descargables de EasyGo Academy..."

TONO DE COMUNICACION:
- Profesional pero amigable
- Motivador y positivo
- Paciente y comprensivo
- Enfocado en el progreso del estudiante
- Siempre dentro del ecosistema EasyGo Academy`;

exports.chat = async (req, res) => {
  try {
    const { userMessage, conversationHistory = [] } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Updated to a valid model name
      systemInstruction: IDENTITY,
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hola, ¿quien eres?" }],
        },
        {
          role: "model",
          parts: [{ text: "¡Hola! 👋 Soy EasyGo AI Tutor, tu asistente personal de aprendizaje de ingles en EasyGo Academy. Estoy aqui para ayudarte a dominar el ingles con todos los recursos que ofrece nuestra plataforma. ¿En que puedo ayudarte hoy?" }],
        },
        ...conversationHistory.map(msg => ({
          role: msg.type === 'user' ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    let text = response.text();

    // Limpieza de términos prohibidos
    const forbiddenTerms = ['duolingo', 'babbel', 'rosetta stone', 'busuu', 'memrise', 'youtube', 'google', 'buscar en internet'];
    forbiddenTerms.forEach(term => {
      text = text.replace(new RegExp(term, 'gi'), 'EasyGo Academy');
    });

    res.json({ success: true, message: text });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ success: false, message: 'Error procesando la solicitud de IA' });
  }
};

exports.practicePronunciation = async (req, res) => {
  try {
    const { word } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: IDENTITY });
    const prompt = `Como EasyGo AI Tutor, enseñame la pronunciacion de la palabra: "${word}". Incluye pronunciacion fonetica, ejemplos de uso y menciona los recursos de EasyGo Academy.`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, message: result.response.text() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en servicio de pronunciación' });
  }
};

exports.generateExercise = async (req, res) => {
  try {
    const { topic, level = 'intermediate' } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: IDENTITY });
    const prompt = `Como EasyGo AI Tutor, crea un ejercicio de ingles sobre "${topic}" para nivel ${level}. Menciona que hay más en EasyGo Academy.`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, message: result.response.text() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generando ejercicio' });
  }
};
