import React, { useState, useEffect, useRef } from 'react';
import { PersonalityHost } from '../types';
import { PLAYABLE_PERSONALITIES } from '../data';
import { Mic, Send, Volume2, Sparkles, CheckCircle2, RefreshCw, HelpCircle, Bot, AlertTriangle, Play } from 'lucide-react';

interface ConversationPracticeProps {
  onEarnXp: (xp: number) => void;
  userLevel: string;
}

export default function ConversationPractice({ onEarnXp, userLevel }: ConversationPracticeProps) {
  const [activePracticeTab, setActivePracticeTab] = useState<'scenarios' | 'trivia'>('trivia');
  
  // 1. SCENARIOS ROLEPLAY CHAT STATE
  const [selectedScenario, setSelectedScenario] = useState<string>('Restaurant 🍽️');
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string; correct?: boolean; correction?: string; improvement?: string; }[]>([
    { sender: 'ai', text: "Hello! Welcome to our restaurant. Are you ready to order some food, or do you need a few more minutes? 😊" }
  ]);
  const [userTypedInput, setUserTypedInput] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  
  // 2. AI TRIVIA SHOW GAME STATE
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityHost>(PLAYABLE_PERSONALITIES[1]); // santi chill default
  const [triviaStarted, setTriviaStarted] = useState<boolean>(false);
  const [triviaQuestion, setTriviaQuestion] = useState<string>('Welcome! Tap "Empezar Show" below to let me ask your first American trivia question!');
  const [triviaOptions, setTriviaOptions] = useState<string[]>([]);
  const [triviaAnswer, setTriviaAnswer] = useState<string>('');
  const [triviaHostReply, setTriviaHostReply] = useState<string>('¡Hola, amigazo! I am Santi. I am ready to host this legendary Trivia challenge. Ready to learn English and the culture of those US streets? Let\'s go!');
  const [triviaExplanation, setTriviaExplanation] = useState<string>('');
  const [triviaSelectedOption, setTriviaSelectedOption] = useState<string | null>(null);
  const [triviaRoundChecked, setTriviaRoundChecked] = useState<boolean>(false);
  const [triviaFeedback, setTriviaFeedback] = useState<string>('');
  const [triviaScore, setTriviaScore] = useState<number>(0);
  const [triviaRoundCount, setTriviaRoundCount] = useState<number>(0);

  // Micro and Speech State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(false);
  const [speechFeedbackText, setSpeechFeedbackText] = useState<string>('');

  // Audio wave interval
  const [waveHeight, setWaveHeight] = useState<number[]>(Array(10).fill(10));
  const waveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  // Voice recording mock/real wrapper
  const handleMicroToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      if (waveRef.current) clearInterval(waveRef.current);
      
      // Simulate speech transcribed text based on tab context
      const simulatedSpeeches = [
        "I would like to rent a nice apartment please",
        "The correct answer is definitely option B",
        "Can I get a cheeseburger with french fries",
        "I am looking for a primary care doctor"
      ];
      const selectedSpeech = simulatedSpeeches[Math.floor(Math.random() * simulatedSpeeches.length)];
      
      if (activePracticeTab === 'scenarios') {
        setUserTypedInput(selectedSpeech);
      } else {
        setTriviaSelectedOption(null);
        setSpeechFeedbackText(`Dijiste: "${selectedSpeech}"`);
        // If it was a letter or option choice
        if (selectedSpeech.toLowerCase().includes("b") || selectedSpeech.toLowerCase().includes("option b")) {
          setTriviaSelectedOption("B");
        } else if (selectedSpeech.toLowerCase().includes("a") || selectedSpeech.toLowerCase().includes("option a")) {
          setTriviaSelectedOption("A");
        } else if (selectedSpeech.toLowerCase().includes("c") || selectedSpeech.toLowerCase().includes("option c")) {
          setTriviaSelectedOption("C");
        } else if (selectedSpeech.toLowerCase().includes("d") || selectedSpeech.toLowerCase().includes("option d")) {
          setTriviaSelectedOption("D");
        }
      }
    } else {
      setIsRecording(true);
      setSpeechFeedbackText('Escuchando tu pronunciación clara...');
      waveRef.current = setInterval(() => {
        setWaveHeight(Array(10).fill(0).map(() => Math.floor(Math.random() * 40) + 12));
      }, 150);
    }
  };

  const triggerTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove options letter prefix for better flow
      const speechText = text.replace(/A\)|B\)|C\)|D\)/g, "");
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. ACTIONS FOR SCENARIOS CHAT
  const handleSendChatMessage = async () => {
    if (!userTypedInput.trim()) return;
    const userText = userTypedInput;
    setUserTypedInput('');
    
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario,
          userMessage: userText,
          level: userLevel
        })
      });

      const data = await response.json();
      setIsAiTyping(false);

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.partnerReply,
          correct: data.isSentenceCorrect,
          correction: data.grammarSuggestions,
          improvement: data.suggestedImprovement
        }
      ]);
      
      // Earn small XP per line
      onEarnXp(15);
      triggerTTS(data.partnerReply);

    } catch (e) {
      setIsAiTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Awesome phrasing. I understand you perfectly at the ${selectedScenario}. What else would you like to request?`
        }
      ]);
    }
  };

  // 2. ACTIONS FOR AI TRIVIA GAME SHOW
  const handleStartTriviaShow = async () => {
    setTriviaStarted(true);
    setIsAiTyping(true);
    setTriviaRoundCount(1);
    
    try {
      const response = await fetch('/api/ai/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personality: selectedPersonality,
          userResponse: "Hola, let's start the game show!",
          level: userLevel
        })
      });

      const data = await response.json();
      setIsAiTyping(false);
      
      setTriviaQuestion(data.question);
      setTriviaOptions(data.options);
      setTriviaAnswer(data.correctOptionLetter);
      setTriviaHostReply(data.hostReply);
      setTriviaExplanation(data.explanation);
      setTriviaFeedback(data.grammarCorrection || '');
      setTriviaRoundChecked(false);
      setTriviaSelectedOption(null);
      
      triggerTTS(`${data.hostReply}. Question: ${data.question}`);

    } catch (e) {
      setIsAiTyping(false);
    }
  };

  const handleChooseTriviaAnswer = (letter: string) => {
    if (triviaRoundChecked) return;
    setTriviaSelectedOption(letter);
  };

  const handleCheckTriviaAnswer = () => {
    if (!triviaSelectedOption) return;
    setTriviaRoundChecked(true);
    const isCorrect = triviaSelectedOption === triviaAnswer;
    if (isCorrect) {
      setTriviaScore(triviaScore + 1);
      setTriviaHostReply(`¡Increíble! That is CORRECT! ${selectedPersonality.emoji}`);
      onEarnXp(100);
    } else {
      setTriviaHostReply(`¡Ah, no te preocupes, mi gente! The correct target was option ${triviaAnswer}. Keep trying!`);
    }
    
    triggerTTS(`${isCorrect ? 'Correct!' : 'Incorrect.'} ${triviaExplanation}`);
  };

  const handleNextTriviaRound = async () => {
    setIsAiTyping(true);
    setTriviaRoundCount(prev => prev + 1);
    
    try {
      const response = await fetch('/api/ai/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personality: selectedPersonality,
          userResponse: `Next question please. My previous score was ${triviaScore}`,
          level: userLevel
        })
      });

      const data = await response.json();
      setIsAiTyping(false);
      
      setTriviaQuestion(data.question);
      setTriviaOptions(data.options);
      setTriviaAnswer(data.correctOptionLetter);
      setTriviaHostReply(data.hostReply);
      setTriviaExplanation(data.explanation);
      setTriviaFeedback(data.grammarCorrection || '');
      setTriviaRoundChecked(false);
      setTriviaSelectedOption(null);
      
      triggerTTS(`${data.hostReply}. Next question: ${data.question}`);

    } catch (e) {
      setIsAiTyping(false);
    }
  };

  const scenarios = [
    "Restaurant 🍽️",
    "Supermarket 🛍️",
    "Job Interview 💼",
    "Doctor Appointment 🏥",
    "School Parent Meeting 🏫",
    "Emergency Services 🚨"
  ];

  return (
    <div id="practice-container" className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <span className="font-academy text-brand-orange text-3xl font-semibold">Pierde el Miedo</span>
        <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">Práctica Oral Interactiva</h1>
        <p className="text-slate-400 text-sm">Elige entre entablar una conversación realista o jugar con un Host de IA carismático.</p>
      </div>

      {/* Tabs selectors */}
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
        <button
          onClick={() => setActivePracticeTab('trivia')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 pointer ${
            activePracticeTab === 'trivia'
              ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 shrink-0" /> AI Trivia Show 🌟
        </button>
        <button
          onClick={() => setActivePracticeTab('scenarios')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 pointer ${
            activePracticeTab === 'scenarios'
              ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" /> Diálogo Situacional 💬
        </button>
      </div>

      {activePracticeTab === 'scenarios' ? (
        /* SCENARIO TAB CONTENTS */
        <div id="scenarios-practice-box" className="glass rounded-3xl border border-white/10 overflow-hidden flex flex-col min-h-[500px]">
          {/* Top Scenario Selector */}
          <div className="bg-white/5 border-b border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Escenario activo</span>
              <h3 className="text-sm font-bold text-white shrink-0">{selectedScenario}</h3>
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
              {scenarios.map((scen) => (
                <button
                  key={scen}
                  onClick={() => {
                    setSelectedScenario(scen);
                    setChatMessages([{ sender: 'ai', text: `Hi there! We are practicing roleplay inside a ${scen}. Talk to me like a customer or professional. Tell me, how can I serve you today?` }]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 pointer ${
                    selectedScenario === scen
                      ? 'bg-brand-orange text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {scen.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Chat message viewport body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[300px] scrollbar-none">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                {/* Message speech bubble wrapper */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-brand-orange to-brand-purple text-white rounded-br-none'
                      : 'bg-white/5 border border-white/5 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Grammar correction overlay displayed for AI feedback lines only */}
                {msg.sender === 'ai' && (msg.correction || msg.improvement) && (
                  <div className="mt-2.5 w-full bg-brand-orange/10 border border-brand-orange/30 rounded-2xl p-3.5 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-1 text-brand-orange font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0" />
                      Grammarly AI Feedback:
                    </div>
                    {msg.correction && (
                      <p className="text-xs text-slate-300">
                        <strong className="text-brand-orange">Corrección:</strong> {msg.correction}
                      </p>
                    )}
                    {msg.improvement && (
                      <p className="text-xs text-emerald-400 font-medium">
                        💡 Recomiendo decir: <span className="font-italic">"{msg.improvement}"</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2 italic animate-pulse-slow">
                <Bot className="w-4 h-4 text-brand-orange" /> Compañero escribiendo respuesta analizada...
              </div>
            )}
          </div>

          {/* Integrated mic and keyboard form footer */}
          <div className="bg-white/5 border-t border-white/5 p-4 flex items-center gap-3">
            {/* Pronunciation speech trigger */}
            <button
              onClick={handleMicroToggle}
              className={`p-3.5 rounded-full transition-all shrink-0 pointer ${
                isRecording
                  ? 'bg-brand-orange text-white animate-pulse-slow shadow-lg shadow-brand-orange/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={userTypedInput}
              onChange={(e) => setUserTypedInput(e.target.value)}
              placeholder="Escribe en inglés o presiona el micro para pronunciar..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              className="flex-1 bg-white/5 border border-white/5 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-brand-orange transition-all"
            />

            <button
              id="scenarios-send-btn"
              disabled={!userTypedInput.trim()}
              onClick={handleSendChatMessage}
              className={`p-3.5 rounded-full transition-all shrink-0 pointer ${
                userTypedInput.trim()
                  ? 'bg-brand-violet text-white hover:opacity-90'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* TRIVIA TAB CONTENTS */
        <div id="trivia-practice-box" className="space-y-4">
          {!triviaStarted ? (
            /* Personality choices grid */
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-6">
              <div className="text-center space-y-1">
                <Bot className="w-10 h-10 text-brand-orange mx-auto mb-2 animate-float" />
                <h3 className="text-lg font-bold text-white font-display">Elige la personalidad de tu Host de IA</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Cada tutor hablará con un tono, dialecto y estilo diferente para desafiar tu inglés americano de forma entretenida.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {PLAYABLE_PERSONALITIES.map((pers) => (
                  <button
                    key={pers.id}
                    onClick={() => setSelectedPersonality(pers)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 pointer ${
                      selectedPersonality.id === pers.id
                        ? 'border-brand-orange bg-gradient-to-b from-brand-orange/15 to-transparent'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-3xl mb-2">{pers.emoji}</div>
                    <h4 className="text-xs font-bold text-white">{pers.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{pers.roleDescription}</p>
                  </button>
                ))}
              </div>

              <button
                id="start-trivia-show-btn"
                onClick={handleStartTriviaShow}
                className="w-full py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-brand-orange to-brand-purple text-white pointer shadow-xl shadow-brand-orange/15 hover:opacity-95 text-center active:scale-95 transition-all"
              >
                ¡Empezar Show con {selectedPersonality.name.split(",")[0]}! 🎉
              </button>
            </div>
          ) : (
            /* TRIVIA QUESTIONS VIEWPLAY */
            <div className="glass rounded-3xl border border-white/10 p-6 space-y-6 relative overflow-hidden">
              {/* Background ambient light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl"></div>

              {/* Stats Bar */}
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="flex gap-1.5 items-center">
                  <span className="text-lg">{selectedPersonality.emoji}</span>
                  <div className="text-left font-display">
                    <span className="text-[10px] text-slate-400 block pointer" onClick={() => setTriviaStarted(false)}>← Cambiar Tutor</span>
                    <span className="text-xs font-bold text-white block">{selectedPersonality.name.split(",")[0]}</span>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-mono font-bold">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block font-sans">Ronda</span>
                    <span className="text-brand-orange text-sm mt-0.5 block">{triviaRoundCount}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block font-sans">Puntaje</span>
                    <span className="text-brand-violet text-sm mt-0.5 block">{triviaScore}</span>
                  </div>
                </div>
              </div>

              {/* In-character response and active tutor balloon */}
              <div className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 relative">
                <div className="text-4xl shrink-0 mt-0.5">{selectedPersonality.emoji}</div>
                <div className="space-y-1.5">
                  <p className="text-xs leading-relaxed text-slate-200 font-medium">
                    {triviaHostReply}
                  </p>
                  
                  {/* Feedback or corrections warning block */}
                  {triviaFeedback && (
                    <span className="text-[11px] text-brand-orange block font-semibold">
                      💡 Tip de escritura: {triviaFeedback}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => triggerTTS(triviaHostReply)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white pointer transition-colors"
                >
                  <Volume2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Actual question context display */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-brand-orange">Pregunta de Trivia</span>
                  <h3 className="text-md font-bold text-white mt-1 leading-snug">{triviaQuestion}</h3>
                </div>

                {/* Multiple choices option select list */}
                {triviaOptions && triviaOptions.length > 0 && (
                  <div className="grid gap-2.5">
                    {triviaOptions.map((opt, i) => {
                      const letter = opt.substring(0, 1);
                      const isSelected = triviaSelectedOption === letter;
                      
                      let style = 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10';
                      if (isSelected) {
                        style = 'border-brand-orange bg-brand-orange/20 text-white font-semibold';
                      }

                      if (triviaRoundChecked) {
                        const isCorrectAnswer = letter === triviaAnswer;
                        if (isCorrectAnswer) {
                          style = 'border-brand-success bg-brand-success/20 text-brand-success font-bold';
                        } else if (isSelected) {
                          style = 'border-brand-error bg-brand-error/20 text-brand-error';
                        } else {
                          style = 'opacity-35 border-white/5 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={triviaRoundChecked}
                          onClick={() => handleChooseTriviaAnswer(letter)}
                          className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm border transition-all duration-200 pointer ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* User answer submission microphone simulator wave controls */}
              {isRecording && (
                <div className="flex flex-col items-center justify-center p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl animate-fade-in space-y-3">
                  <div className="flex justify-center items-end gap-1.5 h-10 w-48">
                    {waveHeight.map((h, i) => (
                      <span key={i} className="bg-brand-orange w-1.5 rounded-full transition-all" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Grabando... Di el texto o letra de opción en inglés</span>
                </div>
              )}

              {/* Complete show round check results display */}
              {!triviaRoundChecked ? (
                <div className="flex items-center gap-3">
                  {voiceSupported && (
                    <button
                      onClick={handleMicroToggle}
                      className={`p-4 rounded-2xl transition-all pointer ${
                        isRecording
                          ? 'bg-brand-orange text-white animate-pulse-slow'
                          : 'bg-slate-850 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    disabled={!triviaSelectedOption || isAiTyping}
                    onClick={handleCheckTriviaAnswer}
                    className={`flex-1 py-4 rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-all ${
                      triviaSelectedOption && !isAiTyping
                        ? 'bg-brand-orange text-white pointer hover:bg-brand-coral'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isAiTyping ? 'Consultando a la IA...' : 'Verificar Opción Seleccionada 🚀'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5">
                    <span className="text-[10px] uppercase font-extrabold text-brand-orange tracking-widest font-mono">Explicación del Host:</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {triviaExplanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNextTriviaRound}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 pointer flex items-center justify-center gap-1.5 animate-bounce-slow"
                  >
                    Próxima Pregunta de Trivia <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
