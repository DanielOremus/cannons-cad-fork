import { type ReactNode, useMemo, useState } from 'react';
import { UserRole } from '@project/shared';
import { type UserProfile } from '../model/auth.types';
import { AuthContext, type AuthContextValue } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user,
      isAdmin: Boolean(
        user?.roles.includes(UserRole.ADMIN) || user?.roles.includes(UserRole.SUPER_ADMIN),
      ),
      setAuthSession: (nextAccessToken, nextUser) => {
        setAccessToken(nextAccessToken);
        setUser(nextUser);
      },
      setAccessToken,
      setUser,
      clearAuthSession: () => {
        setAccessToken('');
        setUser(null);
      },
    }),
    [accessToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
