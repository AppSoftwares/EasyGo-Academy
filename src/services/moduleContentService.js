// src/services/moduleContentService.js
import api from './api'

export const moduleContentService = {
  // Obtener contenido de un módulo
  getModuleContent: (moduleId) => api.get(`/module-content/module/${moduleId}`),
  
  // Obtener contenido disponible para agregar
  getAvailableContent: (moduleId, type, search = '') => {
    // La URL debe coincidir con la ruta del backend
    return api.get(`/module-content/module/${moduleId}/available/${type}`, {
      params: { search }
    })
  },
  
  // Agregar contenido a un módulo
  addContentToModule: (moduleId, data) => api.post(`/module-content/${moduleId}/add`, data),
  
  // Eliminar contenido de un módulo
  removeContent: (id) => api.delete(`/module-content/${id}`),
  
  // Reordenar contenido
  reorderContent: (moduleId, orders) => api.post(`/module-content/${moduleId}/reorder`, { orders })
}