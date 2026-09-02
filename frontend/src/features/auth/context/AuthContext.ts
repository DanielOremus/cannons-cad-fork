import { createContext, useContext } from 'react';
import { type UserProfile } from '../model/auth.types';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'unavailable';

export type AuthContextValue = {
  status: AuthStatus;
  accessToken: string;
  user: UserProfile | null;
  isAdmin: boolean;
  restorationError: string | null;
  setAuthSession: (accessToken: string, user: UserProfile) => void;
  updateAuthUser: (updater: (user: UserProfile) => UserProfile) => void;
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
