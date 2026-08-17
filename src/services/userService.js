import api from './api'

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  saveLevelTest: (data) => api.post('/users/level-test', data),
  getLevelTests: (params) => api.get('/users/level-tests', { params }),
  reviewLevelTest: (userId, data) => api.put(`/users/level-test/${userId}/review`, data),
  getStats: () => api.get('/users/stats'),
  getCurriculumSnapshot: () => api.get('/progress/snapshot'),
}