import { useState } from 'react';
import { Card, Button, Badge } from '../ui';
import { PageContainer, SectionHeader } from '../layout';
import {
  Settings,
  Moon,
  Sun,
  Shield,
  FileText,
  Mail,
  LogOut,
  User,
  Lock,
  ChevronRight,
  Bell,
  Globe,
  HelpCircle,
  Info,
  Check
} from 'lucide-react';

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    {
      icon: User,
      title: 'Perfil de Usuario',
      subtitle: 'Ver y editar información personal',
      action: 'profile',
      color: 'text-[#FF5E36]'
    },
    {
      icon: Lock,
      title: 'Cambiar Contraseña',
      subtitle: 'Actualiza tu contraseña de seguridad',
      action: 'password',
      color: 'text-[#FFD700]'
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      subtitle: notifications ? 'Activadas' : 'Desactivadas',
      action: 'notifications',
      color: 'text-[#5D26C1]'
    },
    {
      icon: Globe,
      title: 'Idioma',
      subtitle: 'Español (predeterminado)',
      action: 'language',
      color: 'text-[#00E676]'
    },
    {
      icon: Moon,
      title: 'Tema Oscuro',
      subtitle: darkMode ? 'Activado' : 'Desactivado',
      action: 'theme',
      color: 'text-[#FF5E36]',
      toggle: true
    }
  ];

  const legalItems = [
    {
      icon: Shield,
      title: 'Privacidad',
      subtitle: 'Política de protección de datos',
      color: 'text-[#00E676]'
    },
    {
      icon: FileText,
      title: 'Términos de Uso',
      subtitle: 'Condiciones de la aplicación',
      color: 'text-[#FF5E36]'
    },
    {
      icon: Info,
      title: 'Acerca de EasyGo',
      subtitle: 'Versión 1.0.0',
      color: 'text-[#5D26C1]'
    },
    {
      icon: HelpCircle,
      title: 'Centro de Ayuda',
      subtitle: 'FAQ y soporte técnico',
      color: 'text-[#FFD700]'
    }
  ];

  const supportItems = [
    {
      icon: Mail,
      title: 'Buzón de Sugerencias',
      subtitle: 'Envíanos tus ideas',
      color: 'text-[#5D26C1]'
    },
    {
      icon: Mail,
      title: 'Reclamos',
      subtitle: 'Reporta problemas',
      color: 'text-[#FF5E36]'
    }
  ];

  return (
    <PageContainer className="p-0">
      <div className="min-h-screen bg-[#120E2E] pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF5E36] to-[#5D26C1] px-6 py-10 rounded-b-[3rem] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ajustes</h1>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Configura tu experiencia</p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="px-6 -mt-8">
          <Card variant="elevated" className="bg-[#1A153D] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#FF5E36] to-[#5D26C1] flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-2xl font-black text-white">MA</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg leading-tight">María García</h3>
                <p className="text-xs text-white/40 font-medium">maria.garcia@email.com</p>
                <Badge className="mt-2 bg-[#00E676]/20 text-[#00E676] border-none font-black text-[10px]">PRO NIVEL 5</Badge>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20" />
            </div>
          </Card>
        </div>

        {/* Account Settings */}
        <div className="px-6 mt-10">
          <SectionHeader title="Cuenta" />
          <Card variant="flat" className="divide-y divide-white/5 overflow-hidden">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all"
                onClick={() => item.action === 'theme' && toggleTheme()}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{item.subtitle}</p>
                </div>
                {item.toggle ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTheme();
                    }}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      darkMode ? 'bg-[#FF5E36]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-transform ${
                        darkMode ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/20" />
                )}
              </div>
            ))}
          </Card>
        </div>

        {/* Legal */}
        <div className="px-6 mt-10">
          <SectionHeader title="Legal" />
          <Card variant="flat" className="divide-y divide-white/5 overflow-hidden">
            {legalItems.map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20" />
              </div>
            ))}
          </Card>
        </div>

        {/* Support */}
        <div className="px-6 mt-10">
          <SectionHeader title="Soporte" />
          <Card variant="flat" className="divide-y divide-white/5 overflow-hidden">
            {supportItems.map((item, index) => (
              <div
                key={index}
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20" />
              </div>
            ))}
          </Card>
        </div>

        {/* Logout */}
        <div className="px-6 mt-12">
          <Button
            variant="danger"
            className="w-full h-14 shadow-[0_10px_25px_rgba(239,68,68,0.2)]"
            onClick={() => {
              if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                window.location.href = '/';
              }
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            CERRAR SESIÓN
          </Button>
        </div>

        {/* Version */}
        <div className="px-6 mt-10 text-center pb-12">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">EasyGo Academy v1.0.0</p>
          <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-2">© 2024 Todos los derechos reservados</p>
        </div>
      </div>
    </PageContainer>
  );
}
