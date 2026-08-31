import { createContext, useContext } from 'react';
import { type UserProfile } from '../model/auth.types';

export type AuthContextValue = {
  accessToken: string;
  user: UserProfile | null;
  isAdmin: boolean;
  setAuthSession: (accessToken: string, user: UserProfile) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (updater: UserProfile | null | ((user: UserProfile | null) => UserProfile | null)) => void;
  clearAuthSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
