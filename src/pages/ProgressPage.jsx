// src/pages/ProgressPage.jsx - Con navegación libre entre niveles pero lecciones bloqueadas
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { progressService } from "../services/progressService";
import { useAuthStore } from "../store/useAuthStore";

export const ProgressPage = () => {
  const { user } = useAuthStore();
  const [activeLevel, setActiveLevel] = useState(user?.assignedLevel || user?.finalAssignedLevel || "A1");
  const [activeCourse, setActiveCourse] = useState("curriculum");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [stats, setStats] = useState(null);

  const userLevel = user?.assignedLevel || user?.finalAssignedLevel || "A1";
  
  // Orden de niveles
  const levelOrder = ["A1", "A2", "B1", "B2", "C1"];
  const currentLevelIndex = levelOrder.indexOf(userLevel);
  
  // Verificar si un nivel está desbloqueado para ACCEDER A SUS LECCIONES
  const isLevelUnlockedForLessons = (level) => {
    const levelIndex = levelOrder.indexOf(level);
    // Un nivel está desbloqueado si es el nivel actual del usuario o uno inferior
    return levelIndex <= currentLevelIndex;
  };

  // Obtener mensaje de bloqueo para lecciones
  const getLessonLockedMessage = (level) => {
    return `🔒 Completa el nivel ${userLevel} para desbloquear las lecciones de ${level}`;
  };

  useEffect(() => {
    loadProgress();
  }, [activeLevel]);

  const loadProgress = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressRes, statsRes] = await Promise.all([
        progressService.getMyProgress(activeLevel),
        progressService.getStats(),
      ]);

      if (progressRes.data.success) {
        setProgressData(progressRes.data.progress);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error("Error al cargar progreso:", err);
      setError("No se pudo cargar el progreso");
    } finally {
      setLoading(false);
    }
  };

  // Verificar si se puede acceder a una lección específica
  const canAccessLesson = (lesson, moduleIndex, unitIndex, module, lessonLevel) => {
    // PRIMERO: Verificar si el nivel de la lección está desbloqueado para el usuario
    if (!isLevelUnlockedForLessons(lessonLevel)) {
      return { 
        canAccess: false, 
        message: getLessonLockedMessage(lessonLevel),
        reason: "level_locked"
      };
    }
    
    // Verificar si es la primera lección del módulo
    const isFirstLesson = unitIndex === 0;
    
    // Para la primera lección del módulo, verificar si el módulo anterior está completo
    if (isFirstLesson && moduleIndex > 0) {
      const previousModule = curriculumData.modules[moduleIndex - 1];
      const isPreviousModuleCompleted = previousModule?.completed || false;
      if (!isPreviousModuleCompleted) {
        return { 
          canAccess: false, 
          message: `🔒 Completa el módulo "${previousModule?.title}" primero`,
          reason: "module_locked"
        };
      }
    }
    
    // Para lecciones que no son la primera, verificar lección anterior
    if (!isFirstLesson) {
      const previousLesson = module.units[unitIndex - 1];
      const isPreviousCompleted = previousLesson?.completed || false;
      if (!isPreviousCompleted && !lesson.completed) {
        return { 
          canAccess: false, 
          message: `🔒 Completa "${previousLesson?.title}" primero`,
          reason: "lesson_locked"
        };
      }
    }
    
    return { canAccess: true, message: null, reason: null };
  };

  const levels = [
    { id: "A1", name: "A1 - Principiante", icon: "🟢", color: "bg-green-500" },
    { id: "A2", name: "A2 - Básico", icon: "🔵", color: "bg-blue-500" },
    { id: "B1", name: "B1 - Intermedio", icon: "🟡", color: "bg-yellow-500" },
    { id: "B2", name: "B2 - Avanzado", icon: "🟠", color: "bg-orange-500" },
    { id: "C1", name: "C1 - Competente", icon: "🔴", color: "bg-red-500" },
  ];

  const currentLevelData = progressData?.[activeLevel];
  const curriculumData = currentLevelData?.curriculum || {
    modules: [],
    totalUnits: 0,
    completedUnits: 0,
    progress: 0,
  };
  const grammarData = currentLevelData?.grammar || {
    modules: [],
    totalUnits: 0,
    completedUnits: 0,
    progress: 0,
  };

  const getTypeColor = (type) => {
    const colors = {
      grammar: "bg-blue-100 text-blue-700",
      vocabulary: "bg-green-100 text-green-700",
      speaking: "bg-purple-100 text-purple-700",
      writing: "bg-orange-100 text-orange-700",
      listening: "bg-pink-100 text-pink-700",
      reading: "bg-teal-100 text-teal-700",
      explanation: "bg-indigo-100 text-indigo-700",
      exercise: "bg-amber-100 text-amber-700",
      quiz: "bg-rose-100 text-rose-700",
      lesson: "bg-indigo-100 text-indigo-700",
      audiobook: "bg-emerald-100 text-emerald-700",
      task: "bg-slate-100 text-slate-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getTypeName = (type) => {
    const names = {
      grammar: "Gramática",
      vocabulary: "Vocabulario",
      speaking: "Conversación",
      writing: "Escritura",
      listening: "Auditiva",
      reading: "Lectura",
      explanation: "Explicación",
      exercise: "Ejercicio",
      quiz: "Quiz",
      lesson: "Lección",
      audiobook: "Audiolibro",
      task: "Tarea",
    };
    return names[type] || type;
  };

  const getLessonTypeIcon = (type) => {
    const icons = {
      explanation: "📖",
      exercise: "✏️",
      quiz: "📝",
      lesson: "📖",
      grammar: "📘",
      vocabulary: "📝",
      speaking: "🎙️",
      writing: "✍️",
      listening: "🎧",
      reading: "📚",
      audiobook: "🎧",
      task: "📝",
    };
    return icons[type] || "📌";
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score > 0) return "text-yellow-600";
    return "text-gray-400";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando tu ruta de aprendizaje...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">⚠️</span>
          <p className="text-gray-500 text-lg">{error}</p>
          <button
            onClick={loadProgress}
            className="mt-4 text-primary hover:underline font-semibold"
          >
            Reintentar
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!progressData || !stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🗺️</span>
          <p className="text-gray-500 text-lg">
            Aún no tienes una ruta de aprendizaje asignada
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Completa tu prueba de nivelación para empezar
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              🗺️ Mi ruta de aprendizaje
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Visualiza tu progreso por niveles y módulos
            </p>
          </div>
        </div>

        {/* Selector de nivel - TODOS LOS BOTONES ACTIVOS (sin bloqueo) */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {levels.map((level) => {
              const levelStat = stats?.levelStats?.[level.id];
              const total = levelStat?.total || 0;
              const completed = levelStat?.completed || 0;
              const progress = levelStat?.progress || 0;
              const isCurrent = level.id === userLevel;
              const isCompleted = progress === 100 && total > 0;
              const isLessonsUnlocked = isLevelUnlockedForLessons(level.id);

              return (
                <button
                  key={level.id}
                  onClick={() => setActiveLevel(level.id)}
                  className={`relative p-4 rounded-2xl text-left transition-all ${
                    activeLevel === level.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                      : total > 0
                        ? "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        : "bg-gray-50 text-gray-400 opacity-60"
                  }`}
                >
                  {/* Badge de nivel actual */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        activeLevel === level.id 
                          ? "bg-white/20 text-white" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        Actual
                      </span>
                    </div>
                  )}
                  
                  {/* Badge de lecciones bloqueadas (solo informativo) */}
                  {!isLessonsUnlocked && total > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="text-xs">🔒</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{level.icon}</span>
                    {progress === 100 && total > 0 && (
                      <span className="text-lg">
                        {activeLevel === level.id ? "✅" : "🏆"}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{level.name}</h3>
                  {total > 0 ? (
                    <>
                      <div className="flex items-center justify-between text-xs opacity-70">
                        <span>
                          {completed}/{total} módulos
                        </span>
                        <span className="font-bold">{progress}%</span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full mt-2 overflow-hidden"
                        style={{
                          background:
                            activeLevel === level.id
                              ? "rgba(255,255,255,0.3)"
                              : "#E2E8F0",
                        }}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${progress === 100 ? "bg-green-400" : activeLevel === level.id ? "bg-white" : "bg-primary"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs opacity-50">No iniciado</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Progreso general
            </p>
            <p className="text-2xl font-black text-primary">
              {stats.overallProgress}%
            </p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Unidades
            </p>
            <p className="text-2xl font-black text-accent">
              {stats.completedUnits}
              <span className="text-sm text-gray-400 font-normal">
                /{stats.totalUnits}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">completadas</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Horas de estudio
            </p>
            <p className="text-2xl font-black text-primary">
              {Math.round((stats.totalTime / 60) * 10) / 10}h
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.totalTime} minutos
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Promedio
            </p>
            <p className="text-2xl font-black text-accent">{stats.avgScore}%</p>
            <p className="text-xs text-gray-400 mt-1">de puntuación</p>
          </div>
        </div>

        {/* Selector de curso */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveCourse("curriculum")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeCourse === "curriculum"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📘 Módulos
          </button>
        </div>

        {/* Mensaje informativo sobre lecciones bloqueadas */}
        {!isLevelUnlockedForLessons(activeLevel) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="font-semibold text-amber-800">Lecciones bloqueadas</p>
              <p className="text-sm text-amber-700">
                {getLessonLockedMessage(activeLevel)}
              </p>
            </div>
          </div>
        )}

        {/* ============ MÓDULOS DEL CURRÍCULO ============ */}
        {activeCourse === "curriculum" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Módulos del nivel {activeLevel}
              {curriculumData.totalUnits > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({curriculumData.completedUnits}/{curriculumData.totalUnits}{" "}
                  lecciones)
                </span>
              )}
            </h2>

            {curriculumData.modules?.length > 0 ? (
              curriculumData.modules.map((module, moduleIndex) => {
                const isModuleCompleted = module.completed;
                const displayModuleNumber = moduleIndex + 1;
                const isLevelBlocked = !isLevelUnlockedForLessons(activeLevel);
                
                return (
                  <div
                    key={module.id}
                    className={`bg-white rounded-2xl shadow-sm border transition-all ${
                      isModuleCompleted ? "border-green-200" : "border-gray-100"
                    } ${isLevelBlocked ? "opacity-75" : ""}`}
                  >
                    {/* Header del módulo */}
                    <div className="p-5 sm:p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                            isModuleCompleted
                              ? "bg-green-50"
                              : "bg-gray-50"
                          }`}
                        >
                          {isModuleCompleted ? "🏆" : "📦"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">
                              Módulo {displayModuleNumber}: {module.title}
                            </h3>
                            {isModuleCompleted && (
                              <span className="text-sm">✅</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400">
                              {module.totalUnits} lecciones
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isModuleCompleted ? "bg-green-500" : "bg-primary"}`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {isModuleCompleted
                            ? "Completado"
                            : `${module.progress}%`}
                        </p>
                      </div>
                    </div>

                    {/* Unidades - CON BLOQUEO POR NIVEL */}
                    <div className="border-t border-gray-50">
                      {module.units.map((unit, unitIndex) => {
                        // Verificar si el nivel está bloqueado para lecciones
                        if (isLevelBlocked) {
                          return (
                            <div
                              key={unit.id}
                              className="flex items-center gap-4 px-5 sm:px-6 py-3.5 opacity-60 cursor-not-allowed"
                            >
                              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-400 text-xs">🔒</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-400">
                                  {unit.title}
                                </h4>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  Completa el nivel anterior para desbloquear
                                </p>
                              </div>
                              <span className="text-sm font-bold text-gray-300 w-12 text-right">
                                —
                              </span>
                            </div>
                          );
                        }
                        
                        // Si el nivel está desbloqueado, verificar requisitos entre lecciones
                        const { canAccess, message } = canAccessLesson(unit, moduleIndex, unitIndex, module, activeLevel);
                        const isLockedLesson = !canAccess && !unit.completed;
                        
                        return (
                          <Link
                            key={unit.id}
                            to={canAccess ? `/curriculum/lesson/${unit.id}` : "#"}
                            onClick={(e) => {
                              if (isLockedLesson) {
                                e.preventDefault();
                                alert(message || "Completa los requisitos previos primero");
                              }
                            }}
                            className={`flex items-center gap-4 px-5 sm:px-6 py-3.5 ${
                              unitIndex < module.units.length - 1
                                ? "border-b border-gray-50"
                                : ""
                            } ${isLockedLesson ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer transition"}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                unit.completed
                                  ? "bg-green-100"
                                  : isLockedLesson
                                    ? "bg-gray-100"
                                    : "bg-gray-100"
                              }`}
                            >
                              {unit.completed ? (
                                <svg
                                  className="w-4 h-4 text-green-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : isLockedLesson ? (
                                <span className="text-gray-400 text-xs">🔒</span>
                              ) : (
                                <span className="text-gray-400 text-xs font-bold">
                                  {unitIndex + 1}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-sm font-semibold ${
                                  unit.completed
                                    ? "text-gray-900"
                                    : isLockedLesson
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                }`}
                              >
                                {unit.title}
                              </h4>
                              {isLockedLesson && message && (
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {message}
                                </p>
                              )}
                            </div>

                            <span
                              className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold hidden sm:flex items-center gap-1 ${getTypeColor(unit.type)}`}
                            >
                              <span>{getLessonTypeIcon(unit.type)}</span>
                              <span>{getTypeName(unit.type)}</span>
                            </span>

                            <span
                              className={`text-sm font-bold w-12 text-right ${getScoreColor(unit.score)}`}
                            >
                              {unit.score > 0 ? `${unit.score}%` : "—"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <span className="text-4xl block mb-3">📘</span>
                <p className="text-gray-500">
                  No hay módulos disponibles para este nivel
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  El contenido del curso se está preparando
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};