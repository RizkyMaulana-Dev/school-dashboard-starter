import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Badge,
  ConfirmDialog,
  LoadingScreen,
  ErrorMessage,
  EmptyState,
} from "@/components/ui";
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
  const { queryParams, sortBy, sortOrder, setSortBy, setTotalItems } = usePagination();
  const { data, isLoading, isError, error, refetch } = useBooks({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteBook();

  if (data?.meta?.totalItems) setTotalItems(data.meta.totalItems);

  const columns = [
    {
      key: "title",
      header: "Judul",
      sortable: true,
      render: (b: Book) => (
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
      render: (b: Book) => `${b.stockAvailable}/${b.stockTotal}`,
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (b: Book) => (
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

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat buku" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manajemen Buku</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.BOOK_CREATE)}>+ Tambah Buku</Button>
      </div>
      <Input
        placeholder="Cari judul, penulis, ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
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
