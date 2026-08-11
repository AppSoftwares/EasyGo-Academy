import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export const RegisterForm = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (formData.name.trim().length < 2) return 'Ingresa tu nombre completo'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido'
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    if (formData.password !== confirmPassword) return 'Las contraseñas no coinciden'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setLocalError('')

    const validationError = validate()
    if (validationError) {
      setLocalError(validationError)
      return
    }

    const result = await register(formData)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setLocalError(result.error || 'Error al registrar')
    }
  }

  const displayError = localError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {displayError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm flex flex-col gap-1">
          <div className="flex items-center gap-3 font-bold">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <span>Error al registrar</span>
          </div>
          <p className="ml-8 text-[11px] opacity-70">{displayError}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Nombre completo
        </label>
        <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
          <span className="pl-4 text-lg text-gray-500">👤</span>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
            placeholder="Tu nombre completo"
            autoComplete="name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Correo electrónico
        </label>
        <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
          <span className="pl-4 text-lg text-gray-500">✉️</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
            placeholder="tu@correo.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Teléfono (opcional)
        </label>
        <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
          <span className="pl-4 text-lg text-gray-500">📱</span>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Contraseña
        </label>
        <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
          <span className="pl-4 text-lg text-gray-500">🔒</span>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
          Confirmar contraseña
        </label>
        <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
          <span className="pl-4 text-lg text-gray-500">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="relative w-full group mt-2"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-70 group-hover:opacity-100 blur-sm transition-opacity" />
        <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/30">
          <span>{isLoading ? 'Creando cuenta...' : 'Crear cuenta'}</span>
          {!isLoading && <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>}
        </div>
      </button>

      {/* Social Logins */}
      <div className="space-y-4 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-4 bg-[#0f0729] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            O regístrate con
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all shadow-sm active:scale-95 border border-gray-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-3 bg-black text-white py-3 rounded-2xl font-bold text-sm hover:bg-zinc-900 transition-all border border-white/10 active:scale-95">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05 1.61-3.11 1.61-1.21 0-1.62-.73-3.13-.73-1.49 0-2.03.71-3.11.73-.97.02-2.18-.75-3.32-2.26-2.16-2.83-2.48-7.39-1.03-9.52 1.07-1.57 2.65-2.46 4.09-2.46 1.14 0 2.13.63 2.92.63.74 0 2.05-.77 3.39-.63 1.34.14 2.45.74 3.19 1.83-2.69 1.54-2.25 5.39.51 6.8-.75 1.83-1.68 3.51-2.4 4.51zM14.03 3.23c.6-1.56-.25-3.11-.25-3.11.83.07 2.37.66 2.82 2.58.11.47-.11 1.25-.43 1.82-1.07 1.93-2.66 1.86-2.66 1.86.08-1.59.52-3.15.52-3.15z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-light hover:text-accent font-semibold transition-colors">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
