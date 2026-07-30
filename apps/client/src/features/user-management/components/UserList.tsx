import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PermissionGate } from "@/components/guard/PermissionGate";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useUserMutations";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { formatDate } from "@/utils/formatters";
import type { User } from "@/types/entities";
import type { TableColumn } from "@/components/ui/Table";

export default function UserList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
    usePagination();

  const { data, isLoading, isError, error, refetch } = useUsers({
    ...queryParams,
    search: debouncedSearch || undefined,
  });

  const deleteMutation = useDeleteUser();

  // Update total items when data changes
  if (data?.meta.totalItems !== undefined) {
    setTotalItems(data.meta.totalItems);
  }

  const columns: TableColumn<User>[] = [
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (user) => (
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      ),
    },
    {
      key: "roles",
      header: "Role",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles?.map((role) => (
            <Badge key={role.id} variant="info">
              {role.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      align: "center",
      render: (user) => (
        <Badge variant={user.isActive ? "success" : "error"}>
          {user.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Dibuat",
      sortable: true,
      render: (user) => <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "Aksi",
      align: "center",
      render: (user) => (
        <div className="flex items-center justify-center gap-2">
          <PermissionGate requiredPermissions="user.update">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTE_PATHS.USER_EDIT.replace(":id", user.id));
              }}
            >
              Edit
            </Button>
          </PermissionGate>
          <PermissionGate requiredPermissions="user.delete">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setUserToDelete(user);
              }}
              className="text-red-600 hover:text-red-700"
            >
              Hapus
            </Button>
          </PermissionGate>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingScreen message="Memuat data user..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Gagal memuat data user"
        message={error instanceof Error ? error.message : "Terjadi kesalahan"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola pengguna dan role akses</p>
        </div>
        <PermissionGate requiredPermissions="user.create">
          <Button onClick={() => navigate(ROUTE_PATHS.USER_CREATE)}>+ Tambah User</Button>
        </PermissionGate>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Users Table */}
      {data?.data.length === 0 ? (
        <EmptyState
          title="Belum ada user"
          description="Buat user baru untuk memulai"
          action={
            <PermissionGate requiredPermissions="user.create">
              <Button onClick={() => navigate(ROUTE_PATHS.USER_CREATE)}>Tambah User</Button>
            </PermissionGate>
          }
        />
      ) : (
        <Table
          columns={columns}
          data={data?.data || []}
          keyExtractor={(user) => user.id}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSortBy}
          onRowClick={(user) => navigate(ROUTE_PATHS.USER_DETAIL.replace(":id", user.id))}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {(page - 1) * limit + 1}-{Math.min(page * limit, data.meta.totalItems)} dari{" "}
            {data.meta.totalItems} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-3">
              {page} / {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteMutation.mutate(userToDelete.id);
            setUserToDelete(null);
          }
        }}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
