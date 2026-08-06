export const FeaturesSection = () => {
  const features = [
    { icon: '🤖', title: 'EasyGo AI Tutor', desc: 'Practica conversación 24/7 con IA que te corrige en tiempo real.' },
    { icon: '🌍', title: 'Profesores nativos', desc: 'Aprende con profesores de más de 15 países.' },
    { icon: '⚡', title: 'Flexibilidad total', desc: 'Clases disponibles las 24 horas, sin horarios fijos.' },
    { icon: '🎯', title: 'Inglés laboral', desc: 'Preparación para entrevistas y comunicación profesional.' },
    { icon: '🔊', title: 'EasyPhonics™', desc: 'Corrección fonética diseñada para hispanohablantes.' },
    { icon: '🏅', title: 'Certificación MCER', desc: 'Programa alineado al Marco Común Europeo.' },
  ]

  return (
    <section id="features" name="features" className="py-24 sm:py-32 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4 tracking-tight">
            Todo lo que necesitas
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-light">
            Una plataforma diseñada para que aprendas inglés de verdad.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 rounded-3xl hover:bg-gray-50 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}