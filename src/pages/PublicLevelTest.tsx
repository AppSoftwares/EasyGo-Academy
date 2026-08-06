// src/pages/PublicLevelTest.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import logo from "../assets/images/logo.png";

// Estilos para animaciones mejoradas
const animationStyles = `
  @keyframes slideDownIn {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideUpIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%, 100% { filter: drop-shadow(0 0 15px rgba(91, 46, 204, 0.3)); }
    50% { filter: drop-shadow(0 0 25px rgba(227, 80, 74, 0.5)); }
  }
  .animate-slide-down-in {
    animation: slideDownIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .animate-slide-up-in {
    animation: slideUpIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .animate-glow-pulse {
    animation: glowPulse 2s ease-in-out infinite;
  }
`;

export const PublicLevelTest = () => {
  const [step, setStep] = useState("form");
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fadeIn, setFadeIn] = useState(true);

  const changeQuestion = (newIndex) => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentQuestion(newIndex);
      setFadeIn(true);
    }, 200);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/questions/level-test");
        if (res.data.success && res.data.questions.length > 0) {
          setQuestions(res.data.questions);
        } else {
          setError("No hay preguntas disponibles");
        }
      } catch (error) {
        console.error("Error loading questions:", error);
        setError("Error al cargar las preguntas");
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (userData.name && userData.email && userData.phone) {
      setStep("test");
    }
  };

  const handleAnswer = (answer) => {
    const currentQ = questions[currentQuestion];
    setAnswers({ ...answers, [currentQ.id]: answer });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const correctAnswer = q.correctAnswer;
      console.log(userAnswer , correctAnswer,"AAAAAA")
      if (userAnswer && userAnswer === correctAnswer) {
        correct++;
      }
    });
    console.log("aaaaaaa")
    return (correct / questions.length) * 100;
  };

  const calculateLevel = (score) => {
    if (score < 40) return "A1";
    if (score < 60) return "A2";
    if (score < 75) return "B1";
    if (score < 85) return "B2";
    return "C1";
  };

  const submitTest = async () => {
    setSubmitting(true);
    const score = calculateScore();
    const level = calculateLevel(score);
    const testResult = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer,
    }));

    try {
      await api.post("/leads/level-test", {
        ...userData,
        testResult,
        recommendedLevel: level,
        testScore: score,
        source: "level_test",
      });
      setStep("success");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert(
        "Hubo un error al guardar tus resultados. Por favor intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    const currentQ = questions[currentQuestion];
    if (!answers[currentQ.id]) {
      alert("Por favor selecciona una respuesta antes de continuar");
      return;
    }
    if (currentQuestion < questions.length - 1) {
      changeQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      changeQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress =
    questions.length > 0
      ? (Object.keys(answers).length / questions.length) * 100
      : 0;
  const answeredCount = Object.keys(answers).length;

  // PANTALLA DE CARGA
  if (loading) {
    return (
      <>
        <style>{animationStyles}</style>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
          <div className="text-center">
            <img
              src={logo}
              alt="EasyGo Academy"
              className="h-20 mx-auto mb-6 animate-slide-down-in"
            />
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-600 font-medium animate-slide-up-in">
              Preparando tu test de nivelación...
            </p>
          </div>
        </div>
      </>
    );
  }

  // PANTALLA DE ERROR
  if (error) {
    return (
      <>
        <style>{animationStyles}</style>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
          <div className="text-center bg-white rounded-3xl p-8 max-w-md shadow-2xl animate-fade-in-scale">
            <img
              src={logo}
              alt="EasyGo Academy"
              className="h-16 mx-auto mb-6"
            />
            <div className="text-6xl mb-4 animate-bounce">😢</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </>
    );
  }

  // PANTALLA DEL FORMULARIO
  if (step === "form") {
    return (
      <>
        <style>{animationStyles}</style>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
          <div className="w-full max-w-md">
            {/* Logo y título destacado */}
            <div className="text-center mb-10 animate-slide-down-in">
              <div className="relative inline-block mb-6">
                <img
                  src={logo}
                  alt="EasyGo Academy"
                  className="h-24 mx-auto animate-glow-pulse"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Test de Nivelación
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Descubre tu nivel de inglés en 10 minutos
              </p>
            </div>

            {/* Tarjeta del formulario */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl duration-300 animate-fade-in-scale">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">⏱️</span>
                    <span className="text-xs font-medium text-gray-600">
                      10 min
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-r border-gray-200">
                    <span className="text-2xl mb-1">📊</span>
                    <span className="text-xs font-medium text-gray-600">
                      {questions.length || 20} preguntas
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">🎯</span>
                    <span className="text-xs font-medium text-gray-600">
                      Gratis
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleUserSubmit} className="space-y-5">
                  <div className="group animate-slide-up-in">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Nombre completo <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 group-hover:border-primary/40 placeholder-gray-400"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div
                    className="group animate-slide-up-in"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Correo electrónico <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 group-hover:border-primary/40 placeholder-gray-400"
                      placeholder="juan@email.com"
                    />
                  </div>

                  <div
                    className="group animate-slide-up-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Teléfono / WhatsApp <span className="text-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 group-hover:border-primary/40 placeholder-gray-400"
                      placeholder="+51 1 1234 5678"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <span>📱</span> Recibirás los resultados por WhatsApp
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-6 animate-slide-up-in"
                    style={{ animationDelay: "0.3s" }}
                  >
                    Comenzar Test →
                  </button>
                </form>

                <p className="text-xs text-center text-gray-500 mt-6 animate-fade-in-scale">
                  🔒 Tus datos están seguros. No compartiremos tu información.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // PANTALLA DEL TEST
  if (step === "test" && questions.length > 0 && currentQ) {
    const isMultipleChoice =
      currentQ.type === "multiple" || currentQ.type === "multiple-choice";
    const options = Array.isArray(currentQ.options) ? currentQ.options : [];
    const userAnswer = answers[currentQ.id];

    return (
      <>
        <style>{animationStyles}</style>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-6 px-4">
          <div className="w-full h-full max-w-2xl mx-auto flex-1 flex flex-col justify-center align-middle">
            {/* Header con progreso */}
            <div className="text-center mb-0 animate-slide-down-in">
              <div className="relative inline-block mb-6">
                <img
                  src={logo}
                  alt="EasyGo Academy"
                  className="h-12 mx-auto animate-glow-pulse"
                />
              </div>
             
            
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6 animate-slide-down-in border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Progreso:</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-600 font-medium">
                <span>✅ {answeredCount} respondidas</span>
                <span>⏳ {questions.length - answeredCount} pendientes</span>
              </div>
            </div>

            {/* Tarjeta de pregunta */}
            <div
              className={`flex-1 transition-all duration-300 ${fadeIn ? "animate-fade-in-scale" : "opacity-50"}`}
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-full">
                {/* Badge de nivel */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎯</span>
                      <span className="text-sm font-medium text-gray-700">
                        Nivel
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full text-sm font-bold animate-pulse">
                        {currentQ.level || "A1"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Pregunta {currentQuestion + 1} de {questions.length}
                    </div>
                  </div>
                </div>

                {/* Pregunta */}
                <div className="p-8 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                    {currentQ.text || currentQ.question}
                  </h2>

                  {/* Opciones de respuesta */}
                  {isMultipleChoice && options.length > 0 && (
                    <div className="space-y-3 mb-8">
                      {options.map((option, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        const isSelected = userAnswer === option;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-300 flex items-center gap-4 transform hover:scale-105 active:scale-95 ${
                              isSelected
                                ? "border-primary bg-gradient-to-r from-primary/5 to-accent/5 shadow-lg"
                                : "border-gray-300 hover:border-primary/40 hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 ${
                                isSelected
                                  ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-110"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {letter}
                            </div>
                            <span
                              className={`flex-1 transition-all duration-300 ${isSelected ? "text-gray-900 font-semibold" : "text-gray-700"}`}
                            >
                              {option}
                            </span>
                            {isSelected && (
                              <span className="text-primary text-2xl animate-bounce flex-shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {(!isMultipleChoice || options.length === 0) && (
                    <div className="mb-8">
                      <input
                        type="text"
                        value={userAnswer || ""}
                        onChange={(e) => handleAnswer(e.target.value)}
                        placeholder="Escribe tu respuesta aquí..."
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 placeholder-gray-400"
                      />
                    </div>
                  )}

                  {/* Botones de navegación */}
                  <div className="flex gap-3 mt-auto pt-4">
                    {currentQuestion > 0 && (
                      <button
                        onClick={prevQuestion}
                        className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-primary/40 transition-all duration-300 hover:shadow-md active:scale-95"
                      >
                        ← Anterior
                      </button>
                    )}
                    {currentQuestion < questions.length - 1 ? (
                      <button
                        onClick={nextQuestion}
                        className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        Siguiente →
                      </button>
                    ) : (
                      <button
                        onClick={submitTest}
                        disabled={
                          submitting || answeredCount !== questions.length
                        }
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300"
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Enviando...
                          </span>
                        ) : answeredCount !== questions.length ? (
                          `Completa las ${questions.length - answeredCount} restantes`
                        ) : (
                          "Completar Test 🎉"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Indicadores de progreso */}
            <div className="flex justify-center gap-2 mt-8 mb-4 flex-wrap">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (answers[questions[idx].id]) {
                      changeQuestion(idx);
                    }
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    currentQuestion === idx
                      ? "w-3 h-3 bg-gradient-to-r from-primary to-accent shadow-lg scale-125"
                      : answers[questions[idx].id]
                        ? "w-2 h-2 bg-emerald-400 hover:scale-110"
                        : "w-2 h-2 bg-gray-300 hover:scale-110"
                  }`}
                  disabled={!answers[questions[idx].id]}
                  title={`Pregunta ${idx + 1}`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 font-medium">
              {answeredCount === questions.length
                ? "✅ ¡Todas las preguntas respondidas! Listo para completar"
                : `📝 ${questions.length - answeredCount} de ${questions.length} preguntas por responder`}
            </p>
          </div>
        </div>
      </>
    );
  }

  // PANTALLA DE ÉXITO
  const finalScore = calculateScore();
  const finalLevel = calculateLevel(finalScore);

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-8">
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md transform transition-all duration-500 animate-fade-in-scale border border-gray-100">
          <div className="animate-slide-down-in">
            <img
              src={logo}
              alt="EasyGo Academy"
              className="h-16 mx-auto mb-8 animate-glow-pulse"
            />
          </div>

          <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-6xl mx-auto mb-8 animate-bounce shadow-lg">
            🎉
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-slide-up-in">
            ¡Test Completado!
          </h2>
          <p
            className="text-gray-700 mb-8 animate-slide-up-in"
            style={{ animationDelay: "0.1s" }}
          >
            Gracias{" "}
            <span className="font-bold text-primary">{userData.name}</span>,
            hemos recibido tus resultados.
          </p>

          {/* Resultado */}
          <div
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 mb-6 border border-primary/20 animate-fade-in-scale"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-sm font-medium text-gray-600 mb-4">
              Tu nivel recomendado es:
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-lg">
                  {finalLevel}
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-2">
                  Nivel CEFR
                </p>
              </div>
              <div className="w-px h-16 bg-gray-300" />
              <div className="text-center">
                <div className="text-5xl font-black text-primary">
                  {Math.round(finalScore)}%
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-2">
                  Puntaje
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-8 border border-blue-200 animate-slide-up-in"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-sm text-gray-700 flex items-center gap-3 justify-center font-medium">
              <span className="text-2xl">📞</span> Un asesor se pondrá en
              contacto contigo pronto
            </p>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 animate-slide-up-in"
            style={{ animationDelay: "0.4s" }}
          >
            Volver al inicio →
          </button>
        </div>
      </div>
    </>
  );
};
