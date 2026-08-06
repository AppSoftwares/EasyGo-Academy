import { WaveDivider } from "../ui/SectionDivider";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      stars: "⭐⭐⭐⭐⭐",
      text: "Consegui trabajo en Google despues de 6 meses. Las clases de ingles para entrevistas fueron exactamente lo que necesitaba.",
      initials: "MG",
      name: "Maria Gonzalez",
      role: "Software Engineer en Google",
    },
    {
      stars: "⭐⭐⭐⭐⭐",
      text: "Las clases 24/7 son perfectas para mi agenda. Estudio a las 5 AM antes del trabajo y ya lidero reuniones internacionales.",
      initials: "CR",
      name: "Carlos Ruiz",
      role: "Project Manager en Amazon",
    },
    {
      stars: "⭐⭐⭐⭐⭐",
      text: "En 3 meses pase de no poder pedir un cafe a negociar contratos internacionales. La metodologia es revolucionaria.",
      initials: "AL",
      name: "Ana Lopez",
      role: "Business Developer en Microsoft",
    },
  ];

  return (
    <section name="testimonials" id="testimonials"  style={{
      background:"linear-gradient(135deg, rgb(10, 4, 24) 0%, rgb(21, 8, 48) 40%, rgb(30, 10, 69) 70%, rgb(42, 14, 92) 100%)"
    }} className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          bottom: "-2%",
        }}
      >
        <WaveDivider variant="waveSmooth" color="#ffffff" flip={false} />
      </div>
      <div className="absolute inset-0 opacity-5 sm:opacity-10">
        <div className="absolute top-10 left-10 text-7xl sm:text-9xl">"</div>
        <div className="absolute bottom-10 right-10 text-7xl sm:text-9xl">
          "
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block bg-white/20 text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm mb-3 sm:mb-4 border border-white/30">
            💬 Historias Reales
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            Ellos ya transformaron su futuro
          </h2>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-4">
            Profesionales que dieron el salto en su carrera gracias al ingles
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/15 backdrop-blur-lg p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2"
            >
              <div className="text-lg sm:text-2xl mb-3 sm:mb-4">{t.stars}</div>
              <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-gold rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-base">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm sm:text-base">
                    {t.name}
                  </h4>
                  <p className="text-white/70 text-xs sm:text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          bottom: "-2%",
        }}
      >
        <WaveDivider variant="waveSmooth" color="#1a1a2e" flip={true} />
      </div>
    </section>
  );
};
