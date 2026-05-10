'use client';

import { authService } from '@/lib/auth';
import { setProfileCompletedCookie } from '@/lib/cookies';
import { profileService } from '@/lib/profile';
import type {
  AuthContextValue,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  SetupProfilePayload,
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
   * Resend OTP — no redirect.
   */
  const resendOtp = useCallback(
    async (payload: ResendOtpPayload): Promise<void> => {
      await authService.resendOtp(payload);
    },
    []
  );

  /**
   * Login — persists token, sets user, stores milestone if hit, redirects.
   */
  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      const { user, milestone, levelUp } = await authService.login(payload);

      setUser(user);

      // Store milestone so dashboard can show the toast after mount
      try {
        if (milestone) {
          sessionStorage.setItem('vibbe_milestone', JSON.stringify(milestone));
        }
        if (levelUp) {
          sessionStorage.setItem('vibbe_level_up', String(levelUp));
        }
      } catch {
        // sessionStorage unavailable
      }

      if (user.profile_completed === true) {
        router.push('/dashboard');
      } else {
        router.push('/profile/create');
      }
    },
    [router]
  );

  /**
   * Setup profile — saves profile, then goes to dashboard.
   */
  const setupProfile = useCallback(
    async (payload: SetupProfilePayload): Promise<void> => {
      await profileService.setupProfile(payload);

      setProfileCompletedCookie(true);

      setUser(prev =>
        prev ? { ...prev, profile_completed: true } : prev
      );

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
      setupProfile,
      logout,
    }),
    [user, login, register, verifyOtp, resendOtp, setupProfile, logout]
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