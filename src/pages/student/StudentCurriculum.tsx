// src/pages/student/StudentCurriculum.jsx
import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { curriculumService } from '../../services/curriculumService'
import { progressService } from '../../services/progressService'
import { useAuthStore } from '../../store/useAuthStore'

export const StudentCurriculum = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCurriculum()
    loadProgress()
  }, [])

  const loadCurriculum = async () => {
    try {
      const response = await curriculumService.getModules('A1')
      if (response.data.success) {
        setModules(response.data.modules)
      }
    } catch (error) {
      console.error("Error loading curriculum:", error)
      setModules([])
    }
  }

  const loadProgress = async () => {
    try {
      const res = await progressService.getMyProgress()
      if (res.data.success && res.data.progress) {
        const completedMap = {}
        
        // Extraer todas las unidades completadas del progreso existente
        Object.values(res.data.progress).forEach(levelData => {
          if (levelData.modules) {
            levelData.modules.forEach(module => {
              if (module.units) {
                module.units.forEach(unit => {
                  if (unit.completed) {
                    completedMap[unit.id] = {
                      completed: true,
                      score: unit.score,
                      completedAt: unit.completedAt
                    }
                  }
                })
              }
            })
          }
        })
        
        setUserProgress(completedMap)
      }
    } catch (err) {
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calcular progreso de un módulo
  const getModuleProgress = (moduleLessons) => {
    if (!moduleLessons || moduleLessons.length === 0) return 0
    const completedCount = moduleLessons.filter(lesson => userProgress[lesson.id]?.completed).length
    return Math.round((completedCount / moduleLessons.length) * 100)
  }

  // Verificar si una lección está bloqueada
  const isLessonLocked = (lessons, currentIndex) => {
    if (currentIndex === 0) return false
    const previousLesson = lessons[currentIndex - 1]
    return !userProgress[previousLesson.id]?.completed
  }

  const getLevelColor = (level) => {
    const colors = { 
      A1: 'bg-emerald-100 text-emerald-700', 
      A2: 'bg-blue-100 text-blue-700', 
      B1: 'bg-amber-100 text-amber-700', 
      B2: 'bg-orange-100 text-orange-700', 
      C1: 'bg-rose-100 text-rose-700' 
    }
    return colors[level] || 'bg-gray-100 text-gray-700'
  }

  const getLessonTypeIcon = (type) => {
    const icons = {
      explanation: '📖',
      exercise: '✏️',
      quiz: '📝',
      personalized_class: '🎓',
      evaluation: '📊'
    }
    return icons[type] || '📖'
  }

  // Calcular progreso total
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
  const completedLessons = Object.values(userProgress).filter(p => p.completed).length
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📚 Inglés Laboral - Nivel A1</h1>
          <p className="text-gray-500 text-sm mt-1">
            Aprende inglés para tu trabajo en Estados Unidos
          </p>
        </div>

        {/* Barra de progreso general */}
        {totalLessons > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso del curso</span>
              <span className="text-lg font-bold text-primary">{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }} 
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {completedLessons} de {totalLessons} lecciones completadas
            </p>
          </div>
        )}

        {/* Búsqueda */}
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar lección..."
            className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all outline-none" 
          />
        </div>

        {/* Módulos */}
        <div className="space-y-5">
          {modules.map((module, moduleIndex) => {
            const moduleProgress = getModuleProgress(module.lessons)
            const isModuleCompleted = moduleProgress === 100
            
            // Filtrar lecciones por búsqueda
            const filteredLessons = module.lessons?.filter(lesson =>
              lesson.title?.toLowerCase().includes(searchTerm.toLowerCase())
            ) || []
            
            if (filteredLessons.length === 0 && searchTerm) return null
            
            return (
              <div key={module.moduleId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header del módulo */}
                <div className={`px-5 py-4 border-b border-gray-100 ${
                  isModuleCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-gray-50 to-white'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{isModuleCompleted ? '🏆' : '📦'}</span>
                        <h2 className="text-lg font-bold text-gray-900">
                          Módulo {module.moduleId}: {module.title}
                        </h2>
                      </div>
                      <p className="text-sm text-gray-500">
                        {module.lessons?.filter(l => userProgress[l.id]?.completed).length || 0} de {module.lessons?.length || 0} lecciones
                      </p>
                    </div>
                    {isModuleCompleted && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        ✅ Completado
                      </span>
                    )}
                  </div>
                  
                  {/* Barra de progreso del módulo */}
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${moduleProgress}%` }} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Lista de lecciones */}
                <div className="divide-y divide-gray-100">
                  {filteredLessons.map((lesson, lessonIndex) => {
                    const isCompleted = userProgress[lesson.id]?.completed
                    const isLocked = isLessonLocked(module.lessons, lessonIndex)
                    const score = userProgress[lesson.id]?.score || 0
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && navigate(`/curriculum/lesson/${lesson.id}`)}
                        disabled={isLocked}
                        className={`w-full px-5 py-4 flex items-center justify-between transition-all ${
                          isCompleted 
                            ? 'bg-green-50/30 hover:bg-green-50' 
                            : isLocked 
                              ? 'bg-gray-50 opacity-60 cursor-not-allowed' 
                              : 'hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Estado visual */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isLocked
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-primary/10 text-primary'
                          }`}>
                            {isCompleted ? '✓' : lessonIndex + 1}
                          </div>
                          
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{getLessonTypeIcon(lesson.type)}</span>
                              <h3 className={`font-medium ${isCompleted ? 'text-gray-600' : 'text-gray-800'}`}>
                                {lesson.title}
                              </h3>
                            </div>
                            {lesson.description && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {score > 0 && (
                            <span className={`text-xs font-semibold ${score >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                              {score}%
                            </span>
                          )}
                          {isLocked ? (
                            <span className="text-gray-400 text-sm">🔒</span>
                          ) : isCompleted ? (
                            <span className="text-green-500 text-sm">✅</span>
                          ) : (
                            <span className="text-primary text-sm group-hover:translate-x-1 transition-transform">→</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <span className="text-5xl block mb-4">📚</span>
            <p className="text-gray-500 text-lg">No hay módulos disponibles</p>
            <p className="text-gray-400 text-sm mt-1">El contenido del curso se está preparando</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}