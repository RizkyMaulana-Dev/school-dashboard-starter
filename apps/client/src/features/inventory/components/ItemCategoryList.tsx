import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useItemCategories } from "../hooks/useItemCategories";
import { useDeleteItemCategory } from "../hooks/useItemCategoryMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { ItemCategory } from "@/types/entities";

export default function ItemCategoryList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<ItemCategory | null>(null);
    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();
    const { data, isLoading, isError, error, refetch } = useItemCategories({
        ...queryParams,
        search: debouncedSearch || undefined,
    });
    const deleteMutation = useDeleteItemCategory();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, setPage]);
    useEffect(() => {
        if (data?.meta?.total !== undefined) setTotalItems(data.meta.total);
    }, [data?.meta?.total, setTotalItems]);

    const columns = [
        { key: "name", header: "Nama Kategori", sortable: true },
        { key: "description", header: "Deskripsi", render: (c: ItemCategory) => c.description || "-" },
        {
            key: "actions",
            header: "Aksi",
            align: "center" as const,
            render: (c: ItemCategory) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(ROUTE_PATHS.ITEM_CATEGORY_EDIT.replace(":id", c.id))
                        }
                        }
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(c)
                        }}
                    >
                        Hapus
                    </Button>
                </div >
            ),
        },
    ];

    if (isLoading && !data) return <LoadingScreen />;
    if (isError)
        return (
            <ErrorMessage title="Gagal memuat kategori" message={error?.message} onRetry={refetch} />
        );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Kategori Barang</h1>
                <Button onClick={() => navigate(ROUTE_PATHS.ITEM_CATEGORY_CREATE)}>
                    + Tambah Kategori
                </Button>
            </div>
            <Input
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md text-black"
            />
            {data?.data.length === 0 ? (
                <EmptyState title="Belum ada kategori" />
            ) : (
                <Table
                    columns={columns}
                    data={data?.data || []}
                    keyExtractor={(c) => c.id}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={setSortBy}
                    onRowClick={(user) => navigate(ROUTE_PATHS.ITEM_CATEGORY_DETAIL.replace(":id", user.id))}
                />
            )}
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
                title="Hapus Kategori"
                message={`Hapus kategori ${deleteTarget?.name}?`}
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
