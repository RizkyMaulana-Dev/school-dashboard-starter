import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import type { TableColumn } from "@/components/ui/Table";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
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

  if (data?.meta?.totalItems) setTotalItems(data.meta.totalItems);

  const columns: TableColumn<Student>[] = [
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (s: Student) => (
        <div>
          <p className="font-medium">{s.name}</p>
          <p className="text-sm text-gray-500">{s.user?.email}</p>
        </div>
      ),
    },
    { key: "gender", header: "Gender", render: (s: Student) => formatGender(s.gender) },
    { key: "schoolClass", header: "Kelas", render: (s: Student) => s.schoolClass?.name || "-" },
    {
      key: "birthDate",
      header: "Tgl Lahir",
      render: (s: Student) => new Date(s.birthDate).toLocaleDateString("id-ID"),
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (s: Student) => (
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

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return (
      <ErrorMessage title="Gagal memuat data siswa" message={error?.message} onRetry={refetch} />
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Siswa</h1>
          <p className="text-sm text-gray-500">Data siswa dan kelas</p>
        </div>
        <Button onClick={() => navigate(ROUTE_PATHS.STUDENT_CREATE)}>+ Tambah Siswa</Button>
      </div>
      <Input
        placeholder="Cari nama atau email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada siswa" />
      ) : (
        <Table<Student>
          columns={columns}
          data={data?.data || []}
          keyExtractor={(s) => s.id}
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
        title="Hapus Siswa"
        message={`Hapus ${deleteTarget?.name}?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
