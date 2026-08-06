import { WaveDivider } from "../ui/SectionDivider"

export const WhyDifferentSection = () => {
  const differences = [
    {
      icon: '👨‍💼',
      title: 'Para hispanos en EE.UU.',
      desc: 'El unico programa diseñado exclusivamente para adultos hispanos que viven y trabajan en Estados Unidos.'
    },
    {
      icon: '🗣️',
      title: 'Clases en vivo individuales',
      desc: 'Cada modulo incluye una clase en vivo individual obligatoria con correccion personalizada.'
    },
    {
      icon: '🔊',
      title: 'EasyPhonics™',
      desc: 'Sistema de correccion fonetica diseñado especificamente para los errores comunes de hispanohablantes.'
    },
    {
      icon: '🎯',
      title: 'Real English First™',
      desc: 'Ingles funcional de vida diaria y entorno laboral. Nada de ejercicios que nunca usaras.'
    },
    {
      icon: '📈',
      title: 'Quick Win System™',
      desc: 'Micro-victorias constantes. Ves tu progreso en cada modulo. No te estancas.'
    },
    {
      icon: '🏅',
      title: 'Certificacion MCER',
      desc: 'Programa alineado al Marco Comun Europeo. Certificacion reconocida internacionalmente.'
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-accent/10 text-accent px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            💡 ¿Que nos hace diferentes?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            No somos un curso<br className="sm:hidden" /> de ingles tradicional
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            EasyGo Academy fue diseñado desde cero para resolver el problema real 
            de los hispanos que necesitan ingles para trabajar.
          </p>
        </div>
22222222
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {differences.map((diff, index) => (
            <div key={index} className="flex items-start gap-4 p-5 sm:p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-primary/10">
              <span className="text-3xl sm:text-4xl flex-shrink-0">{diff.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{diff.title}</h3>
                <p className="text-sm text-gray-600">{diff.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  )
}