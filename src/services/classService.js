import api from './api'

export const classService = {
  // Obtener próximas clases disponibles
  getUpcoming: () => {
    return api.get('/classes/upcoming')
  },

  // Obtener mis clases inscritas
  getMyClasses: () => {
    return api.get('/classes/my-classes')
  },

  // Inscribirse a una clase
  enroll: (classId) => {
    return api.post(`/classes/${classId}/enroll`)
  },

  // Cancelar inscripción
  unenroll: (classId) => {
    return api.delete(`/classes/${classId}/unenroll`)
  },

  // Admin: Obtener todas las clases
  getAll: () => {
    return api.get('/classes')
  },

  // Admin: Crear clase
  create: (data) => {
    return api.post('/classes', data)
  },

  // Admin: Actualizar clase
  update: (id, data) => {
    return api.put(`/classes/${id}`, data)
  },

  // Admin: Eliminar clase
  delete: (id) => {
    return api.delete(`/classes/${id}`)
  },
}