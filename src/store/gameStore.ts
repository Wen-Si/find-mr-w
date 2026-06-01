import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Case } from '../types';
import * as api from '../api';

interface GameState {
  player: Player | null;
  cases: Case[];
  isLoading: boolean;
  error: string | null;
  loadCases: () => Promise<void>;
  loadCase: (caseId: string) => Promise<Case | null>;
  createPlayer: (name: string) => void;
  setPlayer: (player: Player) => void;
  startCase: (caseId: string) => void;
  collectClue: (clueId: string) => void;
  identifyFakePoint: (fakePointId: string) => void;
  completeCase: () => void;
  unlockNextCase: () => void;
  addWClue: (clue: string) => void;
  resetGame: () => void;
}

const createInitialPlayer = (name: string): Player => ({
  id: `player-${Date.now()}`,
  name,
  level: 1,
  experience: 0,
  unlockedCases: ['case-1'],
  unlockedSkills: ['skill-1'],
  currentProgress: null,
  wClues: []
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      cases: [],
      isLoading: false,
      error: null,
      
      loadCases: async () => {
        set({ isLoading: true, error: null });
        try {
          const cases = await api.fetchCases();
          set({ cases, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load cases', isLoading: false });
        }
      },
      
      loadCase: async (caseId: string) => {
        try {
          const caseData = await api.fetchCase(caseId);
          set(state => ({
            cases: state.cases.map(c => c.id === caseId ? caseData : c)
          }));
          return caseData;
        } catch {
          return null;
        }
      },
      
      createPlayer: (name) => {
        const player = createInitialPlayer(name);
        set({ player });
      },
      
      setPlayer: (player) => {
        set({ player });
      },
      
      startCase: (caseId) => {
        set((state) => ({
          player: state.player ? {
            ...state.player,
            currentProgress: {
              caseId,
              collectedClues: [],
              identifiedFakePoints: []
            }
          } : null
        }));
      },
      
      collectClue: (clueId) => {
        set((state) => ({
          player: state.player && state.player.currentProgress ? {
            ...state.player,
            currentProgress: {
              ...state.player.currentProgress,
              collectedClues: [...state.player.currentProgress.collectedClues, clueId]
            }
          } : state.player
        }));
      },
      
      identifyFakePoint: (fakePointId) => {
        set((state) => ({
          player: state.player && state.player.currentProgress ? {
            ...state.player,
            currentProgress: {
              ...state.player.currentProgress,
              identifiedFakePoints: [...state.player.currentProgress.identifiedFakePoints, fakePointId]
            }
          } : state.player
        }));
      },
      
      completeCase: () => {
        const state = get();
        if (!state.player || !state.player.currentProgress) return;
        
        const currentCaseId = state.player.currentProgress.caseId;
        const currentCase = state.cases.find(c => c.id === currentCaseId);
        if (!currentCase) return;
        
        const newExperience = state.player.experience + currentCase.experienceReward;
        const newLevel = Math.floor(newExperience / 100) + 1;
        
        const newUnlockedSkills = [...state.player.unlockedSkills];
        if (newLevel >= 3 && !newUnlockedSkills.includes('skill-2')) {
          newUnlockedSkills.push('skill-2');
        }
        if (newLevel >= 5 && !newUnlockedSkills.includes('skill-3')) {
          newUnlockedSkills.push('skill-3');
        }
        if (newLevel >= 8 && !newUnlockedSkills.includes('skill-4')) {
          newUnlockedSkills.push('skill-4');
        }
        
        const newUnlockedCases = [...state.player.unlockedCases];
        if (currentCaseId === 'case-1' && !newUnlockedCases.includes('case-2')) {
          newUnlockedCases.push('case-2');
        }
        if (currentCaseId === 'case-2' && !newUnlockedCases.includes('case-3')) {
          newUnlockedCases.push('case-3');
        }
        
        const newWClues = [...state.player.wClues];
        if (currentCase.wClue && !newWClues.includes(currentCase.wClue)) {
          newWClues.push(currentCase.wClue);
        }
        
        const updatedCases = state.cases.map(c => 
          c.id === currentCaseId ? { ...c, isCompleted: true } : c
        );
        
        set({
          player: {
            ...state.player,
            level: newLevel,
            experience: newExperience,
            unlockedSkills: newUnlockedSkills,
            unlockedCases: newUnlockedCases,
            wClues: newWClues,
            currentProgress: null
          },
          cases: updatedCases
        });
      },
      
      unlockNextCase: () => {
        // Handled in completeCase
      },
      
      addWClue: (clue) => {
        set((state) => ({
          player: state.player ? {
            ...state.player,
            wClues: [...state.player.wClues, clue]
          } : null
        }));
      },
      
      resetGame: () => {
        set({
          player: null,
          cases: [],
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'find-mr-w-game-storage',
      partialize: (state) => ({
        player: state.player
      })
    }
  )
);
