/**
 * Next.js Edge Middleware — Route Protection
 *
 * Runs on the server BEFORE any page renders.
 * Reads the auth token from cookies (not localStorage — that's browser-only).
 *
 * Strategy:
 *  - Protected routes: redirect to /login if no token cookie
 *  - Auth routes (/login, /register): redirect to /dashboard if already logged in
 *
 * Note: We check cookie existence here, not token validity.
 * Token validity is enforced by the Laravel API on every request.
 * A stolen/expired cookie will fail at the API level and the UI handles that.
 */

import { TOKEN_COOKIE } from '@/lib/cookies';
import { type NextRequest, NextResponse } from 'next/server';

// ── Route configuration ─────────────────────────────────────────────────────

/** Routes that require authentication */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/focus',
  '/sentinel',
  '/analytics',
  '/profile',
];

/** Routes that authenticated users should NOT visit */
const AUTH_ROUTES = [
  '/login',
  '/register',
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

function getToken(request: NextRequest): string | null {
  return request.cookies.get(TOKEN_COOKIE)?.value ?? null;
}

// ── Middleware ──────────────────────────────────────────────────────────────

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token        = getToken(request);
  const isAuthed     = !!token;

  // Authenticated user trying to visit /login or /register → send to dashboard
  if (isAuthed && matchesRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated user trying to visit a protected route → send to login
  if (!isAuthed && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ── Matcher ─────────────────────────────────────────────────────────────────

/**
 * Only run middleware on these paths.
 * Exclude _next internals, static files, and API routes.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};