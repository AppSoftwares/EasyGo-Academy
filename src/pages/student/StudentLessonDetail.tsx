// src/pages/student/StudentLessonDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { curriculumService } from "../../services/curriculumService";
import { progressService } from "../../services/progressService";

// Función segura para parsear JSON (maneja doble escape)
const safeParseJSON = (data, fallback = []) => {
  if (!data) return fallback;
  if (Array.isArray(data)) return data;

  let parsed = data;
  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      return fallback;
    }
  }

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch (e) {
      return fallback;
    }
  }

  return Array.isArray(parsed) ? parsed : fallback;
};

// Componente de carga mejorado
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-96">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-primary mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">📖</span>
        </div>
      </div>
      <p className="mt-4 text-gray-500 font-medium">Cargando tu lección...</p>
    </div>
  </div>
);

// Componente de error mejorado
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="text-center py-12 max-w-md mx-auto">
    <div className="text-7xl mb-6">😕</div>
    <h2 className="text-2xl font-bold text-gray-800 mb-3">¡Oops! Algo salió mal</h2>
    <p className="text-gray-500 mb-6">{error || "No pudimos cargar esta lección"}</p>
    <div className="flex gap-3 justify-center">
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition shadow-sm"
      >
        Intentar de nuevo
      </button>
    </div>
  </div>
);

