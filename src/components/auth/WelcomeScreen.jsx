import { useState, useEffect, useRef } from 'react'
import { Logo } from '../ui/Logo'

export const WelcomeScreen = ({ userName, onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [direction, setDirection] = useState('left')
  const timerRef = useRef(null)

  const slides = [
    {
      emoji: '👋',
      title: `¡Qué gusto verte${userName ? `, ${userName}` : ''}!`,
      subtitle: 'Gracias por ser parte de EasyGo Academy',
      color: 'from-primary to-accent',
      bgEmoji: '💜',
    },
    {
      emoji: '📈',
      title: 'Cada día estás más cerca',
      subtitle: 'La constancia es la clave del éxito',
      color: 'from-accent to-gold',
      bgEmoji: '🎯',
    },
    {
      emoji: '💪',
      title: 'El esfuerzo de hoy',
      subtitle: 'Es el éxito de mañana. Estamos orgullosos de ti.',
      color: 'from-gold via-orange-400 to-accent',
      bgEmoji: '⭐',
    },
    {
      emoji: '🚀',
      title: '¡Vamos por más!',
      subtitle: 'Preparando tu espacio de aprendizaje...',
      color: 'from-primary via-primary-light to-accent',
      bgEmoji: '🔥',
    },
  ]

  // Auto-avanzar cada 2 segundos
  useEffect(() => {
    if (currentSlide < slides.length - 1) {
      timerRef.current = setTimeout(() => {
        goToNext()
      }, 2000)
    } else {
      // Último slide: esperar 2.5 segundos y llamar onFinish
      timerRef.current = setTimeout(() => {
        onFinish()
      }, 2500)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentSlide])

  const goToNext = () => {
    setDirection('left')
    setIsExiting(true)
    
    setTimeout(() => {
      setCurrentSlide(prev => prev + 1)
      setIsExiting(false)
    }, 400) // Duración de la animación de salida
  }

  const goToPrev = () => {
    if (currentSlide > 0) {
      setDirection('right')
      setIsExiting(true)
      
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1)
        setIsExiting(false)
      }, 400)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-[#0a041e] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Emoji gigante de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <span className="text-[20rem] sm:text-[25rem] select-none">{slide.bgEmoji}</span>
      </div>

      {/* Confeti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🎉', '⭐', '🌟', '✨', '💫', '🎊', '🏆', '💯', '🎯', '🔥', '💡', '🌈'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-lg sm:text-xl md:text-2xl animate-float-slow"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 5}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center w-full max-w-lg px-4">
        
        {/* Logo */}
        <div className="mb-8">
          <Logo scrolled={true} />
        </div>

        {/* Carrusel */}
        <div className="relative overflow-hidden min-h-[280px] sm:min-h-[300px] flex items-center">
          
          {/* Slide actual */}
          <div
            key={currentSlide}
            className={`w-full transition-all duration-400 ease-out ${
              isExiting
                ? direction === 'left'
                  ? 'opacity-0 -translate-x-full scale-90'
                  : 'opacity-0 translate-x-full scale-90'
                : 'opacity-100 translate-x-0 scale-100 animate-slide-in'
            }`}
          >
            {/* Emoji */}
            <div className={`inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${slide.color} shadow-2xl mb-6`}>
              <span className="text-5xl sm:text-6xl">{slide.emoji}</span>
            </div>

            {/* Título */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
              {slide.title}
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              {slide.subtitle}
            </p>
          </div>
        </div>

        {/* Indicadores de progreso */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index !== currentSlide) {
                  setDirection(index > currentSlide ? 'left' : 'right')
                  setIsExiting(true)
                  setTimeout(() => {
                    setCurrentSlide(index)
                    setIsExiting(false)
                  }, 400)
                }
              }}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2.5 bg-gradient-to-r from-primary to-accent'
                  : index < currentSlide
                    ? 'w-2.5 h-2.5 bg-primary/60'
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Contador de slides */}
        <p className="text-gray-600 text-xs mt-4">
          {currentSlide + 1} de {slides.length}
        </p>

        {/* Botones de navegación */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={goToPrev}
            disabled={currentSlide === 0}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ←
          </button>

          <button
            onClick={onFinish}
            className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
          >
            Omitir bienvenida
          </button>

          <button
            onClick={goToNext}
            disabled={currentSlide === slides.length - 1}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>

        {/* Barra de progreso inferior */}
        <div className="w-full max-w-xs mx-auto mt-6">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-80vh) rotate(180deg); opacity: 0; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(30px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-float-slow { animation: float-slow linear infinite; }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
        .duration-400 { transition-duration: 400ms; }
      `}</style>
    </div>
  )
}