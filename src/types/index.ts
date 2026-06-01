
export interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  unlockedCases: string[];
  unlockedSkills: string[];
  currentProgress: {
    caseId: string;
    collectedClues: string[];
    identifiedFakePoints: string[];
  } | null;
  wClues: string[];
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

export interface Case {
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
