import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../api';
import type { User, Player, GameCase, CaseProgress } from '../types';

interface GameState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  player: Player | null;
  cases: GameCase[];
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  fetchCases: () => Promise<void>;
  startCase: (caseId: string) => void;
  collectClue: (clueId: string) => void;
  identifyFakePoint: (fakePointId: string) => void;
  completeCase: (caseId: string, experienceReward: number) => Promise<void>;
  unlockNextCase: () => void;
  addWClue: (clue: string) => Promise<void>;
  resetGame: () => void;
}

const createInitialPlayer = (name: string): Player => ({
  id: '',
  name,
  level: 1,
  experience: 0,
  unlockedCases: ['case-1'],
  unlockedSkills: ['skill-1'],
  completedCases: [],
  currentProgress: null,
  wClues: [],
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      token: null,
      player: null,
      cases: [],
      isLoading: false,
      error: null,
      
      // Auth actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await api.login(email, password);
          api.setAuthToken(result.data.token);
          const { user, progress } = await api.getCurrentUser();
          
          set({
            isAuthenticated: true,
            user: result.data.user,
            token: result.data.token,
            player: progress,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await api.register(username, email, password);
          api.setAuthToken(result.data.token);
          
          set({
            isAuthenticated: true,
            user: result.data.user,
            token: result.data.token,
            player: createInitialPlayer(username),
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        api.logout();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          player: null,
          cases: [],
          error: null,
        });
      },
      
      checkAuth: async () => {
        try {
          const { user, progress } = await api.getCurrentUser();
          if (user) {
            set({
              isAuthenticated: true,
              user,
              player: progress,
            });
          }
        } catch {
          set({
            isAuthenticated: false,
            user: null,
            player: null,
          });
        }
      },
      
      fetchCases: async () => {
        set({ isLoading: true });
        try {
          const cases = await api.fetchCases();
          set({ cases, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      
      startCase: (caseId: string) => {
        const currentProgress: CaseProgress = {
          caseId,
          collectedClues: [],
          identifiedFakePoints: [],
          isCompleted: false,
        };
        set({
          player: {
            ...get().player!,
            currentProgress,
          },
        });
      },
      
      collectClue: (clueId: string) => {
        const player = get().player;
        if (!player?.currentProgress) return;
        
        if (!player.currentProgress.collectedClues.includes(clueId)) {
          player.currentProgress.collectedClues.push(clueId);
          set({ player });
        }
      },
      
      identifyFakePoint: (fakePointId: string) => {
        const player = get().player;
        if (!player?.currentProgress) return;
        
        if (!player.currentProgress.identifiedFakePoints.includes(fakePointId)) {
          player.currentProgress.identifiedFakePoints.push(fakePointId);
          set({ player });
        }
      },
      
      completeCase: async (caseId: string, experienceReward: number) => {
        const player = get().player;
        if (!player) return;
        
        const newExperience = player.experience + experienceReward;
        const newLevel = Math.floor(newExperience / 100) + 1;
        
        const updatedPlayer: Player = {
          ...player,
          experience: newExperience,
          level: newLevel,
          completedCases: [...player.completedCases, caseId],
          currentProgress: null,
        };
        
        try {
          await api.saveProgress(updatedPlayer);
          set({ player: updatedPlayer });
        } catch (error) {
          throw error;
        }
      },
      
      unlockNextCase: () => {
        const player = get().player;
        if (!player) return;
        
        const nextCaseId = `case-${player.completedCases.length + 1}`;
        if (!player.unlockedCases.includes(nextCaseId)) {
          player.unlockedCases.push(nextCaseId);
          set({ player });
        }
      },
      
      addWClue: async (clue: string) => {
        const player = get().player;
        if (!player) return;
        
        if (!player.wClues.includes(clue)) {
          player.wClues.push(clue);
          set({ player });
          await api.saveProgress(player);
        }
      },
      
      resetGame: () => {
        api.logout();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          player: null,
          cases: [],
          error: null,
        });
      },
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        player: state.player,
      }),
    }
  )
);
