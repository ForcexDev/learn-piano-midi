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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold text-xs sm:text-sm animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>{evaluation.feedback}</span>
          </div>
        );
      case 'missing-notes':
      case 'correct-notes-wrong-inversion':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-medium text-xs sm:text-sm">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span>{evaluation.feedback}</span>
          </div>
        );
      case 'extra-notes':
      case 'incorrect':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40 font-medium text-xs sm:text-sm">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
            <span>{evaluation.feedback}</span>
          </div>
        );
      case 'waiting':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80 font-normal text-xs sm:text-sm">
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            <span>{evaluation.feedback}</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl flex flex-col gap-2 sm:gap-3">
      {/* Level Header Banner & Change Button */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-2 gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
          <span className="truncate max-w-xs sm:max-w-md">{level.title[language]}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLevelModal}
            className="text-[11px] sm:text-xs font-bold text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 px-2.5 py-0.5 sm:py-1 rounded-full border border-blue-500/30 transition-colors"
          >
            {t.changeLevel}
          </button>
        </div>
      </div>

      {/* Main Target Goal Card & Instructions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
        <div className="space-y-1 sm:space-y-1.5 flex-1">
          {/* Goal Title in English Note Notation (e.g. Play: F# Minor) */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow">
            {target.label}
          </h2>

          {/* Educational Target Explanation in Selected Language */}
          {target.explanation && (
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed bg-slate-950/60 p-2 sm:p-2.5 rounded-xl border border-slate-800/90">
              <span className="text-blue-400 font-bold">{t.lessonGuidance} </span>
              {target.explanation[language]}
            </p>
          )}

          {/* Status Feedback Badge */}
          <div className="pt-0.5">
            {getStatusBadge()}
          </div>
        </div>

        {/* Right Side: Level Score & Control Buttons */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0 self-stretch justify-between">
          <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-1.5 rounded-xl sm:rounded-2xl border border-slate-800 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.passed} {score.correct} / {level.passingCriteria.minCorrect}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-800" />
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">
              {t.targetOf} {targetIndex + 1} {t.of} {totalTargets}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={onRepeatTarget}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.restartLevel}
            </button>
            <button
              onClick={onNextTarget}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30"
            >
              {t.skipTarget}
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
