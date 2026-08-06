// src/pages/GrammarDetailPage.jsx - Versión corregida
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { grammarService } from "../services/grammarService";
import { progressService } from "../services/progressService";
import { useAuthStore } from "../store/useAuthStore";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";

export const GrammarDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const [answers, setAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [activeSection, setActiveSection] = useState("content");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [saving, setSaving] = useState(false);

  // Función para parsear JSON de forma segura
  const safeParseJSON = (data, fallback = []) => {
    if (!data) return fallback;
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (e) {
        return fallback;
      }
    }
    return fallback;
  };

  useEffect(() => {
    loadTopic();
    loadQuestions();
    setStartTime(Date.now());
  }, [slug]);

  const loadTopic = async () => {
    try {
      const response = await grammarService.getBySlug(slug);
      if (response.data.success && response.data.topic) {
        setTopic(response.data.topic);
      } else {
        setError("No se pudo cargar el tema");
      }
    } catch (error) {
      console.error("Error loading topic:", error);
      setError("Error al cargar el tema");
    }
  };

  const loadQuestions = async () => {
    try {
      const response = await grammarService.getQuestions(slug, true);
      console.log("📝 Preguntas recibidas:", response.data);

      if (response.data.success) {
        // Procesar preguntas para formato consistente y asegurar que tengan ID
        const processedQuestions = (response.data.questions || []).map(
          (q, index) => ({
            ...q,
            // Asegurar que cada pregunta tenga un ID único (usar índice si no tiene)
            uniqueId: q.id || q._id || index,
            question: (q.question || "").replace(/_+/g, (match) =>
              "_".repeat(match.length),
            ),
            options: safeParseJSON(q.options, []),
            acceptAlso: safeParseJSON(q.acceptAlso, []),
          }),
        );

        console.log("📝 Preguntas procesadas:", processedQuestions);
        setQuestions(processedQuestions);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAnsweredCount = useCallback(() => {
    if (!questions.length) return 0;
    let count = 0;
    questions.forEach((q, idx) => {
      const questionKey = q.uniqueId !== undefined ? q.uniqueId : idx;
      if (q.type === "multiple-choice") {
        if (answers[questionKey] !== undefined && answers[questionKey] !== null)
          count++;
      } else {
        if (textAnswers[questionKey] && textAnswers[questionKey].trim() !== "")
          count++;
      }
    });
    return count;
  }, [questions, answers, textAnswers]);

  const handleMultipleChoiceAnswer = (questionKey, optionIndex) => {
    console.log("📌 Guardando respuesta:", { questionKey, optionIndex });

    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionKey]: optionIndex };
      console.log("✅ Nuevas answers:", newAnswers);
      return newAnswers;
    });

    // Limpiar respuesta de texto si existe
    if (textAnswers[questionKey]) {
      setTextAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionKey];
        return newAnswers;
      });
    }
  };

  const handleTextAnswer = (questionKey, value) => {
    console.log("📌 Guardando respuesta texto:", { questionKey, value });

    setTextAnswers((prev) => {
      const newAnswers = { ...prev, [questionKey]: value };
      console.log("✅ Nuevas textAnswers:", newAnswers);
      return newAnswers;
    });

    // Limpiar respuesta multiple si existe
    if (answers[questionKey] !== undefined) {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionKey];
        return newAnswers;
      });
    }
  };

  const checkAnswer = (question, userAnswer) => {
    console.log("🔍 Verificando respuesta:", {
      type: question.type,
      userAnswer,
      correctAnswer: question.correct || question.answer,
    });

    if (userAnswer === undefined || userAnswer === null || userAnswer === "")
      return false;

    let cleanUserAnswer = "";
    let correctAnswer = "";

    if (question.type === "multiple-choice") {
      const selectedOption = question.options[userAnswer];
      if (!selectedOption) return false;
      cleanUserAnswer = String(selectedOption).trim().toLowerCase();
      correctAnswer = String(question.correct).trim().toLowerCase();
    } else {
      // Para fill-blank
      cleanUserAnswer = String(userAnswer).trim().toLowerCase();
      // Asegurar que correctAnswer existe (puede estar en 'correct' o 'answer')
      correctAnswer = String(question.correct || question.answer)
        .trim()
        .toLowerCase();
    }

    console.log("📊 Comparando:", { cleanUserAnswer, correctAnswer });

    // Comparación exacta
    if (cleanUserAnswer === correctAnswer) {
      console.log("✅ Respuesta correcta!");
      return true;
    }

    // Verificar respuestas alternativas
    if (
      question.acceptAlso &&
      Array.isArray(question.acceptAlso) &&
      question.acceptAlso.length > 0
    ) {
      const isAccepted = question.acceptAlso.some(
        (alt) => cleanUserAnswer === String(alt).toLowerCase(),
      );
      if (isAccepted) {
        console.log("✅ Respuesta aceptada como alternativa!");
        return true;
      }
    }

    console.log("❌ Respuesta incorrecta");
    return false;
  };

  const handleSubmitTest = async () => {
    let correctCount = 0;

    questions.forEach((q, idx) => {
      const questionKey = q.uniqueId !== undefined ? q.uniqueId : idx;
      const userAnswer =
        q.type === "multiple-choice"
          ? answers[questionKey]
          : textAnswers[questionKey];

      if (checkAnswer(q, userAnswer, questionKey)) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    setScore(finalScore);
    setTimeSpent(timeSpentSeconds);
    setTestSubmitted(true);

    if (finalScore >= 70 && topic?.unitId) {
      setSaving(true);
      try {
        await progressService.completeUnit(topic.unitId, {
          score: finalScore,
          timeSpent: timeSpentSeconds,
        });
        console.log("✅ Progreso guardado correctamente");
      } catch (error) {
        console.error("❌ Error guardando progreso:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestion(index);
    }
  };

  const handleRetry = () => {
    setShowTest(false);
    setTestSubmitted(false);
    setAnswers({});
    setTextAnswers({});
    setScore(null);
    setCurrentQuestion(0);
    setStartTime(Date.now());
  };

  // Obtener datos del tema de forma segura
  const sections = safeParseJSON(topic?.sections);
  const tips = safeParseJSON(topic?.tips);
  const commonMistakes = safeParseJSON(topic?.commonMistakes);

  // Estadísticas del test
  const totalQuestions = questions.length;
  const answeredCount = getAnsweredCount();
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const currentQ = questions[currentQuestion];

  // Obtener la clave única de la pregunta actual
  const currentQuestionKey = currentQ
    ? currentQ.uniqueId !== undefined
      ? currentQ.uniqueId
      : currentQuestion
    : null;

  const isCurrentAnswered = currentQ
    ? currentQ.type === "multiple-choice"
      ? answers[currentQuestionKey] !== undefined &&
        answers[currentQuestionKey] !== null
      : textAnswers[currentQuestionKey] &&
        textAnswers[currentQuestionKey].trim() !== ""
    : false;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Cargando lección...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !topic) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            {error || "Tema no encontrado"}
          </h2>
          <p className="text-gray-500 mb-6">
            No se pudo cargar el contenido de esta lección
          </p>
          <button
            onClick={() => navigate("/grammar")}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
          >
            Volver a Gramática
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-full ">
        {/* Breadcrumb */}
        {/*         <nav className="flex mb-6 text-sm">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-primary transition">
            Dashboard
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <button onClick={() => navigate('/grammar')} className="text-gray-500 hover:text-primary transition">
            Gramática
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{topic.title}</span>
        </nav> */}

        {/* Header Hero */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent rounded-3xl p-8 mb-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{topic.icon || "📖"}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {topic.title}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                    Nivel {topic.level}
                  </span>
                  {topic.category && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      {topic.category}
                    </span>
                  )}
                  {topic.unitId && (
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      Unidad {topic.unitId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {topic.description && (
              <p className="text-white/90 text-lg leading-relaxed mt-4 max-w-2xl">
                {topic.description}
              </p>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveSection("content")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeSection === "content"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📚 Explicación
          </button>
          {questions.length > 0 && (
            <button
              onClick={() => setActiveSection("test")}
              className={`px-6 py-3 font-semibold transition-all ${
                activeSection === "test"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📝 Practicar ({questions.length} ejercicios)
            </button>
          )}
        </div>

        {/* CONTENT SECTION */}
        {activeSection === "content" && (
          <div className="space-y-8">
            {/* Formula Section */}
            {topic.formula && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📐</span>
                  <h2 className="text-xl font-bold text-gray-800">
                    Estructura / Fórmula
                  </h2>
                </div>
                <div className="bg-white p-4 rounded-xl font-mono text-lg text-center text-primary font-bold border border-gray-200">
                  {topic.formula}
                </div>
              </div>
            )}

            {/* Sections */}
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {section.content}
                    </p>

                    {section.examples && section.examples.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-5">
                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                          <span>💡</span> Ejemplos:
                        </h3>
                        <ul className="space-y-2">
                          {section.examples.map((example, i) => (
                            <li
                              key={i}
                              className="text-gray-700 flex items-start gap-2"
                            >
                              <span className="text-blue-500 mt-1">→</span>
                              <span className="font-mono text-sm">
                                {example}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <span className="text-4xl mb-3 block">📝</span>
                <p className="text-gray-500">
                  No hay contenido detallado para esta lección aún.
                </p>
              </div>
            )}

            {/* Tips Section */}
            {tips.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💡</span>
                  <h2 className="text-xl font-bold text-amber-800">
                    Consejos para recordar
                  </h2>
                </div>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li
                      key={i}
                      className="text-amber-700 flex items-start gap-2"
                    >
                      <span className="text-amber-500 mt-1">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes Section */}
            {commonMistakes.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <h2 className="text-xl font-bold text-red-800">
                    Errores comunes
                  </h2>
                </div>
                <ul className="space-y-2">
                  {commonMistakes.map((mistake, i) => (
                    <li key={i} className="text-red-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">✗</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Call to Action */}
            {questions.length > 0 && !showTest && !testSubmitted && (
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center border-2 border-dashed border-primary/30">
                <span className="text-5xl mb-4 block">🎯</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Listo para practicar?
                </h3>
                <p className="text-gray-600 mb-4">
                  Pon a prueba lo que has aprendido con {questions.length}{" "}
                  ejercicios prácticos
                </p>
                <button
                  onClick={() => setShowTest(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Comenzar práctica →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TEST SECTION */}
        {activeSection === "test" && (
          <div>
            {!showTest && !testSubmitted ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ejercicios prácticos
                </h2>
                <p className="text-gray-500 mb-6">
                  Este test contiene {questions.length} preguntas sobre "
                  {topic.title}"
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-gray-600 mb-2">
                    📋 Información del ejercicio:
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>
                      •{" "}
                      {
                        questions.filter((q) => q.type === "multiple-choice")
                          .length
                      }{" "}
                      preguntas de opción múltiple
                    </li>
                    <li>
                      •{" "}
                      {questions.filter((q) => q.type === "fill-blank").length}{" "}
                      preguntas de completar
                    </li>
                    <li>• Necesitas 70% para aprobar la lección</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowTest(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Comenzar ejercicios →
                </button>
              </div>
            ) : showTest && !testSubmitted ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header con progreso */}
                <div className="bg-gradient-to-r from-primary to-primary-dark px-5 sm:px-6 py-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <h3 className="font-bold">Ejercicios prácticos</h3>
                    <div className="flex items-center gap-3 text-sm">
                      {saving && (
                        <span className="text-white/70 animate-pulse text-xs">
                          💾 Guardando...
                        </span>
                      )}
                      <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {answeredCount}/{totalQuestions}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{
                        width: `${(answeredCount / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Navegación rápida por preguntas */}
                <div className="px-5 pt-4 pb-2 overflow-x-auto">
                  <div className="flex gap-1.5">
                    {questions.map((q, idx) => {
                      const questionKey =
                        q.uniqueId !== undefined ? q.uniqueId : idx;
                      const isAnswered =
                        q.type === "multiple-choice"
                          ? answers[questionKey] !== undefined &&
                            answers[questionKey] !== null
                          : textAnswers[questionKey] &&
                            textAnswers[questionKey].trim() !== "";
                      return (
                        <button
                          key={idx}
                          onClick={() => jumpToQuestion(idx)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                            currentQuestion === idx
                              ? "bg-primary text-white shadow-sm"
                              : isAnswered
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pregunta actual */}
                <div className="p-5 sm:p-6">
                  {/* Tags de la pregunta */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      Pregunta {currentQuestion + 1} de {totalQuestions}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {currentQ?.type === "multiple-choice"
                        ? "Opción múltiple"
                        : "Completar"}
                    </span>
                  </div>

                  {/* Enunciado */}
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-6 leading-relaxed">
                    {currentQ?.question || ""}
                  </h4>

                  {/* Opciones según tipo */}
                  {currentQ?.type === "multiple-choice" ? (
                    <div className="space-y-2.5 mb-6">
                      {currentQ.options?.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            handleMultipleChoiceAnswer(currentQuestionKey, idx)
                          }
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                            answers[currentQuestionKey] === idx
                              ? "border-primary bg-primary/5 text-primary shadow-sm"
                              : "border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs mr-3 ${
                              answers[currentQuestionKey] === idx
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10">
                          ✍️
                        </span>
                        <input
                          type="text"
                          value={textAnswers[currentQuestionKey] || ""}
                          onChange={(e) =>
                            handleTextAnswer(currentQuestionKey, e.target.value)
                          }
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm focus:border-primary/30 focus:bg-white transition-all outline-none"
                          placeholder="Escribe tu respuesta en inglés..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Indicador de respuesta respondida */}
                  {isCurrentAnswered && (
                    <div className="flex items-center gap-2 text-xs text-green-600 mb-6 bg-green-50 px-4 py-2 rounded-xl">
                      <span className="text-base">✅</span>
                      <span className="font-medium">Respuesta guardada</span>
                    </div>
                  )}

                  {/* Botones de navegación */}
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestion === 0}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Anterior
                    </button>
                    {currentQuestion === totalQuestions - 1 ? (
                      <button
                        onClick={handleSubmitTest}
                        disabled={answeredCount < totalQuestions}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Finalizar práctica ✓
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm hover:shadow-md"
                      >
                        Siguiente →
                      </button>
                    )}
                  </div>

                  {/* Botón para cancelar test */}
                  <button
                    onClick={() => setShowTest(false)}
                    className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors"
                  >
                    ✕ Cancelar y volver a la lección
                  </button>
                </div>
              </div>
            ) : (
              testSubmitted && (
                // Resultados
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="text-center mb-8">
                    <div
                      className={`text-7xl mb-4 ${score >= 70 ? "text-green-500" : "text-orange-500"}`}
                    >
                      {score >= 70 ? "🎉" : "📚"}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">
                      Tu puntuación: {score}%
                    </h2>
                    <p className="text-gray-600">
                      {score >= 70
                        ? "¡Felicidades! Has dominado esta lección."
                        : "Sigue practicando, puedes intentarlo de nuevo."}
                    </p>
                    <div className="max-w-md mx-auto mt-4">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${score >= 70 ? "bg-green-500" : "bg-orange-500"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      ⏱️ Tiempo: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                    </p>
                  </div>

                  {/* Respuestas correctas */}
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📖</span> Respuestas correctas:
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {questions.map((q, idx) => {
                        console.log(q, "TONTO");
                        const questionKey =
                          q.uniqueId !== undefined ? q.uniqueId : idx;
                        const userAnswer =
                          q.type === "multiple-choice"
                            ? answers[questionKey] !== undefined
                              ? q.options[answers[questionKey]]
                              : null
                            : textAnswers[questionKey];
                        const isCorrect = checkAnswer(
                          q,
                          q.type === "multiple-choice"
                            ? answers[questionKey]
                            : textAnswers[questionKey],
                          questionKey,
                        );

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                          >
                            <p className="font-medium text-gray-800 text-sm mb-2">
                              {idx + 1}. {q.question}
                            </p>
                            <p className="text-green-700 text-sm flex items-center gap-2">
                              <span>✓</span> Respuesta correcta:{" "}
                              <span className="font-semibold">
                                {q.correct || q.answer}
                              </span>
                            </p>
                            {!isCorrect && userAnswer && (
                              <p className="text-red-600 text-sm flex items-center gap-2 mt-1">
                                <span>✗</span> Tu respuesta: {userAnswer}
                              </p>
                            )}
                            {q.explanation && (
                              <p className="text-gray-500 text-xs mt-2 italic">
                                💡 {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {score < 70 && (
                      <button
                        onClick={handleRetry}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                      >
                        Intentar de nuevo
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/grammar")}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-semibold"
                    >
                      {score >= 70
                        ? "Continuar aprendiendo →"
                        : "Volver a gramática"}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
