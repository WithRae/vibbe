/**
 * Profile service — all user profile API calls.
 */

import { apiClient } from '@/lib/api';
import type { ProfileResponse, SetupProfilePayload, UserProfile } from '@/types/auth';

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
  async getProfile(): Promise<ProfileResponse | null> {
    try {
      const response = await apiClient.get<ProfileResponse>('/profile');

      return response.data ?? null;
    } catch {
      return null;
    }
  },
};