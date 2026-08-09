import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Sun, Moon, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppearancePage = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
        <h1 className="text-2xl font-black text-[var(--text-color)]">Apariencia y Tema</h1>
      </div>

      {/* Toggle Card */}
      <div className="glass rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[var(--text-color)]">Modo Oscuro</h3>
            <p className="text-sm text-gray-500">Ajusta la apariencia del sistema</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Previews */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => isDarkMode && toggleTheme()}
            className={`relative p-4 rounded-2xl border-2 transition-all space-y-4 ${!isDarkMode ? 'border-primary bg-white' : 'border-transparent bg-white/5'}`}
          >
            <div className="space-y-2">
              <div className="h-2 w-12 bg-gray-200 rounded" />
              <div className="h-2 w-20 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Sun className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Modo Claro</span>
            </div>
            {!isDarkMode && (
              <div className="absolute top-2 right-2 bg-primary text-white p-0.5 rounded-full">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>

          <button
            onClick={() => !isDarkMode && toggleTheme()}
            className={`relative p-4 rounded-2xl border-2 transition-all space-y-4 ${isDarkMode ? 'border-primary bg-[#0f0729]' : 'border-transparent bg-black/20'}`}
          >
            <div className="space-y-2">
              <div className="h-2 w-12 bg-white/20 rounded" />
              <div className="h-2 w-20 bg-white/10 rounded" />
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Moon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Modo Oscuro</span>
            </div>
            {isDarkMode && (
              <div className="absolute top-2 right-2 bg-primary text-white p-0.5 rounded-full">
                <Check className="w-3 h-3" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
