import React from 'react';
import { LevelConfig, LevelTarget } from '../../types/midi';
import { EvaluationResult } from '../../core/chordDetector';
import { useProgressStore } from '../../store/progressStore';
import { TRANSLATIONS } from '../../data/translations';
import { CheckCircle2, AlertCircle, HelpCircle, SkipForward, RotateCcw, Award, BookOpen } from 'lucide-react';

interface LevelHUDProps {
  level: LevelConfig;
  target: LevelTarget;
  targetIndex: number;
  totalTargets: number;
  evaluation: EvaluationResult;
  score: { correct: number; total: number };
  onNextTarget: () => void;
  onRepeatTarget: () => void;
  onOpenLevelModal: () => void;
}

export const LevelHUD: React.FC<LevelHUDProps> = ({
  level,
  target,
  targetIndex,
  totalTargets,
  evaluation,
  score,
  onNextTarget,
  onRepeatTarget,
  onOpenLevelModal,
}) => {
  const language = useProgressStore((state) => state.settings.language) || 'es';
  const t = TRANSLATIONS[language].hud;

  const getStatusBadge = () => {
    switch (evaluation.status) {
      case 'perfect':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold text-xs animate-bounce shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{evaluation.feedback}</span>
          </div>
        );
      case 'missing-notes':
      case 'correct-notes-wrong-inversion':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-medium text-xs shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{evaluation.feedback}</span>
          </div>
        );
      case 'extra-notes':
      case 'incorrect':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40 font-medium text-xs shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{evaluation.feedback}</span>
          </div>
        );
      case 'waiting':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80 font-normal text-xs shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{evaluation.feedback}</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-[1920px] bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-1.5 sm:gap-2">
      {/* Top Header Bar: Title, Score Badge & Control Buttons on a single row */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
            <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate max-w-xs sm:max-w-md md:max-w-lg">{level.title[language]}</span>
          </div>

          <button
            onClick={onOpenLevelModal}
            className="text-[11px] font-bold text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 px-2.5 py-0.5 rounded-full border border-blue-500/30 transition-colors shrink-0"
          >
            {t.changeLevel}
          </button>
        </div>

        {/* Right Header Side: Score & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.passed} {score.correct} / {level.passingCriteria.minCorrect}</span>
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="text-[11px] text-slate-400 font-medium">
              {t.targetOf} {targetIndex + 1} {t.of} {totalTargets}
            </div>
          </div>

          <button
            onClick={onRepeatTarget}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.restartLevel}</span>
          </button>

          <button
            onClick={onNextTarget}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30"
          >
            <span>{t.skipTarget}</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Wide Horizontal Main Grid: Expanding into yellow side boxes */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 sm:gap-4">
        {/* Left Side (Col 1-5): Target Title + Feedback Status */}
        <div className="md:col-span-5 space-y-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white drop-shadow truncate">
            {target.label}
          </h2>
          <div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Right Side (Col 6-12): Lesson Guidance Text expanding across wide screen */}
        {target.explanation && (
          <div className="md:col-span-7 bg-slate-950/70 p-2 sm:p-2.5 rounded-xl border border-slate-800/90 text-xs sm:text-sm text-slate-300 font-medium leading-snug">
            <span className="text-blue-400 font-bold">{t.lessonGuidance} </span>
            {target.explanation[language]}
          </div>
        )}
      </div>
    </div>
  );
};
