import { useState, useEffect, useCallback } from 'react'
import { questionService } from '../../services/questionService'
import { testProgressService } from '../../services/testProgressService'
import { progressService } from '../../services/progressService'
import { useAuthStore } from '../../store/useAuthStore'

export const LevelTestInline = ({ onComplete }) => {
  const { user, saveLevelTestResult } = useAuthStore()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [textAnswers, setTextAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [resuming, setResuming] = useState(false)

  useEffect(() => { loadInitialData() }, [])

  const loadInitialData = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const [questionsRes, progressRes] = await Promise.all([
        questionService.getForTest(),
        testProgressService.getProgress(),
      ])
      if (questionsRes.data.success) {
        const parsed = (questionsRes.data.questions || []).map(q => ({
          ...q,
          question: (q.question || '').replace(/_+/g, (match) => '╴'.repeat(match.length)),
          options: typeof q.options === 'string' ? (() => { try { return JSON.parse(q.options) } catch { return [] } })() : (Array.isArray(q.options) ? q.options : []),
          acceptAlso: typeof q.acceptAlso === 'string' ? (() => { try { return JSON.parse(q.acceptAlso) } catch { return [] } })() : (Array.isArray(q.acceptAlso) ? q.acceptAlso : []),
        }))
        setQuestions(parsed)
      }
      if (progressRes.data.success && progressRes.data.progress) {
        const saved = progressRes.data.progress
        let pa = {}; let pt = {}
        if (saved.answers) pa = typeof saved.answers === 'string' ? JSON.parse(saved.answers) : saved.answers
        if (saved.textAnswers) pt = typeof saved.textAnswers === 'string' ? JSON.parse(saved.textAnswers) : saved.textAnswers
        setAnswers(pa); setTextAnswers(pt)
        setCurrentQuestion(saved.currentQuestion || 0)
        setResuming(true); setStarted(true)
      }
    } catch (err) { setLoadError('No se pudieron cargar los datos.') }
    finally { setLoading(false) }
  }

  const getAnsweredCount = useCallback(() => {
    if (!questions || questions.length === 0) return 0
    let count = 0
    questions.forEach(q => {
      if (!q || !q.id) return
      if (q.type === 'multiple') { if (answers[q.id] !== undefined && answers[q.id] !== null && typeof answers[q.id] === 'number' && answers[q.id] >= 0) count++ }
      else { if (textAnswers[q.id] && typeof textAnswers[q.id] === 'string' && textAnswers[q.id].trim() !== '') count++ }
    })
    return count
  }, [questions, answers, textAnswers])

  const saveProgressToServer = async (questionIndex) => {
    if (saving || questions.length === 0) return
    setSaving(true)
    try {
      await testProgressService.saveProgress({ currentQuestion: questionIndex, answers, textAnswers, totalQuestions: questions.length })
      setLastSaved(new Date())
    } catch (err) { console.error('Error al guardar:', err) }
    finally { setSaving(false) }
  }

  const handleAnswer = (qId, index) => {
    setAnswers(prev => ({ ...prev, [qId]: index }))
    if (textAnswers[qId]) { setTextAnswers(prev => { const n = { ...prev }; delete n[qId]; return n }) }
  }
  const handleTextAnswer = (qId, value) => setTextAnswers(prev => ({ ...prev, [qId]: value }))

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      const next = currentQuestion + 1
      setCurrentQuestion(next)
      await saveProgressToServer(next)
    }
  }
  const handlePrevious = () => { if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1) }
  const jumpToQuestion = (index) => { if (index >= 0 && index < questions.length) setCurrentQuestion(index) }

  const checkAnswer = (q, userAnswer) => {
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') return false
    const clean = String(userAnswer).trim().toLowerCase()
    const correct = String(q.answer).toLowerCase()
    if (clean === correct) return true
    if (Array.isArray(q.acceptAlso)) return q.acceptAlso.some(alt => clean === String(alt).toLowerCase())
    return false
  }

  const calculateResults = () => {
    let totalPoints = 0, earnedPoints = 0
    const byLevel = {}, byCategory = {}
    questions.forEach(q => {
      totalPoints += q.points
      if (!byLevel[q.level]) byLevel[q.level] = { earned: 0, total: 0 }
      if (!byCategory[q.category]) byCategory[q.category] = { earned: 0, total: 0 }
      byLevel[q.level].total += q.points
      byCategory[q.category].total += q.points
      const ua = q.type === 'multiple' ? answers[q.id] : textAnswers[q.id]
      if (checkAnswer(q, ua)) { earnedPoints += q.points; byLevel[q.level].earned += q.points; byCategory[q.category].earned += q.points }
    })
    const pct = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    let rl = 'A1'
    if (pct >= 85) rl = 'C1'; else if (pct >= 70) rl = 'B2'; else if (pct >= 55) rl = 'B1'; else if (pct >= 35) rl = 'A2'
    return { totalPoints, earnedPoints, percentage: pct.toFixed(1), recommendedLevel: rl, byLevel, byCategory }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const results = calculateResults()
    try {
      await testProgressService.completeTest({ answers, textAnswers, results })
      saveLevelTestResult({ ...results, date: new Date().toISOString() })
      await progressService.initLevel(results.recommendedLevel)
      setShowResults(true)
      setTimeout(() => { if (onComplete) onComplete(results) }, 2500)
    } catch (err) { console.error('Error:', err) }
    finally { setSubmitting(false) }
  }

  const handleSkip = async () => {
    if (!window.confirm('¿Estás seguro de omitir el test?\n\nSe te asignará el nivel A1 por defecto. Podrás hacer el test más tarde.')) return
    setSubmitting(true)
    try {
      const allAnswers = {}, allTextAnswers = {}
      questions.forEach(q => { if (q.type === 'multiple') allAnswers[q.id] = -1; else allTextAnswers[q.id] = '' })
      await testProgressService.completeTest({
        answers: allAnswers, textAnswers: allTextAnswers,
        results: { totalPoints: questions.reduce((s, q) => s + q.points, 0), earnedPoints: 0, percentage: '0.0', recommendedLevel: 'A1', skipped: true, byLevel: {}, byCategory: {}, date: new Date().toISOString() },
      })
      saveLevelTestResult({ totalPoints: questions.reduce((s, q) => s + q.points, 0), earnedPoints: 0, percentage: '0.0', recommendedLevel: 'A1', skipped: true, date: new Date().toISOString() })
      await progressService.initLevel('A1')
      if (onComplete) onComplete({ recommendedLevel: 'A1', skipped: true })
    } catch (err) { alert('Error al omitir el test.') }
    finally { setSubmitting(false) }
  }

  const handleReset = async () => {
    if (window.confirm('¿Reiniciar el test? Perderás todo el progreso.')) {
      await testProgressService.resetTest()
      setCurrentQuestion(0); setAnswers({}); setTextAnswers({}); setStarted(false); setResuming(false); setLastSaved(null)
    }
  }

  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0
  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === totalQuestions - 1
  const answeredCount = getAnsweredCount()
  const isCurrentAnswered = currentQ ? (currentQ.type === 'multiple' ? (answers[currentQ.id] !== undefined && answers[currentQ.id] !== null && answers[currentQ.id] >= 0) : (textAnswers[currentQ.id] && textAnswers[currentQ.id].trim() !== '')) : false

  const getSafeOptions = (q) => { if (!q) return []; let o = q.options; if (typeof o === 'string') { try { o = JSON.parse(o) } catch { return [] } } return Array.isArray(o) ? o : [] }
  const safeOptions = getSafeOptions(currentQ)

  if (loading) return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 font-medium">Cargando preguntas...</p>
    </div>
  )
  if (loadError) return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-3xl">⚠️</span></div>
      <p className="text-gray-500 font-medium mb-4">{loadError}</p>
      <button onClick={loadInitialData} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-semibold transition-colors">Reintentar</button>
    </div>
  )
  if (questions.length === 0) return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
      <span className="text-4xl block mb-4">📭</span><p className="text-gray-500">No hay preguntas disponibles.</p>
    </div>
  )
  if (resuming && !showResults) return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🔄</span></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Tienes un test en progreso</h2>
      <p className="text-gray-500 mb-2">Has respondido <strong>{answeredCount}</strong> de <strong>{totalQuestions}</strong> preguntas</p>
      <div className="w-full max-w-xs mx-auto mb-6"><div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} /></div><p className="text-xs text-gray-400 mt-1.5">Progreso: {Math.round((answeredCount / totalQuestions) * 100)}%</p></div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => setResuming(false)} className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">Continuar test →</button>
        <button onClick={handleReset} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3.5 rounded-2xl font-semibold transition-all text-sm">Reiniciar desde cero</button>
      </div>
    </div>
  )
  if (!started) return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6"><span className="text-4xl">📝</span></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Prueba de nivelación</h2>
      <p className="text-gray-500 mb-2">Descubre tu nivel de inglés</p>
      <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6"><span>📋 {totalQuestions} preguntas</span><span>⏱️ ~{Math.round(totalQuestions * 0.5)} min</span><span>💾 Progreso guardado</span></div>
      <button onClick={() => setStarted(true)} className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95">Comenzar prueba →</button>
      <p className="text-xs text-gray-400 mt-4">Tu progreso se guarda al avanzar entre preguntas</p>
    </div>
  )
  if (showResults) {
    const results = calculateResults()
    const getEmoji = (pct) => pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪'
    const getLevelColor = (level) => ({ A1: '#10B981', A2: '#3B82F6', B1: '#F59E0B', B2: '#F97316', C1: '#EF4444' })[level] || '#5B2ECC'
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4"><span className="text-4xl">{getEmoji(results.percentage)}</span></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Prueba completada!</h2>
        <p className="text-gray-500 mb-6">{user?.name?.split(' ')[0] || 'Estudiante'}, estos son tus resultados</p>
        <div className="rounded-2xl p-6 mb-6 text-white" style={{ background: `linear-gradient(135deg, ${getLevelColor(results.recommendedLevel)}, ${getLevelColor(results.recommendedLevel)}dd)` }}>
          <p className="text-sm opacity-90 mb-1">Tu nivel recomendado es</p><p className="text-5xl font-black">{results.recommendedLevel}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xl font-black text-primary">{results.earnedPoints}/{results.totalPoints}</p><p className="text-xs text-gray-500">Puntos</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xl font-black text-accent">{results.percentage}%</p><p className="text-xs text-gray-500">Porcentaje</p></div>
          <div className="bg-gray-50 rounded-xl p-3"><p className="text-xl font-black text-primary">{results.recommendedLevel}</p><p className="text-xs text-gray-500">Nivel</p></div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 animate-pulse"><span>⏳</span><span>Configurando tu ruta de aprendizaje...</span></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-dark px-5 sm:px-6 py-4">
        <div className="flex items-center justify-between text-white mb-2">
          <h3 className="font-bold">Prueba de nivelación</h3>
          <div className="flex items-center gap-3 text-sm">
            {saving && <span className="text-white/70 animate-pulse text-xs">💾 Guardando...</span>}
            {lastSaved && !saving && <span className="text-white/70 text-xs">💾 {new Date(lastSaved).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>}
            <span className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-semibold">{answeredCount}/{totalQuestions}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {['A1', 'A2', 'B1', 'B2'].map(level => {
            const levelQuestions = questions.filter(q => q.level === level)
            const firstIdx = questions.findIndex(q => q.level === level)
            const lvlAnswered = levelQuestions.filter(q => q.type === 'multiple' ? answers[q.id] !== undefined && answers[q.id] >= 0 : textAnswers[q.id] && textAnswers[q.id].trim() !== '').length
            const isCurrent = currentQ?.level === level
            return firstIdx >= 0 ? (
              <button key={level} onClick={() => jumpToQuestion(firstIdx)} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isCurrent ? 'bg-primary text-white shadow-sm' : lvlAnswered > 0 ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {level} <span className="opacity-70 ml-0.5">{lvlAnswered}/{levelQuestions.length}</span>
              </button>
            ) : null
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>{currentQ?.category || ''}</span>
          {currentQ?.section && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">{currentQ.section}</span>}
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-semibold ml-auto">Nivel {currentQ?.level} · {currentQ?.points || 1} {currentQ?.points === 1 ? 'pto' : 'pts'}</span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-5 leading-relaxed" style={{ letterSpacing: '-0.5px' }}>{currentQ?.question || ''}</h4>
        {currentQ?.type === 'multiple' ? (
          <div className="space-y-2.5 mb-6">
            {safeOptions.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(currentQ.id, index)} className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${answers[currentQ.id] === index ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'}`}>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs mr-3">{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
            {safeOptions.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No hay opciones disponibles</p>}
          </div>
        ) : (
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10">✍️</span>
              <input type="text" value={textAnswers[currentQ?.id] || ''} onChange={(e) => handleTextAnswer(currentQ?.id, e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm focus:border-primary/30 focus:bg-white transition-all outline-none" placeholder="Escribe tu respuesta..." />
            </div>
          </div>
        )}
        {isCurrentAnswered && <div className="flex items-center gap-2 text-xs text-green-600 mb-5 bg-green-50 px-4 py-2 rounded-xl"><span className="text-base">✅</span><span className="font-medium">Pregunta respondida</span></div>}
        <div className="flex gap-2 sm:gap-3">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Anterior</button>
          <button onClick={handleReset} className="px-3 sm:px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl text-sm transition-colors hover:text-red-500" title="Reiniciar test">🔄</button>
          <button onClick={handleSkip} className="px-3 sm:px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold transition-colors border border-amber-200" title="Omitir test">Omitir ⏭️</button>
          {isLastQuestion ? (
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50">{submitting ? 'Guardando...' : 'Finalizar prueba ✓'}</button>
          ) : (
            <button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm hover:shadow-md">Siguiente →</button>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">💾 El progreso se guarda al hacer clic en "Siguiente"</p>
      </div>
    </div>
  )
}