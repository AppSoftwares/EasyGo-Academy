import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge } from '../ui';
import { Mic, Send, Sparkles, Volume2, RefreshCw } from 'lucide-react';

interface ConversationPracticeProps {
  scenario?: {
    id: string;
    title: string;
    context: string;
  };
  onComplete?: (score: number) => void;
}

export const ConversationPractice: React.FC<ConversationPracticeProps> = ({ scenario, onComplete }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; feedback?: any }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "¡Excelente intento! Try saying it with more confidence.",
        "Good approach. Remember to link 'what' and 'is' into 'what's'.",
        "Your rhythm is getting better! Let's try another phrase.",
      ];
      const aiMessage = {
        role: 'ai' as const,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        feedback: { isCorrect: Math.random() > 0.5, corrections: [] },
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Use Web Speech API for voice input
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4 px-2 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-[#FF5E36] animate-pulse" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">¿Cómo puedo ayudarte hoy?</h3>
            <p className="text-white/40 text-sm max-w-[200px] mx-auto">Practica hablando sobre {scenario?.title || 'cualquier tema'}</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div
              className={`max-w-[85%] p-4 rounded-[1.5rem] ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] text-white rounded-br-md shadow-[0_10px_25px_rgba(255,94,54,0.2)]'
                  : 'bg-white/5 border border-white/10 text-white rounded-bl-md backdrop-blur-sm'
              }`}
            >
              <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
              {msg.feedback && !msg.feedback.isCorrect && (
                <div className="mt-3 p-3 bg-white/10 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-[#FF5E36] uppercase tracking-widest mb-1">Tip Gramatical</p>
                  <p className="text-xs text-white/80">Intenta unir las palabras para que suene más fluido.</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#FF5E36] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#FF5E36] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#FF5E36] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Onda Activa y Botón de Micro (User Requirements) */}
      <div className="mt-auto py-6 flex flex-col items-center gap-6">
        {isRecording && (
          <div className="flex items-end gap-1.5 h-12">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-[#5D26C1] to-[#FF5E36] rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100 + 20}%`,
                  animationDuration: `${0.5 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe o presiona el micro..."
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#FF5E36] focus:border-transparent outline-none transition-all backdrop-blur-sm"
            />
          </div>
          <button
            onMouseDown={startVoiceRecording}
            onMouseUp={() => setIsRecording(false)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-[#FF5E36] shadow-[0_0_30px_rgba(255,94,54,0.5)] scale-110'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isRecording ? <Sparkles size={24} className="animate-spin-slow" /> : <Mic size={24} />}
          </button>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-14 h-14 rounded-full bg-[#5D26C1] text-white flex items-center justify-center disabled:opacity-20 transition-all active:scale-95"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface PronunciationFeedbackProps {
  targetWord: string;
  phonetic: string;
  userAttempt?: string;
  onRetry?: () => void;
}

export const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
  targetWord,
  phonetic,
  userAttempt,
  onRetry,
}) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (userAttempt) {
      // Simulate pronunciation scoring
      const similarity = userAttempt.toLowerCase() === targetWord.toLowerCase() ? 95 :
                         userAttempt.toLowerCase().includes(targetWord.toLowerCase()) ? 75 : 50;
      setScore(similarity);
      setFeedback(
        similarity >= 90 ? '¡Excelente! Tu pronunciación es casi perfecta.' :
        similarity >= 70 ? '¡Muy bien! Un poco más de práctica y será perfecto.' :
        'Intenta abrir un poco más la boca para el sonido de la vocal.'
      );
    }
  }, [userAttempt, targetWord]);

  return (
    <div className="text-center py-6">
      <div className="mb-8">
        <h3 className="text-4xl font-extrabold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {targetWord}
        </h3>
        <p className="text-[#FF5E36] text-xl font-medium tracking-widest uppercase">/{phonetic}/</p>
      </div>

      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Decorative Background for the circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5E36]/20 to-[#5D26C1]/20 rounded-full blur-2xl animate-pulse" />

        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <circle
            cx="96" cy="96" r="88"
            fill="none"
            stroke={score >= 90 ? '#00E676' : score >= 70 ? '#FFD700' : '#FF5E36'}
            strokeWidth="12"
            strokeDasharray={`${(score / 100) * 553} 553`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="text-4xl font-black text-white">{score || 0}%</span>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Precisión</span>
        </div>
      </div>

      {score > 0 ? (
        <div className="animate-slide-up">
          <Card className="bg-white/5 border border-white/10 mb-6">
            <p className="text-white text-lg font-medium mb-1">{feedback}</p>
            {score < 90 && (
              <p className="text-white/40 text-sm">💡 Pronunciaste "{userAttempt}"</p>
            )}
          </Card>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onRetry} className="flex-1 border border-white/10">
              <RefreshCw size={18} className="mr-2" />
              REPETIR
            </Button>
            <Button className="flex-1 shadow-[0_10px_30px_rgba(255,94,54,0.3)]">
              <Volume2 size={18} className="mr-2" />
              ESCUCHAR
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p className="text-white/60">Mantén presionado para hablar</p>
          <button
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => { setIsRecording(false); /* trigger logic */ }}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-[#FF5E36] shadow-[0_0_50px_rgba(255,94,54,0.4)] scale-110'
                : 'bg-white/5 border-2 border-white/10 text-white'
            }`}
          >
            <Mic size={40} className={isRecording ? 'animate-pulse' : ''} />
          </button>
        </div>
      )}
    </div>
  );
};

interface GrammarCheckerProps {
  text: string;
  onCorrected?: (corrected: string, corrections: any[]) => void;
}

export const GrammarChecker: React.FC<GrammarCheckerProps> = ({ text, onCorrected }) => {
  const [corrections, setCorrections] = useState<any[]>([]);

  useEffect(() => {
    if (text) {
      // Simulate grammar checking
      const mockCorrections = [
        { original: 'I am go', corrected: 'I am going', explanation: 'Use gerund form after "am"' },
        { original: 'the book of John', corrected: "John's book", explanation: "Possessive form for ownership" },
      ];
      setCorrections(mockCorrections.filter(() => Math.random() > 0.5));
    }
  }, [text]);

  return (
    <Card>
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Sparkles className="text-purple-500" size={20} />
        Revisión de Gramática
      </h4>
      {corrections.length > 0 ? (
        <div className="space-y-3">
          {corrections.map((correction, index) => (
            <div key={index} className="p-3 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-gray-500 line-through">{correction.original}</p>
              <p className="text-sm font-medium text-green-600">{correction.corrected}</p>
              <p className="text-xs text-gray-500 mt-1">💡 {correction.explanation}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Tu texto se ve bien. Sigue así.</p>
      )}
    </Card>
  );
};

export default {
  ConversationPractice,
  PronunciationFeedback,
  GrammarChecker,
};