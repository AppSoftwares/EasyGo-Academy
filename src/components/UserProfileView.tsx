import React, { useRef, useState } from 'react';
import {
  User, Shield, Bell, HelpCircle, FileText, LogOut, Moon, ChevronRight,
  Sparkles, Camera, Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfileViewProps {
  userEmail: string;
  userName: string;
  userLevel: string;
  isDarkMode: boolean;
  onLogout: () => void;
}

export default function UserProfileView({
  userEmail,
  userName,
  userLevel,
  isDarkMode,
  onLogout
}: UserProfileViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const MenuItem = ({ icon: Icon, text, to, color }: any) => (
    <Link
      to={to}
      className={`flex items-center justify-between p-5 hover:bg-white/5 transition-all group`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} ${color} group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{text}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </Link>
  );

  return (
    <div id="user-profile-screen" className="space-y-8 animate-fade-in text-left pb-10">
      {/* Header Encabezado Circular */}
      <div className="flex flex-col items-center text-center space-y-5 pt-4">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <div className="absolute -inset-2 bg-gradient-to-tr from-brand-orange to-brand-violet rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />

          <div className="relative w-32 h-32 rounded-full border-4 border-[var(--bg-color)] overflow-hidden shadow-2xl bg-slate-800">
            <img
              src={profileImage || `https://ui-avatars.com/api/?name=${userName}&background=E8622E&color=fff&bold=true&size=256`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="absolute bottom-0 right-0 bg-brand-orange text-white p-2.5 rounded-full shadow-xl border-4 border-[var(--bg-color)] scale-110">
            <Sparkles className="w-4 h-4" />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="space-y-1">
          <h2 className={`font-black text-3xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userName}</h2>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] px-4 py-1.5 bg-brand-orange/10 text-brand-orange rounded-full font-black border border-brand-orange/20 uppercase tracking-widest">
              {userLevel}
            </span>
            <span className="text-[11px] text-slate-400 font-bold lowercase">{userEmail}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sección Sistema */}
        <div className={`rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'} divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-50'}`}>
          <MenuItem
            icon={User}
            text="Configuración de Cuenta"
            to="/profile/account"
            color="text-blue-500"
          />
          <MenuItem
            icon={Shield}
            text="Privacidad y Seguridad"
            to="/profile/privacy"
            color="text-emerald-500"
          />
          <MenuItem
            icon={Moon}
            text="Apariencia y Tema"
            to="/profile/appearance"
            color="text-brand-orange"
          />
          <MenuItem
            icon={Bell}
            text="Notificaciones"
            to="/profile/notifications"
            color="text-amber-500"
          />
        </div>

        {/* Sección Soporte */}
        <div className={`rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'} divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-50'}`}>
          <MenuItem
            icon={HelpCircle}
            text="Centro de Ayuda"
            to="/profile/help"
            color="text-primary-light"
          />
          <MenuItem
            icon={FileText}
            text="Términos y Condiciones"
            to="/profile/legal"
            color="text-slate-400"
          />

          <button
            onClick={() => {
              if (window.confirm('¿Cerrar sesión en EasyGo Academy?')) {
                onLogout();
              }
            }}
            className="w-full flex items-center justify-between p-5 hover:bg-red-500/5 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform shadow-sm`}>
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-red-500 tracking-tight">Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300/50" />
          </button>
        </div>
      </div>

      <div className="pt-4 pb-12">
        <p className={`text-center text-[10px] font-black uppercase tracking-[0.4em] opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          EasyGo Academy V1.1.5
        </p>
      </div>
    </div>
  );
}
