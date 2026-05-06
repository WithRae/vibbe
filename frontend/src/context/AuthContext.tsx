'use client';

import { authService } from '@/lib/auth';
import type {
  AuthContextValue,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types/auth';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const user = await authService.register(payload);

      setUser(user);

      router.push('/dashboard');
    },
    [router]
  );

  const login = useCallback(
    async (payload: LoginPayload) => {
      const user = await authService.login(payload);

      setUser(user);

      router.push('/dashboard');
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authService.logout();

    setUser(null);

    router.push('/login');
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside <AuthProvider>. Wrap your layout.'
    );
  }

  return context;
}