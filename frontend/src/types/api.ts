/**
 * Standard API envelope returned by every backend endpoint.
 *
 * {
 *   success: true,
 *   message: "...",
 *   data: T
 * }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Shape returned when a request fails at the HTTP level
 * (non-2xx with our standard JSON body).
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}