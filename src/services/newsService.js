import api from './api'

export const newsService = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  getFeatured: () => api.get('/news/featured'),
  recordView: (id) => api.post(`/news/${id}/view`),
  getStats: () => api.get('/news/stats'),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
}