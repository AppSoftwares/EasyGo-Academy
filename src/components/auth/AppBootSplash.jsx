import React, { useEffect, useState } from 'react';
import { Logo } from '../ui/Logo';

export const AppBootSplash = ({ onFinish }) => {
  const [version, setVersion] = useState('...');

  useEffect(() => {
    // Leer versión del JSON empaquetado
    fetch('/version.json')
      .then(res => res.json())
      .then(data => setVersion(data.version))
      .catch(() => setVersion('1.1.0'));

    // Duración automática del splash
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a041e] flex flex-col items-center justify-center animate-fade-in">
      {/* Luces de Fondo */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-6 scale-110">
        <Logo scrolled={true} />
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-white font-black text-xl tracking-tight">EasyGo Academy</h2>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
            Versión {version}
          </span>
        </div>
      </div>

      {/* Indicador de carga sutil */}
      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent w-full animate-pulse" />
        </div>
        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Cargando experiencia nativa</p>
      </div>
    </div>
  );
};
