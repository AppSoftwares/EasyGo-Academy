import { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { newsService } from '../services/newsService'

export const NewsPage = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeLevel, setActiveLevel] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedNews, setSelectedNews] = useState(null)
  const [stats, setStats] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => { loadData(); loadStats() }, [activeLevel, activeCategory])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      if (activeCategory !== 'all') params.category = activeCategory
      const res = await newsService.getAll(params)
      if (res.data.success) setNews(res.data.news)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadStats = async () => {
    try { const res = await newsService.getStats(); if (res.data.success) setStats(res.data.stats) } catch (err) {}
  }

  const openNews = async (item) => {
    setSelectedNews(item)
    try {
      const res = await newsService.getById(item.id)
      if (res.data.success) setSelectedNews(res.data.news)
      newsService.recordView(item.id).catch(() => {})
    } catch (err) {}
  }

  const levels = [
    { id: 'all', label: 'Todos', count: stats?.total || 0 },
    { id: 'A1', label: 'A1', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-500', count: stats?.byLevel?.A1 || 0 },
    { id: 'A2', label: 'A2', color: 'from-sky-400 to-sky-600', bg: 'bg-sky-500', count: stats?.byLevel?.A2 || 0 },
    { id: 'B1', label: 'B1', color: 'from-amber-400 to-amber-600', bg: 'bg-amber-500', count: stats?.byLevel?.B1 || 0 },
    { id: 'B2', label: 'B2', color: 'from-orange-400 to-orange-600', bg: 'bg-orange-500', count: stats?.byLevel?.B2 || 0 },
    { id: 'C1', label: 'C1', color: 'from-rose-400 to-rose-600', bg: 'bg-rose-500', count: stats?.byLevel?.C1 || 0 },
  ]

  const categories = [
    { id: 'all', label: 'Todo', icon: '📰' },
    { id: 'easygo', label: 'EasyGo', icon: '🏫' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'technology', label: 'Tech', icon: '🤖' },
    { id: 'health', label: 'Salud', icon: '🏥' },
    { id: 'education', label: 'Educación', icon: '🎓' },
    { id: 'culture', label: 'Cultura', icon: '🌎' },
    { id: 'tips', label: 'Tips', icon: '💡' },
    { id: 'science', label: 'Ciencia', icon: '🔬' },
  ]

  const getLevelGradient = (l) => levels.find(lv => lv.id === l)?.color || 'from-gray-400 to-gray-600'
  const getLevelBg = (l) => levels.find(lv => lv.id === l)?.bg || 'bg-gray-500'
  const getCategoryIcon = (c) => categories.find(cat => cat.id === c)?.icon || '📰'
  const getCategoryName = (c) => categories.find(cat => cat.id === c)?.label || c
  const getCardSize = (index) => {
    if (index === 0) return 'lg:col-span-2 lg:row-span-2'
    if (index === 1 || index === 2) return 'lg:col-span-1 lg:row-span-1'
    return ''
  }

  const featured = news.filter(n => n.featured).slice(0, 3)
  const regular = news.filter(n => !n.featured)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent animate-ping opacity-20" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ============ DETALLE ============
  if (selectedNews) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <button onClick={() => setSelectedNews(null)} 
            className="mb-6 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:shadow-md transition-all flex items-center gap-2 w-fit">
            <span>←</span> Volver
          </button>
          
          <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Hero gradient */}
            <div className={`bg-gradient-to-br ${getLevelGradient(selectedNews.level)} p-8 sm:p-10 text-white`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">{selectedNews.level}</span>
                <span className="text-white/70 text-xs">{getCategoryName(selectedNews.category)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">{selectedNews.title}</h1>
              {selectedNews.subtitle && <p className="text-white/80">{selectedNews.subtitle}</p>}
              <div className="flex items-center gap-4 mt-4 text-white/60 text-xs">
                <span>{selectedNews.readingTime || 3} min lectura</span>
                <span>{selectedNews.views || 0} lectores</span>
              </div>
            </div>
            
            <div className="p-6 sm:p-10">
              <div className="prose max-w-none text-gray-700 leading-relaxed space-y-3">
                {selectedNews.content.split('\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {selectedNews.contentSpanish && (
                <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-600 uppercase mb-2">🇪🇸 Resumen</p>
                  <p className="text-sm text-amber-800">{selectedNews.contentSpanish}</p>
                </div>
              )}

              {selectedNews.vocabulary?.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-4">📝 Vocabulario</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.vocabulary.map((v, i) => (
                      <span key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm">
                        <strong className="text-primary">{v.word}</strong>
                        <span className="text-gray-400 mx-1">—</span>
                        <span className="text-gray-500">{v.translation}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </DashboardLayout>
    )
  }

  // ============ PORTADA ============
  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header moderno */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Noticias<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Inglés real, temas reales</p>
          </div>
          
          {/* Stats pills */}
          <div className="flex items-center gap-2">
            {levels.filter(l => l.id !== 'all').slice(0, 4).map(l => (
              <div key={l.id} className={`w-3 h-3 rounded-full ${l.bg}`} title={`${l.label}: ${l.count} noticias`} />
            ))}
            <span className="text-xs text-gray-400 ml-1">{news.length} artículos</span>
          </div>
        </div>

        {/* Categorías - chips modernos */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategory === c.id 
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
              }`}>
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Niveles - pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {levels.map(l => (
            <button key={l.id} onClick={() => setActiveLevel(l.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-300 ${
                activeLevel === l.id 
                  ? `bg-gradient-to-r ${l.color} text-white shadow-lg scale-105` 
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}>
              {l.label}
              <span className="opacity-70">({l.count})</span>
            </button>
          ))}
        </div>

        {/* ============ GRID DE NOTICIAS (Pinterest-like) ============ */}
        {news.length > 0 ? (
          <>
            {/* Featured cards */}
            {featured.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">
                {featured.map((item, index) => (
                  <button key={item.id} onClick={() => openNews(item)}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                      index === 0 ? 'lg:col-span-2 lg:row-span-2 min-h-[300px]' : 'min-h-[200px]'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${index === 0 ? '#1a1a2e' : index === 1 ? '#2d1b69' : '#1b3a4b'}, ${index === 0 ? '#16213e' : index === 1 ? '#4a2d8f' : '#0f3443'})`,
                    }}>
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full font-bold">{item.level}</span>
                          <span className="text-white/50 text-[10px]">{getCategoryName(item.category)}</span>
                        </div>
                        <h3 className={`font-bold leading-snug group-hover:underline ${index === 0 ? 'text-xl sm:text-2xl' : 'text-base'}`}>{item.title}</h3>
                        {index === 0 && <p className="text-white/60 text-sm mt-2 line-clamp-2">{item.subtitle}</p>}
                      </div>
                      <div className="flex items-center gap-3 text-white/40 text-xs mt-4">
                        <span>{item.readingTime || 3} min</span>
                        <span>{item.views || 0} lectores</span>
                        {index === 0 && <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-white text-xs">Leer →</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Regular cards - Masonry grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {regular.map(item => (
                <button key={item.id} onClick={() => openNews(item)}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  
                  {/* Top color bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${getLevelGradient(item.level)}`} />
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl">{getCategoryIcon(item.category)}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{item.readingTime || 2} min</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.subtitle}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${getLevelGradient(item.level)} text-white`}>
                        {item.level}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.views || 0} lectores</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📰</span>
            </div>
            <p className="text-gray-500 font-medium">No hay noticias</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros</p>
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
  )
}