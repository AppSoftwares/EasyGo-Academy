import { useNavigate } from "react-router-dom";

export const QuickAccess = () => {
  const navigate = useNavigate();

  const items = [
    /* {
      id: "grammar",
      title: "Gramática",
      subtitle: "Reglas y estructuras del inglés",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 7h2m-2 4h6m-6 4h4"
          />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
      path: "/resources",
    },
    {
      id: "dictionary",
      title: "Diccionario",
      subtitle: "Busca palabras y significados",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 6v12M16 6v12"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10l4 4 4-4"
          />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
      path: "/resources",
    },
    {
      id: "translator",
      title: "Traductor",
      subtitle: "Traduce palabras y frases al instante",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
      color: "bg-purple-50 text-purple-600",
      path: "/resources",
    },
    {
      id: "expressions",
      title: "Expresiones comunes",
      subtitle: "Frases útiles para el día a día",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      color: "bg-orange-50 text-orange-600",
      path: "/chat",
    },
    {
      id: "pronunciation",
      title: "Pronunciación",
      subtitle: "Mejora tu acento y entonación",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      color: "bg-pink-50 text-pink-600",
      path: "/chat",
    },
    {
      id: "audiobooks",
      title: "Audiolibros",
      subtitle: "Escucha historias en inglés",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ),
      color: "bg-teal-50 text-teal-600",
      path: "/resources",
    },
    {
      id: "writing",
      title: "Escritura",
      subtitle: "Practica redacción en inglés",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
      path: "/resources",
    },
    {
      id: "vocabulary",
      title: "Vocabulario",
      subtitle: "Amplía tu léxico en inglés",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      color: "bg-indigo-50 text-indigo-600",
      path: "/resources",
    },
    {
      id: "listening",
      title: "Comprensión auditiva",
      subtitle: "Entrena tu oído con ejercicios",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 11.5a3.5 3.5 0 000 3m3-5a7 7 0 010 8"
          />
        </svg>
      ),
      color: "bg-rose-50 text-rose-600",
      path: "/videos",
    },
    {
      id: "reading",
      title: "Lectura",
      subtitle: "Lee artículos y textos en inglés",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      color: "bg-cyan-50 text-cyan-600",
      path: "/resources",
    }, */
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-4 text-left group"
        >
          {/* Icono a la derecha */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${item.color}`}
          >
            {item.icon}
          </div>

          {/* Textos a la izquierda */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm">
              {item.title}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {item.subtitle}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
