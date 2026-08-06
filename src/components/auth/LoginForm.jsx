import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useAuthStore } from '../../store/useAuthStore'

export const LoginForm = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'El email es requerido'
    if (!formData.password) newErrors.password = 'La contrasena es requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (!validate()) return

    const result = await login(formData.email, formData.password)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-primary to-primary-dark flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full animate-morphing" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full animate-morphing" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-primary shadow-xl animate-float">
              EG
            </div>
            <span className="text-3xl font-black text-white">EasyGo Academy</span>
          </Link>
        </div>

        <div className="bg-white backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-white/50">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-gray-900">Iniciar Sesion</h2>
            <p className="text-gray-600 mt-2">Bienvenido de vuelta a EasyGo Academy</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon="✉️"
              type="email"
              placeholder="Correo electronico"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={errors.email}
            />

            <Input
              icon="🔒"
              type="password"
              placeholder="Contrasena"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              error={errors.password}
            />

            <div className="flex justify-end">
              <a href="#" className="text-sm text-primary hover:text-accent font-semibold transition-colors">
                Olvidaste tu contrasena?
              </a>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
              INICIAR SESION
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              No tienes cuenta?{' '}
              <Link to="/" className="text-primary font-bold hover:text-accent transition-colors">
                Registrate gratis
              </Link>
            </p>
          </div>

          {/* <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500 mb-4">O inicia sesion con</p>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                <span>G</span> Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                <span>f</span> Facebook
              </button>
            </div>
          </div> */}
        </div>

        <p className="text-center text-white/70 mt-8 text-sm">
          Al iniciar sesion, aceptas nuestros{' '}
          <a href="#" className="text-white underline">Terminos de Servicio</a>
          {' '}y{' '}
          <a href="#" className="text-white underline">Politica de Privacidad</a>
        </p>
      </div>
    </div>
  )
}