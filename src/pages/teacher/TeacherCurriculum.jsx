// src/pages/teacher/TeacherCurriculum.jsx - Versión mejorada visualmente
import { useState, useEffect } from "react";
import { TeacherLayout } from "../../components/teacher/TeacherLayout";
import { curriculumService } from "../../services/curriculumService";
import { moduleService } from "../../services/moduleService";

export const TeacherCurriculum = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [moduleForm, setModuleForm] = useState({});
  const [lessonForm, setLessonForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [expandedModules, setExpandedModules] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const levels = ["A1", "A2", "B1", "B2", "C1"];

  // Estados para preguntas
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question: "",
    type: "multiple-choice",
    options: ["", "", "", ""],
    correct: "",
    explanation: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  useEffect(() => {
    loadModules();
  }, [selectedLevel]);

  const loadModules = async () => {
    setLoading(true);
    try {
      const res = await moduleService.getModules(selectedLevel);
      if (res.data.success) {
        setModules(res.data.modules || []);
      }
    } catch (error) {
      console.error("Error loading modules:", error);
      showToast("Error al cargar los módulos", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const openModuleModal = (module = null) => {
    setEditingModule(module);
    setModuleForm(
      module || {
        title: "",
        description: "",
        level: selectedLevel,
        order: modules.length + 1,
      },
    );
    setShowModuleModal(true);
  };

  const handleSaveModule = async () => {
    if (!moduleForm.title?.trim()) {
      showToast("El título del módulo es requerido", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingModule) {
        await moduleService.updateModule(editingModule.id, moduleForm);
        showToast("Módulo actualizado correctamente");
      } else {
        await moduleService.createModule(moduleForm);
        showToast("Módulo creado correctamente");
      }
      setShowModuleModal(false);
      loadModules();
    } catch (error) {
      showToast(
        "Error: " + (error.response?.data?.message || error.message),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (id, title) => {
    if (
      !window.confirm(
        `¿Eliminar el módulo "${title}"? Se eliminará TODO su contenido.`,
      )
    )
      return;
    try {
      await moduleService.deleteModule(id);
      loadModules();
      showToast("Módulo eliminado correctamente");
    } catch (error) {
      showToast("Error al eliminar el módulo", "error");
    }
  };

  const openLessonModal = async (module, lesson = null) => {
    if (lesson) {
      try {
        const res = await curriculumService.getLesson(lesson.id);
        const fullLesson = res.data.lesson;

        setEditingLesson(lesson);
        setLessonForm({
          title: fullLesson.title || "",
          description: fullLesson.description || "",
          moduleId: module.id,
          orderInModule:
            fullLesson.orderInModule || (module.lessons?.length || 0) + 1,
          lessonType: fullLesson.lessonType || "explanation",
          sections: fullLesson.sections,
          pointsToPass: fullLesson.pointsToPass || 70,
          estimatedTime: fullLesson.estimatedTime || 15,
          isRequired: fullLesson.isRequired !== false,
          requiresValidation: fullLesson.requiresValidation || false,
        });

        // 🔧 PARSEAR PREGUNTAS CORRECTAMENTE
        let parsedQuestions = [];
        if (fullLesson.questions) {
          try {
            // Si es string, parsearlo; si ya es array, usarlo directamente
            if (typeof fullLesson.questions === "string") {
              parsedQuestions = JSON.parse(JSON.parse(fullLesson.questions));
            } else if (Array.isArray(fullLesson.questions)) {
              parsedQuestions = fullLesson.questions;
            } else {
              parsedQuestions = [];
            }
          } catch (e) {
            console.error("Error parsing questions:", e);
            parsedQuestions = [];
          }
        }

        // Asegurar que cada pregunta tenga un ID único para el frontend
        const questionsWithIds = parsedQuestions.map((q, idx) => ({
          ...q,
          id: q.id || Date.now() + idx, // Si no tiene ID, asignar uno
        }));

        setQuestions(questionsWithIds);
      } catch (error) {
        console.error("Error loading lesson details:", error);
        showToast("Error al cargar los detalles de la lección", "error");
        setQuestions([]);
      }
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: "",
        description: "",
        moduleId: module.id,
        orderInModule: (module.lessons?.length || 0) + 1,
        lessonType: "explanation",
        sections: [],
        pointsToPass: 70,
        estimatedTime: 15,
        isRequired: true,
        requiresValidation: false,
      });
      setQuestions([]);
    }
    setActiveTab("content");
    setShowLessonModal(true);
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title?.trim()) {
      showToast("El título de la lección es requerido", "error");
      return;
    }
    setSaving(true);
    try {
      const dataToSave = {
        ...lessonForm,
        questions: questions,
      };

      if (editingLesson) {
        await curriculumService.updateLesson(editingLesson.id, dataToSave);
        showToast("Lección actualizada correctamente");
      } else {
        await curriculumService.createLesson(dataToSave);
        showToast("Lección creada correctamente");
      }
      setShowLessonModal(false);
      loadModules();
    } catch (error) {
      showToast(
        "Error: " + (error.response?.data?.message || error.message),
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (id, title) => {
    if (!window.confirm(`¿Eliminar la lección "${title}"?`)) return;
    try {
      await curriculumService.deleteLesson(id);
      loadModules();
      showToast("Lección eliminada correctamente");
    } catch (error) {
      showToast("Error al eliminar la lección", "error");
    }
  };

  // CRUD de Preguntas
  const openQuestionModal = (question = null) => {
    setEditingQuestion(question);
    if (question) {
      setQuestionForm({
        question: question.question || "",
        type: question.type || "multiple-choice",
        options: question.options || ["", "", "", ""],
        correct: question.correct || "",
        explanation: question.explanation || "",
      });
    } else {
      setQuestionForm({
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correct: "",
        explanation: "",
      });
    }
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = () => {
    if (!questionForm.question.trim()) {
      showToast("La pregunta es requerida", "error");
      return;
    }
    if (questionForm.type !== "open" && !questionForm.correct) {
      showToast("La respuesta correcta es requerida", "error");
      return;
    }

    const newQuestion = {
      id: editingQuestion?.id || Date.now(),
      question: questionForm.question,
      type: questionForm.type,
      options:
        questionForm.type === "multiple-choice"
          ? questionForm.options.filter((opt) => opt.trim())
          : [],
      correct: questionForm.correct || "",
      explanation: questionForm.explanation,
    };

    if (editingQuestion) {
      console.log("Updating question:", editingQuestion);
      setQuestions(
        questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q)),
      );
    } else {
      setQuestions([...questions, newQuestion]);
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
    setQuestionForm({
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correct: "",
      explanation: "",
    });
    showToast(editingQuestion ? "Pregunta actualizada" : "Pregunta agregada");
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("¿Eliminar esta pregunta?")) {
      setQuestions(questions.filter((q) => q.id !== questionId));
      showToast("Pregunta eliminada");
    }
  };

  const handleMoveQuestion = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= questions.length) return;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [
      newQuestions[newIndex],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  const getModuleProgress = (module) => {
    const total = module.lessons?.length || 0;
    const completed = module.lessons?.filter((l) => l.completed).length || 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getLessonTypeIcon = (type) => {
    const icons = {
      explanation: "📖",
      exercise: "✏️",
      quiz: "📝",
      personalized_class: "🎓",
      evaluation: "📊",
      grammar: "📘",
    };
    return icons[type] || "📄";
  };

  const getLessonTypeColor = (type) => {
    const colors = {
      explanation: "bg-blue-100 text-blue-700",
      exercise: "bg-amber-100 text-amber-700",
      quiz: "bg-purple-100 text-purple-700",
      personalized_class: "bg-green-100 text-green-700",
      evaluation: "bg-red-100 text-red-700",
      grammar: "bg-indigo-100 text-indigo-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex flex-col justify-center items-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Cargando currículo...</p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      {/* Toast Notifications */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header mejorado */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-3xl p-8">
          <div className="absolute top-0 right-0 opacity-10">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4V6zm2-4h12v2H6V2zm16 8H2v12h20V10z" />
            </svg>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">📚</span>
              Gestión del Currículo
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Organiza los módulos y lecciones del curso. Crea, edita y
              estructura el contenido educativo para cada nivel.
            </p>
          </div>
        </div>

        {/* Selector de nivel mejorado */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`flex-1 min-w-[70px] px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedLevel === level
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg">
                    {level === "A1"
                      ? "🌟"
                      : level === "A2"
                        ? "📘"
                        : level === "B1"
                          ? "📗"
                          : level === "B2"
                            ? "📕"
                            : "🎓"}
                  </span>
                  <span>Nivel {level}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Barra de acciones */}
       {/*  <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {modules.length} {modules.length === 1 ? "módulo" : "módulos"}{" "}
            disponibles
          </p>
          <button
            onClick={() => openModuleModal()}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-lg">+</span>
            Nuevo Módulo
          </button>
        </div> */}

        {/* Lista de módulos mejorada */}
        {modules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            {/* <div className="text-8xl mb-4 opacity-50">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay módulos creados
            </h3>
            <p className="text-gray-400 mb-6">
              Comienza creando tu primer módulo para el nivel {selectedLevel}
            </p>
            <button
              onClick={() => openModuleModal()}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              + Crear primer módulo
            </button> */}
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => {
              const progress = getModuleProgress(module);
              const isExpanded = expandedModules[module.id] !== false;

              return (
                <div
                  key={module.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {/* Header del módulo mejorado */}
                  <div
                    className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {isExpanded ? "📂" : "📁"}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-lg font-bold text-gray-900">
                                {module.title}
                              </h2>
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                Módulo {moduleIndex + 1}
                              </span>
                            </div>
                            {module.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 ml-9">
                          <p className="text-xs text-gray-400">
                            📖 {module.lessons?.length || 0} lecciones
                          </p>
                          {/* <p className="text-xs text-gray-400">
                            ✓ {module.completedLessons || 0} completadas
                          </p> */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Barra de progreso circular pequeña */}
                        <div className="hidden sm:block">
                          {/* <div className="relative w-10 h-10">
                            <svg className="w-10 h-10 transform -rotate-90">
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                                fill="none"
                              />
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 16}`}
                                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                                className="transition-all duration-500"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
                              {progress}%
                            </span>
                          </div> */}
                        </div>
                        <div className="flex gap-1">
                         {/*  <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModuleModal(module);
                            }}
                            className="text-primary text-sm p-2 hover:bg-primary/10 rounded-lg transition"
                            title="Editar módulo"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(module.id, module.title);
                            }}
                            className="text-red-500 text-sm p-2 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar módulo"
                          >
                            🗑️
                          </button> */}
                          <button className="text-gray-400 p-1">
                            {isExpanded ? "▲" : "▼"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    {/* <div className="mt-3 ml-9">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div> */}
                  </div>

                  {/* Contenido del módulo (expandible) */}
                  {isExpanded && (
                    <>
                      {/* Botón agregar lección */}
                      <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100">
                        <button
                          onClick={() => openLessonModal(module)}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition flex items-center gap-2"
                        >
                          <span className="text-lg">+</span>
                          Agregar lección
                        </button>
                      </div>

                      {/* Lista de lecciones mejorada */}
                      <div className="divide-y divide-gray-100">
                        {module.lessons?.length === 0 ? (
                          <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl block mb-2">📭</span>
                            <p>No hay lecciones en este módulo</p>
                            <button
                              onClick={() => openLessonModal(module)}
                              className="mt-2 text-primary text-sm font-semibold"
                            >
                              Agregar primera lección →
                            </button>
                          </div>
                        ) : (
                          module.lessons.map((lesson, idx) => (
                            <div
                              key={lesson.id}
                              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition group"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-lg">
                                      {getLessonTypeIcon(
                                        lesson.lessonType || lesson.type,
                                      )}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">
                                      {lesson.title}
                                    </h3>
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full ${getLessonTypeColor(lesson.lessonType || lesson.type)}`}
                                    >
                                      {lesson.lessonType || lesson.type}
                                    </span>
                                  </div>
                                  {lesson.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                      {lesson.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 mt-1.5">
                                    {lesson.questionsCount > 0 && (
                                      <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                                        📝 {lesson.questionsCount}{" "}
                                        {lesson.questionsCount === 1
                                          ? "pregunta"
                                          : "preguntas"}
                                      </span>
                                    )}
                                    {lesson.score > 0 && (
                                      <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                                        ✓ {lesson.score}% completado
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  onClick={() =>
                                    openLessonModal(module, lesson)
                                  }
                                  className="text-primary text-sm p-2 hover:bg-primary/10 rounded-lg transition"
                                  title="Editar lección"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteLesson(lesson.id, lesson.title)
                                  }
                                  className="text-red-500 text-sm p-2 hover:bg-red-50 rounded-lg transition"
                                  title="Eliminar lección"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}


      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

              {/* Modal de Módulo mejorado */}
        {showModuleModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setShowModuleModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingModule ? "✏️ Editar Módulo" : "➕ Nuevo Módulo"}
                </h3>
                <button
                  onClick={() => setShowModuleModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={moduleForm.title || ""}
                    onChange={(e) =>
                      setModuleForm({ ...moduleForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="Ej: My Identity at Work"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={moduleForm.description || ""}
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    rows={2}
                    placeholder="Describe el contenido del módulo..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel
                    </label>
                    <select
                      value={moduleForm.level || selectedLevel}
                      onChange={(e) =>
                        setModuleForm({ ...moduleForm, level: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      {levels.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orden
                    </label>
                    <input
                      type="number"
                      value={moduleForm.order || modules.length + 1}
                      onChange={(e) =>
                        setModuleForm({
                          ...moduleForm,
                          order: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveModule}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all"
                >
                  {saving ? "Guardando..." : "Guardar Módulo"}
                </button>
                <button
                  onClick={() => setShowModuleModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Lección mejorado */}
        {showLessonModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setShowLessonModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingLesson ? "✏️ Editar Lección" : "➕ Nueva Lección"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingLesson
                      ? "Actualiza el contenido y las preguntas"
                      : "Completa los datos para crear una nueva lección"}
                  </p>
                </div>
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Tabs mejoradas */}
              <div className="flex gap-2 border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("content")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${
                    activeTab === "content"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📝 Contenido
                </button>
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                    activeTab === "questions"
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📋 Preguntas
                  {questions.length > 0 && (
                    <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {questions.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Panel de Contenido */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lessonForm.title || ""}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Título de la lección"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        value={lessonForm.lessonType || "explanation"}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            lessonType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      >
                        <option value="explanation">📖 Explicación</option>
                        <option value="exercise">✏️ Ejercicio</option>
                        <option value="quiz">📝 Quiz</option>
                        <option value="personalized_class">
                          🎓 Clase Personalizada
                        </option>
                        <option value="evaluation">📊 Evaluación</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={lessonForm.description || ""}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      rows={2}
                      placeholder="Describe el objetivo de la lección..."
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Orden
                      </label>
                      <input
                        type="number"
                        value={lessonForm.orderInModule || 1}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            orderInModule: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos para aprobar (%)
                      </label>
                      <input
                        type="number"
                        value={lessonForm.pointsToPass || 70}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            pointsToPass: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiempo estimado (min)
                      </label>
                      <input
                        type="number"
                        value={lessonForm.estimatedTime || 15}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            estimatedTime: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lessonForm.requiresValidation || false}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            requiresValidation: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Requiere validación del profesor
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lessonForm.isRequired !== false}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            isRequired: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Lección obligatoria
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Panel de Preguntas mejorado */}
              {activeTab === "questions" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">
                      Crea preguntas para evaluar el conocimiento de los
                      estudiantes
                    </p>
                    <button
                      onClick={() => openQuestionModal()}
                      className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-semibold hover:shadow-lg transition flex items-center gap-2"
                    >
                      <span className="text-lg">+</span>
                      Agregar pregunta
                    </button>
                  </div>

                  {questions.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                      <span className="text-5xl block mb-3">📝</span>
                      <p className="text-gray-500 font-medium">
                        No hay preguntas en esta lección
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Agrega preguntas para evaluar a los estudiantes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {questions.map((q, index) => (
                        <div
                          key={q.id}
                          className="bg-gray-50 rounded-xl p-4 hover:shadow-sm transition"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Pregunta {index + 1}
                                </span>
                                <span className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-200 rounded-full">
                                  {q.type === "multiple-choice"
                                    ? "🔘 Opción múltiple"
                                    : q.type === "fill-blank"
                                      ? "✏️ Completar"
                                      : "📝 Respuesta abierta"}
                                </span>
                              </div>
                              <p className="font-medium text-gray-800">
                                {q.question}
                              </p>
                              {q.type === "multiple-choice" && q.options && (
                                <div className="mt-2 ml-2 space-y-1">
                                  {q.options.map((opt, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <span className="text-gray-400 w-5">
                                        {String.fromCharCode(65 + i)}.
                                      </span>
                                      <span
                                        className={
                                          opt === q.correct
                                            ? "text-green-600 font-medium"
                                            : "text-gray-600"
                                        }
                                      >
                                        {opt}
                                        {opt === q.correct && " ✓"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {(q.type === "fill-blank" || q.type === "open") &&
                                q.correct && (
                                  <div className="mt-2 ml-2">
                                    <span className="text-sm text-gray-500">
                                      {q.type === "open"
                                        ? "Respuesta sugerida:"
                                        : "Respuesta:"}
                                    </span>
                                    <span className="text-green-600 font-medium ml-2">
                                      {q.correct}
                                    </span>
                                  </div>
                                )}
                              {q.explanation && (
                                <p className="text-xs text-gray-400 mt-2 italic ml-2">
                                  💡 {q.explanation}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-1 ml-4">
                              <button
                                onClick={() => handleMoveQuestion(index, -1)}
                                disabled={index === 0}
                                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded-lg hover:bg-gray-200 transition"
                                title="Mover arriba"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => handleMoveQuestion(index, 1)}
                                disabled={index === questions.length - 1}
                                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded-lg hover:bg-gray-200 transition"
                                title="Mover abajo"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => openQuestionModal(q)}
                                className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSaveLesson}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all hover:shadow-lg"
                >
                  {saving ? "Guardando..." : "Guardar Lección"}
                </button>
                <button
                  onClick={() => setShowLessonModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Pregunta mejorado */}
        {showQuestionModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setShowQuestionModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingQuestion ? "✏️ Editar Pregunta" : "➕ Nueva Pregunta"}
                </h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de pregunta
                  </label>
                  <select
                    value={questionForm.type}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, type: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="multiple-choice">🔘 Opción múltiple</option>
                    <option value="fill-blank">✏️ Completar espacio</option>
                    <option value="open">📝 Respuesta abierta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pregunta <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={questionForm.question}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    rows={2}
                    placeholder="Escribe la pregunta aquí..."
                  />
                </div>

                {questionForm.type === "multiple-choice" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opciones
                    </label>
                    <div className="space-y-2">
                      {questionForm.options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500 w-8">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[idx] = e.target.value;
                              setQuestionForm({
                                ...questionForm,
                                options: newOptions,
                              });
                            }}
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {questionForm.type === "multiple-choice"
                      ? "Respuesta correcta *"
                      : questionForm.type === "open"
                        ? "Respuesta sugerida"
                        : "Respuesta correcta *"}
                  </label>
                  {questionForm.type === "multiple-choice" ? (
                    <select
                      value={questionForm.correct}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          correct: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      <option value="">Selecciona la respuesta correcta</option>
                      {questionForm.options
                        .filter((opt) => opt.trim())
                        .map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={questionForm.correct}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          correct: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                      placeholder={
                        questionForm.type === "open"
                          ? "Respuesta sugerida (opcional)"
                          : "Ej: am"
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explicación (opcional)
                  </label>
                  <textarea
                    value={questionForm.explanation}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    rows={2}
                    placeholder="Explica por qué esa es la respuesta correcta..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveQuestion}
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  {editingQuestion ? "Actualizar Pregunta" : "Agregar Pregunta"}
                </button>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
    </TeacherLayout>
  );
};
