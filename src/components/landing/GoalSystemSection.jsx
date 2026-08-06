export const GoalSystemSection = () => {
  const goals = [
    {
      icon: '🎯',
      title: 'Tu objetivo personal',
      desc: 'Cada estudiante trabaja en su propio proyecto: preparar una entrevista, hablar con el supervisor, resolver tramites.',
    },
    {
      icon: '📋',
      title: 'Traducimos tu meta en ingles',
      desc: 'Convertimos tu objetivo personal en habilidades comunicativas concretas que practicas en cada modulo.',
    },
    {
      icon: '✅',
      title: 'Pequenas victorias diarias',
      desc: 'Cada clase y cada unidad te da una victoria observable. Una frase que ya puedes usar. Una interaccion que ya dominas.',
    },
    {
      icon: '📈',
      title: 'Progreso medible',
      desc: 'No avanzas por tiempo. Avanzas por competencia demostrada. Sabes exactamente que puedes hacer en cada nivel.',
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-accent/10 text-accent px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            🎯 Goal-Oriented Learning
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            No estudias ingles.<br className="sm:hidden" />{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Trabajas en tu meta</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Cada estudiante tiene un objetivo real. Nosotros convertimos ese objetivo en tu plan de estudios.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {goals.map((goal, index) => (
            <div key={index} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl sm:text-3xl">{goal.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">{goal.title}</h3>
              <p className="text-sm text-gray-600">{goal.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}