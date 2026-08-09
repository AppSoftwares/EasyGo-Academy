import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint, Smartphone, Trash2, CheckCircle, RefreshCcw } from 'lucide-react';
import api from '../../services/api';

export const PrivacyPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/sessions');
      setSessions(res.data.sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('¿Cerrar esta sesión remotamente?')) return;
    try {
      await api.delete(`/auth/sessions/${id}`);
      setSessions(sessions.filter(s => s.id !== id));
      setStatus({ type: 'success', msg: 'Sesión cerrada exitosamente' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Error al cerrar sesión' });
    } finally {
      setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6 space-y-8 animate-fade-in text-left">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="text-xl text-[var(--text-color)]">←</span>
        </button>
        <h1 className="text-2xl font-black text-[var(--text-color)]">Privacidad y Seguridad</h1>
      </div>

      {status.msg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-slide-in ${
          status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <span>⚠️</span>}
          <span className="text-sm font-bold">{status.msg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Biometrics */}
        <div className="glass rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-color)]">Biometría</h3>
              <p className="text-xs text-gray-500 leading-tight">Login con Huella o Face ID</p>
            </div>
          </div>
          <button className="w-12 h-6 bg-gray-300 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
          </button>
        </div>

        {/* 2FA */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-accent/10 text-accent">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-color)]">Verificación en 2 pasos</h3>
              <p className="text-xs text-gray-500 leading-tight">Seguridad extra con TOTP</p>
            </div>
          </div>
          <button className="w-full py-3 rounded-2xl border border-accent text-accent font-bold text-sm hover:bg-accent/5 transition-colors">
            Configurar 2FA
          </button>
        </div>

        {/* Devices */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-color)]">Sesiones Activas</h3>
            <button onClick={fetchSessions} className={loading ? 'animate-spin' : ''}>
              <RefreshCcw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-black/10 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Smartphone className={`w-5 h-5 ${session.isCurrent ? 'text-primary' : 'text-gray-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[var(--text-color)] truncate max-w-[150px]">
                        {session.userAgent || 'Dispositivo desconocido'}
                      </p>
                      {session.isCurrent && (
                        <span className="text-[8px] bg-primary/20 text-primary-light px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Actual</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">{session.ip} · {new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {sessions.length === 0 && !loading && (
              <p className="text-center text-xs text-gray-500 py-4 italic">No hay otras sesiones activas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
