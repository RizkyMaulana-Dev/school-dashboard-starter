import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import type { TableColumn } from "@/components/ui/Table";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { useTeachers } from "../hooks/useTeachers";
import { useDeleteTeacher } from "../hooks/useTeacherMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatGender } from "@/utils/formatters";
import type { Teacher } from "@/types/entities";

export default function StudentList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useTeachers({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteTeacher();

  if (data?.meta?.totalItems) setTotalItems(data.meta.totalItems);

  const columns: TableColumn<Teacher>[] = [
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (t) => (
        <div>
          <p className="font-medium">{t.name}</p>
          <p className="text-sm text-gray-500">{t.user?.email}</p>
        </div>
      ),
    },
    {
      key: "gender",
      header: "Gender",
      render: (t) => formatGender(t.gender),
    },
    {
      key: "birthDate",
      header: "Tanggal Lahir",
      render: (t) => new Date(t.birthDate).toLocaleDateString("id-ID"),
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center",
      render: (t) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.TEACHER_EDIT.replace(":id", t.id))}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setDeleteTarget(t)}
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
      <ErrorMessage title="Gagal memuat data Guru" message={error?.message} onRetry={refetch} />
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Guru</h1>
          <p className="text-sm text-gray-500">Data Guru dan kelas</p>
        </div>
        <Button onClick={() => navigate(ROUTE_PATHS.TEACHER_CREATE)}>+ Tambah Guru</Button>
      </div>
      <Input
        placeholder="Cari nama atau email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada Guru" />
      ) : (
        <Table<Teacher>
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
        title="Hapus Guru"
        message={`Hapus ${deleteTarget?.name}?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
