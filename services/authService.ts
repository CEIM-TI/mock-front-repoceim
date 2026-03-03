import { User } from '../types';
import { MOCK_USERS } from '../constants';

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, hash password and verify against DB.
  // Here we just check if email exists in our mock users.
  // Password is ignored for this simulation to make testing easier.
  const user = MOCK_USERS.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Credenciales inválidas. Intente con admin@tempo.local');
  }
  
  // Store session securely (mocked via localStorage for persistence in session)
  localStorage.setItem('tempo_session', JSON.stringify(user));
  return user;
};

export const logout = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem('tempo_session');
};

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem('tempo_session');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
