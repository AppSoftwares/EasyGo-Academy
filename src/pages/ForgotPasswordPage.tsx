import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword, isLoading, error, clearError } = useAuthStore() as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email) return;

    // We assume the store has a forgotPassword method now (needs to be added to web store too)
    const result = await forgotPassword(email);
    if (result.success) {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0533] via-[#2d0a5c] to-[#4A1FB8] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-primary shadow-xl">
              EG
            </div>
            <span className="text-3xl font-black text-white">EasyGo Academy</span>
          </Link>
        </div>

        <div className="bg-white backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-white/50">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900">¿Olvidaste tu contraseña?</h2>
                <p className="text-gray-600 mt-2">Dinos tu correo y te enviaremos las instrucciones.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  icon="✉️"
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
                  ENVIAR INSTRUCCIONES
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-4">¡Correo enviado!</h2>
              <p className="text-gray-600 mb-8">
                Si el correo está registrado, recibirás un mensaje con los pasos a seguir.
              </p>
              <Link to="/login" className="w-full block">
                <Button variant="primary" size="lg" className="w-full">
                  VOLVER AL INICIO
                </Button>
              </Link>
            </div>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link to="/login" className="text-primary font-bold hover:text-accent transition-colors">
                Volver al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
