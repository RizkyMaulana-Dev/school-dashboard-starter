import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

/**
 * Generic hook factory untuk membuat query hooks dengan tipe yang aman
 *
 * @example
 * const useUsers = createEntityQuery<User>('users', userService.getAll);
 */
export function createEntityQuery<T>(
  entityKey: string,
  fetchFn: (params?: QueryParams) => Promise<PaginatedResponse<T>>,
  defaultOptions?: Omit<UseQueryOptions<PaginatedResponse<T>>, "queryKey" | "queryFn">,
) {
  return function useEntityQuery(
    params?: QueryParams,
    options?: Omit<UseQueryOptions<PaginatedResponse<T>>, "queryKey" | "queryFn">,
  ): UseQueryResult<PaginatedResponse<T>> {
    return useQuery<PaginatedResponse<T>>({
      queryKey: [entityKey, params],
      queryFn: () => fetchFn(params),
      ...defaultOptions,
      ...options,
    });
  };
}

/**
 * Hook untuk mengambil detail entity by ID
 */
export function createEntityDetailQuery<T>(
  entityKey: string,
  fetchFn: (id: string) => Promise<ApiResponse<T>>,
  defaultOptions?: Omit<UseQueryOptions<ApiResponse<T>>, "queryKey" | "queryFn">,
) {
  return function useEntityDetailQuery(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<T>>, "queryKey" | "queryFn">,
  ): UseQueryResult<ApiResponse<T>> {
    return useQuery<ApiResponse<T>>({
      queryKey: [entityKey, id],
      queryFn: () => fetchFn(id!),
      enabled: !!id, // Only fetch if ID exists
      ...defaultOptions,
      ...options,
    });
  };
}
