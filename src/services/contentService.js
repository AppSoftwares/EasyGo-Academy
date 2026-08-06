// src/services/contentService.js
import api from './api'

export const contentService = {
  // Obtener todos los recursos disponibles
  getAll: (params) => api.get('/content', { params }),
  
  // Obtener un recurso por ID
  getById: (id) => api.get(`/content/${id}`),
  
  // Registrar vista de recurso
  recordView: (id) => api.post(`/content/${id}/view`),
  
  // Registrar descarga de recurso
  recordDownload: (id) => api.post(`/content/${id}/download`),
  
  // Obtener recursos por nivel
  getByLevel: (level) => api.get(`/content/level/${level}`),
  
  // Obtener recursos por tipo
  getByType: (type) => api.get(`/content/type/${type}`),

  getPublicContent: () => api.get('/content/public'),
  
  // Buscar contenido
  searchContent: (query) => api.get(`/content/search?q=${query}`),
}