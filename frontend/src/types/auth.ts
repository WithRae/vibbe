import type { XpState } from '@/types/xp';

export interface User {
  id: number;
  name: string;
  email: string;
  profile_completed: boolean;
  created_at: string;
  xp: XpState;
}

export interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string | null;
}

// ── Streak ──────────────────────────────────────────────────────────────────

export interface StreakMilestone {
  days: number;
  xp_bonus: number;
}

export interface StreakData {
  current: number;
  longest: number;
  mercy_tokens: number;
  is_broken: boolean;
  milestone_hit: StreakMilestone | null;
  xp_awarded: number;
  level_up: number | null;
}

// ── Auth data ────────────────────────────────────────────────────────────────

export interface AuthData {
  user: User;
  token: string;
  streak: StreakData;
}

// ── Request payloads ────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface SetupProfilePayload {
  first_name: string;
  last_name: string;
  username: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string | null;
}

// ── Response shapes ─────────────────────────────────────────────────────────

export interface RegisterResponse {
  email: string;
}

export interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  profile: UserProfile | null;
  streak: StreakData;
  xp: XpState;
}

// ── Auth context shape ──────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  verifyOtp: (payload: OtpPayload) => Promise<void>;
  resendOtp: (payload: ResendOtpPayload) => Promise<void>;
  setupProfile: (payload: SetupProfilePayload) => Promise<void>;
  logout: () => Promise<void>;
}