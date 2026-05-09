/**
 * Auth service — all auth-related API calls.
 *
 * Handles token persistence in cookies so components never touch cookies directly.
 */

import { apiClient } from '@/lib/api';
import { getToken, removeProfileCompletedCookie, removeTokenCookie, setProfileCompletedCookie, setTokenCookie } from '@/lib/cookies';
import type {
  AuthData,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  User,
} from '@/types/auth';

// ── Auth API calls ──────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user.
   * Does NOT return a token — user must verify OTP first.
   * Returns the email so the UI can pass it to the OTP step.
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      payload,
      { public: true }
    );

    // Backend returns: { success, message, email }
    // email lives at top level, not inside data
    return { email: (response as unknown as { email: string }).email };
  },

  /**
   * Verify OTP — activates the account.
   * No token issued here; user is redirected to login.
   */
  async verifyOtp(payload: OtpPayload): Promise<void> {
    await apiClient.post('/auth/verify-otp', payload, { public: true });
  },

  /**
   * Resend OTP to the given email.
   */
  async resendOtp(payload: ResendOtpPayload): Promise<void> {
    await apiClient.post('/auth/resend-otp', payload, { public: true });
  },

  /**
   * Log in and persist the token.
   */
  async login(payload: LoginPayload): Promise<User> {
    const response = await apiClient.post<AuthData>('/auth/login', payload, {
      public: true,
    });

    const { user, token } = response.data!;
    setTokenCookie(token);
    setProfileCompletedCookie(user.profile_completed);
    return user;
  },

  /**
   * Log out: revoke token on server then clear cookie.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear locally, even if server request fails
      removeTokenCookie();
      removeProfileCompletedCookie();
    }
  },

  /**
   * Quick client-side check — does a token cookie exist?
   * Does NOT validate with server. Use getMe() for a hard check.
   */
  hasToken(): boolean {
    return !!getToken();
  },
};