import { useState, useEffect } from 'react'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'

export const AdminLevelTestsPage = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, reviewed

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(allUsers)
  }

  const filteredUsers = users.filter(u => {
    if (filter === 'pending') return u.levelTestCompleted && !u.levelTestReviewed
    if (filter === 'reviewed') return u.levelTestCompleted && u.levelTestReviewed
    if (filter === 'completed') return u.levelTestCompleted
    if (filter === 'not_completed') return !u.levelTestCompleted
    return true
  })

  const pendingCount = users.filter(u => u.levelTestCompleted && !u.levelTestReviewed).length

  const handleReviewTest = (user) => {
    setSelectedUser(user)
  }

  const handleApproveLevel = (userId, finalLevel, notes) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          levelTestReviewed: true,
          reviewedBy: 'Admin',
          reviewedDate: new Date().toISOString(),
          finalAssignedLevel: finalLevel,
          reviewNotes: notes || ''
        }
      }
      return u
    })

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    setSelectedUser(null)
    alert(`Nivel ${finalLevel} asignado al usuario exitosamente.`)
  }

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-blue-100 text-blue-700',
      'A2': 'bg-green-100 text-green-700',
      'B1': 'bg-yellow-100 text-yellow-700',
      'B2': 'bg-orange-100 text-orange-700',
      'C1': 'bg-purple-100 text-purple-700'
    }
    return colors[level] || 'bg-gray-100 text-gray-700'
  }

  const getCategoryName = (category) => {
    const names = {
      grammar: 'Gramatica',
      vocabulary: 'Vocabulario',
      listening: 'Comprension Auditiva',
      speaking: 'Expresion Oral',
      reading: 'Lectura',
      writing: 'Escritura'
    }
    return names[category] || category
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pruebas de Nivelacion</h2>
            <p className="text-sm text-gray-600 mt-1">
              Revisa y aprueba los resultados de las pruebas de nivelacion
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-accent text-white px-4 py-2 rounded-full font-semibold text-sm animate-pulse">
              {pendingCount} pendientes de revision
            </span>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'reviewed', label: 'Revisados' },
            { id: 'completed', label: 'Completaron prueba' },
            { id: 'not_completed', label: 'Sin prueba' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Usuario</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Prueba</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Nivel Recomendado</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Nivel Asignado</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Estado</th>
                  <th className="text-left p-4 font-semibold text-gray-600 text-sm">Accion</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm">
                          {user.name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                    <td className="p-4">
                      {user.levelTestCompleted ? (
                        <span className="text-green-600 text-sm">✅ Completada</span>
                      ) : (
                        <span className="text-gray-400 text-sm">❌ Sin prueba</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.levelTestResult?.recommendedLevel && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(user.levelTestResult.recommendedLevel)}`}>
                          {user.levelTestResult.recommendedLevel}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.finalAssignedLevel ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(user.finalAssignedLevel)}`}>
                          {user.finalAssignedLevel}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Pendiente</span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.levelTestReviewed ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Revisado ✓
                        </span>
                      ) : user.levelTestCompleted ? (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Pendiente revision
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">
                          Sin prueba
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.levelTestCompleted && !user.levelTestReviewed && (
                        <button
                          onClick={() => handleReviewTest(user)}
                          className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors"
                        >
                          Revisar
                        </button>
                      )}
                      {user.levelTestReviewed && (
                        <button
                          onClick={() => handleReviewTest(user)}
                          className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Ver detalle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de revision */}
        {selectedUser && selectedUser.levelTestResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Resultados de {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Prueba completada: {new Date(selectedUser.levelTestResult.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Resultados */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-black text-primary">
                    {selectedUser.levelTestResult.percentage}%
                  </p>
                  <p className="text-xs text-gray-600">Puntuacion</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-black text-accent">
                    {selectedUser.levelTestResult.earnedPoints}/{selectedUser.levelTestResult.totalPoints}
                  </p>
                  <p className="text-xs text-gray-600">Puntos</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className={`text-2xl font-black ${selectedUser.levelTestResult.recommendedLevel ? 'text-primary' : 'text-gray-400'}`}>
                    {selectedUser.levelTestResult.recommendedLevel || '-'}
                  </p>
                  <p className="text-xs text-gray-600">Nivel Recomendado</p>
                </div>
              </div>

              {/* Categorias */}
              {selectedUser.levelTestResult.categoryScores && (
                <div className="space-y-3 mb-6">
                  <h4 className="font-bold text-gray-900">Desglose por area:</h4>
                  {Object.entries(selectedUser.levelTestResult.categoryScores).map(([category, scores]) => (
                    <div key={category} className="flex items-center gap-3">
                      <span className="w-28 text-sm text-gray-700">{getCategoryName(category)}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            scores.total > 0 && (scores.earned / scores.total) >= 0.7
                              ? 'bg-green-500'
                              : scores.total > 0 && (scores.earned / scores.total) >= 0.4
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${scores.total > 0 ? (scores.earned / scores.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {scores.earned}/{scores.total}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Asignar nivel */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-gray-900 mb-4">
                  {selectedUser.levelTestReviewed ? 'Nivel Asignado' : 'Asignar Nivel Final'}
                </h4>

                {selectedUser.levelTestReviewed ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                    <p className="text-green-800">
                      <strong>Nivel asignado:</strong> {selectedUser.finalAssignedLevel}
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Revisado por: {selectedUser.reviewedBy} el {new Date(selectedUser.reviewedDate).toLocaleDateString()}
                    </p>
                    {selectedUser.reviewNotes && (
                      <p className="text-green-600 text-sm mt-1">
                        Notas: {selectedUser.reviewNotes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['A1', 'A2', 'B1', 'B2', 'C1'].map(level => (
                        <button
                          key={level}
                          onClick={() => {
                            const notes = prompt('Notas para el profesor (opcional):')
                            handleApproveLevel(selectedUser.id, level, notes)
                          }}
                          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${
                            level === selectedUser.levelTestResult?.recommendedLevel
                              ? 'bg-primary text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                          {level === selectedUser.levelTestResult?.recommendedLevel && ' (Recomendado)'}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Haz clic en un nivel para asignarlo al usuario.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}