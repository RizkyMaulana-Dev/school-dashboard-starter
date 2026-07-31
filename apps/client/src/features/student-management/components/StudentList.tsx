import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import type { TableColumn } from "@/components/ui/Table";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useStudents } from "../hooks/useStudents";
import { useDeleteStudent } from "../hooks/useStudentMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatGender } from "@/utils/formatters";
import type { Student } from "@/types/entities";

export default function StudentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useStudents({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteStudent();

  // Reset ke halaman 1 saat search berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, setPage]);

  // Sinkronkan total items dari meta backend
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotalItems(data.meta.total);
    }
  }, [data?.meta?.total, setTotalItems]);

  // Karena respons backend saat ini menggunakan field datar (email, className)
  // dan tipe Student di frontend mungkin masih menggunakan relasi (user, schoolClass),
  // kita gunakan casting sementara. Nantinya sesuaikan tipe Student di entities.ts.
  const columns: TableColumn<any>[] = [
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (s: any) => (
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="text-sm text-gray-500">{s.email}</p>
        </div>
      ),
    },
    { key: "gender", header: "Gender", render: (s: any) => formatGender(s.gender) },
    { key: "className", header: "Kelas", render: (s: any) => s.className || "-" },
    {
      key: "birthDate",
      header: "Tgl Lahir",
      render: (s: any) => new Date(s.birthDate).toLocaleDateString("id-ID"),
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (s: any) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.STUDENT_EDIT.replace(":id", s.id))}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setDeleteTarget(s)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && !data) return <LoadingScreen />;
  if (isError)
    return (
      <ErrorMessage title="Gagal memuat data siswa" message={error?.message} onRetry={refetch} />
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Manajemen Siswa</h1>
          <p className="text-sm text-gray-500">Data siswa dan kelas</p>
        </div>
        <Button onClick={() => navigate(ROUTE_PATHS.STUDENT_CREATE)}>+ Tambah Siswa</Button>
      </div>

      <Input
        placeholder="Cari nama atau email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-black"
      />

      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada siswa" />
      ) : (
        <Table<any>
          columns={columns}
          data={data?.data || []}
          keyExtractor={(s) => s.id}
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
        title="Hapus Siswa"
        message={`Hapus ${deleteTarget?.name}?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
