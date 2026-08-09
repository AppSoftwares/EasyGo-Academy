import React from 'react';
import { 
  User, Shield, Bell, HelpCircle, FileText, LogOut, Moon, ChevronRight,
  Sparkles
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

  const MenuItem = ({ icon: Icon, text, to, color }: any) => (
    <Link
      to={to}
      className={`flex items-center justify-between p-4 hover:bg-white/5 transition-all group`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm font-bold text-[var(--text-color)]`}>{text}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-500" />
    </Link>
  );

  return (
    <div id="user-profile-screen" className="space-y-8 animate-fade-in text-left">
      {/* Header Encabezado Circular */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity" />
          <div className="relative w-28 h-28 rounded-full border-4 border-[var(--bg-color)] overflow-hidden shadow-2xl">
            <img
              src={`https://ui-avatars.com/api/?name=${userName}&background=5B2ECC&color=fff&bold=true`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-accent text-white p-2 rounded-full shadow-lg border-2 border-[var(--bg-color)]">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h2 className={`font-black text-2xl text-[var(--text-color)] tracking-tight`}>{userName}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-black border border-primary/20">
              {userLevel}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{userEmail}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tarjeta 1 */}
        <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl divide-y divide-white/5">
          <MenuItem
            icon={User}
            text="Configuración de Cuenta"
            to="/profile/account"
            color="text-blue-400"
          />
          <MenuItem
            icon={Shield}
            text="Privacidad y Seguridad"
            to="/profile/privacy"
            color="text-emerald-400"
          />
          <MenuItem
            icon={Moon}
            text="Apariencia y Tema"
            to="/profile/appearance"
            color="text-purple-400"
          />
          <MenuItem
            icon={Bell}
            text="Notificaciones"
            to="/profile/notifications"
            color="text-amber-400"
          />
        </div>

        {/* Tarjeta 2 */}
        <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl divide-y divide-white/5">
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
            color="text-gray-400"
          />

          <button
            onClick={() => {
              if (window.confirm('¿Cerrar sesión en EasyGo?')) {
                onLogout();
              }
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-red-400">Cerrar Sesión</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest pb-8">
        EasyGo Academy v1.1.0 · Texas, USA
      </p>
    </div>
  );
}
