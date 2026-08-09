import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'

export const HeroContent = ({ onOpenForm }) => {
  const ptoMagnetico = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // ---- TIMELINE NEXUS CON CORTE DE MÁSCARA ----
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, delay: 0.2 })

      tl.fromTo(
        '.nexus-target',
        { '--clip-progress': '0%' },
        {
          '--clip-progress': '100%',
          duration: 2.3,
          ease: 'power3.inOut',
        }
      )
      .to('.nexus-target', { opacity: 1, duration: 0.8 })
      .to('.nexus-target', {
        '--clip-progress': '0%',
        duration: 1.8,
        ease: 'power3.inOut',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e) => {
    const boundBox = ptoMagnetico.current.getBoundingClientRect()
    const relX = e.clientX - boundBox.left - boundBox.width / 2
    const relY = e.clientY - boundBox.top - boundBox.height / 2

    gsap.to(ptoMagnetico.current, {
      x: relX * 0.35,
      y: relY * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = () => {
    gsap.to(ptoMagnetico.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)'
    })
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full px-4 sm:px-8 overflow-hidden">
      {/* Tipografía Fluida con Clamp Avanzado para blindaje total */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap');

        .font-nexus {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.04em;
          width: 100%;
          max-width: 100%;
        }

        /* Tipografía responsiva fluida basada en el viewport */
        .fluid-title-1 {
          font-size: clamp(2rem, 5.5vw, 5.2rem);
        }
        .fluid-title-2 {
          font-size: clamp(1.6rem, 4.2vw, 4.2rem);
        }
        .fluid-title-3 {
          font-size: clamp(1.8rem, 4.8vw, 4.6rem);
        }

        /* Alineación milimétrica por Hardware */
        .nexus-grid-container {
          display: inline-grid;
          grid-template-columns: 1fr;
          align-items: center;
          justify-items: center;
          position: relative;
          max-width: 100%;
        }

        .nexus-base, .nexus-target {
          grid-area: 1 / 1;
        }

        .nexus-target {
          pointer-events: none;
          user-select: none;
          clip-path: polygon(0% 0%, var(--clip-progress) 0%, var(--clip-progress) 100%, 0% 100%);
          will-change: clip-path;
        }
      `}</style>

      {/* Badge Superior */}
      <span className="gsap-fade-in opacity-0 transform translate-y-4 inline-block bg-white/5 backdrop-blur-md text-white/80 font-medium text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-full mb-8 border border-white/10 shadow-sm">
        Aprende inglés · Crece profesionalmente
      </span>
      
      {/* Título Monumental - Adaptativo y Elástico */}
      <h1 className="font-nexus leading-[1.15] mb-8 text-center select-none flex flex-col items-center justify-center">
        
        {/* Línea 1 */}
        <span className="block overflow-hidden py-1 w-full text-center">
          <span className="title-reveal-line fluid-title-1 opacity-0 transform translate-y-full block text-white">
            EL INGLÉS
          </span>
        </span>
        
        {/* Línea 2 */}
        <span className="block overflow-hidden py-1 w-full text-center">
          <span className="title-reveal-line fluid-title-2 opacity-0 transform translate-y-full block  bg-gradient-to-r to-white via-white from-[#ff5a36] text-transparent bg-clip-text tracking-normal my-0.5">
            NO SE ESTUDIA.
          </span>
        </span>
        
        {/* Línea 3: Grid Elástico Anti-Recortes */}
        <span className="block overflow-hidden py-2 w-full text-center justify-center">
          <span className="title-reveal-line opacity-0 transform translate-y-full block max-w-full">
            <span className="nexus-grid-container fluid-title-3">
              
              {/* Capa Base Estática */}
              <span className="nexus-base text-white/15">
                EL INGLÉS SE VIVE.
              </span>

              {/* Capa de Barrido Activa */}
              <span className="nexus-target bg-gradient-to-r from-white via-white to-[#ff5a36] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(255,255,255,0.2)]">
                EL INGLÉS SE VIVE.
              </span>

            </span>
          </span>
        </span>
      </h1>
      
      {/* Descripción */}
      <p className="gsap-fade-in opacity-0 transform translate-y-4 text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl font-normal balance-text text-center">
        El programa diseñado para hispanos que necesitan inglés real para trabajar y vivir en Estados Unidos.
      </p>
      
      {/* Pills de Beneficios */}
      <div className="gsap-fade-in opacity-0 transform translate-y-4 flex flex-wrap gap-3 mb-14 justify-center max-w-3xl">
        {[
          { icon: '🌍', text: 'Profesores nativos' },
          { icon: '⏰', text: 'Clases 24/7' },
          { icon: '🤖', text: 'EasyGo AI Tutor' }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2.5 bg-white/[0.02] backdrop-blur-md px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white/70 border border-white/5 hover:border-white/20 transition-all duration-300"
          >
            <span>{feature.icon}</span>
            <span className="whitespace-nowrap tracking-wide">{feature.text}</span>
          </div>
        ))}
      </div>
      
      {/* Barra de Conversión Inferior */}
      <div className="gsap-fade-in opacity-0 transform translate-y-4 flex flex-col md:flex-row items-center gap-6 bg-[#12072b]/60 border border-white/5 backdrop-blur-lg p-5 rounded-2xl w-full max-w-3xl justify-between shadow-2xl">
        
        {/* Estadísticas */}
        <div className="flex gap-6 text-left md:pl-2">
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#ff7a59] tracking-tight">100K+</div>
            <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold mt-0.5">Estudiantes</div>
          </div>
          <div className="border-r border-white/10 h-8 self-center" />
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#ff7a59] tracking-tight">95%</div>
            <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold mt-0.5">Éxito</div>
          </div>
          <div className="border-r border-white/10 h-8 self-center" />
          <div>
            <div className="text-xl sm:text-2xl font-black text-[#ff7a59] tracking-tight">24/7</div>
            <div className="text-[9px] uppercase tracking-wider text-white/40 font-semibold mt-0.5">Disponible</div>
          </div>
        </div>
        
        {/* Botón de Acción Magnético */}
        <div 
          className="w-full md:w-auto p-1 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to="/register"
            ref={ptoMagnetico}
            className="w-full sm:w-auto bg-[#ff5a36] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.12em] transition-all duration-300 shadow-lg shadow-[#ff5a36]/20 hover:shadow-[#ff5a36]/40 will-change-transform cursor-pointer relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Comienza gratis <span className="transition-transform group-hover:translate-x-1">🚀</span>
            </span>
          </Link>
        </div>

      </div>
    </div>
  )
}