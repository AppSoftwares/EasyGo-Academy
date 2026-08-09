import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Volume2, MessageSquare, BookOpen } from 'lucide-react';

export const NotificationsPage = () => {
  const navigate = useNavigate();

  const NotificationToggle = ({ icon: Icon, title, desc, active }: any) => (
    <div className="flex items-start justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex gap-4">
        <div className="p-3 rounded-2xl bg-white/5 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-[var(--text-color)]">{title}</h4>
          <p className="text-[10px] text-gray-500 leading-normal max-w-[200px]">{desc}</p>
        </div>
      </div>
      <button className={`w-12 h-6 rounded-full transition-colors relative mt-1 ${active ? 'bg-primary' : 'bg-gray-300'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6 space-y-8 text-left">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="text-xl text-[var(--text-color)]">←</span>
        </button>
        <h1 className="text-2xl font-black text-[var(--text-color)]">Notificaciones</h1>
      </div>

      <div className="glass rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Preferencias de Alerta</h3>

        <div className="space-y-3">
          <NotificationToggle
            icon={Bell}
            title="Avisos Diarios"
            desc="Recordatorios para mantener tu racha de aprendizaje activa."
            active={true}
          />
          <NotificationToggle
            icon={BookOpen}
            title="Nuevas Lecciones"
            desc="Entérate cuando subamos contenido nuevo de tu nivel."
            active={true}
          />
          <NotificationToggle
            icon={MessageSquare}
            title="Mensajes de Tutor"
            desc="Alertas cuando tu profesor o la IA te envíen feedback."
            active={false}
          />
          <NotificationToggle
            icon={Volume2}
            title="Sonidos In-App"
            desc="Efectos de sonido al acertar o completar lecciones."
            active={true}
          />
        </div>
      </div>
    </div>
  );
};
