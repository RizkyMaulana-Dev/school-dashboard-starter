import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { QueryParams } from "@/types/api";

/**
 * Hook untuk membaca dan mengelola query parameters dari URL
 * Berguna untuk sinkronisasi state filter dengan URL
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = useMemo<QueryParams>(() => {
    const params: QueryParams = {};

    const page = searchParams.get("page");
    if (page) params.page = Number(page);

    const limit = searchParams.get("limit");
    if (limit) params.limit = Number(limit);

    const search = searchParams.get("search");
    if (search) params.search = search;

    const sortBy = searchParams.get("sortBy");
    if (sortBy) params.sortBy = sortBy;

    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | null;
    if (sortOrder) params.sortOrder = sortOrder;

    // Parse additional filter params
    searchParams.forEach((value, key) => {
      if (!["page", "limit", "search", "sortBy", "sortOrder"].includes(key)) {
        params[key] = value;
      }
    });

    return params;
  }, [searchParams]);

  const setParams = (newParams: Partial<QueryParams>) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          updated.delete(key);
        } else {
          updated.set(key, String(value));
        }
      });

      // Reset page to 1 when filters change
      if (!newParams.page && Object.keys(newParams).length > 0) {
        updated.set("page", "1");
      }

      return updated;
    });
  };

  const resetParams = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    queryParams,
    setParams,
    resetParams,
  };
}
