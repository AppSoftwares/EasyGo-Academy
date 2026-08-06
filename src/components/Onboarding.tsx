import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, Globe } from 'lucide-react';

interface OnboardingProps {
  onComplete: (level: 'A1-A2 Principiante' | 'B1-B2 Intermedio' | 'C1-C2 Avanzado') => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<'A1-A2 Principiante' | 'B1-B2 Intermedio' | 'C1-C2 Avanzado'>('A1-A2 Principiante');

  const slides = [
    {
      emoji: "🌟",
      title: "Bienvenido a EasyGo Academy",
      desc: "La primera academia de inglés diseñada exclusivamente para hispanohablantes viviendo en los Estados Unidos. Pierde el miedo y habla con confianza desde el primer día.",
      badge: "Cero frustración"
    },
    {
      emoji: "💬",
      title: "Conversaciones Reales",
      desc: "Practica situaciones críticas de la vida en EE. UU.: comprar en el supermercado, hablar con los maestros de tus hijos, ir al doctor o responder en entrevistas laborales.",
      badge: "Enfoque 100% práctico"
    },
    {
      emoji: "🔥",
      title: "Mantén tu Racha Diaria",
      desc: "La regularidad es la clave del dominio. Practica solo 10 minutos al día para acumular puntos de Experiencia (XP), ganar insignias legendarias y blindar tu confianza.",
      badge: "Estudio offline compatible"
    },
    {
      emoji: "👥",
      title: "Aprende en Comunidad",
      desc: "Compite de manera amistosa en tablas semanales, comparte tips de adaptación en el foro y únete a desafíos colectivos con miles de hispanos con tus mismas metas.",
      badge: "Apoyo mutuo 24/7"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleComplete = () => {
    onComplete(selectedLevel);
  };

  return (
    <div id="onboarding-viewport" className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow matching brand-gradient */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-violet opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-orange opacity-15 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[580px] shadow-2xl relative z-10 border border-white/10">
        {/* Header Indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-white text-lg tracking-wider">EasyGo</span>
            <span className="font-academy text-brand-orange text-md font-semibold font-italic rotate-[-6deg] ml-1">Academy</span>
          </div>
          <button 
            id="onboarding-skip-btn"
            onClick={() => setCurrentSlide(slides.length - 1)} 
            className="text-xs text-slate-300 hover:text-white transition-colors"
          >
            Saltar
          </button>
        </div>

        {/* Dynamic slides contents */}
        {currentSlide < slides.length - 1 ? (
          <div className="flex-1 flex flex-col justify-center animate-fade-in text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-violet flex items-center justify-center text-5xl mx-auto shadow-lg animate-float mb-6">
              {slides[currentSlide].emoji}
            </div>
            
            <span className="inline-block px-3 py-1 rounded-full bg-brand-purple/40 border border-brand-violet/20 text-xs text-brand-violet font-semibold tracking-wide uppercase mb-3 max-w-max mx-auto">
              {slides[currentSlide].badge}
            </span>

            <h1 className="font-display text-2xl font-bold text-white tracking-tight leading-snug mb-3">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-sm leading-relaxed text-slate-300">
              {slides[currentSlide].desc}
            </p>
          </div>
        ) : (
          /* Level choice sequence */
          <div className="flex-1 flex flex-col justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-coral/20 border border-brand-coral flex items-center justify-center text-3xl mx-auto mb-4">
              🎯
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Elige tu nivel de partida
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Selecciona tu experiencia previa para adaptar la conversación y lecciones
            </p>

            <div className="space-y-3 mb-6">
              {[
                { key: 'A1-A2 Principiante', title: 'A1-A2 Principiante 📚', desc: 'No hablo casi nada o frases muy sencillas.' },
                { key: 'B1-B2 Intermedio', title: 'B1-B2 Intermedio 💬', desc: 'Me defiendo un poco en la calle pero dudo mucho.' },
                { key: 'C1-C2 Avanzado', title: 'C1-C2 Avanzado 💼', desc: 'Entiendo bastante bien, busco credibilidad laboral.' }
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  onClick={() => setSelectedLevel(lvl.key as any)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border flex items-center justify-between ${
                    selectedLevel === lvl.key 
                      ? 'bg-gradient-to-r from-brand-orange/20 to-brand-purple/20 border-brand-orange text-white shadow-md' 
                      : 'bg-white/5 border-white/5 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <h3 className="font-medium text-sm text-white">{lvl.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{lvl.desc}</p>
                  </div>
                  {selectedLevel === lvl.key && (
                    <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions and dots indicator */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <span 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'w-4 bg-brand-orange' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {currentSlide < slides.length - 1 ? (
            <button
              id="onboarding-next-btn"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-purple text-white text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-brand-orange/20 hover:opacity-90 active:scale-95 transition-all"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="onboarding-complete-btn"
              onClick={handleComplete}
              className="px-6 py-2.5 rounded-full bg-brand-orange text-white text-sm font-bold shadow-lg shadow-brand-orange/30 hover:bg-brand-coral active:scale-95 transition-all flex items-center gap-1.5"
            >
              ¡Comenzar! <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
