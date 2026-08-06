import { useState, useRef, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { ChatHistory } from "../components/learning/ChatHistory";
import { useChatStore } from "../store/useChatStore";

const TTS_API_KEY = import.meta.env.VITE_GOOGLE_TTS_KEY;

export const ChatPage = () => {
  const {
    messages,
    sendMessage,
    isLoading,
    practicePronunciation,
    generateExercise,
    newConversation,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [listening, setListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");
  const hasSentRef = useRef(false);
  const inputRef = useRef(null);

  // ============ RENDERIZAR MARKDOWN (SOLO PARA PANTALLA) ============
  const renderMessage = (text) => {
    if (!text) return "";
    let html = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-bold text-gray-900">$1</strong>',
    );
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(
      /`(.*?)`/g,
      '<code class="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-sm font-mono">$1</code>',
    );
    html = html.replace(/\n/g, "<br/>");
    return html;
  };

  // ============ INICIALIZAR RECONOCIMIENTO NATIVO ============
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = "es-ES";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal)
            finalTranscript += event.results[i][0].transcript;
        }
        const fullTranscript =
          finalTranscript ||
          event.results[event.results.length - 1][0].transcript;
        transcriptRef.current = fullTranscript;
        setInput(fullTranscript);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (fullTranscript.trim()) {
          silenceTimerRef.current = setTimeout(() => {
            if (transcriptRef.current.trim() && !hasSentRef.current) {
              hasSentRef.current = true;
              sendMessage(transcriptRef.current.trim());
              transcriptRef.current = "";
              setInput("");
              forceStopListening();
            }
          }, 2000);
        }
      };

      recognition.onend = () => {
        setListening(false);
        if (transcriptRef.current.trim() && !hasSentRef.current) {
          hasSentRef.current = true;
          sendMessage(transcriptRef.current.trim());
          transcriptRef.current = "";
          setInput("");
        }
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      recognition.onerror = () => {
        forceStopListening();
      };

      recognitionRef.current = recognition;
    }
    return () => forceStopListening();
  }, []);

  const forceStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setListening(false);
    hasSentRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  };

  // ============ HABLAR (VOZ INGLESA NATIVA - SOLO TEXTO LIMPIO) ============
  const speakText = useCallback(async (text) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    synthRef.current.cancel();

    // ========== LIMPIEZA PROFUNDA: SOLO LETRAS, NÚMEROS Y PUNTUACIÓN ==========
    let cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2764}\u{2728}\u{1F440}\u{1F4A1}\u{1F389}\u{1F525}\u{1F44D}\u{1F44F}\u{1F60A}\u{1F4AA}\u{1F3C6}\u{2705}\u{2757}\u{2753}\u{2754}\u{2755}\u{2756}\u{2795}\u{2796}\u{2797}\u{2934}\u{2935}\u{2B05}\u{2B06}\u{2B07}\u{2B1B}\u{2B1C}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}\u{25FC}\u{25FD}\u{25FE}\u{2611}\u{2614}\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}\u{2623}\u{2626}\u{2638}\u{2639}\u{263A}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}\u{269C}\u{26A0}\u{26A1}\u{26A7}\u{26AA}\u{26AB}\u{26B0}\u{26B1}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26C8}\u{26CE}\u{26CF}\u{26D1}\u{26D3}\u{26D4}\u{26E9}\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2708}\u{2709}\u{270A}-\u{270F}]/gu,
        "",
      )
      .replace(
        /[🎤🔊🔇📋➕⚡🗣️📝💬📚🎯❓✅❌🌟🚀💡🎓👋🏠👥📊📈🔔📱🖥️💻🎵🎶🎸🎹🎺🎻🥁📅📌📍💰💳🛒🎁🎉🎊👍👎👏🙌💪🤝🙏💯]/g,
        "",
      )
      .replace(/[→←↑↓↔↕↖↗↘↙⇒⇐⇑⇓➡️⬅️⬆️⬇️]/g, "")
      .replace(/["""''']/g, '"')
      .replace(/['']/g, "'")
      .replace(/^[-*•●◦○▪▫■□]\s/gm, "")
      .replace(/[-•●]/g, ",")
      .replace(/---+/g, "")
      .replace(/===+/g, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^>\s/gm, "")
      .replace(/https?:\/\/[^\s]+/g, "")
      .replace(/www\.[^\s]+/g, "")
      .replace(/@\w+/g, "")
      .replace(/#\w+/g, "")
      .replace(/\.{3,}/g, ".")
      .replace(/,{2,}/g, ",")
      .replace(/!{2,}/g, "!")
      .replace(/\?{2,}/g, "?")
      .replace(/\n+/g, ". ")
      .replace(/\s+/g, " ")
      .replace(/\s\./g, ".")
      .replace(/\s,/g, ",")
      .replace(/\s!/g, "!")
      .replace(/\s\?/g, "?")
      .replace(/\.(\S)/g, ". $1")
      .replace(/\,(\S)/g, ", $1")
      .replace(/\!(\S)/g, "! $1")
      .replace(/\?(\S)/g, "? $1")
      .trim();

    if (!cleanText || cleanText.length < 2) return;

    // ========== USAR GOOGLE CLOUD TTS (VOZ NATIVA EN INGLÉS SIEMPRE) ==========
    if (TTS_API_KEY) {
      try {
        const response = await fetch(
          `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input: { text: cleanText },
              voice: {
                languageCode: "es-US", // Español latino
                name: "es-US-Neural2-B", // Voz femenina neural latina
                ssmlGender: "FEMALE",
              },
              audioConfig: {
                audioEncoding: "MP3",
                speakingRate: 1.0,
                pitch: 0.0,
              },
            }),
          },
        );

        const data = await response.json();

        if (data.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          audioRef.current = audio;
          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            audioRef.current = null;
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            audioRef.current = null;
          };
          await audio.play();
          return;
        }
      } catch (error) {
        console.log("TTS API falló, usando voz nativa:", error.message);
      }
    }

    // ========== FALLBACK: VOZ NATIVA DEL NAVEGADOR (INGLÉS) ==========
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = synthRef.current.getVoices();

    const voice =
      voices.find(
        (v) => v.name.includes("Google") && v.lang.startsWith("es"),
      ) ||
      voices.find((v) => v.lang.startsWith("es")) ||
      voices[0];

    if (voice) utterance.voice = voice;
    utterance.lang = "es-US"; // Español latino (lee inglés mejor que es-ES)
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  // ============ DETENER VOZ AL ACTIVAR MICRÓFONO ============
  useEffect(() => {
    if (listening) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [listening]);

  // ============ ESCUCHAR RESPUESTAS DE LA IA ============
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === "ai" && autoSpeak && !listening) {
      setTimeout(() => speakText(lastMessage.content), 300);
    }
  }, [messages, autoSpeak, listening]);

  // ============ LIMPIEZA TOTAL ============
  useEffect(() => {
    return () => {
      forceStopListening();
      synthRef.current.cancel();
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // ============ TOGGLE MICRÓFONO ============
  const toggleListening = () => {
    if (listening) {
      forceStopListening();
    } else {
      if (isSpeaking) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      hasSentRef.current = false;
      transcriptRef.current = "";
      setInput("");
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (e) {}
    }
  };

  // ============ SCROLL ============
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ============ ENVIAR MANUAL ============
  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    forceStopListening();
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
    sendMessage(input.trim());
    setInput("");
    transcriptRef.current = "";
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============ SUGERENCIAS INICIALES ============
  const suggestions = [
    {
      icon: "🗣️",
      text: "Quiero practicar pronunciación",
      action: () => {
        const w = prompt("¿Qué palabra?");
        if (w) practicePronunciation(w);
      },
    },
    {
      icon: "📝",
      text: "Dame un ejercicio de gramática",
      action: () => {
        const t = prompt("¿Sobre qué tema?");
        if (t) generateExercise(t);
      },
    },
    {
      icon: "💬",
      text: "Practiquemos una conversación",
      action: () => sendMessage("Quiero practicar una conversación en inglés"),
    },
    {
      icon: "📚",
      text: "Explícame una regla gramatical",
      action: () => sendMessage("Explícame una regla gramatical importante"),
    },
    {
      icon: "🎯",
      text: "¿Cómo digo esto en inglés?",
      action: () => {
        inputRef.current?.focus();
        setInput("¿Cómo se dice: ");
      },
    },
    {
      icon: "❓",
      text: "Tengo una duda de vocabulario",
      action: () => {
        inputRef.current?.focus();
      },
    },
  ];

  const messageCount = messages.length;
  const browserSupportsSpeech = !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  // ============ RENDER ============
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex gap-4 lg:gap-6">
        {showHistory && (
          <div className="w-full lg:w-80 flex-shrink-0">
            <ChatHistory onClose={() => setShowHistory(false)} />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-3xl shadow-sm flex-1 flex flex-col overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${listening ? "bg-red-500 animate-pulse" : isSpeaking ? "bg-blue-500" : "bg-green-500"}`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    EasyGo AI Tutor
                  </h3>
                  <p className="text-xs text-gray-500">
                    {listening
                      ? "🎤 Escuchando..."
                      : isSpeaking
                        ? "🔊 Respondiendo..."
                        : "En línea · Voz inglesa nativa"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${autoSpeak ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}`}
                  title="Voz"
                >
                  {autoSpeak ? "🔊" : "🔇"}
                </button>
                <button
                  onClick={() => newConversation()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                  title="Nuevo chat"
                >
                  ➕
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${showHistory ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  title="Historial"
                >
                  📋
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
              {messages.length <= 1 && showSuggestions && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">👋</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    ¡Hola! Soy EasyGo AI Tutor
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Estoy aquí para ayudarte con tu inglés. ¿En qué puedo
                    ayudarte?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={s.action}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span className="line-clamp-1">{s.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1;

                return (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"} ${isLast ? "animate-fade-in" : ""}`}
                  >
                    {msg.type === "ai" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                    )}

                    <div
                      className={`group relative max-w-[80%] sm:max-w-[70%] ${msg.type === "user" ? "order-first" : ""}`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.type === "user"
                            ? "bg-primary text-white rounded-br-lg"
                            : "bg-white text-gray-800 rounded-bl-lg shadow-sm border border-gray-100"
                        }`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderMessage(msg.content),
                          }}
                          className="whitespace-pre-wrap"
                        />

                        {msg.type === "ai" && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="mt-2 text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                          >
                            <span>🔊</span> Escuchar
                          </button>
                        )}
                      </div>
                      <p
                        className={`text-[10px] mt-1 px-1 ${msg.type === "user" ? "text-right text-gray-400" : "text-gray-400"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {msg.type === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-gray-500">
                          Tú
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl rounded-bl-lg shadow-sm border border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              {listening && (
                <div className="flex items-center gap-2 mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  <span className="flex-1 truncate">
                    {input || "Escuchando..."}
                  </span>
                  <button
                    onClick={forceStopListening}
                    className="text-red-400 hover:text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2">
                {browserSupportsSpeech && (
                  <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      listening
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  </button>
                )}

                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      listening
                        ? "Escuchando..."
                        : "Escribe tu mensaje en inglés o español..."
                    }
                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-sm focus:border-primary/30 focus:bg-white focus:shadow-lg focus:shadow-primary/5 transition-all outline-none"
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    input.trim()
                      ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
