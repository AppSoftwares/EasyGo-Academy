import { useScrollReveal } from '../../hooks/useScrollReveal'

export const AnimatedSection = ({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  as: Component = 'section',
  ...props 
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 })

  const animations = {
    'fade-up': 'translate-y-12 opacity-0',
    'fade-down': '-translate-y-12 opacity-0',
    'fade-left': 'translate-x-12 opacity-0',
    'fade-right': '-translate-x-12 opacity-0',
    'fade-in': 'opacity-0',
    'scale-up': 'scale-95 opacity-0',
    'scale-down': 'scale-105 opacity-0',
    'rotate-up': 'rotate-3 translate-y-8 opacity-0',
  }

  const initialClass = animations[animation] || animations['fade-up']

  return (
    <Component
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.17, 0.55, 0.55, 1)',
        ...(isVisible 
          ? { 
              opacity: 1, 
              transform: 'translate(0, 0) scale(1) rotate(0)',
            } 
          : {}
        )
      }}
      {...props}
    >
      <div className={`${!isVisible ? initialClass : ''}`} style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.17, 0.55, 0.55, 1)',
      }}>
        {children}
      </div>
    </Component>
  )
}