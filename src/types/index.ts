export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  unlockedCases: string[];
  unlockedSkills: string[];
  completedCases: string[];
  currentProgress: CaseProgress | null;
  wClues: string[];
}

export interface CaseProgress {
  caseId: string;
  collectedClues: string[];
  identifiedFakePoints: string[];
  isCompleted?: boolean;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface FinancialItem {
  id: string;
  name: string;
  value: string;
  notes?: string;
}

export interface FinancialStatement {
  title: string;
  items: FinancialItem[];
}

export interface FinancialStatements {
  balanceSheet: FinancialStatement;
  incomeStatement: FinancialStatement;
  cashFlowStatement: FinancialStatement;
}

export interface FakePoint {
  id: string;
  statementType: 'balanceSheet' | 'incomeStatement' | 'cashFlowStatement';
  itemId: string;
  description: string;
  hint: string;
  requiredClues?: string[];
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  location: string;
  isHidden?: boolean;
  sceneId?: string;
}

export interface GameCase {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  story: string;
  scenes: Scene[];
  financialStatements: FinancialStatements;
  fakePoints: FakePoint[];
  clues: Clue[];
  isUnlocked: boolean;
  isCompleted: boolean;
  wClue?: string;
  experienceReward: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  levelRequired: number;
  icon: string;
}

export type AIPersona = 'boss' | 'partner' | 'rival';

export interface AIPersonaInfo {
  name: string;
  style: string;
  color: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: AIPersona;
}

export interface AIChatResponse {
  success: boolean;
  data: {
    response: string;
    persona: AIPersona;
    personaInfo: AIPersonaInfo;
    conversationId: string;
  };
  error?: string;
}

export interface AIConversationResponse {
  success: boolean;
  data: AIChatMessage[];
}
