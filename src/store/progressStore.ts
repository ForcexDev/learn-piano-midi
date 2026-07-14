import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProgress } from '../types/midi';

interface ProgressStore extends UserProgress {
  markLevelComplete: (levelId: number, score: { correct: number; total: number }) => void;
  updateSettings: (settings: Partial<UserProgress['settings']>) => void;
  resetProgress: () => void;
}

const initialSettings: UserProgress['settings'] = {
  language: 'es', // Default to Spanish instructions
  showSolfegeBridge: true,
  preferSharpsOverFlats: true,
  audioFeedbackEnabled: true,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      completedLevels: [],
      bestScores: {},
      settings: initialSettings,

      markLevelComplete: (levelId, score) => {
        set((state) => {
          const currentBest = state.bestScores[levelId];
          const isBetter = !currentBest || (score.correct / Math.max(1, score.total)) > (currentBest.correct / Math.max(1, currentBest.total));

          const completedLevels = state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId];

          return {
            completedLevels,
            bestScores: {
              ...state.bestScores,
              [levelId]: isBetter ? score : currentBest,
            },
          };
        });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      resetProgress: () => {
        set({
          completedLevels: [],
          bestScores: {},
          settings: initialSettings,
        });
      },
    }),
    {
      name: 'piano-trainer-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
