import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

export const HelpCenterPage = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { id: 1, q: '¿Cómo cambio mi nivel de inglés?', a: 'Puedes hacerlo desde el menú de Ajustes > Configuración de cuenta. También el sistema te sugerirá subir de nivel cuando completes todos los hitos de tu nivel actual.' },
    { id: 2, q: '¿Cómo funciona la repetición espaciada?', a: 'Es un método que optimiza la memorización. Te preguntaremos las palabras que te cuestan más con mayor frecuencia y las que ya dominas con menor frecuencia.' },
    { id: 3, q: '¿Olvidé mi contraseña, qué hago?', a: 'En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y te enviaremos un código de recuperación a tu email.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6 space-y-8 text-left">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="text-xl text-[var(--text-color)]">←</span>
        </button>
        <h1 className="text-2xl font-black text-[var(--text-color)]">Centro de Ayuda</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Busca tu duda..."
          className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-color)] outline-none focus:border-primary/50"
        />
      </div>

      <div className="glass rounded-3xl p-6 space-y-6">
        <h3 className="font-bold text-[var(--text-color)]">Preguntas Frecuentes</h3>
        <div className="space-y-4">
          {faqs.map(faq => (
            <div key={faq.id} className="border-b border-white/5 pb-4">
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between font-bold text-sm text-[var(--text-color)]"
              >
                <span>{faq.q}</span>
                {activeFaq === faq.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeFaq === faq.id && (
                <p className="mt-3 text-xs text-gray-400 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3">
        <MessageCircle className="w-5 h-5" /> Contactar a Soporte
      </button>
    </div>
  );
};
