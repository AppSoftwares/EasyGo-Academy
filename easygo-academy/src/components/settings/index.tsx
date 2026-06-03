import { useCallback, useState } from 'react';
import { Button } from '../ui';
import { PageContainer } from '../layout';
import type { LucideIcon } from 'lucide-react';
import {
  Pencil,
  Trash2,
  Key,
  Lock,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  Heart,
  LogOut,
  Instagram,
  Facebook,
  Twitter,
  Music,
  ChevronRight
} from 'lucide-react';

type MenuItem = {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle?: string;
  readonly danger?: boolean;
};

type SocialItem = {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly color: string;
};

const primaryMenu: readonly MenuItem[] = [
  { icon: Key, title: 'Cuenta', subtitle: 'Administrar acceso y datos' },
  { icon: Lock, title: 'Privacidad y seguridad', subtitle: 'Controla tus permisos' },
  { icon: Bell, title: 'Notificaciones y sonido', subtitle: 'Alertas y tonos' },
  { icon: Moon, title: 'Apariencia', subtitle: 'Tema claro/oscuro' },
  { icon: Globe, title: 'Idioma', subtitle: 'Selecciona tu idioma' }
];

const secondaryMenu: readonly MenuItem[] = [
  { icon: HelpCircle, title: 'Ayuda, Comentario y reclamos' },
  { icon: Heart, title: 'Invitar amigo' },
  { icon: LogOut, title: 'Cerrar Sesión', danger: true }
];

const socialIcons: readonly SocialItem[] = [
  { icon: Instagram, label: 'Instagram', color: 'bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]' },
  { icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]' },
  { icon: Twitter, label: 'Twitter', color: 'bg-[#1DA1F2]' },
  { icon: Music, label: 'TikTok', color: 'bg-[#000000]' }
];

function AvatarActionButton({ isEditing, onToggle }: { isEditing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0B0B16] shadow-lg border border-white/20 transition hover:bg-[#FF5E36] hover:text-white"
      onClick={onToggle}
      aria-label="Editar avatar"
    >
      {isEditing ? <Trash2 className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
    </button>
  );
}

function MenuItemButton({ item }: { item: MenuItem }) {
  return (
    <button
      type="button"
      className={`w-full rounded-[1.75rem] px-4 py-4 text-left transition border border-white/10 ${
        item.danger ? 'bg-[#FF3F4E]/10 text-[#FF6F85] hover:bg-[#FF3F4E]/15' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FF5E36] shadow-inner">
          <item.icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{item.title}</p>
          {item.subtitle ? <p className="text-[13px] text-white/50">{item.subtitle}</p> : null}
        </div>
        <ChevronRight className="w-5 h-5 text-white/30" />
      </div>
    </button>
  );
}

function SocialButton({ item }: { item: SocialItem }) {
  return (
    <button
      type="button"
      className={`${item.color} flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-black/30 transition hover:scale-105`}
      aria-label={item.label}
    >
      <item.icon className="w-5 h-5 text-white" />
    </button>
  );
}

export function SettingsPage() {
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);

  const toggleAvatarEdit = useCallback(() => {
    setIsAvatarEditing((current) => !current);
  }, []);

  return (
    <PageContainer className="p-0">
      <div className="min-h-screen bg-[#0B0B16] text-white flex items-end justify-center pb-6">
        <div className="w-full max-w-[520px] aspect-square rounded-[3rem] bg-[radial-gradient(circle_at_top,_rgba(255,94,54,0.25),_transparent_35%),linear-gradient(180deg,#100D23_0%,#0B0B16_100%)] shadow-[0_35px_90px_rgba(0,0,0,0.35)] border border-white/10 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FF5E36]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07070d]/70 to-transparent" />

          <div className="relative h-full flex flex-col justify-end">
            <div className="px-6 pb-6">
              <div className="mx-auto w-full max-w-[420px] rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.25)] overflow-hidden">
                <div className="bg-[#130F26] px-6 pt-6 pb-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF5E36] via-[#FF9E54] to-[#5D26C1] shadow-xl flex items-center justify-center text-4xl font-black text-white">
                        <span>AG</span>
                      </div>
                      <AvatarActionButton isEditing={isAvatarEditing} onToggle={toggleAvatarEdit} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm uppercase tracking-[0.35em] text-white/40">Perfil</p>
                      <h1 className="text-2xl font-extrabold tracking-tight">Alex González</h1>
                      <p className="text-sm text-white/60">Diseñador UX · México</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-4 py-5">
                  {primaryMenu.map((item) => (
                    <MenuItemButton key={item.title} item={item} />
                  ))}
                </div>

                <div className="border-t border-white/10 px-4 py-4">
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/40">Más opciones</p>
                  <div className="space-y-3">
                    {secondaryMenu.map((item) => (
                      <MenuItemButton key={item.title} item={item} />
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[2rem] bg-[#12101F]/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Síguenos</p>
                      <p className="mt-1 text-[13px] text-white/50">Conéctate con nuestras redes</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {socialIcons.map((item) => (
                        <SocialButton key={item.label} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
