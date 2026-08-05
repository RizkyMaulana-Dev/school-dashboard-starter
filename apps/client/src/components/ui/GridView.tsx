// src/components/ui/GridView.tsx
import type { ReactNode } from "react";
import { LoadingScreen } from "./LoadingScreen";

interface GridViewProps<T> {
    data: T[];
    keyExtractor: (item: T) => string | number;
    renderItem?: (item: T) => ReactNode;
    isLoading?: boolean;
    emptyMessage?: string;
    onItemClick?: (item: T) => void;
    enableSelection?: boolean;
    selectedItems?: Set<string | number>;
    onToggleSelection?: (id: string | number) => void;
}

export function GridView<T>({
    data,
    keyExtractor,
    renderItem,
    isLoading,
    emptyMessage = "Tidak ada data",
    onItemClick,
    enableSelection,
    selectedItems,
    onToggleSelection,
}: GridViewProps<T>) {
    if (isLoading) {
        return <LoadingScreen />;
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((item) => {
                const id = keyExtractor(item);
                return (
                    <div
                        key={id}
                        className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${onItemClick ? "cursor-pointer" : ""
                            }`}
                        onClick={() => onItemClick?.(item)}
                    >
                        {enableSelection && (
                            <div className="mb-2">
                                <input
                                    type="checkbox"
                                    checked={selectedItems?.has(id) ?? false}
                                    onChange={() => onToggleSelection?.(id)}
                                    className="rounded border-gray-300"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                        {renderItem ? (
                            renderItem(item)
                        ) : (
                            <pre className="text-xs text-gray-500">{JSON.stringify(item, null, 2)}</pre>
                        )}
                    </div>
                );
            })}
        </div>
    );
}