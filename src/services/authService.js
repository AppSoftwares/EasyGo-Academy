import api from './api'

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },
  
  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email })
  },
  
  getProfile: () => {
    return api.get('/auth/profile')
  },
  
  logout: () => {
    return api.post('/auth/logout')
  }
}