import { useState } from "react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useRoles } from "../hooks/useRoles";
import { useDeleteRole } from "../hooks/useRoleMutations";
import { usePagination } from "@/hooks/usePagination";
import type { Role } from "@/types/entities";
import type { TableColumn } from "@/components/ui/Table";

export default function RoleList() {
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
    usePagination();

  const { data, isLoading, isError, error, refetch } = useRoles(queryParams);
  const deleteMutation = useDeleteRole();

  if (data?.meta?.totalItems !== undefined) setTotalItems(data.meta.totalItems);

  const columns: TableColumn<Role>[] = [
    {
      key: "name",
      header: "Nama Role",
      sortable: true,
      render: (role) => (
        <div>
          <p className="font-medium text-gray-900">{role.name}</p>
          {role.description && <p className="text-sm text-gray-500">{role.description}</p>}
        </div>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (role) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {role.permissions?.slice(0, 3).map((p) => (
            <Badge key={p.id} variant="info">
              {p.name}
            </Badge>
          ))}
          {role.permissions && role.permissions.length > 3 && (
            <Badge variant="default">+{role.permissions.length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      sortable: true,
      render: (role) => (
        <span className="text-sm text-gray-500">
          {new Date(role.createdAt).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center",
      render: (role) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              /* navigate to edit */
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600"
            onClick={() => setRoleToDelete(role)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat role" message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Role</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola role dan permission akses</p>
        </div>
        <Button>Tambah Role</Button>
      </div>
      {data?.data.length === 0 ? (
        <EmptyState title="Belum ada role" description="Buat role baru" />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(r) => r.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
        />
      )}
      <ConfirmDialog
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => {
          if (roleToDelete) {
            deleteMutation.mutate(roleToDelete.id);
            setRoleToDelete(null);
          }
        }}
        title="Hapus Role"
        message={`Yakin ingin menghapus role "${roleToDelete?.name}"?`}
        confirmLabel="Hapus"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
