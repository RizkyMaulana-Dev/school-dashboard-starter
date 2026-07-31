import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Input, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage, EmptyState } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { useSessions } from "../hooks/useSessions";
import { useDeleteSession } from "../hooks/useAttendanceMutations";
import { usePagination, useDebounce } from "@/hooks";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { AttendanceSession } from "@/types/entities";

export default function SessionList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AttendanceSession | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { queryParams, limit, sortBy, sortOrder, setSortBy, page, setPage, setTotalItems } =
    usePagination();
  const { data, isLoading, isError, error, refetch } = useSessions({
    ...queryParams,
    search: debouncedSearch || undefined,
  });
  const deleteMutation = useDeleteSession();

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
    { key: "title", header: "Judul", sortable: true },
    {
      key: "date",
      header: "Tanggal",
      render: (s: AttendanceSession) => new Date(s.date).toLocaleDateString("id-ID"),
    },
    { key: "schoolClass", header: "Kelas", render: (s: AttendanceSession) => s.schoolClass?.name },
    { key: "teacher", header: "Guru", render: (s: AttendanceSession) => s.teacher?.name },
    {
      key: "actions",
      header: "Aksi",
      align: "center" as const,
      render: (s: AttendanceSession) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/app/attendance/sessions/${s.id}`)}
          >
            Isi Kehadiran
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(ROUTE_PATHS.ATTENDANCE_SESSION_EDIT.replace(":id", s.id))}
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
    return <ErrorMessage title="Gagal memuat sesi" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-black">Sesi Presensi</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.ATTENDANCE_SESSION_CREATE)}>+ Buat Sesi</Button>
      </div>
      <Input
        placeholder="Cari sesi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-black"
      />
      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada sesi" />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(s) => s.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
          onRowClick={(user) =>
            navigate(ROUTE_PATHS.ATTENDANCE_SESSION_DETAIL.replace(":id", user.id))
          }
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
        title="Hapus Sesi"
        message={`Hapus sesi ${deleteTarget?.title}?`}
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
