import React from 'react';
import { LEVELS } from '../../data/levels';
import { useProgressStore } from '../../store/progressStore';
import { TRANSLATIONS } from '../../data/translations';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface LevelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: number;
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  isOpen,
  onClose,
  currentLevelId,
  onSelectLevel,
}) => {
  const completedLevels = useProgressStore((state) => state.completedLevels);
  const bestScores = useProgressStore((state) => state.bestScores);
  const language = useProgressStore((state) => state.settings.language) || 'es';
  const t = TRANSLATIONS[language].levelSelector;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {t.title}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level List */}
        <div className="py-4 space-y-3 overflow-y-auto flex-1 pr-1">
          {LEVELS.map((level) => {
            const isSelected = level.id === currentLevelId;
            const isCompleted = completedLevels.includes(level.id);
            const score = bestScores[level.id];

            return (
              <button
                key={level.id}
                onClick={() => {
                  onSelectLevel(level.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500 shadow-lg'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200 hover:bg-emerald-950/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm md:text-base text-white">
                      {level.title[language]}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.completed}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {level.subtitle[language]} — {level.description[language]}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {score && (
                    <div className="text-right text-xs">
                      <div className="text-emerald-400 font-bold">{t.bestScore}</div>
                      <div className="text-slate-400">{score.correct} {t.passed}</div>
                    </div>
                  )}
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isSelected ? t.active : t.select}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
