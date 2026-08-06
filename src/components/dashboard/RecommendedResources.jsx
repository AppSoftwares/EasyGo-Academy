// src/components/dashboard/RecommendedResources.jsx
import { useState, useEffect } from "react";
import { contentService } from "../../services/contentService"; // 👈 Usar otro servicio

export const RecommendedResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      // Usar endpoint público o de progreso, no /teacher/content
      const res = await contentService.getPublicContent(); // 👈 Nuevo endpoint
      // O si no existe, mostrar recursos de ejemplo
      if (res.data.success) {
        setResources(res.data.content || []);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
      // Mostrar datos de ejemplo si falla
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: "📄",
      doc: "📝",
      video: "🎥",
      audio: "🎧",
      link: "🔗",
      exercise: "✏️",
      quiz: "📝",
    };
    return icons[type] || "📄";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4">
          📚 Recursos recomendados
        </h4>
        <div className="text-center py-6 text-gray-400 text-sm">
          <span className="text-3xl block mb-2">📭</span>
          No hay recursos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h4 className="font-bold text-gray-900 mb-4">📚 Recursos recomendados</h4>
      <div className="space-y-3">
        {resources.map((resource, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
              {getFileIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{resource.title}</p>
              <p className="text-xs text-gray-400">
                {resource.type} • {resource.level}
              </p>
            </div>
            <button
              onClick={() =>
                window.open(resource.fileUrl || resource.externalLink, "_blank")
              }
              className="text-gray-400 hover:text-primary transition-colors"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
