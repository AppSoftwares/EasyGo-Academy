import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          const { token, user } = response.data;

          await AsyncStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return { success: true };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          set({ error: message, isLoading: false, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { token, user } = response.data;

          await AsyncStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return { success: true };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al registrar';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.forgotPassword(email);
          set({ isLoading: false });
          return { success: true, message: response.data.message };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Error al procesar solicitud';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {}
        await AsyncStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
