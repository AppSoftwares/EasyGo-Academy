import React from 'react';
import { Card, Badge } from '../ui';
import { CheckCircle2, Lock, Star, Play } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  xpReward: number;
}

const milestones: Milestone[] = [
  { id: '1', title: 'En el Supermercado', description: 'Vocabulario básico y frases comunes en la caja.', status: 'completed', xpReward: 500 },
  { id: '2', title: 'Hablando con el Maestro', description: 'Reuniones escolares y progreso de tus hijos.', status: 'current', xpReward: 750 },
  { id: '3', title: 'Emergencias y Trámites', description: 'Llamadas al 911 y servicios básicos.', status: 'locked', xpReward: 1000 },
];

export const Roadmap: React.FC = () => {
  return (
    <div className="py-10 px-4 relative">
      {/* Path Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5E36] to-[#5D26C1] -translate-x-1/2 opacity-20" />

      <div className="space-y-16">
        {milestones.map((ms, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={ms.id} className="relative flex items-center justify-center">
              {/* Milestone Node */}
              <div className={`
                z-10 w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl border-4
                ${ms.status === 'completed' ? 'bg-[#00E676] border-white/20' :
                  ms.status === 'current' ? 'bg-[#FF5E36] border-white/20 animate-pulse' :
                  'bg-white/10 border-white/5 text-white/40'}
              `}>
                {ms.status === 'completed' ? <CheckCircle2 className="text-white" /> :
                 ms.status === 'current' ? <Play className="text-white fill-current" /> :
                 <Lock size={24} />}
              </div>

              {/* Content Card (Alternating) */}
              <div className={`
                absolute w-44 md:w-64
                ${isEven ? 'left-[calc(50%+3rem)]' : 'right-[calc(50%+3rem)]'}
              `}>
                <Card className={`p-4 ${ms.status === 'locked' ? 'opacity-50' : ''}`} variant="flat">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#FF5E36] uppercase">BLOQUE {index + 1}</span>
                    <Badge variant="info" className="bg-[#FFD700]/20 text-[#FFD700] border-none">
                      <Star size={10} className="mr-1 fill-current" /> +{ms.xpReward}
                    </Badge>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{ms.title}</h4>
                  <p className="text-white/40 text-[10px] leading-relaxed line-clamp-2">{ms.description}</p>
                </Card>
              </div>

              {/* Connector Curve (SVG or pure CSS) */}
              {index < milestones.length - 1 && (
                <div className={`
                  absolute top-16 h-16 w-1/2 border-dashed border-white/10
                  ${isEven ? 'left-1/2 border-r-2 border-b-2 rounded-br-[3rem]' : 'right-1/2 border-l-2 border-b-2 rounded-bl-[3rem]'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
