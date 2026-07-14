import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ActiveNotesState, LevelConfig, LevelTarget } from '../types/midi';
import { LEVELS } from '../data/levels';
import { evaluateTarget, EvaluationResult } from '../core/chordDetector';
import { useProgressStore } from '../store/progressStore';
import { soundEngine } from '../core/soundEngine';

export interface UseLevelEngineReturn {
  currentLevel: LevelConfig;
  currentTarget: LevelTarget;
  targetIndex: number;
  totalTargets: number;
  evaluation: EvaluationResult;
  score: { correct: number; total: number };
  isLevelCompleted: boolean;
  selectLevel: (levelId: number) => void;
  nextTarget: () => void;
  prevTarget: () => void;
  repeatTarget: () => void;
  restartLevel: () => void;
}

export function useLevelEngine(activeNotes: ActiveNotesState): UseLevelEngineReturn {
  const [currentLevelId, setCurrentLevelId] = useState<number>(0);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [isLevelCompleted, setIsLevelCompleted] = useState<boolean>(false);

  const markLevelComplete = useProgressStore((state) => state.markLevelComplete);
  const language = useProgressStore((state) => state.settings.language) || 'es';

  const currentLevel = useMemo(() => {
    return LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  }, [currentLevelId]);

  const currentTarget = useMemo(() => {
    return currentLevel.targets[targetIndex] || currentLevel.targets[0];
  }, [currentLevel, targetIndex]);

  const evaluation = useMemo(() => {
    return evaluateTarget(activeNotes, currentTarget, currentLevel.enforceInversion, language);
  }, [activeNotes, currentTarget, currentLevel.enforceInversion, language]);

  // Handle auto-advancing on correct answer & victory SFX
  useEffect(() => {
    if (evaluation.isCorrect && currentLevelId !== 0) {
      const timer = setTimeout(() => {
        try {
          confetti({
            particleCount: 45,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
          });
        } catch (e) {
          // Ignore confetti errors
        }

        const isLastTarget = targetIndex + 1 >= currentLevel.targets.length;

        setScore(prev => {
          const newCorrect = prev.correct + 1;
          const newTotal = prev.total + 1;

          if (newCorrect >= currentLevel.passingCriteria.minCorrect || isLastTarget) {
            setIsLevelCompleted(true);
            markLevelComplete(currentLevelId, { correct: newCorrect, total: newTotal });
            // Play victory arpeggio fanfare
            soundEngine.playVictoryFanfare();
          } else {
            // Play success chime SFX
            soundEngine.playSuccessChime();
          }

          return { correct: newCorrect, total: newTotal };
        });

        if (!isLastTarget) {
          setTargetIndex(prev => prev + 1);
        }
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [evaluation.isCorrect, currentLevelId, targetIndex, currentLevel, markLevelComplete]);

  const selectLevel = useCallback((levelId: number) => {
    setCurrentLevelId(levelId);
    setTargetIndex(0);
    setScore({ correct: 0, total: 0 });
    setIsLevelCompleted(false);
  }, []);

  const nextTarget = useCallback(() => {
    if (targetIndex + 1 < currentLevel.targets.length) {
      setTargetIndex(prev => prev + 1);
    }
  }, [targetIndex, currentLevel.targets.length]);

  const prevTarget = useCallback(() => {
    if (targetIndex > 0) {
      setTargetIndex(prev => prev - 1);
    }
  }, [targetIndex]);

  const repeatTarget = useCallback(() => {
    setScore({ correct: 0, total: 0 });
  }, []);

  const restartLevel = useCallback(() => {
    setTargetIndex(0);
    setScore({ correct: 0, total: 0 });
    setIsLevelCompleted(false);
  }, []);

  return {
    currentLevel,
    currentTarget,
    targetIndex,
    totalTargets: currentLevel.targets.length,
    evaluation,
    score,
    isLevelCompleted,
    selectLevel,
    nextTarget,
    prevTarget,
    repeatTarget,
    restartLevel,
  };
}
