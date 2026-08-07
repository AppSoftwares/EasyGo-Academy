import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { HeroContent } from './HeroContent'
import { HeroForm } from './HeroForm'
import { WaveDivider } from '../ui/SectionDivider' //[cite: 3]

export const HeroSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768) //[cite: 3]
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Manejador de resize nativo[cite: 3]
    const handleResize = () => setIsMobile(window.innerWidth <= 768) //[cite: 3]
    window.addEventListener('resize', handleResize) //[cite: 3]

    // Animación de entrada GSAP
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      
      tl.to('.title-reveal-line', {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.15
      })
      .to('.gsap-fade-in', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1
      }, '-=0.8')
    }, containerRef)

    // Canvas de Partículas de Fondo
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      let particles = []
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      resizeCanvas()

      class Particle {
        constructor() { this.reset() }
        reset() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.size = Math.random() * 2 + 0.5
          this.speedX = Math.random() * 0.4 - 0.2
          this.speedY = Math.random() * -0.6 - 0.1
          this.alpha = Math.random() * 0.4 + 0.1
        }
        update() {
          this.x += this.speedX
          this.y += this.speedY
          if (this.y < 0 || this.x < 0 || this.x > canvas.width) this.reset()
        }
        draw() {
          context.fillStyle = `rgba(255, 215, 0, ${this.alpha})`
          context.beginPath()
          context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          context.fill()
        }
      }

      for (let i = 0; i < 45; i++) particles.push(new Particle())

      let animationFrameId
      const render = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        particles.forEach(p => { p.update(); p.draw() })
        animationFrameId = requestAnimationFrame(render)
      }
      render()

      return () => {
        ctx.revert()
        window.removeEventListener('resize', handleResize) //[cite: 3]
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <section 
      id="register"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0533] via-[#2d0a5c] to-[#4A1FB8] overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Canvas Decorativo */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" />

      {/* Luces de Fondo */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-[#e3504a]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Contenido */}
      <div className="w-full max-w-5xl mx-auto z-10 py-24 text-center">
        <HeroContent onOpenForm={() => setIsFormOpen(true)} />
      </div>

      {/* Formulario Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a0533]/85 backdrop-blur-xl transition-opacity" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-md z-10 max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-none">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all">✕</button>
            <HeroForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}

      {/* Tu Wave Divider con Preservación de Estructura Exacta */}
      <div className={`absolute left-0 right-0 z-20 pointer-events-none ${
        isMobile ? '-bottom-1' : 'bottom-0'
      }`}>
        <WaveDivider flip={true} color='#f9fbfd' />
      </div>
    </section>
  )
}