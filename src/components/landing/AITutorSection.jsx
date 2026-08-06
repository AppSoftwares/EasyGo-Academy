import { useNavigate } from "react-router-dom";
import { WaveDivider } from "../ui/SectionDivider";

export const AITutorSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🤖",
      title: "Tutor IA Personal",
      desc: "EasyGo AI Tutor te conoce, te corrige y te guia 24/7. Nunca estas solo en tu aprendizaje.",
    },
    {
      icon: "🗣️",
      title: "Practica de Conversacion Ilimitada",
      desc: "Habla con EasyGo AI Tutor cuando quieras. Sin miedo, sin vergüenza, sin limites de horario.",
    },
    {
      icon: "📝",
      title: "Correccion en Tiempo Real",
      desc: "Recibe feedback inmediato de gramatica, pronunciacion y vocabulario mientras practicas.",
    },
    {
      icon: "🎯",
      title: "Ejercicios Personalizados",
      desc: "EasyGo AI Tutor crea ejercicios adaptados a tu nivel, tus metas personales y tu ritmo de aprendizaje.",
    },
    {
      icon: "⏰",
      title: "Disponible 24/7",
      desc: "Practica a las 5 AM antes del trabajo o a las 11 PM despues de cenar. Siempre disponible para ti.",
    },
    {
      icon: "🧠",
      title: "Memoria de tu Progreso",
      desc: "Recuerda tus conversaciones anteriores, tus errores frecuentes y adapta las lecciones a tu perfil.",
    },
  ];

  const chatDemo = [
    {
      type: "user",
      text: "Necesito practicar para una entrevista de trabajo en ingles manana",
    },
    {
      type: "ai",
      text: '¡Claro! 🎯 Vamos a prepararte AHORA. Practiquemos las preguntas mas comunes de entrevistas.\n\nPregunta tipica: "Tell me about yourself"\n\nRespuesta sugerida: "I have [X] years of experience in [field]. I specialize in [skill] and Im looking for an opportunity where I can [goal]."\n\n¿Quieres intentarlo? Yo te corrijo la pronunciacion con EasyPhonics™.',
    },
    {
      type: "user",
      text: "I have five years of experience in construction and I specialize in electrical work...",
    },
    {
      type: "ai",
      text: '¡Excelente inicio! 👏 Solo un detalle de pronunciacion:\n\n"Construction" → (kon-strak-shon)\n"Electrical" → (e-lek-tri-kal)\n"Specialize" → (spe-sha-laiz)\n\nPractica esas 3 palabras. La "t" en construction es mas suave que en español. Intentalo de nuevo. ¡Estas muy cerca! 💪',
    },
  ];

  return (
    <section style={{
      background:"linear-gradient(135deg, rgb(10, 4, 24) 0%, rgb(21, 8, 48) 40%, rgb(30, 10, 69) 70%, rgb(42, 14, 92) 100%)"
    }} className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br relative overflow-hidden">
     <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          bottom: "-2%",
        }}
      >
        <WaveDivider variant="waveSmooth" color="#ffffff" flip={false} />
      </div>
      {/* Fondos decorativos */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 text-[15rem] select-none">
          💬
        </div>
        <div className="absolute bottom-10 left-10 text-[15rem] select-none">
          🤖
        </div>
      </div>

      {/* Circulos decorativos */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm mb-4 sm:mb-6 border border-white/30">
            <span className="text-lg">🤖</span>
            Inteligencia Artificial Exclusiva de EasyGo Academy
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4">
            Conoce a{" "}
            <span className="bg-gradient-to-r from-gold via-orange-400 to-gold bg-clip-text text-transparent">
              EasyGo AI Tutor
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto px-4">
            Tu profesor de ingles con inteligencia artificial que aplica el
            metodo EASYGO™ en cada interaccion. Te corrige con EasyPhonics™, te
            propone retos con Game Learning y te guia hacia tu meta personal.
          </p>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto px-4 mt-3">
            <strong>Como un profesor real, pero disponible 24/7.</strong> Sin
            miedo, sin vergüenza, sin limites.
          </p>
        </div>

        {/* AI Tutor Mockup / Chat Demo */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl shadow-black/20">
            {/* Barra del chat */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-gold rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg">
                EG
              </div>
              <div>
                <p className="text-white font-bold text-sm sm:text-base">
                  EasyGo AI Tutor
                </p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  En linea - Siempre disponible
                </p>
              </div>
            </div>

            {/* Mensajes del chat */}
            <div className="space-y-3 sm:space-y-4 mb-4 max-h-[400px] overflow-y-auto">
              {chatDemo.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type === "ai" && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                      EG
                    </div>
                  )}
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] text-sm sm:text-base whitespace-pre-wrap ${
                      msg.type === "user"
                        ? "bg-primary/80 text-white rounded-br-md"
                        : "bg-white/20 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.type === "user" && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0 mt-1">
                      Tu
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de escritura */}
              <div className="flex justify-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  EG
                </div>
                <div className="bg-white/20 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input del chat */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-white/40 text-sm">
                Escribe tu mensaje en ingles o español...
              </div>
              <button className="bg-accent hover:bg-accent-light text-white px-4 sm:px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                Enviar ✉️
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
{/*         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group hover:-translate-y-1"
            >
              <span className="text-3xl sm:text-4xl block mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div> */}

        {/* Badges de conocimientos del AI Tutor */}
{/*         <div className="text-center mt-10 sm:mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm px-4 sm:px-8 py-4 sm:py-5 rounded-2xl border border-white/20">
            <span className="text-white font-semibold text-sm sm:text-base whitespace-nowrap">
              🧠 EasyGo AI Tutor conoce:
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                Metodo EASYGO™
              </span>
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                EasyPhonics™
              </span>
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                Tus metas personales
              </span>
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                Tu historial de errores
              </span>
              <span className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/30 transition-colors">
                Niveles A1 al C1
              </span>
            </div>
          </div>
        </div> */}

        {/* CTA */}
{/*         <div className="text-center mt-10 sm:mt-16">
          <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6 font-semibold">
            ¿Quieres probar EasyGo AI Tutor ahora mismo?
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-accent to-orange-500 text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-full text-base sm:text-lg lg:text-xl font-black uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50 animate-pulse-slow"
          >
            Habla con EasyGo AI Tutor Gratis 🤖
          </button>
          <p className="text-white/60 text-xs sm:text-sm mt-3">
            Sin compromiso. Solo tu y la IA. Disponible 24/7.
          </p>
        </div> */}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          bottom: "-2%",
        }}
      >
        <WaveDivider variant="waveSmooth" color="#ffffff" flip={true} />
      </div>
    </section>
  );
};
