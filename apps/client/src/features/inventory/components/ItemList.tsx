// src/features/inventory/components/ItemList.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, Badge, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useItems } from "../hooks/useItems";
import { useDeleteItem } from "../hooks/useItemMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatItemCondition } from "@/utils/formatters";
import type { Item } from "@/types/entities";

export default function ItemList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    const { data, isLoading, isError, error, refetch } = useItems({
        ...queryParams,
        search: debouncedSearch || undefined,
    });

    const deleteMutation = useDeleteItem();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) setTotalItems(data.meta.total);
    }, [data?.meta?.total, setTotalItems]);

    // Bangun opsi filter berdasarkan data yang sudah diambil
    const filterOptions: FilterOption[] = useMemo(() => {
        if (!data?.data) return [];

        const categories = Array.from(
            new Set(data.data.map((i) => i.category?.name).filter(Boolean))
        ).sort() as string[];

        const conditions = Array.from(
            new Set(data.data.map((i) => i.condition).filter(Boolean))
        ).sort();

        const options: FilterOption[] = [];

        if (categories.length > 0) {
            options.push({
                key: "category",
                label: "Kategori",
                type: "select",
                options: [{ value: "", label: "Semua" }, ...categories.map((c) => ({ value: c, label: c }))],
                placeholder: "Semua Kategori",
            });
        }

        if (conditions.length > 0) {
            options.push({
                key: "condition",
                label: "Kondisi",
                type: "select",
                options: [
                    { value: "", label: "Semua" },
                    ...conditions.map((c) => ({ value: c, label: formatItemCondition(c) })),
                ],
                placeholder: "Semua Kondisi",
            });
        }

        options.push({
            key: "stockStatus",
            label: "Status Stok",
            type: "select",
            options: [
                { value: "", label: "Semua" },
                { value: "available", label: "Tersedia" },
                { value: "empty", label: "Habis" },
            ],
            placeholder: "Semua Status",
        });

        return options;
    }, [data?.data]);

    // Group by
    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "categoryName", label: "Kategori" },
        { value: "conditionLabel", label: "Kondisi" },
        { value: "stockStatus", label: "Status Stok" },
    ];

    // Data yang sudah ditambahkan properti turunan untuk filter & group by
    const transformedData = useMemo(() => {
        if (!data?.data) return [];
        let result = data.data.map((item) => ({
            ...item,
            categoryName: item.category?.name ?? "Tanpa Kategori",
            conditionLabel: formatItemCondition(item.condition),
            stockStatus: (item.stockAvailable ?? 0) > 0 ? "available" : "empty",
            stockStatusLabel: (item.stockAvailable ?? 0) > 0 ? "Tersedia" : "Habis",
        }));

        // Filter client‑side
        if (filterValues.category) {
            result = result.filter((i) => i.categoryName === filterValues.category);
        }
        if (filterValues.condition) {
            result = result.filter((i) => i.condition === filterValues.condition);
        }
        if (filterValues.stockStatus) {
            result = result.filter((i) => i.stockStatus === filterValues.stockStatus);
        }

        return result;
    }, [data?.data, filterValues]);

    // Kolom tabel
    const columns = [
        { key: "itemCode", header: "Kode", sortable: true, render: (i: any) => <span className="text-black">{i.itemCode}</span> },
        { key: "name", header: "Nama Barang", sortable: true, render: (i: any) => <span className="text-black">{i.name}</span> },
        {
            key: "condition",
            header: "Kondisi",
            render: (i: any) => (
                <Badge variant={i.condition === "BAIK" ? "success" : "warning"}>
                    {formatItemCondition(i.condition)}
                </Badge>
            ),
        },
        {
            key: "stockAvailable",
            header: "Stok",
            render: (i: any) => <span className="text-black">{i.stockAvailable}/{i.stockTotal}</span>,
        },
        {
            key: "category",
            header: "Kategori",
            render: (i: any) => <span className="text-black">{i.category?.name || "-"}</span>,
        },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (i: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.ITEM_EDIT.replace(":id", i.id));
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(i);
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    // Tampilan grid
    const renderGridItem = (i: any) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{i.name}</h3>
            <p className="text-sm text-black">Kode: {i.itemCode}</p>
            <p className="text-sm text-black">Stok: {i.stockAvailable}/{i.stockTotal}</p>
            <p className="text-sm text-black">Kondisi: {formatItemCondition(i.condition)}</p>
            <p className="text-sm text-black">Kategori: {i.category?.name || "-"}</p>
            <Badge variant={i.condition === "BAIK" ? "success" : "warning"}>
                {formatItemCondition(i.condition)}
            </Badge>
        </div>
    );

    // Bulk delete
    const handleBulkDelete = (items: Item[]) => {
        items.forEach((item) => deleteMutation.mutate(item.id));
    };

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return <ErrorMessage title="Gagal memuat barang" message={error?.message} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold text-black">Manajemen Barang</h1>
                <Button onClick={() => navigate(ROUTE_PATHS.ITEM_CREATE)}>+ Tambah Barang</Button>
            </div>

            <DataView<any>
                columns={columns}
                data={transformedData}
                keyExtractor={(i) => i.id}
                isLoading={isLoading}
                emptyMessage="Belum ada barang"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={setSortBy}
                filters={filterOptions}
                onFilterChange={setFilterValues}
                onResetFilter={() => setFilterValues({})}
                enableBulkAction
                bulkActionLabel="Hapus Terpilih"
                onBulkAction={handleBulkDelete}
                renderGridItem={renderGridItem}
                defaultViewMode="table"
                onRowClick={(item) => navigate(ROUTE_PATHS.ITEM_DETAIL.replace(":id", item.id))}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari kode atau nama..."
                groupBy={groupBy}
                groupByOptions={groupByOptions}
                onGroupByChange={setGroupBy}
            />

            <Pagination
                page={page}
                totalPages={data?.meta?.totalPages ?? 1}
                total={data?.meta?.total ?? 0}
                limit={limit}
                onPageChange={setPage}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    deleteMutation.mutate(deleteTarget!.id);
                    setDeleteTarget(null);
                }}
                title="Hapus Barang"
                message={`Hapus ${deleteTarget?.name}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}