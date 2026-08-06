import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Logo } from '../components/ui/Logo'
import { WelcomeScreen } from '../components/auth/WelcomeScreen'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, user } = useAuthStore()
  
  // ============ USAR REFS PARA EVITAR PÉRDIDA EN MÓVIL ============
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [loginStep, setLoginStep] = useState('idle')
  const [loadingText, setLoadingText] = useState('')
  const [dots, setDots] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const [userName, setUserName] = useState('')
  const redirectTimerRef = useRef(null)

  // ============ PREVENIR PÉRDIDA DE FOCO EN MÓVIL ============
  useEffect(() => {
    // Mantener el foco en el input activo
    const handleResize = () => {
      if (focusedField === 'email' && emailRef.current) {
        // No hacer nada, solo prevenir pérdida
      }
      if (focusedField === 'password' && passwordRef.current) {
        // No hacer nada, solo prevenir pérdida
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [focusedField])

  // ============ MANEJAR CAMBIOS SIN PÉRDIDA ============
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  // Animación de puntos
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.')
      }, 400)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  const loadingMessages = [
    'Verificando tus credenciales',
    'Preparando tu espacio de aprendizaje',
    'Cargando tus lecciones pendientes',
    'Casi listo'
  ]

  useEffect(() => {
    if (isLoading) {
      let i = 0
      setLoadingText(loadingMessages[0])
      const interval = setInterval(() => {
        i++
        if (i < loadingMessages.length) {
          setLoadingText(loadingMessages[i])
        }
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current)
    }
  }, [])

  const handleRedirect = () => {
    setShowWelcome(false)
    setLoginStep('idle')
    
    const currentUser = useAuthStore.getState().user
    const needsTest = useAuthStore.getState().needsLevelTest
    
    if(currentUser.role === 'admin')
      navigate('/admin')
    else if(currentUser.role === 'teacher')
      navigate('/teacher')
    else
      navigate('/dashboard')
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (!email || !password) return

    setLoginStep('loading')
    
    try {
      const result = await login(email, password)
      
      if (result.success) {
        const currentUser = useAuthStore.getState().user
        setUserName(currentUser?.name?.split(' ')[0] || '')
        
        setTimeout(() => {
          setLoginStep('welcome')
          setShowWelcome(true)
        }, 800)
      } else {
        setLoginStep('error')
        setTimeout(() => setLoginStep('idle'), 2500)
      }
    } catch (err) {
      setLoginStep('error')
      setTimeout(() => setLoginStep('idle'), 2500)
    }
  }

  // ============ BIENVENIDA ============
  if (showWelcome && loginStep === 'welcome') {
    return <WelcomeScreen userName={userName} onFinish={handleRedirect} />
  }

  // ============ FORMULARIO ============
  return (
    <div className="min-h-screen bg-[#0a041e] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      
      {/* Frases decorativas */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[10%] left-[5%] text-3xl sm:text-4xl font-black text-white whitespace-nowrap">Aprender · Crecer · Lograr</div>
        <div className="absolute top-[30%] right-[5%] text-2xl sm:text-3xl font-black text-white whitespace-nowrap">Tu futuro empieza hoy</div>
        <div className="absolute bottom-[20%] left-[8%] text-2xl sm:text-3xl font-black text-white whitespace-nowrap">El inglés te abre puertas</div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <span className="text-[12rem] sm:text-[18rem] font-black text-white tracking-tighter select-none">INGLÉS</span>
      </div>

      {/* Contenido */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-500 ${
        loginStep === 'loading' ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'
      }`}>
        
        <div className={`text-center mb-8 transition-all duration-500 ${
          loginStep === 'loading' ? 'opacity-50' : 'opacity-100'
        }`}>
          <Link to="/" className="inline-flex flex-col items-center gap-4">
            <Logo scrolled={true} />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-6 mb-2 tracking-tight">
            Bienvenido{' '}
            <span className="bg-gradient-to-r from-primary-light via-accent to-gold bg-clip-text text-transparent">
              de nuevo
            </span>
          </h1>
          <p className="text-gray-400 text-sm">Continúa tu aprendizaje de inglés</p>
        </div>

        <div className="relative">
          <div className={`absolute -inset-[1px] rounded-3xl opacity-50 blur-sm transition-all duration-500 ${
            loginStep === 'error' 
              ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-400 opacity-70'
              : 'bg-gradient-to-r from-primary via-accent to-primary'
          }`} />
          
          <div className="relative bg-[#0f0729]/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden">
            
            <div className={`flex items-center justify-center gap-2 mb-6 transition-all duration-300 ${
              loginStep === 'loading' ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  loginStep === 'error' ? 'bg-red-400' : 'bg-green-400'
                }`} />
                <span className="text-xs text-gray-400 font-medium">
                  {loginStep === 'loading' ? 'Verificando...' : 'Tu progreso te está esperando'}
                </span>
              </div>
            </div>

            {error && loginStep === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-fade-in">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {loginStep === 'loading' && (
              <div className="absolute inset-0 bg-[#0f0729]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl animate-fade-in">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🔓</span>
                  </div>
                </div>
                <p className="text-white font-semibold text-base mb-1">{loadingText}{dots}</p>
                <p className="text-gray-400 text-xs">Esto tomará solo un momento</p>
              </div>
            )}

  {/*           <div className={`bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 transition-all duration-300 ${
              loginStep === 'loading' ? 'opacity-30' : 'opacity-100'
            }`}>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Credenciales de prueba</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">
                  <span className="text-gray-500">Admin:</span> admin@easygo.com / admin123
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-gray-500">Usuario:</span> maria@email.com / 123456
                </p>
              </div>
            </div> */}

            {/* ============ FORMULARIO - AHORA CON REFS ============ */}
            <form onSubmit={handleSubmit} className={`space-y-5 transition-all duration-300 ${
              loginStep === 'loading' ? 'opacity-30 pointer-events-none' : 'opacity-100'
            }`}>
              
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
                    <span className="pl-4 text-lg text-gray-500">✉️</span>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                      required
                    />
                    {email && <span className="pr-4 text-green-400 text-sm">✓</span>}
                  </div>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="relative flex items-center bg-[#0a041e] rounded-2xl border border-white/10 focus-within:border-primary/50 transition-all overflow-hidden">
                    <span className="pl-4 text-lg text-gray-500">🔒</span>
                    <input
                      ref={passwordRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-500 outline-none text-sm"
                      placeholder="••••••••"
                      autoComplete="current-password"
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
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-xs text-gray-500 hover:text-primary-light transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group mt-2"
              >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-70 group-hover:opacity-100 blur-sm transition-opacity" />
                <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/30">
                  <span>Iniciar sesión</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </form>

            <p className={`text-center text-gray-500 text-sm mt-6 transition-all duration-300 ${
              loginStep === 'loading' ? 'opacity-30' : 'opacity-100'
            }`}>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-light hover:text-accent font-semibold transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 px-4">
          "Cada experto fue alguna vez un principiante. Tu viaje con el inglés empieza aquí."
        </p>
      </div>
    </div>
  )
}