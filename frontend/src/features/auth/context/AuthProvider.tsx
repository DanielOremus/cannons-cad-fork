import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { UserRole } from '@project/shared';
import { ApiError } from '@/shared/api/apiError';
import { refreshSession } from '../api/authApi';
import { type UserProfile } from '../model/auth.types';
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext';

type AuthState = {
  status: AuthStatus;
  accessToken: string;
  user: UserProfile | null;
  restorationError: string | null;
};

const anonymousState: AuthState = {
  status: 'anonymous',
  accessToken: '',
  user: null,
  restorationError: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    accessToken: '',
    user: null,
    restorationError: null,
  });

  const setAuthSession = useCallback((nextAccessToken: string, nextUser: UserProfile) => {
    setAuthState({
      status: 'authenticated',
      accessToken: nextAccessToken,
      user: nextUser,
      restorationError: null,
    });
  }, []);

  const clearAuthSession = useCallback(() => {
    setAuthState(anonymousState);
  }, []);

  const updateAuthUser = useCallback((updater: (user: UserProfile) => UserProfile) => {
    setAuthState((currentState) => {
      if (!currentState.user) {
        return currentState;
      }

      return {
        status: 'authenticated',
        accessToken: currentState.accessToken,
        user: updater(currentState.user),
        restorationError: null,
      };
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const response = await refreshSession();

        if (isMounted) {
          setAuthSession(response.access, response.user);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError && (error.status === 0 || error.status >= 500)) {
          setAuthState({
            status: 'unavailable',
            accessToken: '',
            user: null,
            restorationError:
              'Session restoration is currently unavailable. You can sign in again.',
          });
          return;
        }

        clearAuthSession();
      }
    }

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [clearAuthSession, setAuthSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: authState.status,
      accessToken: authState.accessToken,
      user: authState.user,
      restorationError: authState.restorationError,
      isAdmin: Boolean(
        authState.user?.roles.includes(UserRole.ADMIN) ||
          authState.user?.roles.includes(UserRole.SUPER_ADMIN),
      ),
      setAuthSession,
      updateAuthUser,
      clearAuthSession,
    }),
    [authState, clearAuthSession, setAuthSession, updateAuthUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
