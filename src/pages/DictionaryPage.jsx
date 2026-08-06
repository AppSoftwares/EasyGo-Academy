import { useState, useRef } from "react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { dictionaryService } from "../services/dictionaryService";

export const DictionaryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Función para asegurar que synonyms sea un array
  const parseSynonyms = (synonyms) => {
    if (!synonyms) return [];
    if (Array.isArray(synonyms)) return synonyms;
    if (typeof synonyms === 'string') {
      try {
        const parsed = JSON.parse(synonyms);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await dictionaryService.searchWord(term);

      if (res.data.success && res.data.word) {
        setResult(res.data.word);
        // Agregar a recientes
        setRecentSearches(prev => {
          const filtered = prev.filter(w => w.word !== res.data.word.word);
          return [{ word: res.data.word.word, id: res.data.word.id }, ...filtered].slice(0, 8);
        });
      } else {
        setError(res.data.message || "No se encontró la palabra.");
      }
    } catch (err) {
      setError("Error al buscar. Intenta de nuevo.");
      console.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (word) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "en-US";
      u.rate = 0.85;
      const voices = window.speechSynthesis.getVoices();
      const ev = voices.find((v) => v.lang.startsWith("en"));
      if (ev) u.voice = ev;
      window.speechSynthesis.speak(u);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      A1: "bg-emerald-100 text-emerald-700",
      A2: "bg-blue-100 text-blue-700",
      B1: "bg-amber-100 text-amber-700",
      B2: "bg-orange-100 text-orange-700",
      C1: "bg-rose-100 text-rose-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  // Obtener sinónimos de forma segura
  const synonyms = result ? parseSynonyms(result.synonyms) : [];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            📚 Diccionario
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Busca cualquier palabra en inglés y obtén su significado al instante
          </p>
        </div>

        {/* Buscador */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Escribe una palabra en inglés..."
              className="w-full px-6 py-5 text-lg bg-white border-2 border-gray-100 rounded-3xl focus:border-primary/30 focus:shadow-2xl focus:shadow-primary/5 transition-all outline-none pr-20 shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Buscar"
              )}
            </button>
          </div>
        </form>

        {/* Búsquedas recientes */}
        {recentSearches.length > 0 && !result && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              🕐 Recientes
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchTerm(item.word);
                    handleSearch();
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary/30 hover:text-primary transition-all"
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Buscando "{searchTerm}"...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-center">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Resultado */}
        {result && !loading && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
            {/* Cabecera de la palabra */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
                  {result.word}
                </h2>
                <button
                  onClick={() => speakWord(result.word)}
                  className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center text-xl hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
                >
                  🔊
                </button>
              </div>

              {result.phonetic && (
                <p className="text-gray-400 text-lg mb-1">{result.phonetic}</p>
              )}

              {result.spanishPronunciation && (
                <p className="text-gray-500 text-sm mb-3 italic">
                  "{result.spanishPronunciation}"
                </p>
              )}

              <p className="text-2xl font-bold text-primary">
                {result.translation}
              </p>

              {result.level && (
                <span
                  className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-bold ${getLevelColor(result.level)}`}
                >
                  Nivel {result.level}
                </span>
              )}

              {result.source === "external" && (
                <span className="inline-block mt-3 ml-2 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  ✨ Nueva · Agregada al diccionario
                </span>
              )}
            </div>

            {/* Detalles */}
            <div className="p-6 sm:p-8 space-y-5">
              {/* Definición */}
              {result.definition && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    📖 Definición
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {result.definition}
                  </p>
                </div>
              )}

              {/* Ejemplo */}
              {result.example && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    📝 Ejemplo
                  </p>
                  <p className="text-gray-700 font-medium italic">
                    "{result.example}"
                  </p>
                  {result.exampleTranslation && (
                    <p className="text-sm text-gray-500 mt-1">
                      {result.exampleTranslation}
                    </p>
                  )}
                </div>
              )}

              {/* Sinónimos - CORREGIDO */}
              {synonyms.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    🔗 Sinónimos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {synonyms.map((s, i) => {
                      const text = typeof s === 'string' ? s : (s?.word || s?.text || '');
                      return text ? (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchTerm(text);
                            handleSearch();
                          }}
                          className="bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-all"
                        >
                          {text}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Tips */}
              {result.tips && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                    💡 Tip para hispanohablantes
                  </p>
                  <p className="text-amber-800 text-sm">{result.tips}</p>
                </div>
              )}

              {/* Info de BD */}
              <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
                {result.searches !== undefined ? (
                  <span>Buscada {result.searches} veces en EasyGo Academy</span>
                ) : (
                  <span>Palabra agregada desde diccionario externo</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!result && !loading && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Diccionario EasyGo
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Busca cualquier palabra en inglés. Si no está en nuestra base de
              datos, la buscaremos por ti y la guardaremos.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </DashboardLayout>
  );
};