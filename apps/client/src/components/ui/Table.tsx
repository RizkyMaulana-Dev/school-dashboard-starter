import { type ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (columnKey: string) => void;
  className?: string;
}

/**
 * Reusable Table component dengan sorting dan loading state
 */
export function Table<T extends object>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  className = "",
}: TableProps<T>) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-8 text-center ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Render sort indicator
  const renderSortIndicator = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    alignmentClasses[column.align || "left"]
                  } ${column.sortable ? "cursor-pointer select-none hover:bg-gray-100" : ""}`}
                  style={{ width: column.width }}
                  onClick={() => {
                    if (column.sortable && onSort) {
                      onSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && renderSortIndicator(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className={`${
                  onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                } transition-colors duration-150`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      alignmentClasses[column.align || "left"]
                    }`}
                  >
                    {column.render
                      ? column.render(item, index)
                      : (item as Record<string, React.ReactNode>)[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
