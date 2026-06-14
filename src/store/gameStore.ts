import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialCases, skills as gameSkills } from '../data/gameData';
import type { User, Player, GameCase, CaseProgress } from '../types';

interface GameState {
  isAuthenticated: boolean;
  user: User | null;
  player: Player | null;
  cases: GameCase[];
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  fetchCases: () => void;
  startCase: (caseId: string) => void;
  collectClue: (clueId: string) => void;
  identifyFakePoint: (fakePointId: string) => void;
  completeCase: (caseId: string, experienceReward: number) => void;
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
  completedCases: [],
  currentProgress: null,
  wClues: [],
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      player: null,
      cases: [],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const user = users.find((u: any) => u.email === email);

          if (!user) {
            throw new Error('该邮箱尚未注册，请先注册');
          }

          if (user.password !== password) {
            throw new Error('密码错误');
          }

          let playerData = user.progress;
          if (!playerData) {
            playerData = createInitialPlayer(user.username);
          }

          set({
            isAuthenticated: true,
            user: { id: user.id, username: user.username, email: user.email },
            player: playerData,
            isLoading: false,
          });

          localStorage.setItem('fmw_currentUser', user.email);
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const existingUser = users.find((u: any) => u.email === email);

          if (existingUser) {
            throw new Error('该邮箱已被注册');
          }

          const newPlayer = createInitialPlayer(username);
          const newUser = {
            id: `user-${Date.now()}`,
            username,
            email,
            password,
            progress: newPlayer,
            createdAt: new Date().toISOString(),
          };

          users.push(newUser);
          localStorage.setItem('fmw_users', JSON.stringify(users));
          localStorage.setItem('fmw_currentUser', email);

          set({
            isAuthenticated: true,
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
            player: newPlayer,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('fmw_currentUser');
        set({
          isAuthenticated: false,
          user: null,
          player: null,
          cases: [],
          error: null,
        });
      },

      checkAuth: () => {
        const currentEmail = localStorage.getItem('fmw_currentUser');
        if (currentEmail) {
          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const user = users.find((u: any) => u.email === currentEmail);
          if (user) {
            set({
              isAuthenticated: true,
              user: { id: user.id, username: user.username, email: user.email },
              player: user.progress || createInitialPlayer(user.username),
            });
            return;
          }
        }
        set({
          isAuthenticated: false,
          user: null,
          player: null,
        });
      },

      fetchCases: () => {
        set({ cases: initialCases });
      },

      startCase: (caseId: string) => {
        const currentProgress: CaseProgress = {
          caseId,
          collectedClues: [],
          identifiedFakePoints: [],
          isCompleted: false,
        };

        const updatedPlayer = {
          ...get().player!,
          currentProgress,
        };

        // 保存到用户数据
        const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
        const currentEmail = localStorage.getItem('fmw_currentUser');
        const userIndex = users.findIndex((u: any) => u.email === currentEmail);
        if (userIndex >= 0) {
          users[userIndex].progress = updatedPlayer;
          localStorage.setItem('fmw_users', JSON.stringify(users));
        }

        set({ player: updatedPlayer });
      },

      collectClue: (clueId: string) => {
        const player = get().player;
        if (!player?.currentProgress) return;

        if (!player.currentProgress.collectedClues.includes(clueId)) {
          player.currentProgress.collectedClues.push(clueId);

          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const currentEmail = localStorage.getItem('fmw_currentUser');
          const userIndex = users.findIndex((u: any) => u.email === currentEmail);
          if (userIndex >= 0) {
            users[userIndex].progress = player;
            localStorage.setItem('fmw_users', JSON.stringify(users));
          }

          set({ player });
        }
      },

      identifyFakePoint: (fakePointId: string) => {
        const player = get().player;
        if (!player?.currentProgress) return;

        if (!player.currentProgress.identifiedFakePoints.includes(fakePointId)) {
          player.currentProgress.identifiedFakePoints.push(fakePointId);

          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const currentEmail = localStorage.getItem('fmw_currentUser');
          const userIndex = users.findIndex((u: any) => u.email === currentEmail);
          if (userIndex >= 0) {
            users[userIndex].progress = player;
            localStorage.setItem('fmw_users', JSON.stringify(users));
          }

          set({ player });
        }
      },

      completeCase: (caseId: string, experienceReward: number) => {
        const player = get().player;
        if (!player) return;

        const newExperience = player.experience + experienceReward;
        const newLevel = Math.floor(newExperience / 100) + 1;

        const updatedPlayer: Player = {
          ...player,
          experience: newExperience,
          level: newLevel,
          completedCases: player.completedCases.includes(caseId)
            ? player.completedCases
            : [...player.completedCases, caseId],
          currentProgress: null,
        };

        // 解锁下一个案件
        const nextCaseId = `case-${updatedPlayer.completedCases.length + 1}`;
        if (initialCases.some((c) => c.id === nextCaseId) && !updatedPlayer.unlockedCases.includes(nextCaseId)) {
          updatedPlayer.unlockedCases.push(nextCaseId);
        }

        // 解锁技能
        gameSkills.forEach((skill) => {
          if (newLevel >= skill.levelRequired && !updatedPlayer.unlockedSkills.includes(skill.id)) {
            updatedPlayer.unlockedSkills.push(skill.id);
          }
        });

        // 保存到用户数据
        const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
        const currentEmail = localStorage.getItem('fmw_currentUser');
        const userIndex = users.findIndex((u: any) => u.email === currentEmail);
        if (userIndex >= 0) {
          users[userIndex].progress = updatedPlayer;
          localStorage.setItem('fmw_users', JSON.stringify(users));
        }

        set({ player: updatedPlayer });
      },

      unlockNextCase: () => {
        const player = get().player;
        if (!player) return;

        const nextCaseId = `case-${player.completedCases.length + 1}`;
        if (initialCases.some((c) => c.id === nextCaseId) && !player.unlockedCases.includes(nextCaseId)) {
          player.unlockedCases.push(nextCaseId);

          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const currentEmail = localStorage.getItem('fmw_currentUser');
          const userIndex = users.findIndex((u: any) => u.email === currentEmail);
          if (userIndex >= 0) {
            users[userIndex].progress = player;
            localStorage.setItem('fmw_users', JSON.stringify(users));
          }

          set({ player });
        }
      },

      addWClue: (clue: string) => {
        const player = get().player;
        if (!player) return;

        if (!player.wClues.includes(clue)) {
          player.wClues.push(clue);

          const users = JSON.parse(localStorage.getItem('fmw_users') || '[]');
          const currentEmail = localStorage.getItem('fmw_currentUser');
          const userIndex = users.findIndex((u: any) => u.email === currentEmail);
          if (userIndex >= 0) {
            users[userIndex].progress = player;
            localStorage.setItem('fmw_users', JSON.stringify(users));
          }

          set({ player });
        }
      },

      resetGame: () => {
        localStorage.removeItem('fmw_currentUser');
        set({
          isAuthenticated: false,
          user: null,
          player: null,
          cases: [],
          error: null,
        });
      },
    }),
    {
      name: 'fmw-auth-state',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        player: state.player,
      }),
    }
  )
);
