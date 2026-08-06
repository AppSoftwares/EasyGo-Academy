import React, { useState } from 'react';
import { 
  User, Check, Shield, Bell, HelpCircle, FileText, LogOut, Moon, Sun, 
  Upload, Sparkles, CheckCircle, BookOpen
} from 'lucide-react';

interface UserProfileViewProps {
  userEmail: string;
  userName: string;
  userLevel: string;
  isDarkMode: boolean;
  onToggleTheme: (dark: boolean) => void;
  onUpdateProfile: (name: string, email: string, level: string, avatarUrl: string) => void;
  onLogout: () => void;
  onEarnXp: (xp: number) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
];

export default function UserProfileView({
  userEmail,
  userName,
  userLevel,
  isDarkMode,
  onToggleTheme,
  onUpdateProfile,
  onLogout,
  onEarnXp
}: UserProfileViewProps) {
  const [activeSubSection, setActiveSubSection] = useState<'profile' | 'security' | 'theme' | 'notifications' | 'help' | 'terms'>('profile');

  const [inputName, setInputName] = useState(userName);
  const [inputEmail, setInputEmail] = useState(userEmail);
  const [inputLevel, setInputLevel] = useState(userLevel);
  const [inputAvatarUrl, setInputAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [publicScoreboard, setPublicScoreboard] = useState(true);
  const [hideEmailCommunity, setHideEmailCommunity] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [showPasscodeSuccess, setShowPasscodeSuccess] = useState(false);

  const [notifyDailyReminders, setNotifyDailyReminders] = useState(true);
  const [notifyCommunityAlerts, setNotifyCommunityAlerts] = useState(true);
  const [notifyEmailSummary, setNotifyEmailSummary] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');

  const [searchFaq, setSearchFaq] = useState('');
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [showSupportSuccess, setShowSupportSuccess] = useState(false);

  const [acceptedAdditionalTerms, setAcceptedAdditionalTerms] = useState(true);

  const faqs = [
    { id: 1, q: '¿Cómo funciona la repetición espaciada?', a: 'El sistema registra las palabras que guardas y te pregunta según su nivel de dificultad. Se recomiendan repasos a las 24 horas, 3 días y 7 días.' },
    { id: 2, q: '¿Cuándo gano más puntos de experiencia (XP)?', a: 'Ganas +100 XP por lección completada, +50 XP por publicar en foros, +20 XP por guardar vocabulario con el lente y +100 XP por los desafíos semanales.' },
    { id: 3, q: '¿Qué incluye la suscripción Premium con Stripe?', a: 'Acceso a análisis de pronunciación de voz ilimitados con el Host IA, subida libre de fotos reales al lente inteligente y diplomas oficiales digitales.' },
    { id: 4, q: '¿Puedo cambiar de nivel de inglés?', a: '¡Claro! En la sección de configuración de cuenta, o al pasar de hito, puedes variar entre Principiante (A1-A2), Intermedio (B1-B2) y Avanzado (C1-C2).' }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchFaq.toLowerCase()) || 
    f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = showCustomAvatarInput && customAvatarUrl.trim() ? customAvatarUrl.trim() : inputAvatarUrl;
    onUpdateProfile(inputName, inputEmail, inputLevel, finalAvatar);
    setIsSaved(true);
    onEarnXp(25);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage || !supportSubject) return;
    setShowSupportSuccess(true);
    onEarnXp(30);
    setSupportMessage('');
    setSupportSubject('');
    setTimeout(() => {
      setShowSupportSuccess(false);
    }, 4000);
  };

  const glassClass = isDarkMode ? 'glass text-white' : 'glass-light text-slate-800';
  const textTitleClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSubClass = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const bgCardClass = isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-200/50 border-slate-300/40';
  const textMutedClass = isDarkMode ? 'text-slate-500' : 'text-slate-400';

  return (
    <div id="user-profile-screen" className="space-y-6">
      <div className="flex flex-col gap-1.5 text-left">
        <span className="font-academy text-brand-orange text-3xl font-semibold">Tus Ajustes</span>
        <h1 className={`font-display font-extrabold text-2xl ${textTitleClass} tracking-tight`}>Ajustes y Perfil de Usuario</h1>
        <p className={`${textSubClass} text-sm`}>Configura tu identidad, domina la privacidad, cambia el tema visual y pon en orden tus notificaciones.</p>
      </div>

      <div className={`p-6 rounded-3xl ${glassClass} border ${isDarkMode ? 'border-white/10' : 'border-slate-300/40'} flex flex-col items-center text-center space-y-4`}>
        <div className="relative">
          <img 
            src={showCustomAvatarInput && customAvatarUrl.trim() ? customAvatarUrl : inputAvatarUrl} 
            alt="User Avatar" 
            className="w-24 h-24 rounded-full object-cover border-4 border-brand-orange shadow-lg shadow-brand-orange/20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 bg-brand-purple text-white p-1.5 rounded-full shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <div>
          <h2 className={`font-display font-bold text-lg ${textTitleClass}`}>{userName}</h2>
          <span className="text-xs px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange rounded-full font-bold inline-block mt-1">
            Nivel: {userLevel}
          </span>
          <span className={`block text-xs font-mono mt-1.5 ${textSubClass}`}>{userEmail}</span>
        </div>
      </div>

      <div className="space-y-4 text-left">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 select-none">
          {[
            { id: 'profile', label: 'Cuenta 👤', icon: User },
            { id: 'theme', label: 'Apariencia 🎨', icon: Moon },
            { id: 'security', label: 'Privacidad 🔒', icon: Shield },
            { id: 'notifications', label: 'Avisos 🔔', icon: Bell },
            { id: 'help', label: 'Ayuda 💬', icon: HelpCircle },
            { id: 'terms', label: 'Términos 📂', icon: FileText },
          ].map((sub) => {
            const isActive = activeSubSection === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSubSection(sub.id as any)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-orange border-brand-orange text-white font-extrabold shadow-md shadow-brand-orange/15'
                    : isDarkMode 
                      ? 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      : 'border-slate-300/60 bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        <div className={`p-5 rounded-3xl ${glassClass} border ${isDarkMode ? 'border-white/10' : 'border-slate-300/40'} space-y-6`}>
          {activeSubSection === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <h3 className={`font-display font-extrabold text-md ${textTitleClass} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} pb-3 flex items-center gap-2`}>
                <span>Configuración de Cuenta e Identity</span>
              </h3>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Cambia tu Avatar (Preinstalados o Foto Real URL):</label>
                <div className="flex gap-2 px-1 py-1">
                  {PRESET_AVATARS.map((url, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setInputAvatarUrl(url);
                        setShowCustomAvatarInput(false);
                      }}
                      className="relative rounded-full focus:outline-none cursor-pointer"
                    >
                      <img 
                        src={url} 
                        alt="Preset choice" 
                        className={`w-11 h-11 rounded-full object-cover transition-all ${
                          !showCustomAvatarInput && inputAvatarUrl === url 
                            ? 'ring-4 ring-brand-orange scale-105' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      {!showCustomAvatarInput && inputAvatarUrl === url && (
                        <div className="absolute -top-1 -right-1 bg-brand-orange text-white p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                    className={`w-11 h-11 rounded-full border border-dashed flex flex-col items-center justify-center text-xs transition-colors cursor-pointer ${
                      showCustomAvatarInput 
                        ? 'border-brand-orange text-brand-orange bg-brand-orange/10' 
                        : isDarkMode ? 'border-white/20 hover:border-white/40 text-slate-400' : 'border-slate-300 hover:border-slate-500 text-slate-600'
                    }`}
                    title="Poner foto real"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>

                {showCustomAvatarInput && (
                  <div className="p-3.5 rounded-2xl bg-brand-orange/5 border border-brand-orange/20 space-y-2 animate-fade-in">
                    <span className="text-[10px] font-bold text-brand-orange block">Enlace de tu Foto Real (Instagram, Unsplash, Google, etc.):</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... o URL real"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className={`w-full rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-orange ${isDarkMode ? 'bg-black/30 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    />
                    <p className="text-[9px] text-slate-400">Pega un enlace seguro de imagen HTTPS directo para personalizar tu ficha.</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4.5">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nombre del Estudiante</span>
                  <input
                    required
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className={`w-full ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-800'} border rounded-xl p-3 text-xs focus:outline-none focus:border-brand-orange`}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Correo Electrónico de Contacto</span>
                  <input
                    required
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className={`w-full ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-800'} border rounded-xl p-3 text-xs focus:outline-none focus:border-brand-orange`}
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Nivel de Inglés Primario</span>
                  <select
                    value={inputLevel}
                    onChange={(e) => setInputLevel(e.target.value)}
                    className={`w-full ${isDarkMode ? 'bg-zinc-900 border-white/10 text-white font-mono' : 'bg-white border-slate-300 text-slate-800'} border p-3 rounded-xl text-xs focus:outline-none focus:border-brand-orange`}
                  >
                    <option value="A1-A2 Principiante">A1-A2 Principiante (Calle cero)</option>
                    <option value="B1-B2 Intermedio">B1-B2 Intermedio (Integración)</option>
                    <option value="C1-C2 Avanzado">C1-C2 Avanzado (Fluidez laboral)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                {isSaved ? (
                  <span className="text-xs font-bold text-brand-success flex items-center gap-1.5 animate-slide-in">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> ¡Guardado con Éxito (+25 XP)!
                  </span>
                ) : (
                  <span className={`text-[10px] ${textMutedClass}`}>Cambiar datos te da puntos de preparación.</span>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-brand-orange hover:bg-brand-coral font-bold text-white text-xs shadow-lg shadow-brand-orange/15 transition-all pointer active:scale-95"
                >
                  Guardar Cambios (+25 XP)
                </button>
              </div>
            </form>
          )}

          {activeSubSection === 'theme' && (
            <div className="space-y-5">
              <h3 className={`font-display font-extrabold text-md ${textTitleClass} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} pb-3 flex items-center justify-between`}>
                <span>Apariencia y Colores de la Academia</span>
                <span className="text-xs px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded-full font-bold">Tema Universal</span>
              </h3>

              <p className="text-xs leading-normal text-slate-400">
                Selecciona tu modo visual de estudio. El modo claro es ideal para leer al sol o revisar el vocabulario rápidamente. El modo oscuro protege tus ojos en repasos nocturnos o simulaciones de voz.
              </p>

              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => onToggleTheme(false)}
                  className={`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    !isDarkMode 
                      ? 'border-brand-orange bg-brand-orange/10 text-slate-900 font-extrabold shadow-md' 
                      : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Sun className={`w-8 h-8 ${!isDarkMode ? 'text-brand-orange' : 'text-slate-500'}`} />
                  <div>
                    <span className="text-xs block font-bold">Modo Claro 🌞</span>
                    <span className="text-[10px] text-slate-400 font-normal">Contraste diurno alto</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTheme(true)}
                  className={`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    isDarkMode 
                      ? 'border-brand-orange bg-brand-orange/10 text-white font-extrabold shadow-md' 
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <Moon className={`w-8 h-8 ${isDarkMode ? 'text-brand-orange' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs block font-bold">Modo Oscuro 🌙</span>
                    <span className="text-[10px] text-slate-500 font-normal">Protección azul nocturna</span>
                  </div>
                </button>
              </div>

              <div className="bg-brand-violet/10 p-3.5 rounded-2xl border border-brand-violet/20 flex gap-2 text-xs">
                <Sparkles className="w-5 h-5 text-brand-violet shrink-0" />
                <span className="text-slate-300 leading-snug">
                  ¡Súper! Cambiar de tema alternará instantáneamente los fondos, la legibilidad de las tarjetas de repetición y los menús del foro.
                </span>
              </div>
            </div>
          )}

          {activeSubSection === 'security' && (
            <div className="space-y-5 text-left">
              <h3 className={`font-display font-extrabold text-md ${textTitleClass} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} pb-3`}>
                <span>Privacidad, Seguridad y Protección Jurídica</span>
              </h3>

              <div className="space-y-4">
                <label className="flex items-start justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 pointer select-none">
                  <div className="space-y-0.5 pr-2">
                    <span className={`text-xs font-bold block ${textTitleClass}`}>Clasificación Pública y Scoreboard</span>
                    <span className="text-[10px] text-slate-400 block leading-normal">Permitir que otros hispanos vean tus XP en la liga de Texas.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicScoreboard}
                    onChange={(e) => setPublicScoreboard(e.target.checked)}
                    className="accent-brand-orange scale-110 mt-1 cursor-pointer"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 pointer select-none">
                  <div className="space-y-0.5 pr-2">
                    <span className={`text-xs font-bold block ${textTitleClass}`}>Ocultar Correo en Foros</span>
                    <span className="text-[10px] text-slate-400 block leading-normal">Muestra solo tu nombre de pila en tus consultas comunitarias escolares.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hideEmailCommunity}
                    onChange={(e) => setHideEmailCommunity(e.target.checked)}
                    className="accent-brand-orange scale-110 mt-1 cursor-pointer"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 pointer select-none">
                  <div className="space-y-0.5 pr-2">
                    <span className={`text-xs font-bold block ${textTitleClass}`}>Guardado Seguro de Sesión (MFA)</span>
                    <span className="text-[10px] text-slate-400 block leading-normal">Autenticación de dos pasos con tu correo ante accesos sospechosos.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => {
                      setTwoFactorAuth(e.target.checked);
                      if (e.target.checked) onEarnXp(10);
                    }}
                    className="accent-brand-orange scale-110 mt-1 cursor-pointer"
                  />
                </label>

                <div className="flex flex-col gap-2 p-3.5 bg-black/20 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className={`font-bold block ${textTitleClass}`}>Clave de Bloqueo de 4 dígitos</span>
                      <span className="text-[10px] text-slate-400 block">Exige PIN al iniciar la app EasyGo.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPasscodeEnabled(!passcodeEnabled);
                        setShowPasscodeSuccess(true);
                        setTimeout(() => setShowPasscodeSuccess(false), 2500);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                        passcodeEnabled ? 'bg-brand-success text-white' : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {passcodeEnabled ? 'Habilitado ✓' : 'Habilitar'}
                    </button>
                  </div>
                  {showPasscodeSuccess && (
                    <span className="text-[10px] text-brand-success font-bold mt-1 block">
                      {passcodeEnabled ? '¡PIN de seguridad activo! El simulador guardó tu clave local 4242.' : 'Clave de PIN removida correctamente.'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className={`font-display font-extrabold text-md ${textTitleClass} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} pb-3`}>
                <span>Configuración de Alertas y Avisos Diarios</span>
              </h3>

              <div className="space-y-4">
                <label className="flex items-start justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 pointer select-none">
                  <div className="space-y-0.5 pr-2">
                    <span className={`text-xs font-bold block ${textTitleClass}`}>Avisos Diarios para Mantener Racha</span>
                    <span className="text-[10px] text-slate-400 block leading-normal">Enviar un recordatorio diario a tu dispositivo. ¡Racha activa de {7} días!</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyDailyReminders}
                    onChange={(e) => setNotifyDailyReminders(e.target.checked)}
                    className="accent-brand-orange scale-110 mt-1 cursor-pointer"
                  />
                </label>

                {notifyDailyReminders && (
                  <div className={`p-3 rounded-2xl border text-xs animate-fade-in flex items-center justify-between ${isDarkMode ? 'bg-black/20 border border-white/5' : 'bg-slate-100 border border-slate-200'}`}>
                    <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Hora de notificación preferida:</span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className={`rounded-xl p-2 text-xs uppercase focus:outline-none focus:border-brand-orange ${isDarkMode ? 'bg-zinc-800 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    />
                  </div>
                )}

                <label className="flex items-start justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 pointer select-none">
                  <div className="space-y-0.5 pr-2">
                    <span className={`text-xs font-bold block ${textTitleClass}`}>Comentarios de Comunidad en Foros</span>
                    <span className="text-[10px] text-slate-400 block leading-normal font-sans">Avisarme cuando un compañero responda a mis dudas de escuela o trabajo.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyCommunityAlerts}
                    onChange={(e) => setNotifyCommunityAlerts(e.target.checked)}
                    className="accent-brand-orange scale-110 mt-1 cursor-pointer"
                  />
                </label>

                <label className="flex items-start justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 pointer select-none">
                  <div className="space-y-0.5 pr-2">
                    <span className={`text-xs font-bold block ${textTitleClass}`}>Resumen semanal por Correo</span>
                    <span className="text-[10px] text-slate-400 block leading-normal font-sans">Boletín con tu avance de vocabulario dominado y los modismos más populares en Texas.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyEmailSummary}
                    onChange={(e) => setNotifyEmailSummary(e.target.checked)}
                    className="accent-brand-orange scale-110 mt-1 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {activeSubSection === 'help' && (
            <>
              <div className="space-y-5 text-left">
              <h3 className={`font-display font-extrabold text-md ${textTitleClass} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} pb-3`}>
                <span>Preguntas Frecuentes y Soporte Técnico</span>
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Buscar soluciones en el Centro de Ayuda..."
                  value={searchFaq}
                  onChange={(e) => setSearchFaq(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-orange ${isDarkMode ? 'bg-black/30 border border-white/5 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                />

                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveFaqId(activeFaqId === faq.id ? null : faq.id)}
                      className={`w-full font-bold text-xs flex justify-between items-center cursor-pointer text-left ${textTitleClass}`}
                    >
                      <span>{faq.q}</span>
                      <span className="text-brand-orange">{activeFaqId === faq.id ? '▲' : '▼'}</span>
                    </button>
                    {activeFaqId === faq.id && (
                      <p className={`text-[11px] leading-relaxed mt-2.5 p-2.5 rounded-xl font-sans border-l-2 border-brand-orange ${isDarkMode ? 'text-slate-300 bg-black/20' : 'text-slate-700 bg-slate-100 border-slate-200'}`}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}

                {filteredFaqs.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">No se hallaron coincidencias de FAQ.</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3 pt-3.5 border-t border-white/5">
                <span className="text-[10px] uppercase font-bold text-brand-orange block">¿Aún tienes dudas? Reportar directamente:</span>
                
                <input
                  required
                  type="text"
                  placeholder="Tema de tu consulta (Ej. Problema de voz Host IA)..."
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-orange`}
                />

                <textarea
                  required
                  rows={2}
                  placeholder="Explícanos tu situación en español para priorizarlo..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-orange resize-none`}
                />

                {showSupportSuccess && (
                  <div className="p-3.5 bg-brand-success/15 border border-brand-success/40 rounded-2xl flex items-center gap-2 text-xs animate-slide-in text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>¡Ticket enviado! Nuestro equipo responderá en un plazo de 12h. +30 XP otorgados.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-orange hover:bg-brand-coral font-bold text-white text-xs rounded-xl transition-all shadow-md active:scale-95 text-center pointer"
                >
                  Enviar Ticket Directo a EasyGo Support (+30 XP) ✉️
                </button>
              </form>
            </>
          )}

          {activeSubSection === 'terms' && (
            <div className="space-y-5">
              <h3 className={`font-display font-extrabold text-md ${textTitleClass} border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} pb-3`}>
                <span>Términos, Condiciones y Licencias de Academia</span>
              </h3>

              <div className={`p-3.5 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-slate-50'} text-[10px] leading-relaxed ${textSubClass} max-h-[180px] overflow-y-auto scrollbar-none space-y-2 border ${isDarkMode ? 'border-white/5' : 'border-slate-200'} text-left font-serif`}>
                <h4 className="font-bold text-xs">CONTRATO DE LICENCIA DEL ALUMNO (EULA)</h4>
                <p>Bienvenido a EasyGo Academy, una solución móvil de integración lingüística para familias y trabajadores hispanohablantes en Estados Unidos.</p>
                <p><strong>1. Inteligencia Artificial y Datos:</strong> Las simulaciones e interacciones de voz generadas por nuestros Hosts son impulsadas por modelos de traducción integrados. No se almacena audio personal en la nube permanente para resguardar tu privacidad.</p>
                <p><strong>2. Uso del Lente de Escaneo:</strong> Al usar el scanner inteligente para objetos de tu hogar, autorizas el uso del lente de cámara de forma estrictamente local para el análisis instantáneo.</p>
                <p><strong>3. Responsabilidad:</strong> El contenido provisto para hitos conversacionales (médicos, escolares, inmobiliarios) sirve como fin puramente educativo. No constituye consejería legal ni técnica formal.</p>
                <p><strong>4. Suscripciones y Pagos Seguro:</strong> Cualquier compra simulada por Stripe o el uso de cupones se procesa mediante una pasarela segura dedicada exclusivamente de prueba escolar.</p>
              </div>

              <label className="flex items-center gap-2 text-xs pt-1 select-none pointer">
                <input
                  type="checkbox"
                  checked={acceptedAdditionalTerms}
                  onChange={(e) => setAcceptedAdditionalTerms(e.target.checked)}
                  className="accent-brand-orange"
                />
                <span className={textTitleClass}>Acepto los términos de servicio supervivencia actualizados.</span>
              </label>
            </div>
          )}

        </div>
      </div>

      <div className="pt-4 border-t border-white/5 text-center">
        <button
          onClick={() => {
            const confirmed = window.confirm('¿Estás seguro de que quieres cerrar la sesión de tu cuenta en EasyGo? Tu progreso actual de XP estará protegido.');
            if (confirmed) {
              onLogout();
            }
          }}
          className="px-6 py-3.5 bg-brand-error/15 hover:bg-brand-error/25 border border-brand-error/30 text-brand-error rounded-3xl font-bold text-xs pointer transition-all active:scale-95 inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4 text-brand-error shrink-0" /> Cerrar Sesión de EasyGo
        </button>
      </div>
    </div>
  );
}
