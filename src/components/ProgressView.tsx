import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { INITIAL_VOCABULARY } from '../data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Dot } from 'recharts';
import { Trophy, Flame, Play, Search, Filter, ShieldCheck, CreditCard, Sparkles, AlertCircle, Bookmark, Percent, Trash } from 'lucide-react';

interface ProgressViewProps {
  vocabularyList: VocabularyItem[];
  onEarnXp: (xp: number) => void;
  userXp: number;
  userStreak: number;
  isDarkMode: boolean;
}

export default function ProgressView({ vocabularyList, onEarnXp, userXp, userStreak, isDarkMode }: ProgressViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  
  // Local Vocabulary Bank state allowing interactive mastery changes
  const [localVocab, setLocalVocab] = useState<VocabularyItem[]>(vocabularyList.length > 0 ? vocabularyList : INITIAL_VOCABULARY);

  // Billing and Subscription checkout simulator states
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'semiannual'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckoutCompleted, setIsCheckoutCompleted] = useState(false);

  // Stripe simulator credit card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // Weekly XP mock stats data for Recharts
  const weeklyData = [
    { name: 'Lun', xp: 120 },
    { name: 'Mar', xp: 240 },
    { name: 'Mié', xp: 180 },
    { name: 'Jue', xp: 350 },
    { name: 'Vie', xp: 90 },
    { name: 'Sáb', xp: 450 },
    { name: 'Dom', xp: userXp % 300 } // link to actual user state
  ];

  // Core English skills data for Recharts
  const skillsData = [
    { subject: 'Fluidez oral (IA)', A: 68, fullMark: 100 },
    { subject: 'Fonética (TH/R)', A: 45, fullMark: 100 },
    { subject: 'Gramática', A: 75, fullMark: 100 },
    { subject: 'Vocabulario', A: 82, fullMark: 100 },
    { subject: 'Cultura US', A: 90, fullMark: 100 }
  ];

  const triggerTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateWordMastery = (wordId: string, value: number) => {
    setLocalVocab(prev => prev.map(item => {
      if (item.id === wordId) {
        return { ...item, masteryLevel: Math.max(0, Math.min(5, value)) };
      }
      return item;
    }));
    onEarnXp(15);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'EASYGO50') {
      setCouponApplied(true);
      setDiscountAmount(50); // 50% discount
    } else {
      setCouponError('Código no válido. Prueba el cupón "EASYGO50" generado por tu administrador.');
    }
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) return;
    setIsCheckoutCompleted(true);
    onEarnXp(200); // XP bonus for subscription!
  };

  const filteredVocab = localVocab.filter(item => {
    const matchSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategoryFilter === 'all' || item.category === activeCategoryFilter;
    return matchSearch && matchCategory;
  });

  const costMap = {
    monthly: 19.99,
    quarterly: 49.99,
    semiannual: 79.99
  };

  const finalCost = couponApplied 
    ? (costMap[selectedPlan] * 0.5).toFixed(2) 
    : costMap[selectedPlan].toFixed(2);

  // Derive simple statistics
  const masteredCount = localVocab.filter(v => v.masteryLevel >= 4).length;

  const pageTextClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const pageBgClass = isDarkMode ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-900';
  const panelClass = isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white/95 border border-slate-200 shadow-sm';

  return (
    <div id="progress-view-root" className={`space-y-6 ${pageBgClass}`}>
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <span className="font-academy text-brand-orange text-3xl font-semibold">Tus Logros</span>
        <h1 className={`font-display font-extrabold text-2xl tracking-tight ${pageTextClass}`}>Rendimiento y Memoria</h1>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Visualiza tus fortalezas analizadas por IA, repasa tu vocabulario guardado y asegura tu pase premium.</p>
      </div>

      {/* Grid: Overview level cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left flex items-start gap-3">
          <Trophy className="w-8 h-8 text-brand-orange shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntos XP</span>
            <span className={`text-lg font-bold font-mono mt-0.5 block ${pageTextClass}`}>{userXp}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left flex items-start gap-3">
          <Flame className="w-8 h-8 text-brand-orange shrink-0 animate-pulse-slow" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Racha Activa</span>
            <span className={`text-lg font-bold font-mono mt-0.5 block ${pageTextClass}`}>{userStreak} días</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left flex items-start gap-3 col-span-2">
          <ShieldCheck className="w-8 h-8 text-brand-violet shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Vocabulario Dominado</span>
            <span className={`text-sm font-bold mt-1 block ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {masteredCount} de {localVocab.length} palabras (+4 estrellas)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Recharts Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Activity Progress Bar */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3">
          <div>
            <h4 className="font-bold text-xs text-brand-orange uppercase font-mono tracking-widest block">Actividad de Estudio Semanal</h4>
            <span className="text-xs text-slate-400 mt-1 block">Rendimiento de XP acumulados en las últimas rondas escolares</span>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#120E2E', border: '1px solid rgba(250,250,250,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="xp" fill="#FF6B35" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-3">
          <div>
            <h4 className="font-bold text-xs text-brand-orange uppercase font-mono tracking-widest block">Radar de Competencias Orales</h4>
            <span className="text-xs text-slate-400 mt-1 block">Análisis comparativo de tus fortalezas comunicativas bajo la IA</span>
          </div>

          <div className="h-44 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={9} />
                <Radar name="Mis Competencias" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vocabulary Tracker Block with Interactive Spaced Repetition */}
      <div className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className={`font-bold text-sm font-display ${pageTextClass}`}>Tus Tarjetas de Repetición Espaciada 📖</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-normal">Repasa tus palabras guardadas, escúchalas y califica de 1 a 5 tu nivel de dominio para el algoritmo.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-white/5 rounded-xl border border-white/5 px-2.5 items-center w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar palabra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent border-none text-xs p-2 focus:outline-none placeholder-slate-500 w-full ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              />
            </div>

            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className={`p-2 rounded-xl pointer shrink-0 ${isDarkMode ? 'border border-white/5 bg-zinc-900 text-white' : 'border border-slate-200 bg-white text-slate-900'}`}
            >
              <option value="all">Todas categorías</option>
              <option value="Housing">Housing</option>
              <option value="Escaner">Escaner</option>
              <option value="Workplace">Workplace</option>
              <option value="Leisure/Shopping">Leisure/Shopping</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        {/* Vocabulary Deck grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredVocab.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/5 hover:border-slate-850 rounded-2xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <h4 className={`font-bold text-sm flex items-center gap-1.5 leading-none ${pageTextClass}`}>
                    {item.word}
                    <button 
                      onClick={() => triggerTTS(item.word)}
                      className="p-1 rounded-full bg-brand-orange/20 hover:bg-brand-orange/40 text-brand-orange pointer transition-colors"
                      title="Pronunciación"
                    >
                      <Play className="w-3 h-3 fill-brand-orange" />
                    </button>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1.5">{item.phonetic}</span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-semibold block ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{item.translation}</span>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-violet bg-brand-violet/10 px-2 py-0.5 rounded mt-1.5 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Spaced Repetition Mastery Stars Tracker */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-medium font-sans">Confianza (0-5★):</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateWordMastery(item.id, star)}
                      className={`text-sm tracking-wide transition-all pointer ${
                        star <= item.masteryLevel ? 'text-brand-orange font-bold scale-110' : 'text-slate-600 font-normal hover:text-slate-350'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {filteredVocab.length === 0 && (
            <div className="col-span-full py-8 text-center bg-white/5 rounded-2xl">
              <Bookmark className="w-8 h-8 text-zinc-650 opacity-20 mx-auto" />
              <p className="text-xs text-slate-500 mt-2">No se encontraron palabras guardadas que coincidan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stripe Payment & Checkout Simulator Billing Segment */}
      <div className="glass rounded-3xl p-6 border border-white/10 space-y-6 text-left relative overflow-hidden">
        {/* Background visual brand badge */}
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-brand-violet/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
          <div className="text-left">
            <span className="text-[10px] uppercase font-extrabold text-brand-orange tracking-widest font-mono">Premium Access</span>
            <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>EasyGo Unlimited Subscription</h3>
            <p className="text-xs text-slate-400">Desbloquea tutorías orales ilimitadas con la IA y el escáner de cámara real.</p>
          </div>

          <div className={`flex items-center gap-2 rounded-2xl p-2 px-4 shrink-0 ${isDarkMode ? 'bg-brand-purple/20 border border-brand-violet/20' : 'bg-slate-100 border border-slate-200'}`}>
            <ShieldCheck className="w-5 h-5 text-brand-violet shrink-0" />
            <span className={`text-[10px] font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Pago Legal & Seguro</span>
          </div>
        </div>

        {!isCheckoutCompleted ? (
          <form onSubmit={handleCompletePayment} className="grid md:grid-cols-2 gap-6 relative z-10">
            {/* Left side: Plan choice */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Selecciona tu suscripción extendida:</label>
              
              <div className="space-y-3">
                {[
                  { id: 'monthly', term: 'Suscripción Mensual 🗓️', cost: '19.99', desc: 'Renovación automática regular' },
                  { id: 'quarterly', term: 'Suscripción Trimestral 🌟', cost: '49.99', desc: 'Ahorra 15%. Ideal para consistencia' },
                  { id: 'semiannual', term: 'Suscripción Semestral 🎓', cost: '79.99', desc: 'Ahorra 35%. Dominio garantizado' }
                ].map((plan) => (
                  <label
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as any)}
                    className={`p-4 rounded-2xl border flex items-center justify-between pointer transition-all ${
                      selectedPlan === plan.id 
                        ? 'border-brand-orange bg-brand-orange/15 text-white' 
                        : isDarkMode 
                          ? 'border-white/5 bg-white/5 text-slate-300' 
                          : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <div>
                      <h4 className={`text-xs font-bold leading-none mb-1 ${selectedPlan === plan.id ? 'text-white' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>{plan.term}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">{plan.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-sm font-extrabold font-mono ${selectedPlan === plan.id ? 'text-white' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>${plan.cost}</span>
                      <span className="text-[9px] text-slate-500 block">USD</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Coupon Field */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Ingresa cupón de descuento:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. EASYGO50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs uppercase focus:outline-none focus:border-brand-orange ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="p-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300 pointer transition-all"
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-brand-error font-medium mt-1">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[10px] text-brand-success font-bold mt-1 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> ¡Cupón EASYGO50 aplicado con éxito! Descuento del 50%.
                  </p>
                )}
              </div>
            </div>

            {/* Right side: Mock Credit card checkout form with Stripe layout */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Ingresa tu tarjeta de crédito:</label>

<div className={`rounded-2xl p-4 space-y-3.5 ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white border border-slate-200'}`}>
                  <div className={`flex justify-between items-center rounded-xl p-2 text-xs ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>
                    <span className={`text-[10px] flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <CreditCard className="w-4 h-4 text-brand-violet shrink-0" /> Stripe Secure Tunnel
                    </span>
                    <span className={`text-[9px] font-bold font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>TLS 1.3 Certified</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Card Number</span>
                  <input
                    required
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className={`w-full rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-brand-orange ${isDarkMode ? 'bg-black/40 border border-white/5 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium">Expiration</span>
                    <input
                      required
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className={`w-full rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-brand-orange ${isDarkMode ? 'bg-black/40 border border-white/5 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-medium">CVC</span>
                    <input
                      required
                      type="password"
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className={`w-full rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-brand-orange ${isDarkMode ? 'bg-black/40 border border-white/5 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Big Pay button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white text-xs sm:text-sm font-bold shadow-xl shadow-brand-orange/15 hover:opacity-95 active:scale-95 transition-all text-center pointer"
              >
                Pagar ${finalCost} USD con Stripe 🚀
              </button>
            </div>
          </form>
        ) : (
          /* PAYMENT SUCCESS PANEL */
          <div className="text-center py-6 space-y-4 animate-fade-in relative z-10">
            <div className="w-16 h-16 bg-brand-success/10 border border-brand-success rounded-full flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Suscripción Activada con Stripe</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                ¡Enhorabuena, amigazo! Eres miembro premium ilimitado de EasyGo Academy. Has ganado +200 XP por tu suscripción activa.
              </p>
            </div>
            <button
              onClick={() => setIsCheckoutCompleted(false)}
              className="px-6 py-2 rounded-full border border-white/10 text-xs text-slate-400 hover:text-white pointer transition-colors"
            >
              Simular Otro Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
