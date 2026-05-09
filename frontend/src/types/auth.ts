export interface User {
  id: number;
  name: string;
  email: string;
  profile_completed: boolean;
  created_at: string;
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

export interface AuthData {
  user: User;
  token: string;
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

/**
 * What register() returns — email only, no token yet.
 * Token is issued only after OTP verification + login.
 */
export interface RegisterResponse {
  email: string;
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