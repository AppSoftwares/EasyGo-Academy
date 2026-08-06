import { useState } from 'react'

export const LevelsSection = () => {
  const [activeLevel, setActiveLevel] = useState(0)

  const levels = [
    {
      level: 'A1',
      name: 'Basico Inicial',
      subtitle: 'Supervivencia comunicativa',
      description: 'Comunicacion inmediata en situaciones cotidianas simples.',
      hours: '120-150h',
      modules: '12 modulos',
      skills: [
        'Presentarte en el trabajo',
        'Pedir ayuda basica',
        'Hablar de tu familia',
        'Hacer compras simples',
        'Entender instrucciones basicas',
        'Decir lo que haces y donde trabajas'
      ],
      color: 'from-blue-400 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      level: 'A2',
      name: 'Basico Progresivo',
      subtitle: 'Independencia cotidiana',
      description: 'Manejo funcional del pasado y futuro con mayor autonomia.',
      hours: '140-160h',
      modules: '12 modulos',
      skills: [
        'Narrar experiencias pasadas',
        'Explicar planes futuros',
        'Describir tu trabajo en detalle',
        'Resolver problemas simples',
        'Hacer sugerencias',
        'Comparar opciones'
      ],
      color: 'from-green-400 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      level: 'B1',
      name: 'Intermedio Umbral',
      subtitle: 'Independencia laboral',
      description: 'Expresarse con claridad en contextos laborales y sociales.',
      hours: '160-180h',
      modules: '12 modulos',
      skills: [
        'Expresar opiniones laborales',
        'Justificar decisiones',
        'Explicar procesos',
        'Participar en reuniones',
        'Resolver conflictos simples',
        'Hacer recomendaciones'
      ],
      color: 'from-yellow-400 to-orange-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      level: 'B2',
      name: 'Avanzado Profesional',
      subtitle: 'Precision y argumentacion',
      description: 'Desempeno profesional con seguridad y autonomia comunicativa.',
      hours: '180-200h',
      modules: '15 modulos',
      skills: [
        'Liderar conversaciones',
        'Argumentar propuestas',
        'Negociar condiciones',
        'Presentar ideas formales',
        'Dar retroalimentacion estructurada',
        'Manejar conflictos laborales'
      ],
      color: 'from-orange-400 to-red-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      level: 'C1',
      name: 'Competente',
      subtitle: 'Dominio discursivo profesional',
      description: 'Fluidez avanzada y dominio comunicativo en contextos complejos.',
      hours: '200-220h',
      modules: '15 modulos',
      skills: [
        'Dirigir reuniones formales',
        'Persuadir audiencias',
        'Negociar en contextos complejos',
        'Presentar informes ejecutivos',
        'DeBatir temas abstractos',
        'Defender estrategias'
      ],
      color: 'from-purple-400 to-purple-700',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ]

  const currentLevel = levels[activeLevel]

  return (
    <section id="levels" name="levels" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
            📚 Progresion Oficial MCER
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4">
            Del A1 al C1:<br className="sm:hidden" />{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Progresion real
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Cada nivel representa un incremento real en autonomia comunicativa. 
            No avanzas por tiempo. Avanzas por competencia demostrada.
          </p>
        </div>

        {/* Navegacion de niveles - Mobile: tabs horizontales */}
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {levels.map((level, index) => (
            <button
              key={index}
              onClick={() => setActiveLevel(index)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm whitespace-nowrap ${
                activeLevel === index
                  ? `bg-gradient-to-r ${level.color} text-white shadow-lg`
                  : 'bg-white text-gray-500 shadow-sm hover:bg-gray-50'
              }`}
            >
              {level.level} - {level.name}
            </button>
          ))}
        </div>

        {/* Contenido del nivel seleccionado (mobile) / Grid de niveles (desktop) */}
        
        {/* Vista Mobile: Mostrar nivel activo */}
        <div className="lg:hidden">
          <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border-2 ${currentLevel.borderColor}`}>
            {/* Cabecera del nivel */}
            <div className={`bg-gradient-to-r ${currentLevel.color} p-5 sm:p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-black">{currentLevel.level}</span>
                <div className="flex gap-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">{currentLevel.hours}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{currentLevel.modules}</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">{currentLevel.name}</h3>
              <p className="text-white/80 text-sm">{currentLevel.subtitle}</p>
            </div>

            {/* Contenido */}
            <div className="p-5 sm:p-6">
              <p className="text-gray-600 text-sm sm:text-base mb-4">{currentLevel.description}</p>
              
              <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">¿Que podras hacer?</h4>
              <ul className="space-y-2">
                {currentLevel.skills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-sm text-gray-700">
                    <span className={`w-5 h-5 sm:w-6 sm:h-6 ${currentLevel.bgLight} ${currentLevel.textColor} rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      ✓
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Indicadores de nivel (dots) */}
          <div className="flex justify-center gap-2 mt-4">
            {levels.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveLevel(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeLevel === index
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Vista Desktop: Grid de 5 columnas */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 xl:gap-6">
          {levels.map((level, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl xl:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group border-2 border-transparent hover:border-primary/20`}
            >
              {/* Cabecera del nivel */}
              <div className={`bg-gradient-to-r ${level.color} p-4 xl:p-6 text-white`}>
                <span className="text-3xl xl:text-4xl font-black block mb-2">{level.level}</span>
                <h3 className="font-bold text-sm xl:text-base mb-1">{level.name}</h3>
                <p className="text-white/80 text-xs">{level.subtitle}</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] xl:text-xs">{level.hours}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] xl:text-xs">{level.modules}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4 xl:p-6">
                <p className="text-gray-600 text-xs xl:text-sm mb-4 line-clamp-2">{level.description}</p>
                
                <h4 className="font-bold text-gray-900 mb-3 text-xs xl:text-sm">¿Que podras hacer?</h4>
                <ul className="space-y-2">
                  {level.skills.map((skill, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs xl:text-sm text-gray-700">
                      <span className={`w-4 h-4 xl:w-5 xl:h-5 ${level.bgLight} ${level.textColor} rounded-full flex items-center justify-center text-[10px] xl:text-xs font-bold flex-shrink-0`}>
                        ✓
                      </span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Certificacion */}
      {/*   <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-primary/5 text-primary px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl">
            <span className="text-xl sm:text-2xl">🏅</span>
            <span className="text-sm sm:text-base font-semibold">
              Certificacion oficial por nivel alineada al Marco Comun Europeo de Referencia (MCER)
            </span>
          </div>
        </div> */}
      </div>
    </section>
  )
}