import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Case } from '../types';
import * as api from '../api';

interface GameState {
  // Auth state
  isAuthenticated: boolean;
  user: { id: string; username: string; email: string } | null;
  token: string | null;
  
  // Game state
  player: Player | null;
  cases: Case[];
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  
  // Game actions
  loadCases: () => Promise<void>;
  loadCase: (caseId: string) => Promise<Case | null>;
  loadProgress: () => Promise<void>;
  setPlayer: (player: Player) => void;
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
          api.setAuthToken(result.token);
          const { user, progress } = await api.getCurrentUser();
          
          set({
            isAuthenticated: true,
            user: result.user,
            token: result.token,
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
          api.setAuthToken(result.token);
          
          set({
            isAuthenticated: true,
            user: result.user,
            token: result.token,
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
        const token = api.getAuthToken();
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }
        
        try {
          const { user, progress } = await api.getCurrentUser();
          api.setAuthToken(token);
          set({
            isAuthenticated: true,
            user,
            token,
            player: progress,
          });
        } catch {
          api.logout();
          set({
            isAuthenticated: false,
            user: null,
            token: null,
          });
        }
      },
      
      // Game actions
      loadCases: async () => {
        set({ isLoading: true, error: null });
        try {
          const cases = await api.fetchCases();
          set({ cases, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to load cases', isLoading: false });
        }
      },
      
      loadCase: async (caseId) => {
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
      
      loadProgress: async () => {
        if (!get().isAuthenticated) return;
        try {
          const progress = await api.fetchProgress();
          set({ player: progress });
        } catch (error) {
          console.error('Failed to load progress:', error);
        }
      },
      
      setPlayer: (player) => {
        set({ player });
      },
      
      startCase: (caseId) => {
        set(state => ({
          player: state.player ? {
            ...state.player,
            currentProgress: {
              caseId,
              collectedClues: [],
              identifiedFakePoints: [],
            }
          } : null
        }));
      },
      
      collectClue: (clueId) => {
        set(state => ({
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
        set(state => ({
          player: state.player && state.player.currentProgress ? {
            ...state.player,
            currentProgress: {
              ...state.player.currentProgress,
              identifiedFakePoints: [...state.player.currentProgress.identifiedFakePoints, fakePointId]
            }
          } : state.player
        }));
      },
      
      completeCase: async (caseId, experienceReward) => {
        if (!get().isAuthenticated) return;
        
        try {
          const result = await api.completeCase(caseId, experienceReward);
          set({ player: result.data });
        } catch (error) {
          console.error('Failed to complete case:', error);
        }
      },
      
      unlockNextCase: () => {
        // Handled on server side
      },
      
      addWClue: async (clue) => {
        if (!get().isAuthenticated) return;
        
        try {
          const result = await api.addWClue(clue);
          set({ player: result.data });
        } catch (error) {
          console.error('Failed to add W clue:', error);
        }
      },
      
      resetGame: () => {
        set({
          player: null,
          cases: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'find-mr-w-game-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
