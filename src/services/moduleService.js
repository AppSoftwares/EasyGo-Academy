// src/services/moduleService.js
import api from './api'

export const moduleService = {
  getModules: (level) => api.get(`/modules/${level}`),
  createModule: (data) => api.post('/modules', data),
  updateModule: (id, data) => api.put(`/modules/${id}`, data),
  deleteModule: (id) => api.delete(`/modules/${id}`),
  reorderModules: (level, orders) => api.post('/modules/reorder', { level, orders })
}