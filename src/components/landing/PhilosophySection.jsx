export const PhilosophySection = () => {
  const beliefs = [
    {
      icon: '🧠',
      title: 'No es talento, es sistema',
      desc: 'El dominio del ingles no depende de tu talento natural. Depende de un sistema diseñado para que practiques, te expongas y mejores cada dia.',
      highlight: true
    },
    {
      icon: '🏠',
      title: 'Tu entorno es tu laboratorio',
      desc: 'El aprendizaje no solo ocurre en clase. Te enseñamos a convertir tu trabajo, tu telefono y tu dia a dia en practica de ingles.',
    },
    {
      icon: '💪',
      title: 'El error es parte del proceso',
      desc: 'No te corregimos para señalarte. Te corregimos para que mejores. El miedo a equivocarte es lo unico que te frena.',
    },
    {
      icon: '🎯',
      title: 'Ingles como estilo de vida',
      desc: 'No enseñamos ingles como materia de escuela. Lo enseñamos como herramienta de integracion y movilidad economica.',
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            🎓 Nuestra Filosofia
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
            El ingles <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">no es talento</span>.<br className="hidden sm:block" />
            Es sistema.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Creemos que tu no has fracasado aprendiendo ingles. Fracasaron los metodos 
            tradicionales que solo te enseñan reglas que nunca usas.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {beliefs.map((belief, index) => (
            <div key={index} className={`p-5 sm:p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 ${
              belief.highlight 
                ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl shadow-primary/30' 
                : 'bg-white shadow-sm hover:shadow-md'
            }`}>
              <span className="text-4xl sm:text-5xl block mb-3 sm:mb-4">{belief.icon}</span>
              <h3 className={`font-bold text-lg sm:text-xl mb-2 sm:mb-3 ${belief.highlight ? 'text-white' : 'text-gray-900'}`}>
                {belief.title}
              </h3>
              <p className={`text-sm ${belief.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                {belief.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quote */}
       {/*  <div className="text-center mt-10 sm:mt-16 max-w-3xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 italic leading-relaxed">
              "El estudiante adulto hispano no fracasa por incapacidad, sino por haber sido 
              expuesto a modelos academicos que priorizan reglas sobre uso real."
            </p>
            <p className="text-primary font-bold mt-4">— EasyGo Academy</p>
          </div>
        </div> */}
      </div>
    </section>
  )
}