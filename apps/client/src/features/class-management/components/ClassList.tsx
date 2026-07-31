import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import { ErrorMessage, EmptyState, ConfirmDialog } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useClasses } from "../hooks/useClasses";
import { useDeleteClass } from "../hooks/useClassMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { SchoolClass } from "@/types/entities";

export default function ClassList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useClasses({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteClass();

  // Reset ke halaman 1 saat search berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  // Update total items dari meta backend
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotalItems(data.meta.total);
    }
  }, [data?.meta?.total, setTotalItems]);

  const columns = [
    {
      key: "name",
      header: "Nama Kelas",
      sortable: true,
      render: (c: SchoolClass) => <span className="font-medium">{c.name}</span>,
    },
    { key: "grade", header: "Tingkat", render: (c: SchoolClass) => c.grade },
    { key: "academicYear", header: "Tahun Ajaran" },
    {
      key: "studentCount",
      header: "Siswa",
      align: "center" as const,
      render: (c: SchoolClass) => (c as any).studentCount ?? 0,
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (c: SchoolClass) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.CLASS_EDIT.replace(":id", c.id))}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setDeleteTarget(c)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat kelas" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Manajemen Kelas</h1>
          <p className="text-sm text-gray-500">Daftar kelas dan rombongan belajar</p>
        </div>
        <Button onClick={() => navigate(ROUTE_PATHS.CLASS_CREATE)}>+ Tambah Kelas</Button>
      </div>

      <Input
        placeholder="Cari kelas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-black"
      />

      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada kelas" />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(c) => c.id}
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
        title="Hapus Kelas"
        message={`Hapus kelas ${deleteTarget?.name}?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
