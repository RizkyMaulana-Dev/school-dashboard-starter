import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useBooks } from "../hooks/useBooks";
import { useDeleteBook } from "../hooks/useBookMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { Book } from "@/types/entities";

export default function BookList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { queryParams, sortBy, sortOrder, setSortBy, page, setPage, setTotalItems, limit } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useBooks({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteBook();

  // Reset halaman saat search berubah
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
    {
      key: "title",
      header: "Judul",
      sortable: true,
      render: (b: any) => (
        <div>
          <p className="font-medium">{b.title}</p>
          <p className="text-sm text-gray-500">{b.isbn}</p>
        </div>
      ),
    },
    { key: "author", header: "Penulis" },
    {
      key: "stockAvailable",
      header: "Stok",
      render: (b: any) => `${b.stockAvailable}/${b.stockTotal}`,
    },
    {
      key: "category",
      header: "Kategori",
      render: (b: any) => b.category?.name || "-",
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (b: any) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.BOOK_EDIT.replace(":id", b.id))}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setDeleteTarget(b)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat buku" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-black">Manajemen Buku</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.BOOK_CREATE)}>+ Tambah Buku</Button>
      </div>
      <Input
        placeholder="Cari judul, penulis, ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-black"
      />
      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada buku" />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(b) => b.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
        />
      )}
      {/* Pagination */}
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
        title="Hapus Buku"
        message={`Hapus buku "${deleteTarget?.title}"?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
