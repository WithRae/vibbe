/**
 * Auth service — all auth-related API calls.
 *
 * Handles token persistence in cookies so components never touch cookies directly.
 */

import { apiClient } from '@/lib/api';
import { getToken, removeTokenCookie, setTokenCookie } from '@/lib/cookies';
import type { AuthData, LoginPayload, RegisterPayload, User } from '@/types/auth';

// ── Auth API calls ──────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user and persist the token.
   */
  async register(payload: RegisterPayload): Promise<User> {
    const response = await apiClient.post<AuthData>('/auth/register', payload, {
      public: true,
    });

    const { user, token } = response.data!;
    setTokenCookie(token);
    return user;
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