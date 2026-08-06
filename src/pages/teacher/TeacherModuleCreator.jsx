// src/pages/teacher/TeacherModuleCreator.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { curriculumService } from '../../services/curriculumService'

export const TeacherModuleCreator = () => {
  const [level, setLevel] = useState('A1')
  const [moduleId, setModuleId] = useState(1)
  const [orderInModule, setOrderInModule] = useState(1)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [examples, setExamples] = useState('')
  const [lessonType, setLessonType] = useState('explanation')
  const [saving, setSaving] = useState(false)
  const [recentLessons, setRecentLessons] = useState([])

  useEffect(() => {
    loadRecentLessons()
  }, [])

  const loadRecentLessons = async () => {
    try {
      const res = await curriculumService.getModules(level)
      if (res.data.success) {
        setRecentLessons(res.data.modules)
      }
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const sections = [{
      title: title,
      content: content,
      examples: examples.split('\n').filter(e => e.trim())
    }]
    
    const data = {
      title,
      level,
      moduleId,
      orderInModule,
      lessonType,
      sections,
      active: true
    }
    
    try {
      await curriculumService.createLesson(data)
      alert('✅ Lección creada exitosamente')
      setTitle('')
      setContent('')
      setExamples('')
      setOrderInModule(orderInModule + 1)
      loadRecentLessons()
    } catch (error) {
      alert('❌ Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const getLevelColor = (lvl) => {
    const colors = {
      A1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      A2: 'bg-blue-100 text-blue-700 border-blue-200',
      B1: 'bg-amber-100 text-amber-700 border-amber-200',
      B2: 'bg-orange-100 text-orange-700 border-orange-200',
      C1: 'bg-rose-100 text-rose-700 border-rose-200'
    }
    return colors[lvl] || 'bg-gray-100 text-gray-700'
  }

  const getTypeIcon = (type) => {
    const icons = {
      explanation: '📖',
      exercise: '✏️',
      quiz: '📝',
      personalized_class: '🎓',
      evaluation: '📊'
    }
    return icons[type] || '📖'
  }

  return (
    <TeacherLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📚 Constructor de Currículo</h1>
            <p className="text-gray-500 text-sm">Crea módulos y lecciones para tus cursos</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              Nivel {level}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
              Módulo {moduleId}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ============ FORMULARIO DE CREACIÓN ============ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="text-xl">✨</span> Crear Nueva Lección
              </h2>
              <p className="text-sm text-gray-500">Completa los campos para agregar una lección al curso</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Fila 1: Nivel y Módulo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <span>🎯</span> Nivel
                  </label>
                  <select 
                    value={level} 
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
                  >
                    <option value="A1">🌟 A1 - Principiante</option>
                    <option value="A2">📘 A2 - Básico</option>
                    <option value="B1">📗 B1 - Intermedio</option>
                    <option value="B2">📙 B2 - Avanzado</option>
                    <option value="C1">📕 C1 - Competente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <span>📦</span> Módulo
                  </label>
                  <input 
                    type="number" 
                    value={moduleId} 
                    onChange={(e) => setModuleId(parseInt(e.target.value))}
                    min="1"
                    max="20"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Número del módulo (1, 2, 3...)</p>
                </div>
              </div>
              
              {/* Fila 2: Orden y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <span>🔢</span> Orden en módulo
                  </label>
                  <input 
                    type="number" 
                    value={orderInModule} 
                    onChange={(e) => setOrderInModule(parseInt(e.target.value))}
                    min="1"
                    max="50"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Ej: 1 = Lección 1, 2 = Lección 2...</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <span>📌</span> Tipo de lección
                  </label>
                  <select 
                    value={lessonType} 
                    onChange={(e) => setLessonType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
                  >
                    <option value="explanation">📖 Explicación</option>
                    <option value="exercise">✏️ Ejercicio</option>
                    <option value="quiz">📝 Quiz</option>
                    <option value="personalized_class">🎓 Clase Personalizada</option>
                    <option value="evaluation">📊 Evaluación</option>
                  </select>
                </div>
              </div>
              
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <span>📝</span> Título de la lección
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Greetings by the Hour"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
                  required
                />
              </div>
              
              {/* Contenido */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <span>📄</span> Contenido de la lección
                </label>
                <textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  placeholder="Explicación detallada del tema..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition resize-none"
                  required
                />
              </div>
              
              {/* Ejemplos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <span>💡</span> Ejemplos (uno por línea)
                </label>
                <textarea 
                  value={examples} 
                  onChange={(e) => setExamples(e.target.value)}
                  rows={3}
                  placeholder="Good morning&#10;Good afternoon&#10;Good evening"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition resize-none"
                />
              </div>
              
              {/* Vista previa */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Vista previa</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getLevelColor(level)}`}>
                    {level}
                  </span>
                  <span className="text-xs text-gray-400">Módulo {moduleId}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">Lección {orderInModule}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{getTypeIcon(lessonType)} {lessonType}</span>
                </div>
                <p className="font-semibold text-gray-800 mt-2">{title || "(Título)"}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{content || "(Contenido)"}</p>
              </div>
              
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>✨ Crear Lección</>
                )}
              </button>
            </form>
          </div>
          
          {/* ============ LISTA DE LECCIONES EXISTENTES ============ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="text-xl">📋</span> Lecciones Creadas
              </h2>
              <p className="text-sm text-gray-500">Módulos y lecciones de nivel {level}</p>
            </div>
            
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {recentLessons.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-5xl block mb-3">📭</span>
                  <p className="text-gray-500">No hay lecciones creadas aún</p>
                  <p className="text-sm text-gray-400">Usa el formulario para crear tu primera lección</p>
                </div>
              ) : (
                recentLessons.map(module => (
                  <div key={module.moduleId} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className={`px-4 py-2 ${module.moduleId % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📦</span>
                          <h3 className="font-bold text-gray-800">Módulo {module.moduleId}</h3>
                          <span className="text-xs text-gray-400">
                            {module.completedLessons}/{module.totalLessons} lecciones
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(module.completedLessons / module.totalLessons) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {module.lessons.map(lesson => (
                        <div key={lesson.id} className="px-4 py-2 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400 w-6">{lesson.order}</span>
                            <span className="text-base">{getTypeIcon(lesson.type)}</span>
                            <span className="text-sm text-gray-800">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.completed && (
                              <span className="text-xs text-green-600">✓</span>
                            )}
                            <button className="text-primary text-sm">✏️</button>
                            <button className="text-red-400 text-sm">🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  )
}