'use client';

import { authService } from '@/lib/auth';
import type {
  AuthContextValue,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  /**
   * Register — sends OTP, returns email for the OTP step.
   * Does NOT redirect; the page handles the step transition.
   */
  const register = useCallback(
    async (payload: RegisterPayload): Promise<RegisterResponse> => {
      return authService.register(payload);
    },
    []
  );

  /**
   * Verify OTP — activates account, then redirects to login.
   */
  const verifyOtp = useCallback(
    async (payload: OtpPayload): Promise<void> => {
      await authService.verifyOtp(payload);
      router.push('/login');
    },
    [router]
  );

  /**
   * Resend OTP — no redirect, UI handles the countdown reset.
   */
  const resendOtp = useCallback(
    async (payload: ResendOtpPayload): Promise<void> => {
      await authService.resendOtp(payload);
    },
    []
  );

  /**
   * Login — persists token, sets user, redirects to dashboard.
   */
  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      const user = await authService.login(payload);
      setUser(user);
      router.push('/dashboard');
    },
    [router]
  );

  /**
   * Logout — clears token, clears user, redirects to login.
   */
  const logout = useCallback(async (): Promise<void> => {
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
      verifyOtp,
      resendOtp,
      logout,
    }),
    [user, login, register, verifyOtp, resendOtp, logout]
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