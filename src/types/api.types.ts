/**
 * Tipos compartidos para respuestas de API normalizadas
 */

/**
 * Respuesta exitosa de API
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Respuesta de error de API
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  details?: string[];
}

/**
 * Respuesta de API (puede ser éxito o error)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Respuesta de API con paginación
 */
export type ApiPaginatedResponse<T> = ApiSuccessResponse<PaginatedResponse<T>>;

