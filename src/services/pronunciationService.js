import api from './api'

export const pronunciationService = {
  getAll: (params) => api.get('/pronunciations', { params }),
  getById: (id) => api.get(`/pronunciations/${id}`),
  getDailyPractice: (level) => api.get('/pronunciations/daily-practice', { params: { level } }),
  recordPractice: (id) => api.post(`/pronunciations/${id}/practice`),
  getStats: () => api.get('/pronunciations/stats'),
  create: (data) => api.post('/pronunciations', data),
  update: (id, data) => api.put(`/pronunciations/${id}`, data),
  delete: (id) => api.delete(`/pronunciations/${id}`),
}