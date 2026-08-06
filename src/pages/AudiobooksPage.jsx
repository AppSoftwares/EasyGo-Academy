
import { useState, useEffect, useRef, useCallback } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { audiobookService } from '../services/audiobookService'
import { listeningProgressService } from '../services/listeningProgressService'
import { useNavigate } from 'react-router-dom'

export const AudiobooksPage = () => {
  const [audiobooks, setAudiobooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeLevel, setActiveLevel] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [stats, setStats] = useState(null)
  
  // ============ USAR new Audio() EN VEZ DE ELEMENTO HTML ============
  const audioInstanceRef = useRef(null)
  const saveIntervalRef = useRef(null)
  const timeUpdateRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { loadAudiobooks(); loadStats() }, [activeLevel, activeCategory])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current)
      if (timeUpdateRef.current) clearInterval(timeUpdateRef.current)
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause()
        audioInstanceRef.current.src = ''
        audioInstanceRef.current = null
      }
    }
  }, [])

  const loadAudiobooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      if (activeCategory !== 'all') params.category = activeCategory
      const response = await audiobookService.getAll(params)
      if (response.data.success) setAudiobooks(response.data.audiobooks)
    } catch (err) {
      setError('No se pudieron cargar los audiolibros')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await audiobookService.getStats()
      if (response.data.success) setStats(response.data.stats)
    } catch (err) {}
  }

  // Guardar progreso
  const saveProgress = useCallback(async () => {
    if (!currentlyPlaying || !audioInstanceRef.current) return
    const time = Math.floor(audioInstanceRef.current.currentTime)
    if (time <= 0) return
    try {
      await listeningProgressService.saveProgress(currentlyPlaying.id, {
        currentTime: time,
        completed: audioInstanceRef.current.ended,
      })
    } catch (err) {}
  }, [currentlyPlaying])

  // Guardar cada 30s
  useEffect(() => {
    if (isPlaying && currentlyPlaying) {
      saveIntervalRef.current = setInterval(saveProgress, 30000)
      return () => { if (saveIntervalRef.current) clearInterval(saveIntervalRef.current) }
    }
  }, [isPlaying, currentlyPlaying, saveProgress])

  // Actualizar tiempo
  const startTimeUpdate = (audio) => {
    if (timeUpdateRef.current) clearInterval(timeUpdateRef.current)
    timeUpdateRef.current = setInterval(() => {
      if (audio) {
        setCurrentTime(audio.currentTime)
        if (audio.duration) setDuration(audio.duration)
      }
    }, 500)
  }

  const stopTimeUpdate = () => {
    if (timeUpdateRef.current) {
      clearInterval(timeUpdateRef.current)
      timeUpdateRef.current = null
    }
  }

  // Cargar progreso guardado
  const loadProgress = async (book) => {
    try {
      const response = await listeningProgressService.getProgress(book.id)
      if (response.data.success && response.data.progress && !response.data.progress.completed) {
        const saved = response.data.progress
        if (saved.savedCheckpoint > 0) {
          return saved.savedCheckpoint
        }
      }
    } catch (err) {}
    return 0
  }

  // ============ REPRODUCIR USANDO new Audio() ============
  const handlePlay = async (book) => {
    console.log('🎵 handlePlay:', book.title, book.audioUrl)

    // Si es el mismo, toggle
    if (currentlyPlaying?.id === book.id) {
      if (isPlaying) {
        audioInstanceRef.current?.pause()
        setIsPlaying(false)
        stopTimeUpdate()
      } else {
        audioInstanceRef.current?.play()
        setIsPlaying(true)
        startTimeUpdate(audioInstanceRef.current)
      }
      return
    }

    // Detener audio anterior
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause()
      await saveProgress()
      stopTimeUpdate()
    }

    // Sin URL
    if (!book.audioUrl) {
      alert('Este audiolibro no tiene audio disponible.')
      return
    }

    // Crear nuevo audio con JavaScript PURO
    try {
      const audio = new Audio(book.audioUrl)
      audio.preload = 'auto'
      
      // Eventos
      audio.addEventListener('loadedmetadata', () => {
        console.log('✅ Metadata cargada, duración:', audio.duration)
        setDuration(audio.duration)
      })

      audio.addEventListener('canplay', () => {
        console.log('✅ Puede reproducirse')
      })

      audio.addEventListener('play', () => {
        console.log('▶️ Reproduciendo')
        setIsPlaying(true)
      })

      audio.addEventListener('pause', () => {
        console.log('⏸️ Pausado')
        setIsPlaying(false)
      })

      audio.addEventListener('ended', async () => {
        console.log('🏁 Terminado')
        setIsPlaying(false)
        stopTimeUpdate()
        setCurrentTime(0)
        await saveProgress()
        if (currentlyPlaying) {
          try {
            await listeningProgressService.saveProgress(currentlyPlaying.id, {
              currentTime: Math.floor(audio.duration || 0),
              completed: true,
            })
          } catch (err) {}
        }
      })

      audio.addEventListener('error', (e) => {
        console.error('❌ Error en audio:', e)
        alert('Error al cargar el audio. Verifica que la URL sea accesible.')
        setIsPlaying(false)
        stopTimeUpdate()
      })

      // Cargar progreso
      const savedTime = await loadProgress(book)
      if (savedTime > 0) {
        audio.currentTime = savedTime
        setCurrentTime(savedTime)
        console.log('📍 Reanudando desde:', savedTime)
      }

      // Guardar instancia
      audioInstanceRef.current = audio
      setCurrentlyPlaying(book)
      setCurrentTime(savedTime > 0 ? savedTime : 0)
      setDuration(0)

      // Reproducir
      await audio.play()
      startTimeUpdate(audio)
      audiobookService.recordPlay(book.id).catch(() => {})
      
    } catch (err) {
      console.error('❌ Error:', err)
      alert('No se pudo reproducir: ' + err.message)
      setIsPlaying(false)
    }
  }

  const handleStop = async () => {
    await saveProgress()
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause()
      audioInstanceRef.current = null
    }
    stopTimeUpdate()
    setCurrentlyPlaying(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    if (audioInstanceRef.current && duration > 0) {
      const newTime = pct * duration
      audioInstanceRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const filteredAudiobooks = audiobooks.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.narrator || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const levels = [
    { id: 'all', label: 'Todos', icon: '📚', count: stats?.total || audiobooks.length },
    { id: 'A1', label: 'A1', icon: '🟢', count: stats?.byLevel?.A1 || 0 },
    { id: 'A2', label: 'A2', icon: '🔵', count: stats?.byLevel?.A2 || 0 },
    { id: 'B1', label: 'B1', icon: '🟡', count: stats?.byLevel?.B1 || 0 },
    { id: 'B2', label: 'B2', icon: '🟠', count: stats?.byLevel?.B2 || 0 },
    { id: 'C1', label: 'C1', icon: '🔴', count: stats?.byLevel?.C1 || 0 },
  ]

  const categories = [
    { id: 'all', label: 'Todas', icon: '🎧' },
    { id: 'stories', label: 'Historias', icon: '📖' },
    { id: 'dialogues', label: 'Diálogos', icon: '💬' },
    { id: 'business', label: 'Negocios', icon: '💼' },
    { id: 'daily', label: 'Vida diaria', icon: '🏠' },
    { id: 'news', label: 'Noticias', icon: '📰' },
    { id: 'interviews', label: 'Entrevistas', icon: '🎙️' },
    { id: 'academic', label: 'Académico', icon: '🎓' },
  ]

  const getLevelColor = (level) => {
    const c = { A1: 'bg-green-100 text-green-700 border-green-300', A2: 'bg-blue-100 text-blue-700 border-blue-300', B1: 'bg-yellow-100 text-yellow-700 border-yellow-300', B2: 'bg-orange-100 text-orange-700 border-orange-300', C1: 'bg-red-100 text-red-700 border-red-300' }
    return c[level] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getCategoryEmoji = (id) => ({ stories: '📖', dialogues: '💬', business: '💼', daily: '🏠', news: '📰', interviews: '🎙️', academic: '🎓' })[id] || '🎧'
  const getCategoryName = (id) => categories.find(c => c.id === id)?.label || id

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando audiolibros...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🎧 Audiolibros</h1>
            <p className="text-gray-500 text-sm mt-1">{audiobooks.length} audios · Mejora tu listening</p>
          </div>
          {stats && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>▶️ {stats.totalPlays?.toLocaleString() || 0}</span>
              <span>⬇️ {stats.totalDownloads?.toLocaleString() || 0}</span>
            </div>
          )}
        </div>

        {/* Reproductor */}
        {currentlyPlaying && (
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 sticky top-20 z-30">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center text-4xl flex-shrink-0">
                {getCategoryEmoji(currentlyPlaying.category)}
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg truncate">{currentlyPlaying.title}</h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 mt-1">
                  <span>🎙️ {currentlyPlaying.narrator || 'Narrador'}</span>
                  <span>·</span>
                  <span>{formatTime(currentTime)} / {currentlyPlaying.duration || formatTime(duration)}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-3 overflow-hidden cursor-pointer" onClick={handleSeek}>
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button   onClick={() => navigate(`/audiobooks/${currentlyPlaying.id}`)}
                  className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button onClick={handleStop}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all">
                  ⏹
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Búsqueda */}
        <div className="relative">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar audiolibro..."
            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-primary/30 transition-all outline-none" />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">✕</button>}
        </div>

        {/* Niveles */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {levels.map((lvl) => (
            <button key={lvl.id} onClick={() => setActiveLevel(lvl.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${activeLevel === lvl.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'}`}>
              {lvl.icon} {lvl.label} <span className="text-xs opacity-70">({lvl.count})</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAudiobooks.map((book) => (
            <div key={book.id} onClick={() => navigate(`/audiobooks/${book.id}`)}
              className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all hover:shadow-md cursor-pointer group ${currentlyPlaying?.id === book.id ? 'border-primary/50' : 'border-gray-100 hover:border-primary/20'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{getCategoryEmoji(book.category)}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLevelColor(book.level)}`}>{book.level}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm line-clamp-1">{book.title}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{book.description || ''}</p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>{book.duration || '--:--'}</span>
                <span className={`font-semibold ${currentlyPlaying?.id === book.id && isPlaying ? 'text-green-600' : 'group-hover:text-primary'}`}>
                  {currentlyPlaying?.id === book.id && isPlaying ? '▶ Reproduciendo' : '▶ Reproducir'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}