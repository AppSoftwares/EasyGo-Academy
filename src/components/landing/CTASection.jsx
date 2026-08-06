export const CTASection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="relative bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3rem] text-center overflow-hidden shadow-2xl shadow-primary/30 max-w-4xl mx-auto">
          <div className="absolute top-[-30%] right-[-20%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-white/10 rounded-full hidden sm:block" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-accent/20 rounded-full hidden sm:block" />
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
              Listo para cambiar tu historia?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Unete a mas de 100,000 profesionales que ya transformaron sus carreras dominando el ingles. 
              El momento es ahora.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-10">
              <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
                <span>✅</span> Sin costo inicial
              </div>
              <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
                <span>✅</span> Cancela cuando quieras
              </div>
              <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
                <span>✅</span> Clase privada de regalo
              </div>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="bg-gradient-to-r from-accent to-orange-500 text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-full text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50 animate-pulse-slow w-full sm:w-auto"
            >
              Empieza Gratis Ahora 🚀
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}