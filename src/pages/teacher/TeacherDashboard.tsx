// src/pages/teacher/TeacherDashboard.jsx
import { useState, useEffect } from 'react'
import { TeacherLayout } from '../../components/teacher/TeacherLayout'
import { teacherService } from '../../services/teacherService'
import { useAuthStore } from '../../store/useAuthStore'
import { Link } from 'react-router-dom'

export const TeacherDashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentClasses, setRecentClasses] = useState([])
  const [recentStudents, setRecentStudents] = useState([])
  const [pendingAssignments, setPendingAssignments] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, classesRes, studentsRes, assignmentsRes] = await Promise.all([
        teacherService.getStats(),
        teacherService.getMyClasses(),
        teacherService.getMyStudents(),
        teacherService.getPendingAssignments()
      ])
      
      if (statsRes.data.success) setStats(statsRes.data.stats)
      if (classesRes.data.success) setRecentClasses(classesRes.data.classes?.slice(0, 3) || [])
      if (studentsRes.data.success) setRecentStudents(studentsRes.data.students?.slice(0, 5) || [])
      if (assignmentsRes.data.success) setPendingAssignments(assignmentsRes.data.assignments || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <TeacherLayout>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-900">¡Bienvenido, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-600 mt-1">Aquí está el resumen de tu actividad docente</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <span className="text-2xl font-bold text-primary">{stats?.totalStudents || 0}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Total Alumnos</h3>
            <p className="text-xs text-gray-400 mt-1">Activos en tu curso</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-2xl font-bold text-primary">{stats?.totalClasses || 0}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Clases Impartidas</h3>
            <p className="text-xs text-gray-400 mt-1">Este mes</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="text-2xl font-bold text-primary">{stats?.avgProgress || 0}%</span>
            </div>
            <h3 className="font-semibold text-gray-700">Progreso Promedio</h3>
            <p className="text-xs text-gray-400 mt-1">De tus alumnos</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <span className="text-2xl font-bold text-primary">{stats?.completionRate || 0}%</span>
            </div>
            <h3 className="font-semibold text-gray-700">Tasa de Completitud</h3>
            <p className="text-xs text-gray-400 mt-1">Lecciones finalizadas</p>
          </div>
        </div>

        {/* Grid de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Clases */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">📅 Próximas Clases</h2>
              <Link to="/teacher/classes" className="text-xs text-primary hover:underline">Ver todas →</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No hay clases programadas</div>
              ) : (
                recentClasses.map(cls => (
                  <div key={cls.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{cls.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          📅 {new Date(cls.date).toLocaleDateString('es-ES')} • ⏰ {cls.time}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">👥 {cls.currentStudents}/{cls.maxStudents} inscritos</p>
                      </div>
                      <Link to={`/teacher/classes/${cls.id}`} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                        Gestionar
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tareas Pendientes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">📝 Tareas Pendientes</h2>
              <Link to="/teacher/assignments" className="text-xs text-primary hover:underline">Ver todas →</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No hay tareas pendientes</div>
              ) : (
                pendingAssignments.map(assignment => (
                  <div key={assignment.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{assignment.title}</p>
                        <p className="text-xs text-gray-500 mt-1">📚 {assignment.course}</p>
                        <p className="text-xs text-orange-600 mt-1">⏰ Entrega: {new Date(assignment.dueDate).toLocaleDateString('es-ES')}</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold">
                        {assignment.submittedCount}/{assignment.totalStudents} entregadas
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alumnos Recientes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">👨‍🎓 Alumnos Recientes</h2>
            <Link to="/teacher/students" className="text-xs text-primary hover:underline">Ver todos →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Alumno</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Nivel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Progreso</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Último acceso</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                          {student.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{student.assignedLevel || 'A1'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${student.progress || 0}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-primary">{student.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{student.lastAccess || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/teacher/students/${student.id}`} className="text-primary text-sm">Ver →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherLayout>
  )
}