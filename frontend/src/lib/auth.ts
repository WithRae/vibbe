/**
 * Auth service — all auth-related API calls.
 */

import { apiClient } from '@/lib/api';
import {
  getToken,
  removeProfileCompletedCookie,
  removeTokenCookie,
  setProfileCompletedCookie,
  setTokenCookie,
} from '@/lib/cookies';
import type {
  AuthData,
  ChangePasswordPayload,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  StreakMilestone,
  User,
} from '@/types/auth';

export const authService = {
  /**
   * Register a new user.
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      payload,
      { public: true }
    );

    return { email: (response as unknown as { email: string }).email };
  },

  /**
   * Verify OTP — activates the account.
   */
  async verifyOtp(payload: OtpPayload): Promise<void> {
    await apiClient.post('/auth/verify-otp', payload, { public: true });
  },

  /**
   * Resend OTP.
   */
  async resendOtp(payload: ResendOtpPayload): Promise<void> {
    await apiClient.post('/auth/resend-otp', payload, { public: true });
  },

  /**
   * Log in, persist the token, and return the user + any milestone hit.
   */
  async login(payload: LoginPayload): Promise<{
    user: User;
    milestone: StreakMilestone | null;
    levelUp: number | null;
  }> {
    const response = await apiClient.post<AuthData>('/auth/login', payload, {
      public: true,
    });

    const { user, token, streak } = response.data!;
    setTokenCookie(token);
    setProfileCompletedCookie(user.profile_completed);

    return {
      user,
      milestone: streak?.milestone_hit ?? null,
      levelUp:   streak?.level_up     ?? null,
    };
  },

  /**
   * Change password.
   */
  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.patch('/auth/password', payload);
  },

  /**
   * Log out: revoke token on server then clear cookies.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      removeTokenCookie();
      removeProfileCompletedCookie();
    }
  },

  /**
   * Quick client-side check — does a token cookie exist?
   */
  hasToken(): boolean {
    return !!getToken();
  },
};