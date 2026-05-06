/**
 * Cookie utilities that work in both browser and Edge Runtime (middleware).
 *
 * We store the auth token in a cookie — NOT localStorage — so that:
 *  1. Next.js middleware (server-side) can read it to protect routes.
 *  2. There is no "flash of protected content" before a client redirect.
 *
 * The cookie is NOT httpOnly (we need JS to write it on login),
 * but it IS Secure + SameSite=Strict in production.
 */

export const TOKEN_COOKIE = 'vibbe_token';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Write the auth token cookie.
 * Called after a successful login / register.
 */
export function setTokenCookie(token: string): void {
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  const secure  = isProduction ? '; Secure' : '';
  document.cookie = [
    `${TOKEN_COOKIE}=${token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'SameSite=Strict',
    secure,
  ].join('; ');
}

/**
 * Remove the auth token cookie.
 * Called on logout.
 */
export function removeTokenCookie(): void {
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Strict`;
}

/**
 * Read the auth token from the cookie string.
 * Works with both `document.cookie` and the raw cookie header string
 * passed in from Next.js middleware / server components.
 */
export function getTokenFromCookieString(cookieString: string): string | null {
  const match = cookieString
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${TOKEN_COOKIE}=`));

  return match ? match.split('=').slice(1).join('=') : null;
}

/**
 * Client-side helper — reads token from document.cookie.
 */
export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  return getTokenFromCookieString(document.cookie);
}