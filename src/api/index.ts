const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function fetchSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`);
  if (!response.ok) throw new Error('Failed to fetch skills');
  const result: ApiResponse<any> = await response.json();
  return result.data;
}

export async function fetchCases() {
  const response = await fetch(`${API_BASE_URL}/cases`);
  if (!response.ok) throw new Error('Failed to fetch cases');
  const result: ApiResponse<any> = await response.json();
  return result.data;
}

export async function fetchCase(caseId: string) {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);
  if (!response.ok) throw new Error('Failed to fetch case');
  const result: ApiResponse<any> = await response.json();
  return result.data;
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
