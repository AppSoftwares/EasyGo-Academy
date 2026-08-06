export const ClassStructureSection = () => {
  const classSteps = [
    {
      time: '1',
      title: 'Warm-up',
      desc: 'Activacion rapida con frases funcionales del modulo. Empiezas hablando desde el minuto uno.',
      icon: '🔥'
    },
    {
      time: '2',
      title: 'Modelado',
      desc: 'Tu profesor demuestra la estructura en un contexto real de trabajo o vida diaria.',
      icon: '👨‍🏫'
    },
    {
      time: '3',
      title: 'Practica Controlada',
      desc: 'Respuestas guiadas con alta repeticion. Estructura segura para ganar confianza.',
      icon: '🎯'
    },
    {
      time: '4',
      title: 'Practica Comunicativa',
      desc: 'Roleplay o tarea alineada a TU meta real. Aqui es donde aplicas lo aprendido.',
      icon: '🗣️'
    },
    {
      time: '5',
      title: 'Feedback + Micro-accion',
      desc: 'Correccion estrategica + refuerzo EasyPhonics™ + una tarea diaria para seguir practicando.',
      icon: '✅'
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            🎓 Asi son nuestras clases
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            Clases en vivo 1 a 1:<br className="sm:hidden" />{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">45-60 minutos</span> que valen
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Cada clase tiene una estructura diseñada para maximizar tu practica oral. 
            No son clases de gramatica. Son sesiones de activacion comunicativa.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {classSteps.map((step, index) => (
            <div key={index} className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 last:mb-0">
              {/* Numero */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-black text-base sm:text-lg flex-shrink-0 shadow-lg shadow-primary/30">
                  {step.time}
                </div>
                {index < classSteps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary to-accent mt-2"></div>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 bg-gray-50 hover:bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-md border-2 border-transparent hover:border-primary/10 pb-6 sm:pb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-xl sm:text-2xl">{step.icon}</span>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">{step.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info adicional */}
        <div className="text-center mt-8 sm:mt-12 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-primary/5 p-4 rounded-xl">
            <p className="text-2xl sm:text-3xl font-black text-primary">45-60</p>
            <p className="text-xs sm:text-sm text-gray-600">Minutos por clase</p>
          </div>
          <div className="bg-accent/5 p-4 rounded-xl">
            <p className="text-2xl sm:text-3xl font-black text-accent">1 a 1</p>
            <p className="text-xs sm:text-sm text-gray-600">Atencion personalizada</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-2xl sm:text-3xl font-black text-green-600">100%</p>
            <p className="text-xs sm:text-sm text-gray-600">Practica oral</p>
          </div>
        </div>
      </div>
    </section>
  )
}