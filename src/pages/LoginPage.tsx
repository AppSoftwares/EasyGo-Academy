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
                <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-primary-light transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
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

              {/* Social Logins */}
              <div className="space-y-4 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <span className="relative px-4 bg-[#0f0729] text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    O continuar con
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