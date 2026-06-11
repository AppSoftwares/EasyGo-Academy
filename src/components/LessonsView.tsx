import React, { useState } from 'react';
import { Lesson } from '../types';
import { INITIAL_LESSONS } from '../data';
import { BookOpen, Trophy, Volume2, CheckCircle2, XCircle, ArrowRight, BookMarked, Play } from 'lucide-react';

interface LessonsViewProps {
  onEarnXp: (xp: number) => void;
  userLevel: string;
}

export default function LessonsView({ onEarnXp, userLevel }: LessonsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // Interactive quiz state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showCompletionPage, setShowCompletionPage] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos 📚' },
    { id: 'daily-conversations', label: 'Conversaciones 💬' },
    { id: 'pronunciation-mastery', label: 'Pronunciación 🎤' },
    { id: 'grammar-essentials', label: 'Gramática 📝' },
    { id: 'cultural-immersion', label: 'Cultura 🌎' },
    { id: 'phonetics', label: 'Fonética 🔊' }
  ];

  const difficulties = [
    { id: 'all', label: 'Todos los Niveles 🎯' },
    { id: 'beginner', label: 'A1-A2 Principiante 📚' },
    { id: 'intermediate', label: 'B1-B2 Intermedio 💬' },
    { id: 'advanced', label: 'C1-C2 Avanzado 💼' }
  ];

  const filteredLessons = INITIAL_LESSONS.filter((lesson) => {
    const matchCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'all' || lesson.level === selectedDifficulty;
    return matchCategory && matchDifficulty;
  });

  const triggerTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentStep(0);
    setSelectedOption(null);
    setHasCheckedAnswer(false);
    setQuizScore(0);
    setShowCompletionPage(false);
  };

  const handleOptionSelect = (opt: string) => {
    if (hasCheckedAnswer) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !activeLesson) return;
    const currentQuestion = activeLesson.content[currentStep];
    const isCorrect = selectedOption.startsWith(currentQuestion.answer);
    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }
    setHasCheckedAnswer(true);
    
    // Play pronunciation if audioText is present
    if (currentQuestion.audioText) {
      triggerTTS(currentQuestion.audioText);
    }
  };

  const handleNextStep = () => {
    if (!activeLesson) return;
    setSelectedOption(null);
    setHasCheckedAnswer(false);
    
    if (currentStep < activeLesson.content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCompletionPage(true);
      const earnedXp = activeLesson.xpReward;
      onEarnXp(earnedXp);
    }
  };

  return (
    <div id="lessons-view-container" className="space-y-6">
      {!activeLesson ? (
        <>
          {/* Headline */}
          <div className="flex flex-col gap-1.5">
            <span className="font-academy text-brand-orange text-3xl font-semibold">Tus Lecciones de Vida</span>
            <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">Estudios por Hitos Útiles</h1>
            <p className="text-slate-400 text-sm">Contenido práctico diseñado para resolver de verdad el día a día en los Estados Unidos.</p>
          </div>

          {/* Scrolling filter horizontal bar */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 select-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white shadow-md'
                    : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Level choice filtering dropdown */}
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  selectedDifficulty === diff.id
                    ? 'border-brand-orange bg-brand-orange/10 text-white'
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-slate-800'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>

          {/* Lessons Grid list */}
          <div id="lessons-grid" className="grid gap-4 sm:grid-cols-2">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleStartLesson(lesson)}
                  className="bg-brand-dark/40 border border-white/5 rounded-2xl p-5 hover:border-slate-700 transition-all group pointer flex flex-col justify-between hover:shadow-xl hover:translate-y-[-2px] duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full">
                        {lesson.category.replace("-", " ")}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {lesson.durationMinutes} min
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-white text-lg group-hover:text-brand-orange transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-brand-violet flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-brand-orange shrink-0" /> +{lesson.xpReward} XP
                    </span>
                    <button className="text-xs font-bold text-white group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                      Estudiar <ArrowRight className="w-4 h-4 text-brand-orange" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <span className="text-2xl">📚</span>
                <p className="text-slate-400 text-sm mt-2">No se encontraron lecciones en este nivel por ahora.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Quiz active interface */
        <div className="glass rounded-3xl p-6 relative border border-white/10 shadow-2xl">
          {/* Quiz Header Progress Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setActiveLesson(null)}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Cancelar
            </button>
            
            <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-orange to-brand-violet h-full transition-all duration-300"
                style={{ width: `${((currentStep + (showCompletionPage ? 1 : 0)) / activeLesson.content.length) * 100}%` }}
              />
            </div>

            <span className="text-xs font-mono font-bold text-white shrink-0">
              {showCompletionPage ? '100' : `${Math.round((currentStep / activeLesson.content.length) * 100)}`}%
            </span>
          </div>

          {!showCompletionPage ? (
            /* ACTIVE QUIZ STEP */
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-orange tracking-widest uppercase">
                  Paso {currentStep + 1} de {activeLesson.content.length}
                </span>
                <h2 className="text-xl font-bold font-display text-white mt-1 leading-snug">
                  {activeLesson.content[currentStep].question}
                </h2>
              </div>

              {/* Sound Play Trigger Button */}
              {activeLesson.content[currentStep].audioText && (
                <button
                  onClick={() => triggerTTS(activeLesson.content[currentStep].audioText!)}
                  className="flex items-center gap-2 self-start py-1.5 px-3 rounded-full bg-brand-violet/20 hover:bg-brand-violet/40 text-brand-violet font-semibold text-xs border border-brand-violet/30 transition-all pointer animate-pulse-slow active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-brand-orange" /> Escuchar Pronunciación Correcta
                </button>
              )}

              {/* Multiple Choice list */}
              <div className="space-y-3">
                {activeLesson.content[currentStep].options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isAnswerChecked = hasCheckedAnswer;
                  
                  // Style modifiers for answers validation
                  let optStyle = 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10';
                  if (isSelected) {
                    optStyle = 'border-brand-violet bg-brand-violet/15 text-white';
                  }

                  if (isAnswerChecked) {
                    const isCorrectOption = opt.startsWith(activeLesson.content[currentStep].answer);
                    if (isCorrectOption) {
                      optStyle = 'border-brand-success bg-brand-success/15 text-brand-success font-bold';
                    } else if (isSelected) {
                      optStyle = 'border-brand-error bg-brand-error/15 text-brand-error';
                    } else {
                      optStyle = 'opacity-30 border-white/5 bg-white/5 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleOptionSelect(opt)}
                      className={`w-full p-4 rounded-2xl text-left text-sm transition-all duration-200 border flex items-center justify-between ${optStyle} ${!isAnswerChecked && 'pointer'}`}
                    >
                      <span>{opt}</span>
                      {isAnswerChecked && opt.startsWith(activeLesson.content[currentStep].answer) && (
                        <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !opt.startsWith(activeLesson.content[currentStep].answer) && (
                        <XCircle className="w-5 h-5 text-brand-error shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action checking button and explanations display */}
              {!hasCheckedAnswer ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleCheckAnswer}
                  className={`w-full py-4 rounded-2xl text-sm font-bold shadow-lg transition-all ${
                    selectedOption 
                      ? 'bg-gradient-to-r from-brand-orange to-brand-purple text-white pointer hover:opacity-90 active:scale-95' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Verificar Respuesta 💡
                </button>
              ) : (
                <div className="space-y-4 animate-fade-in border-t border-white/5 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5">
                    <span className="text-xs uppercase font-extrabold text-brand-orange tracking-widest block mb-1">Explicación práctica:</span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {activeLesson.content[currentStep].explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white text-sm font-bold shadow-lg hover:opacity-95 pointer flex items-center justify-center gap-1.5"
                  >
                    {currentStep < activeLesson.content.length - 1 ? 'Siguiente Pregunta' : 'Completar Lección'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* COMPLETION CONGRATS SCREEN */
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-orange to-brand-purple flex items-center justify-center text-4xl mx-auto shadow-xl">
                🏆
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase text-brand-purple tracking-widest">Lección Terminada</span>
                <h2 className="text-2xl font-bold font-display text-white">
                  ¡Gran trabajo en la lección!
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Has completado &quot;{activeLesson.title}&quot; exitosamente y desbloqueado puntos de experiencia.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Recompensa</span>
                  <span className="text-brand-orange text-lg font-extrabold font-mono flex items-center justify-center gap-1">
                    +{activeLesson.xpReward} XP
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Aprobado</span>
                  <span className="text-brand-violet text-lg font-extrabold font-mono">
                    {quizScore}/{activeLesson.content.length}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveLesson(null)}
                className="px-8 py-3.5 rounded-full bg-brand-orange text-white text-sm font-bold shadow-lg hover:bg-brand-coral active:scale-95 transition-all pointer"
              >
                Volver a Lecciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
