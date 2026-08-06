import React, { useState, useEffect, useRef } from 'react';
import { PRESET_DETECTIONS } from '../data';
import { VocabularyItem } from '../types';
import { Camera, Volume2, Save, Sparkles, RefreshCw, Layers, Check, Info } from 'lucide-react';

interface ObjectScannerProps {
  onEarnXp: (xp: number) => void;
  onAddVocabulary: (item: VocabularyItem) => void;
  isDarkMode: boolean;
}

export default function ObjectScanner({ onEarnXp, onAddVocabulary, isDarkMode }: ObjectScannerProps) {
  const [activeDetectionIdx, setActiveDetectionIdx] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showSavingSuccess, setShowSavingSuccess] = useState<boolean>(false);
  
  // Real camera stream states
  const webVideoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);

  // Stop current video stream
  const stopCameraStream = () => {
    if (webVideoRef.current && webVideoRef.current.srcObject) {
      const stream = webVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      webVideoRef.current.srcObject = null;
    }
  };

  // Launch camera
  const startCameraStream = async () => {
    try {
      stopCameraStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      if (webVideoRef.current) {
        webVideoRef.current.srcObject = stream;
        webVideoRef.current.play().catch(err => console.log("Video play interrupted", err));
      }
      setHasCameraPermission(true);
      setUseRealCamera(true);
    } catch (e) {
      console.error("Camera access failed:", e);
      setHasCameraPermission(false);
      setUseRealCamera(false);
    }
  };

  // Turn off real camera on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const triggerDetectionScanner = () => {
    setIsScanning(true);
    setShowSavingSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      // Select another random detection item
      const nextIdx = (activeDetectionIdx + 1) % PRESET_DETECTIONS.length;
      setActiveDetectionIdx(nextIdx);
    }, 1200);
  };

  const triggerTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const activeObj = PRESET_DETECTIONS[activeDetectionIdx];

  const handleSaveToVocabulary = () => {
    // Construct new learned card vocabulary element
    const newLearnedCard: VocabularyItem = {
      id: `discovered-${Date.now()}-${activeObj.id}`,
      word: activeObj.word,
      translation: activeObj.translation,
      phonetic: activeObj.phonetic,
      category: "Escaner",
      difficulty: "easy",
      masteryLevel: 1, // starting learning mastery
      timesCorrect: 0,
      timesIncorrect: 0,
      lastReviewed: new Date().toISOString()
    };

    onAddVocabulary(newLearnedCard);
    onEarnXp(20); // Award XP
    setShowSavingSuccess(true);
    
    // Auto reset saving checked state
    setTimeout(() => {
      setShowSavingSuccess(false);
    }, 2500);

    // Speak audio
    triggerTTS(activeObj.word);
  };

  const pageTextClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const pageBgClass = isDarkMode ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-900';
  const sectionBg = isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white/95 border border-slate-200 shadow-sm';
  const inputClass = isDarkMode ? 'bg-zinc-950 border-white/10 text-white placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-500';

  return (
    <div id="object-scanner-container" className={`space-y-6 ${pageBgClass}`}>
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <span className="font-academy text-brand-orange text-3xl font-semibold">Cámara Inteligente</span>
        <h1 className={`font-display font-extrabold text-2xl tracking-tight ${pageTextClass}`}>Escáner de Objetos Reales</h1>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Apunta tu teléfono a cualquier objeto de tu casa para descubrir instantáneamente cómo se dice, se escribe y se pronuncia en inglés.</p>
      </div>

      {/* Main Viewfinder Section */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden relative min-h-[350px] flex flex-col justify-between">
        
        {/* Real video tag or simulated camera canvas backdrop */}
        {useRealCamera ? (
          <video
            ref={webVideoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          /* High-quality styled dynamic simulated canvas */
          <div className="absolute inset-0 w-full h-full z-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6">
            {/* Soft grid decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
            <Camera className="w-12 h-12 text-zinc-650 opacity-20 animate-pulse" />
            <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Simulador de Cámara Inteligente Activo</p>
          </div>
        )}

        {/* Viewfinder Bounding HUD lines overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none">
          {/* Top HUD metrics */}
          <div className="flex justify-between items-center bg-black/60 backdrop-blur-md rounded-xl p-2.5 px-4 border border-white/5 max-w-max mx-auto">
            <span className="flex h-2 w-2 relative shrink-0 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white">
              {isScanning ? 'PROCESANDO TEXTO...' : 'HUD CÁMARA: LISTO'}
            </span>
          </div>

          {/* Central Squircle Target with neon corners */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto border-2 border-dashed border-white/20 rounded-3xl relative flex items-center justify-center">
            {/* Neon glowing corners */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-brand-orange rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-brand-orange rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-brand-orange rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-brand-orange rounded-br-xl"></div>

            {isScanning && (
              /* Laser scanner bar animation */
              <div className="absolute w-full h-1 bg-brand-orange/60 shadow-[0_0_15px_#FF5E36] animate-pulse rounded-full top-1/4 left-0"></div>
            )}
          </div>

          <span className="text-[9px] font-mono text-center text-slate-400">EasyGo Lens v1.0 • Coloca el objeto en el centro</span>
        </div>

        {/* Real / Mock Camera Switch Overlay bottom elements */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          {!useRealCamera ? (
            <button
              onClick={startCameraStream}
              className="px-3 py-1.5 rounded-lg bg-black/75 hover:bg-slate-900 border border-white/10 text-[10px] text-white font-bold pointer transition-all flex items-center gap-1 shrink-0"
            >
              📷 Activar Cámara Real
            </button>
          ) : (
            <button
              onClick={() => {
                stopCameraStream();
                setUseRealCamera(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-black/75 border border-white/10 text-[10px] text-white font-bold pointer transition-all shrink-0"
            >
              ❌ Apagar Cámara
            </button>
          )}
        </div>
      </div>

      {/* Scene list control buttons allows pointing simulation */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-slate-400 block px-1">Simular apuntar a un objeto en el entorno:</label>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 select-none">
          {PRESET_DETECTIONS.map((det, index) => (
            <button
              key={det.id}
              onClick={() => {
                setActiveDetectionIdx(index);
                setShowSavingSuccess(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all pointer ${
                activeDetectionIdx === index
                  ? 'border-brand-orange bg-brand-orange/10 text-white font-bold'
                  : 'border-white/5 bg-white/5 text-slate-400 hover:border-slate-800'
              }`}
            >
              {det.word}
            </button>
          ))}
        </div>
      </div>

      {/* Target annotation and actions block */}
      <div className="glass rounded-3xl p-5 border border-white/10 space-y-4 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-brand-orange block">Lente de Análisis</span>
            <h2 className="text-2xl font-extrabold font-display text-white mt-0.5">{activeObj.word}</h2>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-brand-violet font-semibold">
              <span>{activeObj.phonetic}</span>
              <button 
                onClick={() => triggerTTS(activeObj.word)}
                className="p-1 rounded-full bg-brand-violet/20 hover:bg-brand-violet/40 text-brand-violet pointer transition-colors"
                title="Escuchar"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Significado</span>
            <span className="text-lg font-bold text-slate-200 block">{activeObj.translation}</span>
          </div>
        </div>

        {/* Educational info context */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-xs leading-relaxed flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <span>Para guardar esta ficha con sonido y agregarlo a tu banco de repetición espaciada, presiona "Guardar vocabulario" abajo. Descubrir palabras nuevas te otorga +20 XP.</span>
        </div>

        {/* Action button row */}
        <div className="flex gap-2.5">
          <button
            onClick={triggerDetectionScanner}
            className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold hover:bg-white/10 text-xs pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-brand-orange" /> Escanear Siguiente
          </button>

          <button
            onClick={handleSaveToVocabulary}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-xs pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              showSavingSuccess
                ? 'bg-brand-success text-white shadow-lg shadow-brand-success/20'
                : 'bg-brand-orange text-white hover:bg-brand-coral shadow-lg shadow-brand-orange/15'
            }`}
          >
            {showSavingSuccess ? (
              <>
                <Check className="w-4 h-4 shrink-0" /> ¡Guardado con Éxito !
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" /> Guardar Vocabulario (+20 XP)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
