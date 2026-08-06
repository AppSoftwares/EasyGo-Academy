import api from './api'

export const questionService = {
  getForTest: () => api.get('/questions/test'),
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  bulkCreate: (questions) => api.post('/questions/bulk', { questions }),
  getStats: () => api.get('/questions/stats'),
}