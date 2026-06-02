import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createRequire } from 'module';

dotenv.config();

const app = express();
app.use(express.json());

// Mount payments routes (Stripe example)
const require = createRequire(import.meta.url);
try {
  const stripeRouter = require('./easygo-academy/server/payments/stripe_example.js');
  app.use('/payments', stripeRouter);
} catch (e) {
  console.warn('Stripe routes not mounted (file missing or require failed):', e?.message || e);
}

const PORT = 3000;

// Initialize Gemini SDK with named parameter and safety User-Agent
const geminiKey = process.env.GEMINI_API_KEY;
const hasApiKey = !!geminiKey && geminiKey !== "MY_GEMINI_API_KEY";

const ai = new GoogleGenAI({
  apiKey: hasApiKey ? geminiKey : "MOCK_KEY_FOR_DEV_BUILD",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey,
    time: new Date().toISOString()
  });
});

/**
 * API for AI Trivia host
 */
app.post("/api/ai/trivia", async (req, res) => {
  const { personality, history, userResponse, level } = req.body;

  if (!hasApiKey) {
    // Return high quality mockup response if key is missing
    return res.json({
      hostReply: `¡Hola, amigazo! I'm your chosen host ${personality?.name || 'Coach'}. Since we are in Offline/Preview mode, I'll guide you through this pre-installed preview round!`,
      question: "Which of the following documents is normally required when applying for a lease in the US?",
      options: [
        "A) Certified high school diploma",
        "B) Proof of income (paystubs) and credit check",
        "C) US Tourist visa approval letter",
        "D) Proof of membership to a US local library"
      ],
      correctOptionLetter: "B",
      explanation: "Normally, landlords require proof of stable income (like paystubs or utility bills) and a credit score check to verify your qualifications as a tenant.",
      grammarCorrection: userResponse ? "Your typing was perfectly clear!" : ""
    });
  }

  try {
    const levelStr = level || 'Principiante';
    const characterPrompt = `You are ${personality?.name || 'An English Coach'} with the personality of: ${personality?.roleDescription || 'a kind but strict teacher'}.
You are hosting a fun trivia game for a Spanish speaker living in the US who is learning practical English.
The user is at level: ${levelStr}.
Your job is to provide active, fun feedback to their previous response: "${userResponse || 'Start the game!'}" in your character's voice.
Provide encouragement, correct any grammar or spelling mistakes they made in their response in a helpful way, and then present the next practical English or American culture trivia question.

Give the options clearly as A, B, C, D. Ensure the question is directly useful for daily survival/success in the USA (like supermarket shopping, renting an apartment, school interactions, tax systems, or pronunciation rules).
Translate key vocab or use gentle Spanish expressions only where it adds in-character charm or comforting support. Keep the response concise and strictly structured as JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: 'user', parts: [{ text: userResponse || "Start the game!" }] }
      ],
      config: {
        systemInstruction: characterPrompt + "\nYou must respond with a JSON matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hostReply: {
              type: Type.STRING,
              description: "In-character witty reply or feedback about the user's previous answer or welcome."
            },
            question: {
              type: Type.STRING,
              description: "The next trivia question in English."
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four options starting with A), B), C), D)."
            },
            correctOptionLetter: {
              type: Type.STRING,
              description: "The correct letter: A, B, C or D."
            },
            explanation: {
              type: Type.STRING,
              description: "Concise, friendly explanation of why that's the correct option (in simple English mixed with a bit of Spanish explanation if needed)."
            },
            grammarCorrection: {
              type: Type.STRING,
              description: "Constructive feedback on any typos, grammatical errors, or poor phrasing in the user's input. Leave empty if user's input was clean or if it is the first turn."
            }
          },
          required: ["hostReply", "question", "options", "correctOptionLetter", "explanation"]
        }
      }
    });

    const bodyText = response.text || "{}";
    const data = JSON.parse(bodyText.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Trivia error:", error);
    res.status(500).json({
      error: "Ocurrió un error consultando a la IA",
      details: error.message,
      hostReply: "¡Oops! Al parecer mi frecuencia se ha desconectado momentáneamente. Sigamos con esta de práctica.",
      question: "Choose the correct phrase to order food politely:",
      options: [
        "A) Give me a burger now.",
        "B) Make a taco for me.",
        "C) I would like a cheeseburger, please.",
        "D) Fry me some potatoes."
      ],
      correctOptionLetter: "C",
      explanation: "Using 'I would like..., please' is the most polite and natural way to order food or drink in any American restaurant.",
      grammarCorrection: ""
    });
  }
});

/**
 * API for AI Scenario Conversation partner with real-time feedback
 */
app.post("/api/ai/conversation", async (req, res) => {
  const { scenario, userMessage, level } = req.body;

  if (!hasApiKey) {
    return res.json({
      partnerReply: `Hi there! I am your simulation partner at the ${scenario || 'Store'}. Since we are offline, let me say: "Welcome, how can I help you today?"`,
      isSentenceCorrect: true,
      grammarSuggestions: "No grammatical errors found in this offline test mode.",
      suggestedImprovement: userMessage ? `Try saying: "I am looking for some help with..." if you want to sound advanced.` : "I would like to order a warm cup of coffee, please."
    });
  }

  try {
    const levelStr = level || 'Principiante';
    const instructions = `You are a real-life conversation partner in the USA.
The user is a native Spanish speaker trying to practice English at a ${scenario || 'General Store'}.
They are at English proficiency level: ${levelStr}.
Your dialogue partner person should be appropriate to the target scene (e.g., if restaurant, be the waiter; if doctor appointment, be the receptionist or nurse).
Analyze the user's latest statement: "${userMessage || 'Hello'}".
Provide:
1. An in-character, natural reply (keep it accessible to their level).
2. Assessment whether their sentence was grammatically correct.
3. Constructive spelling/grammar correction suggestions explaining standard American usage.
4. An alternative suggestion to sound more fluent or natural.

Strictly respond with JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: 'user', parts: [{ text: userMessage || "Hello!" }] }
      ],
      config: {
        systemInstruction: instructions,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partnerReply: { type: Type.STRING, description: "Your next role-play line in English." },
            isSentenceCorrect: { type: Type.BOOLEAN, description: "Whether userMessage is correct English" },
            grammarSuggestions: { type: Type.STRING, description: "Brief friendly explanation in Spanish of any grammatical error or correction. Leave empty if correct." },
            suggestedImprovement: { type: Type.STRING, description: "A better or more natural way to phrase their input in English." }
          },
          required: ["partnerReply", "isSentenceCorrect"]
        }
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Conversation error:", error);
    res.status(500).json({
      error: "Error en la conversación de IA",
      details: error.message,
      partnerReply: "Awesome! Let's continue practicing speaking.",
      isSentenceCorrect: true,
      grammarSuggestions: "",
      suggestedImprovement: "Try saying: 'I would like some water, please' for high politeness."
    });
  }
});

// Configure Vite or Static delivery helper
async function initializeApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving Production Static Assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EasyGo Academy server running on port ${PORT}`);
  });
}

initializeApp().catch((e) => {
  console.error("Failed to start EasyGo server:", e);
});
