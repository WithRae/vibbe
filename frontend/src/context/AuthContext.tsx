'use client';

/**
 * AuthContext — global authentication state provider.
 *
 * Wrap your layout with <AuthProvider> so any component can call useAuth().
 * On mount it fetches /me to rehydrate auth state from an existing cookie.
 */

import { authService } from '@/lib/auth';
import type { AuthContextValue, LoginPayload, RegisterPayload, User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On mount: rehydrate from existing cookie
  useEffect(() => {
    authService
      .getMe()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const user = await authService.register(payload);
    setUser(user);
    router.push('/dashboard');
  }, [router]);

  const login = useCallback(async (payload: LoginPayload) => {
    const user = await authService.login(payload);
    setUser(user);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }), [user, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────

/**
 * useAuth — consume auth state anywhere inside <AuthProvider>.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>. Wrap your layout.');
  }

  return context;
}