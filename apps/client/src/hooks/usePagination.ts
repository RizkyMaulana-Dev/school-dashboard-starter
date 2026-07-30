import { useState, useCallback, useMemo } from "react";
import type { QueryParams } from "@/types/api";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  sortBy: string | undefined;
  sortOrder: "asc" | "desc";
  queryParams: QueryParams;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPagination: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  totalItems: number;
  setTotalItems: (total: number) => void;
}

/**
 * Hook untuk mengelola state pagination, sorting, dan filtering
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10, initialSortBy, initialSortOrder = "asc" } = options;

  const [page, setPageState] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [sortBy, setSortByState] = useState<string | undefined>(initialSortBy);
  const [sortOrder, setSortOrderState] = useState<"asc" | "desc">(initialSortOrder);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const queryParams = useMemo<QueryParams>(
    () => ({
      page,
      limit,
      ...(sortBy && { sortBy }),
      ...(sortBy && { sortOrder }),
    }),
    [page, limit, sortBy, sortOrder],
  );

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, newPage));
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1); // Reset to first page when limit changes
  }, []);

  const setSortBy = useCallback((newSortBy: string) => {
    setSortByState((prev) => {
      // If clicking the same column, toggle order
      if (prev === newSortBy) {
        setSortOrderState((order) => (order === "asc" ? "desc" : "asc"));
      } else {
        setSortOrderState("asc");
      }
      return newSortBy;
    });
  }, []);

  const setSortOrder = useCallback((newSortOrder: "asc" | "desc") => {
    setSortOrderState(newSortOrder);
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPageState((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPageState((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const resetPagination = useCallback(() => {
    setPageState(initialPage);
    setLimitState(initialLimit);
    setSortByState(initialSortBy);
    setSortOrderState(initialSortOrder);
    setTotalItems(0);
  }, [initialPage, initialLimit, initialSortBy, initialSortOrder]);

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    queryParams,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage,
    hasPrevPage,
    totalPages,
    totalItems,
    setTotalItems,
  };
}
