/**
 * Profile service — all user profile API calls.
 */

import { apiClient } from '@/lib/api';
import type { SetupProfilePayload, UserProfile } from '@/types/auth';

export const profileService = {
  /**
   * Create or update the authenticated user's profile.
   */
  async setupProfile(payload: SetupProfilePayload): Promise<UserProfile> {
    const response = await apiClient.post<UserProfile>('/profile', payload);
    return response.data!;
  },

  /**
   * Fetch the authenticated user's profile.
   * Returns null if no profile exists yet.
   */
  async getProfile(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<{ profile: UserProfile | null }>('/profile');
      return response.data?.profile ?? null;
    } catch {
      return null;
    }
  },
};