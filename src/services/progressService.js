import api from './api'

export const progressService = {
  getMyProgress: (activeLevel) => api.get(`/progress/my-progress/${activeLevel}`),
  getStats: () => api.get('/progress/stats'),
  updateProgress: (data) => api.post('/progress/update', data),
  completeUnit: (unitId, data) => api.put(`/progress/complete/${unitId}`, data),
  initLevel: (level) => api.post('/progress/init-level', { level }),
  getRanking: () => api.get('/progress/ranking'),
}