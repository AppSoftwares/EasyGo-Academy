import api from './api'

export const listeningProgressService = {
  getProgress: (audiobookId) => api.get(`/listening-progress/${audiobookId}`),
  saveProgress: (audiobookId, data) => api.post(`/listening-progress/${audiobookId}`, data),
}