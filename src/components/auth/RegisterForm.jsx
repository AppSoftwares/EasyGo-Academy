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
      setError(result.error || 'Error al registrar')
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

      <p className="text-center text-gray-500 text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary-light hover:text-accent font-semibold transition-colors">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
