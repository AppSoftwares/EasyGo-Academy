import React from 'react';
import { useNavigate } from 'react-router-dom';

export const LegalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6 space-y-8 text-left">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="text-xl text-[var(--text-color)]">←</span>
        </button>
        <h1 className="text-2xl font-black text-[var(--text-color)]">Términos y Condiciones</h1>
      </div>

      <div className="glass rounded-3xl p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        <section className="space-y-2">
          <h3 className="font-bold text-[var(--text-color)]">1. Reglas de Uso</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            EasyGo Academy es una plataforma educativa. Al usarla, te comprometes a hacer un uso respetuoso del sistema de IA y de los foros comunitarios.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-[var(--text-color)]">2. Privacidad de Datos</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Tus grabaciones de audio para práctica de pronunciación son procesadas en tiempo real y no se almacenan permanentemente en nuestros servidores para proteger tu privacidad.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-[var(--text-color)]">3. Responsabilidad</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            El contenido de la academia es educativo y no sustituye asesoría legal o técnica oficial en los Estados Unidos.
          </p>
        </section>
      </div>
    </div>
  );
};
