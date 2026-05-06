/**
 * Centralized API client for all backend communication.
 *
 * Features:
 *  - Auth Bearer token auto-attached from cookie
 *  - Consistent ApiResponse<T> typing
 *  - Typed error throwing via ApiError
 *  - Base URL from environment variable
 */

import { getToken } from '@/lib/cookies';
import type { ApiError, ApiResponse } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

if (!BASE_URL) {
  console.warn('[api] NEXT_PUBLIC_API_BASE_URL is not set.');
}

// ── Custom error class ──────────────────────────────────────────────────────

export class HttpError extends Error implements ApiError {
  success: false = false;
  errors?: Record<string, string[]>;
  statusCode: number;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name       = 'HttpError';
    this.statusCode = statusCode;
    this.errors     = errors;
  }
}

// ── Request options ─────────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: object;
  /** Skip auth header (for login / register) */
  public?: boolean;
}

// ── Core fetch wrapper ──────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { body, public: isPublic, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  };

  if (!isPublic) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: { ...headers, ...(rest.headers as Record<string, string> ?? {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse JSON regardless of status — our API always returns JSON
  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new HttpError('Failed to parse server response.', response.status);
  }

  if (!response.ok) {
    throw new HttpError(
      json.message ?? 'An error occurred.',
      response.status,
      json.errors
    );
  }

  return json;
}

// ── HTTP method helpers ─────────────────────────────────────────────────────

export const apiClient = {
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: object, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: object, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: object, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};