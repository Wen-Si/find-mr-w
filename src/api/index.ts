const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  message: string;
}

// Token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken || localStorage.getItem('authToken');

// Helper function for authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

// Auth APIs
export const register = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const result: ApiResponse<AuthResponse> = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Registration failed');
  }
  return result;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result: ApiResponse<AuthResponse> = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Login failed');
  }
  return result;
};

export const getCurrentUser = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
  if (!response.ok) {
    throw new Error('Failed to get user');
  }
  const result = await response.json();
  return result;
};

export const logout = () => {
  setAuthToken(null);
};

// Game APIs
export const fetchSkills = async () => {
  const response = await fetch(`${API_BASE_URL}/skills`);
  if (!response.ok) throw new Error('Failed to fetch skills');
  const result: ApiResponse<any> = await response.json();
  return result.data;
};

export const fetchCases = async () => {
  const response = await fetch(`${API_BASE_URL}/cases`);
  if (!response.ok) throw new Error('Failed to fetch cases');
  const result: ApiResponse<any> = await response.json();
  return result.data;
};

export const fetchCase = async (caseId: string) => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);
  if (!response.ok) throw new Error('Failed to fetch case');
  const result: ApiResponse<any> = await response.json();
  return result.data;
};

// Progress APIs
export const fetchProgress = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/progress`);
  if (!response.ok) throw new Error('Failed to fetch progress');
  const result: ApiResponse<any> = await response.json();
  return result.data;
};

export const saveProgress = async (progress: any) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/progress`, {
    method: 'PUT',
    body: JSON.stringify(progress),
  });
  if (!response.ok) throw new Error('Failed to save progress');
  const result: ApiResponse<any> = await response.json();
  return result;
};

export const completeCase = async (caseId: string, experienceReward: number) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/progress/complete-case`, {
    method: 'POST',
    body: JSON.stringify({ caseId, experienceReward }),
  });
  if (!response.ok) throw new Error('Failed to complete case');
  const result: ApiResponse<any> = await response.json();
  return result;
};

export const addWClue = async (clue: string) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/progress/w-clue`, {
    method: 'POST',
    body: JSON.stringify({ clue }),
  });
  if (!response.ok) throw new Error('Failed to add W clue');
  const result: ApiResponse<any> = await response.json();
  return result;
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

// AI 对话 API
export const sendAIChat = async (message: string, caseId?: string, persona?: string) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, caseId, persona }),
  });
  const result = await response.json();
  return result;
};

export const fetchAIConversation = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/conversation`);
  if (!response.ok) throw new Error('Failed to fetch conversation');
  const result = await response.json();
  return result;
};

export const clearAIConversation = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/conversation`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to clear conversation');
  const result = await response.json();
  return result;
};

// AI角色设定
export const createCharacter = async (characterData: {
  characterName: string;
  characterBackground: string;
  personality?: string;
  goals?: string;
}) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/character`, {
    method: 'POST',
    body: JSON.stringify(characterData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Failed to create character');
  return result;
};

export const getCharacter = async () => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/character`);
  if (!response.ok) throw new Error('Failed to get character');
  const result = await response.json();
  return result;
};

// AI剧情生成
export const generateStory = async (caseId: string, stage: string = 'development') => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/generate-story`, {
    method: 'POST',
    body: JSON.stringify({ caseId, stage }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Failed to generate story');
  return result;
};

// AI角色互动对话
export const characterInteraction = async (caseId: string, targetCharacter: string, playerMessage: string) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/ai/character-interaction`, {
    method: 'POST',
    body: JSON.stringify({ caseId, targetCharacter, playerMessage }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Failed to generate interaction');
  return result;
};
