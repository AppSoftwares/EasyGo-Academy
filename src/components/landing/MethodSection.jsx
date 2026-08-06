export const MethodSection = () => {
  const methodSteps = [
    {
      letter: 'E',
      title: 'Entorno Real',
      full: 'Real English First™',
      desc: 'Ingles de la vida real y entorno laboral, no estructuras academicas aisladas.',
      icon: '🏢'
    },
    {
      letter: 'A',
      title: 'Aprendizaje por Proyecto',
      full: 'Project-Based Learning',
      desc: 'Trabajas en TU objetivo: entrevista, trabajo, comunicacion laboral.',
      icon: '🎯'
    },
    {
      letter: 'S',
      title: 'Sonido por Bloques',
      full: 'Sound Blocks™',
      desc: 'Aprendes frases completas y bloques funcionales, no palabras sueltas.',
      icon: '🔊'
    },
    {
      letter: 'Y',
      title: 'Tu Historia Primero',
      full: 'Your Story First™',
      desc: 'El metodo se adapta a tu vida, emociones y objetivos personales.',
      icon: '💙'
    },
    {
      letter: 'G',
      title: 'Aprendizaje con Juegos',
      full: 'Game Learning™',
      desc: 'Retos, historias y simulaciones para aprender sin miedo a equivocarte.',
      icon: '🎮'
    },
    {
      letter: 'O',
      title: 'Objetivos Diarios',
      full: 'Quick Win System™',
      desc: 'Micro-victorias constantes. Progreso visible en cada modulo.',
      icon: '✅'
    }
  ]

  return (
    <section name="method" id="method" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            🧠 Metodo Exclusivo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            El metodo <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">EASYGO</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            No es un curso tradicional. Es un sistema diseñado especificamente para que 
            los hispanos aprendan ingles de verdad, sin frustrarse.
          </p>
        </div>

        {/* Method Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {methodSteps.map((step, index) => (
            <div key={index} className="group bg-gray-50 hover:bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 border-2 border-transparent hover:border-primary/10">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl flex-shrink-0">
                  {step.letter}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-xs text-primary font-semibold">{step.full}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{step.icon}</span>
                <p className="text-sm sm:text-base text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}