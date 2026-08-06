// src/services/communityService.js
import api from './api'

export const communityService = {
  // Obtener posts recientes
  getRecentPosts: () => api.get('/community/posts/recent'),
  
  // Crear un post
  createPost: (data) => api.post('/community/posts', data),
  
  // Dar like a un post
  likePost: (postId) => api.post(`/community/posts/${postId}/like`),
  
  // Comentar un post
  commentPost: (postId, comment) => api.post(`/community/posts/${postId}/comment`, { comment }),
}