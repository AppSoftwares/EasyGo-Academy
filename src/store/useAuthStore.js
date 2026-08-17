import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      needsLevelTest: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.login(email, password)
          const { token, user } = response.data
          
          // Guardar token y usuario
          localStorage.setItem('token', token)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsLevelTest: user.needsLevelTest || false,
            error: null
          })
          
          return { 
            success: true, 
            needsLevelTest: user.needsLevelTest || false 
          }
        } catch (error) {
          console.error('Error en login:', error);
          const message = error.response?.data?.message
            || (error.code === 'ERR_NETWORK'
                  ? 'No se pudo conectar con el servidor (revisa tu conexión o CORS).'
                  : 'Error al iniciar sesión')
          set({ 
            error: message, 
            isLoading: false,
            isAuthenticated: false 
          })
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await authService.register(userData)
          const { token, user } = response.data
          
          localStorage.setItem('token', token)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsLevelTest: true,
            error: null
          })
          
          return { success: true, needsLevelTest: true }
        } catch (error) {
          console.error('Error en registro:', error);
          const message = error.response?.data?.message ||
                         (error.response?.data?.errors ? error.response.data.errors[0].msg : null) ||
                         (error.code === 'ERR_NETWORK'
                           ? 'No se pudo conectar con el servidor (revisa tu conexión o CORS).'
                           : 'Error al registrar');
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      loginWithGoogle: async (idToken) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.googleLogin(idToken)
          const { token, user } = response.data
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsLevelTest: user.needsLevelTest || false,
          })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Error con Google Login'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      loginWithApple: async (idToken, appleUser) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.appleLogin(idToken, appleUser)
          const { token, user } = response.data
          localStorage.setItem('token', token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            needsLevelTest: user.needsLevelTest || false,
          })
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Error con Apple Login'
          set({ error: message, isLoading: false })
          return { success: false, error: message }
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null })
        try {
          await authService.forgotPassword(email)
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: true } // Mock success
        }
      },

      saveLevelTestResult: async (result) => {
        try {
          const { userService } = await import('../services/userService')
          await userService.saveLevelTest(result)
          
          set(state => ({
            user: {
              ...state.user,
              levelTestCompleted: true,
              levelTestResult: result,
              assignedLevel: result.recommendedLevel
            },
            needsLevelTest: false
          }))
        } catch (error) {
          console.error('Error al guardar prueba:', error)
          // Aún así actualizar localmente
          set(state => ({
            user: {
              ...state.user,
              levelTestCompleted: true,
              levelTestResult: result,
              assignedLevel: result.recommendedLevel
            },
            needsLevelTest: false
          }))
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (e) {
          // continuar con el logout local aunque falle la llamada al backend
        }
        localStorage.removeItem('token')
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false,
          needsLevelTest: false
        })
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        needsLevelTest: state.needsLevelTest,
      }),
    }
  )
)