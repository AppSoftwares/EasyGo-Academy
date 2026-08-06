import api from './api'

export const testProgressService = {
  getProgress: () => api.get('/test-progress'),
  saveProgress: (data) => api.post('/test-progress/save', data),
  completeTest: (data) => api.post('/test-progress/complete', data),
  resetTest: () => api.delete('/test-progress/reset'),
}