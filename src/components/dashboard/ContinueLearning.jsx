  import { useState, useEffect } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { progressService } from '../../services/progressService'
  import { useAuthStore } from '../../store/useAuthStore'
  import DEFAULT_IMAGE from '../../assets/images/image.png'

  export const ContinueLearning = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { loadNextLesson() }, [])

    const loadNextLesson = async () => {
      setLoading(true)
      try {
        const response = await progressService.getMyProgress()
        if (response.data.success && response.data.progress) {
          const progressData = response.data.progress
          const userLevel = user?.assignedLevel || user?.finalAssignedLevel || 'A1'
          const levelData = progressData[userLevel]
          
          if (levelData && levelData.modules && levelData.modules.length > 0) {
            const incompleteModule = levelData.modules.find(m => !m.completed)
            
            if (incompleteModule) {
              const nextUnit = incompleteModule.units.find(u => !u.completed)
              const moduleProgress = incompleteModule.totalUnits > 0 
                ? Math.round((incompleteModule.completedUnits / incompleteModule.totalUnits) * 100) 
                : 0
              
              if (nextUnit) {
                setLesson({
                  id: nextUnit.id,
                  title: nextUnit.title,
                  module: incompleteModule.title,
                  description: getUnitDescription(nextUnit.type),
                  progress: moduleProgress,
                  unitType: nextUnit.type,
                  level: userLevel,
                  completedUnits: incompleteModule.completedUnits,
                  totalUnits: incompleteModule.totalUnits,
                })
              } else {
                setLesson({
                  id: incompleteModule.id,
                  title: incompleteModule.title,
                  module: `Nivel ${userLevel}`,
                  description: '¡Módulo completado! 🎉',
                  progress: 100,
                  completed: true,
                  level: userLevel,
                })
              }
            } else {
              setLesson({
                id: 0,
                title: `Nivel ${userLevel}`,
                module: 'EasyGo Academy',
                description: '¡Todos los módulos completados! 🎉',
                progress: 100,
                completed: true,
                level: userLevel,
              })
            }
          } else {
            setLesson(getDefaultLesson())
          }
        } else {
          setLesson(getDefaultLesson())
        }
      } catch (err) {
        setLesson(getDefaultLesson())
      } finally {
        setLoading(false)
      }
    }

    const getDefaultLesson = () => {
      const userLevel = user?.assignedLevel || user?.finalAssignedLevel || 'A1'
      return {
        id: 1, title: 'Comienza tu primera lección', module: `Nivel ${userLevel}`,
        description: 'Aprende inglés desde cero con EasyGo Academy', progress: 0, level: userLevel,
      }
    }

    const getUnitDescription = (type) => {
      const d = { grammar: 'Practica reglas gramaticales', vocabulary: 'Aprende nuevas palabras', speaking: 'Practica conversación', listening: 'Mejora tu comprensión auditiva', reading: 'Lee y comprende textos', writing: 'Practica escritura en inglés', pronunciation: 'Mejora tu pronunciación' }
      return d[type] || 'Continúa tu aprendizaje'
    }

    const getUnitRoute = (type) => {
      const r = { grammar: '/grammar', vocabulary: '/dictionary', speaking: '/chat', listening: '/audiobooks', reading: '/news', writing: '/chat', pronunciation: '/pronunciation' }
      return r[type] || '/videos'
    }

    const handleContinue = () => {
      if (!lesson) return
      navigate('/progress')
    }

    if (loading) {
      return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="flex gap-4 mb-4">
            <div className="w-40 h-40 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 w-20 bg-gray-200 rounded"></div><div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div><div className="h-9 w-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full"></div>
        </div>
      )
    }

    if (!lesson) return null

    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <h4 className="font-bold text-gray-900 mb-4">{lesson.completed ? '✅ Completado' : 'Continuar aprendiendo'}</h4>
        <div className="flex gap-4 mb-4">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-blue-100">
            <img src={DEFAULT_IMAGE} alt={lesson.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="flex flex-col gap-1">
              <h6 className="text-gray-900 text-xs font-semibold">{lesson.completed ? 'Módulo' : 'Lección'} {lesson.id}</h6>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{lesson.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{lesson.module}</p>
              <p className="text-xs text-gray-400 mt-1 hidden sm:block">{lesson.description}</p>
            </div>
            <button onClick={handleContinue}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold transition-colors mt-2 ${lesson.completed ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-primary hover:bg-primary-dark text-white'}`}>
              {lesson.completed ? 'Ver resumen' : 'Continuar lección'}
            </button>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500 font-medium">Progreso del módulo</span>
            <span className="text-primary font-bold">{lesson.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${lesson.completed ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-accent'}`}
              style={{ width: `${lesson.progress}%` }} />
          </div>
          {lesson.totalUnits > 0 && (
            <p className="text-xs text-gray-400 mt-1">{lesson.completedUnits} de {lesson.totalUnits} unidades completadas</p>
          )}
        </div>
      </div>
    )
  }