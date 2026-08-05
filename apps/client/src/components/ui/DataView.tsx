// src/components/ui/DataView.tsx
import { useState, type ReactNode } from "react";
import { Table, type TableColumn } from "./Table";
import { Button } from "./button";
import { Input } from "./Input";
import { Select } from "./Select";
import { GridView } from "./GridView";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";

export interface FilterOption {
    key: string;
    label: string;
    type: "select" | "input" | "date-range";
    options?: { value: string; label: string }[];
    placeholder?: string;
}

export interface DataViewProps<T extends object> {
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (item: T) => string | number;
    isLoading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort?: (columnKey: string) => void;
    // Grid
    renderGridItem?: (item: T) => ReactNode;
    // Filter
    filters?: FilterOption[];
    onFilterChange?: (filters: Record<string, string>) => void;
    onResetFilter?: () => void;
    // Bulk action
    enableBulkAction?: boolean;
    bulkActionLabel?: string;
    onBulkAction?: (items: T[]) => void;
    // View mode
    defaultViewMode?: "table" | "grid";
    // Group by
    groupBy?: string;
    groupByOptions?: { value: string; label: string }[];
    onGroupByChange?: (value: string) => void;
    // Global search
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    className?: string;
}

export function DataView<T extends object>({
    columns,
    data,
    keyExtractor,
    isLoading,
    emptyMessage,
    onRowClick,
    sortBy,
    sortOrder,
    onSort,
    renderGridItem,
    filters = [],
    onFilterChange,
    onResetFilter,
    enableBulkAction = false,
    bulkActionLabel = "Hapus Terpilih",
    onBulkAction,
    defaultViewMode = "table",
    groupBy,
    groupByOptions,
    onGroupByChange,
    searchValue,
    onSearchChange,
    searchPlaceholder = "Cari...",
    className = "",
}: DataViewProps<T>) {
    const [viewMode, setViewMode] = useState<"table" | "grid">(defaultViewMode);
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filterValues, [key]: value };
        if (!value) delete newFilters[key];
        setFilterValues(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleResetFilter = () => {
        setFilterValues({});
        onResetFilter?.();
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === data.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(data.map(keyExtractor)));
        }
    };

    const toggleItem = (id: string | number) => {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleBulkAction = () => {
        if (onBulkAction) {
            const items = data.filter((item) => selectedItems.has(keyExtractor(item)));
            onBulkAction(items);
        }
        setShowBulkConfirm(false);
        setSelectedItems(new Set());
    };

    const selectionColumn: TableColumn<T> = {
        key: "__selection__",
        header: (
            <input
                type="checkbox"
                checked={selectedItems.size === data.length && data.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300"
            />
        ),
        width: "40px",
        render: (item: T) => (
            <input
                type="checkbox"
                checked={selectedItems.has(keyExtractor(item))}
                onChange={() => toggleItem(keyExtractor(item))}
                className="rounded border-gray-300"
                onClick={(e) => e.stopPropagation()}
            />
        ),
    };

    const finalColumns = enableBulkAction ? [selectionColumn, ...columns] : columns;

    // Grouping
    const groupedData: { group: string; items: T[] }[] = [];
    if (groupBy) {
        const map = new Map<string, T[]>();
        data.forEach((item) => {
            const val = ((item as Record<string, unknown>)[groupBy] as string) || "Tanpa Kategori";
            if (!map.has(val)) map.set(val, []);
            map.get(val)!.push(item);
        });
        map.forEach((items, group) => groupedData.push({ group, items }));
    }
    const sortedGroupedData = groupedData.sort((a, b) => a.items.length - b.items.length);


    return (
        <div className={`space-y-3 ${className}`}>
            {/* Toolbar: search, filters, view toggle, bulk action */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                    {/* Global search */}
                    {onSearchChange && (
                        <Input
                            value={searchValue ?? ""}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="max-w-xs text-black"
                        />
                    )}

                    {/* Filter inputs */}
                    {filters.map((filter) => (
                        <div key={filter.key} className="flex items-center gap-1">
                            <label className="text-xs text-black">{filter.label}</label>
                            {filter.type === "select" ? (
                                <Select
                                    options={filter.options ?? []}
                                    value={filterValues[filter.key] || ""}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="w-40 text-black"
                                    placeholder={filter.placeholder || "Semua"}
                                />
                            ) : filter.type === "input" ? (
                                <Input
                                    placeholder={filter.placeholder}
                                    value={filterValues[filter.key] || ""}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="w-40 text-black"
                                />
                            ) : filter.type === "date-range" ? (
                                <div className="flex items-center gap-1">
                                    <Input
                                        type="date"
                                        value={filterValues[`${filter.key}_start`] || ""}
                                        onChange={(e) => handleFilterChange(`${filter.key}_start`, e.target.value)}
                                        className="w-32 text-black"
                                    />
                                    <span className="text-xs text-black">-</span>
                                    <Input
                                        type="date"
                                        value={filterValues[`${filter.key}_end`] || ""}
                                        onChange={(e) => handleFilterChange(`${filter.key}_end`, e.target.value)}
                                        className="w-32 text-black"
                                    />
                                </div>
                            ) : null}
                        </div>
                    ))}

                    {/* Group by */}
                    {groupByOptions && onGroupByChange && (
                        <div className="flex items-center gap-1">
                            <label className="text-xs text-black">Kelompokkan</label>
                            <Select
                                options={groupByOptions}
                                value={groupBy ?? ""}
                                onChange={(e) => onGroupByChange(e.target.value)}
                                className="w-40 text-black"
                                placeholder="Tidak"
                            />
                        </div>
                    )}

                    {Object.keys(filterValues).length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleResetFilter}>
                            Reset Filter
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                            className={`px-3 py-1 text-xs ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                            onClick={() => setViewMode("table")}
                        >
                            Tabel
                        </button>
                        <button
                            className={`px-3 py-1 text-xs ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                            onClick={() => setViewMode("grid")}
                        >
                            Grid
                        </button>
                    </div>

                    {enableBulkAction && selectedItems.size > 0 && (
                        <Button variant="danger" size="sm" onClick={() => setShowBulkConfirm(true)}>
                            {bulkActionLabel} ({selectedItems.size})
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {groupBy ? (
                // Render grouped content
                <div className="space-y-6">
                    {sortedGroupedData.map((group) => (
                        <div key={group.group}>
                            <h3 className="text-base font-semibold text-black mb-2 bg-gray-100 px-3 py-2 rounded">
                                {group.group}
                            </h3>
                            {viewMode === "table" ? (
                                <Table
                                    columns={finalColumns}
                                    data={group.items}
                                    keyExtractor={keyExtractor}
                                    isLoading={isLoading}
                                    emptyMessage={emptyMessage}
                                    onRowClick={onRowClick}
                                    sortBy={sortBy}
                                    sortOrder={sortOrder}
                                    onSort={onSort}
                                />
                            ) : (
                                <GridView
                                    data={group.items}
                                    keyExtractor={keyExtractor}
                                    renderItem={renderGridItem}
                                    isLoading={isLoading}
                                    emptyMessage={emptyMessage}
                                    onItemClick={onRowClick}
                                    enableSelection={enableBulkAction}
                                    selectedItems={selectedItems}
                                    onToggleSelection={toggleItem}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                // Non-grouped
                <>
                    {viewMode === "table" ? (
                        <Table
                            columns={finalColumns}
                            data={data}
                            keyExtractor={keyExtractor}
                            isLoading={isLoading}
                            emptyMessage={emptyMessage}
                            onRowClick={onRowClick}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={onSort}
                        />
                    ) : (
                        <GridView
                            data={data}
                            keyExtractor={keyExtractor}
                            renderItem={renderGridItem}
                            isLoading={isLoading}
                            emptyMessage={emptyMessage}
                            onItemClick={onRowClick}
                            enableSelection={enableBulkAction}
                            selectedItems={selectedItems}
                            onToggleSelection={toggleItem}
                        />
                    )}
                </>
            )}

            <ConfirmDialog
                isOpen={showBulkConfirm}
                onClose={() => setShowBulkConfirm(false)}
                onConfirm={handleBulkAction}
                title={bulkActionLabel}
                message={`Yakin ingin ${bulkActionLabel.toLowerCase()} ${selectedItems.size} item?`}
                variant="danger"
            />
        </div>
    );
}