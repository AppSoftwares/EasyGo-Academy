import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore() as any;
  const [email, setEmail] = useState(user?.email || '');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateEmail = async () => {
    if (!email || email === user.email) return;
    setLoading(true);
    try {
      await api.put('/auth/change-email', { newEmail: email });
      setStatus({ type: 'success', msg: 'Email actualizado exitosamente' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Error al actualizar email' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', msg: 'Las contraseñas no coinciden o están vacías' });
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setStatus({ type: 'success', msg: 'Contraseña actualizada' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-6 space-y-8 animate-fade-in text-left">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="text-xl text-[var(--text-color)]">←</span>
        </button>
        <h1 className="text-2xl font-black text-[var(--text-color)]">Configuración de Cuenta</h1>
      </div>

      {status.msg && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-slide-in ${
          status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <span>⚠️</span>}
          <span className="text-sm font-bold">{status.msg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Email Section */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Actualizar Correo
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Email actual: {user?.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-[var(--text-color)] outline-none focus:border-primary/50 transition-all text-sm"
                placeholder="nuevo@correo.com"
              />
            </div>
            <button
              onClick={handleUpdateEmail}
              disabled={loading || email === user?.email}
              className="w-full bg-primary disabled:opacity-50 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Save className="w-5 h-5" /> Guardar Nuevo Correo
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" /> Cambiar Contraseña
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña actual"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-[var(--text-color)] outline-none focus:border-primary/50 transition-all text-sm"
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-[var(--text-color)] outline-none focus:border-primary/50 transition-all text-sm"
            />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Confirmar nueva contraseña"
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-[var(--text-color)] outline-none focus:border-primary/50 transition-all text-sm"
            />
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-accent disabled:opacity-50 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all"
            >
              {loading ? 'Cambiando...' : 'Actualizar Contraseña'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
