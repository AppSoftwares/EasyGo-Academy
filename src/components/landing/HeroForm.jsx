import { useState } from 'react'
import { CheckCircle2, ChevronRight, MessageSquare, Target, User } from 'lucide-react'
import axios from 'axios'

// Detectar IP automáticamente para evitar ERR_CONNECTION_REFUSED en red local
const getBackendUrl = () => {
  const { hostname } = window.location;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3001/api`;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};

const API_URL = getBackendUrl();

export const HeroForm = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    level: 'beginner'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => setStep(step + 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${API_URL}/leads`, {
        ...formData,
        source: 'landing_hero'
      })

      setSuccess(true)
    } catch (error) {
      console.error('Error enviando lead:', error)
      alert('Hubo un error al registrar tus datos. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black text-white mb-4">¡Registro Exitoso!</h3>
        <p className="text-gray-300 mb-8">
          Un asesor académico se pondrá en contacto contigo pronto para iniciar tu proceso.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-primary-light font-bold hover:underline"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-accent' : s < step ? 'w-4 bg-primary-light' : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paso {step} de 3</span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Comencemos por lo básico</h3>
                <p className="text-gray-400 text-sm">¿Cómo te llamas y dónde te escribimos?</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0a041e]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0a041e]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.name || !formData.email}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent/20 transition-all"
              >
                Siguiente Paso
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Sobre tu inglés</h3>
                <p className="text-gray-400 text-sm">¿Cuál es tu nivel actual?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'beginner', label: 'Principiante', desc: 'Sé muy poco o nada' },
                  { id: 'intermediate', label: 'Intermedio', desc: 'Entiendo pero me cuesta hablar' },
                  { id: 'advanced', label: 'Avanzado', desc: 'Busco perfeccionar para negocios' }
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, level: level.id })}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      formData.level === level.id
                        ? 'bg-primary/20 border-primary text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <p className="font-bold text-sm">{level.label}</p>
                    <p className="text-xs opacity-60">{level.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[2] bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group/btn hover:shadow-lg hover:shadow-accent/20 transition-all"
                >
                  Casi listo
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">Último paso</h3>
                <p className="text-gray-400 text-sm">¿Cuál es tu meta principal con el inglés?</p>
              </div>

              <div className="space-y-4">
                <textarea
                  name="goal"
                  placeholder="Ej: Quiero trabajar en una empresa de tecnología en USA..."
                  value={formData.goal}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-[#0a041e]/50 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none"
                />

                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary-light" />
                  </div>
                  <p className="text-xs text-gray-400">
                    Al enviar, recibirás una invitación para una clase demostrativa gratuita con nuestra IA.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group/btn hover:shadow-lg hover:shadow-accent/20 transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Empezar Gratis'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
