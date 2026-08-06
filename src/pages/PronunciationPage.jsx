import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { pronunciationService } from '../services/pronunciationService'

export const PronunciationPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeLevel, setActiveLevel] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [stats, setStats] = useState(null)
  const [dailyItems, setDailyItems] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const recognitionRef = useRef(null)

  useEffect(() => { loadData(); loadStats(); loadDailyPractice() }, [activeLevel])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (activeLevel !== 'all') params.level = activeLevel
      if (activeCategory !== 'all') params.category = activeCategory
      if (activeDifficulty !== 'all') params.difficulty = activeDifficulty
      const res = await pronunciationService.getAll(params)
      if (res.data.success) setItems(res.data.pronunciations)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const loadStats = async () => {
    try {
      const res = await pronunciationService.getStats()
      if (res.data.success) setStats(res.data.stats)
    } catch (err) {}
  }

  const loadDailyPractice = async () => {
    try {
      const level = activeLevel !== 'all' ? activeLevel : 'A1'
      const res = await pronunciationService.getDailyPractice(level)
      if (res.data.success) setDailyItems(res.data.pronunciations)
    } catch (err) {}
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      utterance.pitch = 1
      const voices = window.speechSynthesis.getVoices()
      const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0]
      if (englishVoice) utterance.voice = englishVoice
      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert('Reconocimiento de voz no soportado en este navegador.'); return }
    
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      setIsListening(false)
      
      if (selectedItem) {
        const correct = selectedItem.word.toLowerCase().trim()
        const similarity = transcript === correct
        setFeedback({
          spoken: transcript,
          correct,
          isCorrect: similarity,
          message: similarity ? '¡Perfecto! ⭐' : 'Casi... Intenta de nuevo 💪',
        })
        if (similarity) {
          pronunciationService.recordPractice(selectedItem.id).catch(() => {})
        }
      }
    }

    recognition.onerror = () => { setIsListening(false) }
    recognition.onend = () => { setIsListening(false) }
    
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
  }

  const levels = [
    { id: 'all', label: 'Todos', icon: '📚', count: stats?.total || 0 },
    { id: 'A1', label: 'A1', icon: '🟢', count: stats?.byLevel?.A1 || 0 },
    { id: 'A2', label: 'A2', icon: '🔵', count: stats?.byLevel?.A2 || 0 },
    { id: 'B1', label: 'B1', icon: '🟡', count: stats?.byLevel?.B1 || 0 },
    { id: 'B2', label: 'B2', icon: '🟠', count: stats?.byLevel?.B2 || 0 },
    { id: 'C1', label: 'C1', icon: '🔴', count: stats?.byLevel?.C1 || 0 },
  ]

  const categories = [
    { id: 'all', label: 'Todas', icon: '🎤' },
    { id: 'common_words', label: 'Palabras comunes', icon: '📝' },
    { id: 'workplace', label: 'Trabajo', icon: '💼' },
    { id: 'daily_life', label: 'Vida diaria', icon: '🏠' },
    { id: 'phrases', label: 'Frases', icon: '💬' },
    { id: 'consonants', label: 'Consonantes', icon: '🔤' },
    { id: 'vowels', label: 'Vocales', icon: '🔡' },
    { id: 'silent_letters', label: 'Letras mudas', icon: '🤫' },
    { id: 'stress', label: 'Acentuación', icon: '🎯' },
    { id: 'intonation', label: 'Entonación', icon: '📈' },
    { id: 'tongue_twisters', label: 'Trabalenguas', icon: '👅' },
  ]

  const getDifficultyColor = (d) => ({ easy: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', hard: 'bg-red-100 text-red-700' })[d] || ''

  const getLevelColor = (l) => ({ A1: 'bg-green-50 border-green-200', A2: 'bg-blue-50 border-blue-200', B1: 'bg-yellow-50 border-yellow-200', B2: 'bg-orange-50 border-orange-200', C1: 'bg-red-50 border-red-200' })[l] || ''

  const filteredItems = items.filter(i => {
    const match = !searchTerm || i.word.toLowerCase().includes(searchTerm.toLowerCase()) || (i.translation || '').toLowerCase().includes(searchTerm.toLowerCase())
    return match
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🎤 Pronunciación</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} palabras y frases · EasyPhonics™</p>
        </div>

        {/* Práctica diaria */}
        {dailyItems.length > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-5 border border-primary/10">
            <h3 className="font-bold text-gray-900 mb-1">🗓️ Práctica diaria</h3>
            <p className="text-xs text-gray-500 mb-4">Palabras recomendadas para hoy</p>
            <div className="flex flex-wrap gap-2">
              {dailyItems.slice(0, 8).map(item => (
                <button key={item.id} onClick={() => { setSelectedItem(item); setFeedback(null) }}
                  className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary transition-all border border-gray-200">
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {levels.map(l => (
            <button key={l.id} onClick={() => setActiveLevel(l.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs whitespace-nowrap transition-all ${activeLevel === l.id ? 'bg-primary text-white shadow' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
              {l.icon} {l.label} <span className="opacity-70">({l.count})</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs whitespace-nowrap transition-all ${activeCategory === c.id ? 'bg-accent text-white shadow' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Panel de práctica */}
        {selectedItem && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-2">{selectedItem.word}</h2>
              <p className="text-lg text-gray-500">{selectedItem.spanishPronunciation}</p>
              <p className="text-sm text-gray-400 mt-1">{selectedItem.translation}</p>
              {selectedItem.phonetic && <p className="text-xs text-gray-400 mt-1 font-mono">{selectedItem.phonetic}</p>}
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button onClick={() => speakWord(selectedItem.word)}
                className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl hover:bg-primary/20 transition-all hover:scale-105 active:scale-95">
                🔊
              </button>
              <button onClick={isListening ? stopListening : startListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-105 active:scale-95 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}>
                🎤
              </button>
            </div>

            {isListening && <p className="text-center text-sm text-red-500 animate-pulse mb-4">🎤 Escuchando... Pronuncia la palabra</p>}

            {feedback && (
              <div className={`p-4 rounded-2xl text-center ${feedback.isCorrect ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                <p className="font-bold text-lg">{feedback.message}</p>
                <p className="text-sm mt-1">Dijiste: <strong>"{feedback.spoken}"</strong></p>
                <p className="text-xs opacity-70">Correcto: "{feedback.correct}"</p>
              </div>
            )}

            {selectedItem.tips && (
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">💡 Tips</p>
                <p className="text-sm text-gray-700">{selectedItem.tips}</p>
              </div>
            )}

            {selectedItem.example && (
              <div className="mt-3 p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-1">📝 Ejemplo</p>
                <p className="text-sm text-gray-700">{selectedItem.example}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selectedItem.exampleTranslation}</p>
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredItems.map(item => (
              <button key={item.id} onClick={() => { setSelectedItem(item); setFeedback(null) }}
                className={`text-left p-4 rounded-2xl border-2 transition-all hover:shadow-md ${getLevelColor(item.level)} ${selectedItem?.id === item.id ? 'border-primary/50 ring-2 ring-primary/10' : 'border-gray-100 hover:border-primary/20'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">{item.word}</h3>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}</span>
                </div>
                <p className="text-xs text-primary font-semibold mb-1">{item.spanishPronunciation}</p>
                <p className="text-xs text-gray-400">{item.translation}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16"><span className="text-5xl block mb-4">🎤</span><p className="text-gray-500">No se encontraron palabras</p></div>
        )}
      </div>
    </DashboardLayout>
  )
}