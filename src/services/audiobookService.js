// src/services/audiobookService.js
import api from './api'

export const audiobookService = {
  // Obtener todos
  getAll: (params) => api.get('/audiobooks', { params }),
  
  // Obtener por ID (detalle)
  getById: (id) => api.get(`/audiobooks/${id}`),
  
  // Obtener por nivel
  getByLevel: (level) => api.get(`/audiobooks/level/${level}`),
  
  // 👇 NUEVO: Obtener progreso de escucha
  getProgress: (id) => api.get(`/audiobooks/${id}/progress`),
  
  // 👇 NUEVO: Actualizar progreso de escucha
  updateProgress: (id, data) => api.post(`/audiobooks/${id}/progress`, data),
  
  // Estadísticas
  getStats: () => api.get('/audiobooks/stats'),
  
  // Admin
  create: (data) => api.post('/audiobooks', data),
  update: (id, data) => api.put(`/audiobooks/${id}`, data),
  delete: (id) => api.delete(`/audiobooks/${id}`),
}