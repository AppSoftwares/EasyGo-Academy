// src/components/dashboard/TutorIA.jsx
import { useNavigate } from 'react-router-dom'

export const TutorIA = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 shadow-sm border border-primary/10 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Tutor IA EasyGo</h3>
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-green-600 font-semibold">En línea</span>
      </div>
      <button
        onClick={() => navigate('/chat')}
        className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
      >
        Chatear ahora →
      </button>
    </div>
  )
}