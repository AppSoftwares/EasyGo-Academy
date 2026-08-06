// src/pages/GrammarPage.jsx
import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { grammarService } from "../services/grammarService";
import { progressService } from "../services/progressService";
import { useAuthStore } from "../store/useAuthStore";

export const GrammarPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeLevel, setActiveLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    loadTopics();
    loadProgress();
  }, []);

  useEffect(() => {
    filterTopics();
  }, [activeLevel, searchTerm, topics]);

  const loadTopics = async () => {
    try {
      const response = await grammarService.getAll();
      console.log("📚 Temas desde DB:", response.data);

      if (response.data.success && response.data.topics) {
        setTopics(response.data.topics);
      } else {
        console.warn("No se recibieron temas de la DB");
        setTopics([]);
      }
    } catch (error) {
      console.error("❌ Error loading topics:", error);
      setTopics([]);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await progressService.getMyProgress();
      console.log("Datos crudos del progreso:", res.data);

      if (res.data.success && res.data.progress) {
        const completedMap = {};
        const progressData = res.data.progress;

        // Iteramos sobre las llaves de los niveles (A1, A2, B1, etc.)
        Object.keys(progressData).forEach((level) => {
          const levelContent = progressData[level]

          // Entramos específicamente a los módulos de 'grammar'
          if (
            levelContent &&
            levelContent.grammar &&
            levelContent.grammar.modules
          ) {
            
            levelContent.grammar.modules.forEach((module) => {
              if (module.units) {
                module.units.forEach((unit) => {
                  
                  // Si la unidad está completada, guardamos su estado usando su ID
                  if (unit.completed) {
                    // Nota: Asegúrate de que el backend envíe 'id' o 'unitId'.
                    // Si en el JSON de grammar las unidades no traen ID,
                    // usaremos su índice o el ID de sus detalles.
                    const unitId = unit.id || unit.details?.id;
                    
                    console.log(":: levelContent2 :: ", module);
                    console.log(":: unitId :: ", unitId);

                    if (module.id) {
                      completedMap[module.id] = true;
                    }
                  }
                });
              }
            });
          }
        });
        console.log("📊 Progreso procesado:", completedMap);
        setUserProgress(completedMap);
        console.log("📊 Nuevo mapa de progreso cargado:", completedMap);
      }
    } catch (err) {
      console.error("Error al cargar progreso:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterTopics = () => {
    let filtered = [...topics];

    // Filtrar por nivel
    if (activeLevel !== "all") {
      filtered = filtered.filter((topic) => topic.level === activeLevel);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.title?.toLowerCase().includes(term) ||
          topic.description?.toLowerCase().includes(term) ||
          topic.category?.toLowerCase().includes(term),
      );
    }

    // Ordenar por nivel y orden
    const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
    filtered.sort((a, b) => {
      if (a.level !== b.level) {
        return (levelOrder[a.level] || 999) - (levelOrder[b.level] || 999);
      }
      return (a.order || 0) - (b.order || 0);
    });

    setFilteredTopics(filtered);
  };

  const levels = [
    { id: "all", label: "Todos", icon: "📚" },
    { id: "A1", label: "Nivel A1", icon: "🟢" },
    { id: "A2", label: "Nivel A2", icon: "🔵" },
    { id: "B1", label: "Nivel B1", icon: "🟡" },
    { id: "B2", label: "Nivel B2", icon: "🟠" },
    { id: "C1", label: "Nivel C1", icon: "🔴" },
  ];

  // Calcular contadores
  const getLevelCount = (levelId) => {
    if (levelId === "all") return topics.length;
    return topics.filter((t) => t.level === levelId).length;
  };

  const completedCount = Object.keys(userProgress).filter(
    (id) => userProgress[id],
  ).length;
  console.log(userProgress, "PROGRESO DEL USUARIO");
  const totalCount = topics.length;
  const overallProgress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getLevelColor = (level) => {
    const colors = {
      A1: "bg-green-100 text-green-700",
      A2: "bg-blue-100 text-blue-700",
      B1: "bg-amber-100 text-amber-700",
      B2: "bg-orange-100 text-orange-700",
      C1: "bg-red-100 text-red-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  // Función para obtener un icono por defecto si no hay
  const getTopicIcon = (topic) => {
    if (topic.icon) return topic.icon;
    const icons = {
      verb: "📖",
      adjective: "🎨",
      tense: "⏰",
      preposition: "📍",
      noun: "📚",
      modal: "🎯",
      conditional: "🔮",
      passive: "🔄",
      reported: "💬",
      relative: "🔗",
    };
    return icons[topic.category?.toLowerCase()] || "📝";
  };

  // Función para obtener color del icono
  const getIconColor = (level) => {
    const colors = {
      A1: "bg-green-50 text-green-600",
      A2: "bg-blue-50 text-blue-600",
      B1: "bg-amber-50 text-amber-600",
      B2: "bg-orange-50 text-orange-600",
      C1: "bg-red-50 text-red-600",
    };
    return colors[level] || "bg-gray-50 text-gray-600";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            📝 Gramática en Inglés
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalCount} temas disponibles
            {completedCount > 0 && (
              <span className="ml-2">
                ·{" "}
                <span className="text-green-600 font-semibold">
                  {completedCount} completados
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Barra de progreso general */}
        {totalCount > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Progreso general de gramática
              </span>
              <span className="text-sm font-bold text-primary">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar tema gramatical..."
            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Niveles */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                activeLevel === lvl.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {lvl.icon} {lvl.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeLevel === lvl.id
                    ? "bg-white/20"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {getLevelCount(lvl.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Grid de temas */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-gray-500 text-lg">No se encontraron temas</p>
            <p className="text-gray-400 text-sm mt-1">
              Intenta con otros filtros o palabras clave
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTopics.map((topic) => {
              const isCompleted = userProgress[topic.unitId]
              const iconColor = getIconColor(topic.level);
              const topicIcon = getTopicIcon(topic);

              return (
                <button
                  key={topic.id}
                  onClick={() => navigate(`/grammar/${topic.slug}`)}
                  className={`relative text-left bg-white rounded-2xl p-5 shadow-sm border-2 transition-all hover:shadow-md hover:-translate-y-0.5 group ${
                    isCompleted
                      ? "border-green-300 bg-green-50/30"
                      : "border-gray-100 hover:border-primary/30"
                  }`}
                >
                  {/* Badge de completado */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm shadow-lg z-10">
                      ✓
                    </div>
                  )}

                  {/* Icono y nivel */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${iconColor}`}
                    >
                      {topicIcon}
                    </div>
                    <div className="flex items-center gap-2">
                      {topic.category && (
                        <span className="text-xs text-gray-400 capitalize">
                          {topic.category}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${getLevelColor(topic.level)}`}
                      >
                        Nivel {topic.level}
                      </span>
                    </div>
                  </div>

                  {/* Título y descripción */}
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {topic.description ||
                      "Aprende esta importante lección de gramática"}
                  </p>

                  {/* Fórmula */}
                  {topic.formula && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                        Fórmula
                      </p>
                      <code className="text-xs text-primary font-semibold block truncate">
                        {topic.formula}
                      </code>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span
                      className={`text-xs font-semibold ${isCompleted ? "text-green-600" : "text-gray-400"}`}
                    >
                      {isCompleted ? "✅ Completado" : "📝 Incluye test"}
                    </span>
                    <span className="text-xs text-primary font-semibold group-hover:underline flex items-center gap-1">
                      Ver detalles
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
