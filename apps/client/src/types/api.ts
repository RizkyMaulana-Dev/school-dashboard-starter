// ============================================================
// Generic API Response Types
// ============================================================

/**
 * Standard API response wrapper untuk single data
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Standard API response wrapper untuk paginated data
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

/**
 * Metadata paginasi yang dikembalikan server
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Query parameters standar untuk request GET list
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined; // Untuk filter tambahan
}

/**
 * Default query params (dapat digunakan sebagai nilai awal)
 */
export const DEFAULT_QUERY_PARAMS: Required<Pick<QueryParams, "page" | "limit">> = {
  page: 1,
  limit: 10,
};

/**
 * Tipe untuk error response dari server
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}
