import api from './api'

export const rankingService = {
  getWeekly: (params) => api.get('/ranking/weekly', { params }),
  getMyPosition: () => api.get('/ranking/my-position'),
  updatePoints: (data) => api.post('/ranking/update', data),
  getStats: () => api.get('/ranking/stats'),
}