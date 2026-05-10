import { apiClient } from '@/lib/api';
import type { XpHistoryPage, XpState } from '@/types/xp';

export const xpService = {
  /**
   * Get current XP and level state for the authenticated user.
   */
  async getState(): Promise<XpState | null> {
    try {
      const response = await apiClient.get<XpState>('/xp');
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  /**
   * Get paginated XP transaction history.
   */
  async getHistory(page = 1, perPage = 20): Promise<XpHistoryPage | null> {
    try {
      const response = await apiClient.get<XpHistoryPage>(
        `/xp/history?page=${page}&per_page=${perPage}`
      );
      return response.data ?? null;
    } catch {
      return null;
    }
  },
};