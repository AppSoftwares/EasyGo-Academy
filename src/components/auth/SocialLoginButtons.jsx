import React from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';

export const SocialLoginButtons = () => {
  const { loginWithGoogle, loginWithApple } = useAuthStore();

  const googleLogin = () => {
    alert('Iniciando sesión con Google (Pendiente de configuración)');
  };

  const handleAppleLogin = () => {
    // This requires the Apple JS library to be loaded
    if (window.AppleID) {
      window.AppleID.auth.signIn()
        .then((response) => {
          loginWithApple(response.authorization.id_token, response.user);
        })
        .catch((error) => console.error(error));
    } else {
      alert('Apple login not initialized');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => googleLogin()}
        className="flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all shadow-sm active:scale-95 border border-gray-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Google</span>
      </button>
      <button
        type="button"
        onClick={handleAppleLogin}
        className="flex items-center justify-center gap-3 bg-black text-white py-3 rounded-2xl font-bold text-sm hover:bg-zinc-900 transition-all border border-white/10 active:scale-95"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05 1.61-3.11 1.61-1.21 0-1.62-.73-3.13-.73-1.49 0-2.03.71-3.11.73-.97.02-2.18-.75-3.32-2.26-2.16-2.83-2.48-7.39-1.03-9.52 1.07-1.57 2.65-2.46 4.09-2.46 1.14 0 2.13.63 2.92.63.74 0 2.05-.77 3.39-.63 1.34.14 2.45.74 3.19 1.83-2.69 1.54-2.25 5.39.51 6.8-.75 1.83-1.68 3.51-2.4 4.51zM14.03 3.23c.6-1.56-.25-3.11-.25-3.11.83.07 2.37.66 2.82 2.58.11.47-.11 1.25-.43 1.82-1.07 1.93-2.66 1.86-2.66 1.86.08-1.59.52-3.15.52-3.15z"/>
        </svg>
        <span>Apple</span>
      </button>
    </div>
  );
};
