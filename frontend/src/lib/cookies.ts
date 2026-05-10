export const TOKEN_COOKIE = 'vibbe_token';
export const PROFILE_COMPLETED_COOKIE = 'vibbe_profile_completed';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Write the auth token cookie.
 */
export function setTokenCookie(token: string): void {
  const maxAge = 60 * 60 * 24; // 24 hours
  const secure = isProduction ? '; Secure' : '';

  document.cookie = [
    `${TOKEN_COOKIE}=${token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'SameSite=Strict',
    secure,
  ].join('; ');
}

/**
 * Write profile completion state.
 */
export function setProfileCompletedCookie(completed: boolean): void {
  const maxAge = 60 * 60 * 24; // 24 hours
  const secure = isProduction ? '; Secure' : '';

  document.cookie = [
    `${PROFILE_COMPLETED_COOKIE}=${completed}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'SameSite=Strict',
    secure,
  ].join('; ');
}

/**
 * Remove auth token cookie.
 */
export function removeTokenCookie(): void {
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Strict`;
}

/**
 * Remove profile completed cookie.
 */
export function removeProfileCompletedCookie(): void {
  document.cookie = `${PROFILE_COMPLETED_COOKIE}=; Max-Age=0; Path=/; SameSite=Strict`;
}

/**
 * Read token from cookie string.
 */
export function getTokenFromCookieString(cookieString: string): string | null {
  const match = cookieString
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${TOKEN_COOKIE}=`));

  return match ? match.split('=').slice(1).join('=') : null;
}

/**
 * Read profile_completed from cookie string.
 */
export function getProfileCompletedFromCookieString(
  cookieString: string
): boolean {
  const match = cookieString
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${PROFILE_COMPLETED_COOKIE}=`));

  return match
    ? match.split('=').slice(1).join('=') === 'true'
    : false;
}

/**
 * Client-side helper.
 */
export function getToken(): string | null {
  if (typeof document === 'undefined') return null;

  return getTokenFromCookieString(document.cookie);
}

/**
 * Client-side helper.
 */
export function getProfileCompleted(): boolean {
  if (typeof document === 'undefined') return false;

  return getProfileCompletedFromCookieString(document.cookie);
}