// Componente de sección mejorado
const LessonSection = ({ section, index }) => (
  <div className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 p-6">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
        {index + 1}
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{section.title}</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-4">
          {section.content}
        </p>
        {section.examples?.length > 0 && (
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <span>💡</span> Ejemplos prácticos
            </p>
            <ul className="space-y-2">
              {section.examples.map((example, i) => (
                <li key={i} className="text-gray-700 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▹</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Componente de pregunta mejorado
const QuestionCard = ({ question, index, userAnswer, onAnswerChange }) => {
  const getQuestionIcon = (type) => {
    const icons = {
      "multiple-choice": "🔘",
      "fill-blank": "✏️",
      open: "💬",
    };
    return icons[type] || "❓";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getQuestionIcon(question.type)}</span>
          <span className="text-sm font-medium text-primary">Pregunta {index + 1}</span>
        </div>
      </div>
      <div className="p-6">
        <p className="font-semibold text-gray-800 mb-4 text-lg">
          {question.question}
        </p>

        {question.type === "multiple-choice" && question.options && (
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  userAnswer === option
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <input
                  type="radio"
                  name={`q${index}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => onAnswerChange(index, e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "fill-blank" && (
          <input
            type="text"
            value={userAnswer || ""}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-primary focus:bg-white transition-all outline-none"
          />
        )}

        {question.type === "open" && (
          <textarea
            value={userAnswer || ""}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            placeholder="Desarrolla tu respuesta..."
            rows={4}
            className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-primary focus:bg-white transition-all outline-none resize-none"
          />
        )}
      </div>
    </div>
  );
};

// Componente principal
export const StudentLessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (id) {
      loadLesson();
      setStartTime(Date.now());
    } else {
      setError("ID de lección no válido");
      setLoading(false);
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      const response = await curriculumService.getLesson(id);
      if (response.data.success && response.data.lesson) {
        setLesson(response.data.lesson);
      } else {
        setError("Lección no encontrada");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitTest = async () => {
    const questions = safeParseJSON(lesson?.questions);
    if (!questions.length) return;

    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer?.toLowerCase().trim() === q.correct?.toLowerCase().trim() || userAnswer?.toLowerCase().trim() === q.answer?.toLowerCase().trim()){
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    setScore(finalScore);
    setTestSubmitted(true);

    if (finalScore >= 70 && lesson?.id) {
      try {
        await progressService.completeUnit(lesson.id, {
          score: finalScore,
          timeSpent: timeSpentSeconds,
        });
      } catch (error) {
        console.error("Error guardando progreso:", error);
      }
    }
  };

  const getLessonTypeConfig = (type) => {
    const configs = {
      explanation: { icon: "📖", color: "from-blue-500 to-indigo-600", label: "Explicación" },
      exercise: { icon: "✏️", color: "from-emerald-500 to-teal-600", label: "Ejercicio" },
      quiz: { icon: "📝", color: "from-amber-500 to-orange-600", label: "Quiz" },
      personalized_class: { icon: "🎓", color: "from-purple-500 to-pink-600", label: "Clase personalizada" },
      evaluation: { icon: "📊", color: "from-rose-500 to-red-600", label: "Evaluación" },
    };
    return configs[type] || { icon: "📚", color: "from-gray-500 to-gray-600", label: "Lección" };
  };

  const sections = safeParseJSON(lesson?.sections);
  const questions = safeParseJSON(lesson?.questions);
  const tips = safeParseJSON(lesson?.tips);

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;
  
  if (error || !lesson) {
    return (
      <DashboardLayout>
        <ErrorDisplay error={error} onRetry={loadLesson} />
      </DashboardLayout>
    );
  }

  const typeConfig = getLessonTypeConfig(lesson.lesson_type);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Botón volver mejorado */}
          <button
            onClick={() => navigate("/progress")}
            className="group flex items-center gap-2 text-gray-400 hover:text-primary transition-all mb-6 px-3 py-2 rounded-lg hover:bg-primary/5"
          >
            <span className="transform group-hover:-translate-x-1 transition">←</span>
            <span>Volver al curso</span>
          </button>

          {/* Header rediseñado */}
          <div className={`bg-gradient-to-r ${typeConfig.color} rounded-2xl p-8 mb-8 text-white shadow-xl`}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl drop-shadow-lg">{typeConfig.icon}</span>
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-2">
                  {typeConfig.label}
                </span>
                <h1 className="text-3xl font-bold">{lesson.title}</h1>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {lesson.level && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <span>🏆</span> Nivel {lesson.level}
                </span>
              )}
              {lesson.estimated_time && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                  <span>⏱️</span> {lesson.estimated_time} min
                </span>
              )}
            </div>
          </div>

          {/* Contenido principal con animación */}
          <div className="space-y-6 mb-10 animate-fadeIn">
            {sections.map((section, idx) => (
              <LessonSection key={idx} section={section} index={idx} />
            ))}
          </div>

          {/* Audio mejorado */}
          {lesson.audio_url && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <p className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                <span>🎧</span> Escucha la pronunciación
              </p>
              <audio src={lesson.audio_url} controls className="w-full rounded-lg" />
            </div>
          )}

          {/* Video mejorado */}
          {lesson.video_url && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={lesson.video_url}
                className="w-full aspect-video"
                title={lesson.title}
                allowFullScreen
              />
            </div>
          )}

          {/* Tips mejorados */}
          {tips.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-lg">
                <span>💡</span> Consejos para recordar
              </h3>
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="text-amber-700 flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test rediseñado */}
          {questions.length > 0 && !testSubmitted && (
            <div className="border-t-2 border-gray-200 pt-8 mt-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  📝 Pon a prueba tus conocimientos
                </h2>
                <p className="text-gray-500">Responde las siguientes preguntas</p>
              </div>
              
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <QuestionCard
                    key={idx}
                    question={q}
                    index={idx}
                    userAnswer={userAnswers[idx]}
                    onAnswerChange={handleAnswerChange}
                  />
                ))}
              </div>

              <button
                onClick={handleSubmitTest}
                className="w-full mt-8 bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-semibold hover:opacity-90 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Verificar respuestas ✨
              </button>
            </div>
          )}

          {/* Resultados rediseñados */}
          {testSubmitted && (
            <div className="border-t-2 border-gray-200 pt-8 mt-6 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="text-7xl mb-4 animate-bounce">
                  {score >= 70 ? "🎉🏆🎉" : "📚💪📚"}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {score >= 70 ? "¡Felicidades!" : "¡Sigue así!"}
                </h2>
                <p className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  {score}%
                </p>
                <p className="text-gray-600 mb-6">
                  {score >= 70
                    ? "¡Excelente trabajo! Has completado esta lección exitosamente."
                    : "No te desanimes, cada intento te acerca más a la maestría."}
                </p>

                {/* Barra de progreso animada */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        score >= 70 ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-400 to-red-500"
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Respuestas detalladas */}
                <div className="text-left border-t pt-6 mt-4">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                    <span>📋</span> Revisión de respuestas
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {questions.map((q, idx) => {
                      const userAnswer = userAnswers[idx];
                      const isCorrect = q.answer ? userAnswer?.toLowerCase().trim() === q.answer.toLowerCase().trim() : userAnswer?.toLowerCase().trim() === q.correct?.toLowerCase().trim();
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl transition-all ${
                            isCorrect ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"
                          }`}
                        >
                          <p className="font-medium text-gray-800 text-sm mb-2">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-green-700 text-sm flex items-center gap-2">
                            <span>✓</span> Respuesta correcta: {q.correct || q.answer}
                          </p>
                          {!isCorrect && userAnswer && (
                            <p className="text-red-600 text-sm mt-1 flex items-center gap-2">
                              <span>✗</span> Tu respuesta: {userAnswer}
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-gray-500 text-xs mt-2 italic flex items-start gap-2">
                              <span>💡</span> {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 mt-8">
                  {score < 70 && (
                    <button
                      onClick={() => {
                        setTestSubmitted(false);
                        setUserAnswers({});
                        setScore(null);
                        setStartTime(Date.now());
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                    >
                      Intentar de nuevo ↻
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/progress")}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-medium shadow-sm"
                  >
                    {score >= 70 ? "Continuar con el curso →" : "Volver al curso"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
};