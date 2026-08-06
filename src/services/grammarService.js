// src/services/grammarService.js
import api from './api'

export const grammarService = {
  // Obtener todos los temas (para listado)
  getAll: (params) => api.get('/grammar', { params }),
  
  // Obtener tema completo por slug
  getBySlug: (slug) => api.get(`/grammar/slug/${slug}`),
  
  // Obtener solo las preguntas de un tema
  getQuestions: (slug, shuffle = false) => api.get(`/grammar/slug/${slug}/questions`, { params: { shuffle } }),
  
  // Obtener temas por nivel
  getByLevel: (level) => api.get(`/grammar/level/${level}`),
  
  // Obtener tema por unitId (para navegación)
  getByUnitId: (level, unitId) => api.get(`/grammar/unit/${level}/${unitId}`),
  
  // Obtener siguiente unidad
  getNextUnit: (level, currentUnitId) => api.get(`/grammar/next/${level}/${currentUnitId}`),
  
  // Obtener unidad anterior
  getPreviousUnit: (level, currentUnitId) => api.get(`/grammar/previous/${level}/${currentUnitId}`),
  
  // Obtener estadísticas (para admin)
  getStats: () => api.get('/grammar/stats'),
  
  // Admin: Crear tema
  create: (data) => api.post('/grammar', data),
  
  // Admin: Actualizar tema
  update: (id, data) => api.put(`/grammar/${id}`, data),
  
  // Admin: Eliminar tema (soft delete por defecto)
  delete: (id, soft = true) => api.delete(`/grammar/${id}`, { params: { soft } }),
}