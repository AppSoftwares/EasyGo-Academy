import { WaveDivider } from "../ui/SectionDivider";

export const DailyPracticeSection = () => {
  const practices = [
    {
      icon: "📱",
      title: "Configura tu telefono en ingles",
      desc: "Pequenos cambios que te exponen al idioma todo el dia sin esfuerzo.",
    },
    {
      icon: "🎧",
      title: "Micro-interacciones diarias",
      desc: "5-10 minutos de practica con EasyGo AI Tutor en tu descanso o camino al trabajo.",
    },
    {
      icon: "📺",
      title: "Consume contenido real",
      desc: "Te enseñamos a usar Netflix, YouTube y podcasts como herramientas de aprendizaje.",
    },
    {
      icon: "🏪",
      title: "Tu trabajo es tu aula",
      desc: "Convierte cada interaccion laboral en una oportunidad de practica intencional.",
    },
  ];

  return (
    <section   style={{
      background:"linear-gradient(135deg, rgb(10, 4, 24) 0%, rgb(21, 8, 48) 40%, rgb(30, 10, 69) 70%, rgb(42, 14, 92) 100%)"
    }} className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          bottom: "-2%",
        }}
      >
        <WaveDivider variant="waveSmooth" color="#f9fbfd" flip={false} />
      </div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 text-[20rem]">📱</div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-white/20 text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4 border border-white/30">
            🌍 Ingles como estilo de vida
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            No solo estudias.
            <br className="sm:hidden" />{" "}
            <span className="bg-gradient-to-r from-gold via-orange-400 to-gold bg-clip-text text-transparent">
              Vives en ingles
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto px-4">
            Te enseñamos a convertir tu entorno diario en practica constante. El
            ingles deja de ser "clase" y se convierte en habito.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {practices.map((practice, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group"
            >
              <span className="text-4xl sm:text-5xl block mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {practice.icon}
              </span>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                {practice.title}
              </h3>
              <p className="text-white/80 text-sm">{practice.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="absolute botton-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          bottom: "-2%",
        }}
      >
        <WaveDivider variant="waveSmooth" color="#f9fbfd" flip={true} />
      </div>
    </section>
  );
};
