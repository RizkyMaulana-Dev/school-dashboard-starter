import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, Badge, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
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
  const debouncedSearch = useDebounce(search, 500);
  const { queryParams, sortBy, sortOrder, setSortBy, setPage, setTotalItems, page, limit } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useItems({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteItem();

  // Reset halaman saat pencarian berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  // Sinkronkan total dari meta backend
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotalItems(data.meta.total);
    }
  }, [data?.meta?.total, setTotalItems]);

  const columns = [
    { key: "itemCode", header: "Kode", sortable: true },
    { key: "name", header: "Nama Barang", sortable: true },
    {
      key: "condition",
      header: "Kondisi",
      render: (i: Item) => (
        <Badge variant={i.condition === "BAIK" ? "success" : "warning"}>
          {formatItemCondition(i.condition)}
        </Badge>
      ),
    },
    {
      key: "stockAvailable",
      header: "Stok",
      render: (i: Item) => `${i.stockAvailable}/${i.stockTotal}`,
    },
    {
      key: "category",
      header: "Kategori",
      // Respons backend mengirim "category" sebagai objek
      render: (i: any) => i.category?.name || "-",
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (i: Item) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.ITEM_EDIT.replace(":id", i.id))}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setDeleteTarget(i)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat barang" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-black">Manajemen Barang</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.ITEM_CREATE)}>+ Tambah Barang</Button>
      </div>
      <Input
        placeholder="Cari kode atau nama..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-black"
      />
      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada barang" />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(i) => i.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
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
        title="Hapus Barang"
        message={`Hapus ${deleteTarget?.name}?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
