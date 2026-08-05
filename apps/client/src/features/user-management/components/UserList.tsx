import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Button, Badge, LoadingScreen } from "@/components/ui";
import { ConfirmDialog, ErrorMessage } from "@/components/feedback";
import { PermissionGate } from "@/components/guard/PermissionGate";
import { Pagination } from "@/components/ui/Pagination";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useUserMutations";
import { useRoles } from "../hooks/useRoles";
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
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } =
        usePagination();

    // Ambil daftar role untuk filter dan group by
    const { data: rolesData } = useRoles();
    const roles = rolesData?.data ?? [];
    const [selectedRole, setSelectedRole] = useState("");


    // Kirim filter ke backend (termasuk filter role)
    const { data, isLoading, isFetching, isError, error, refetch } = useUsers({
        ...queryParams,
        search: debouncedSearch || undefined,
        ...filterValues, // filterValues akan berisi key 'role' jika role dipilih
    });

    const deleteMutation = useDeleteUser();

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (data?.meta?.total !== undefined) setTotalItems(data.meta.total);
    }, [data?.meta?.total, setTotalItems]);

    // Hapus filter status, hanya gunakan filter role
    const userFilters: FilterOption[] = [
        {
            key: "role",
            label: "Role",
            type: "select",
            options: [
                { value: "", label: "Semua Role" },
                ...roles.map((r) => ({ value: r.name, label: r.name })),
            ],
            placeholder: "Semua Role",
        },
    ];

    // Group by options
    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "status", label: "Status" },
        { value: "role", label: "Role" },
    ];

    // Transform data untuk menambahkan field turunan untuk group by
    const transformedData = (data?.data ?? [])
        .map((user) => ({
            ...user,
            status: user.isActive ? "Aktif" : "Nonaktif",
            role: user.roles?.map((r) => r.name).join(", ") || "Tanpa Role",
        }))
        .filter((user) => {
            if (!selectedRole) return true;
            // Jika user memiliki setidaknya satu role yang cocok dengan yang dipilih
            return user.roles?.some((r) => r.name === selectedRole);
        });

    const handleFilterChange = (filters: Record<string, string>) => {
        setSelectedRole(filters.role || "");
    };


    const columns: TableColumn<User & { status?: string; role?: string }>[] = [
        {
            key: "name",
            header: "Nama",
            sortable: true,
            render: (user) => (
                <div>
                    <p className="font-medium text-black">{user.name}</p>
                    <p className="text-sm text-black">{user.email}</p>
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
            render: (user) => (
                <span className="text-sm text-black">{formatDate(user.createdAt)}</span>
            ),
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
                            className="text-red-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user);
                            }}
                        >
                            Hapus
                        </Button>
                    </PermissionGate>
                </div>
            ),
        },
    ];

    const renderGridItem = (user: User & { status?: string; role?: string }) => (
        <div className="space-y-2 text-black">
            <h3 className="font-semibold text-black">{user.name}</h3>
            <p className="text-sm text-black">{user.email}</p>
            <div className="flex flex-wrap gap-1">
                {user.roles?.map((role) => (
                    <Badge key={role.id} variant="info" className="text-xs">
                        {role.name}
                    </Badge>
                ))}
            </div>
            <Badge variant={user.isActive ? "success" : "error"}>
                {user.isActive ? "Aktif" : "Nonaktif"}
            </Badge>
        </div>
    );

    const handleBulkDelete = (users: User[]) => {
        users.forEach((user) => deleteMutation.mutate(user.id));
    };

    if (isLoading && !data) {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black">Manajemen User</h1>
                    <p className="mt-1 text-sm text-black">Kelola pengguna dan role akses</p>
                </div>
                <PermissionGate requiredPermissions="user.create">
                    <Button onClick={() => navigate(ROUTE_PATHS.USER_CREATE)}>+ Tambah User</Button>
                </PermissionGate>
            </div>

            <div className={isFetching ? "opacity-50 pointer-events-none transition-opacity" : ""}>
                <DataView<User & { status: string; role: string }>
                    columns={columns}
                    data={transformedData}
                    keyExtractor={(user) => user.id}
                    isLoading={isLoading}
                    emptyMessage="Belum ada user"
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSort={setSortBy}
                    filters={userFilters}
                    onFilterChange={handleFilterChange}
                    onResetFilter={() => setSelectedRole("")}
                    enableBulkAction
                    bulkActionLabel="Hapus Terpilih"
                    onBulkAction={handleBulkDelete}
                    renderGridItem={renderGridItem}
                    defaultViewMode="table"
                    onRowClick={(user) => navigate(ROUTE_PATHS.USER_DETAIL.replace(":id", user.id))}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Cari nama atau email..."
                    groupBy={groupBy}
                    groupByOptions={groupByOptions}
                    onGroupByChange={setGroupBy}
                />
            </div>

            <Pagination
                page={page}
                totalPages={data?.meta?.totalPages ?? 1}
                total={data?.meta?.total ?? 0}
                limit={limit}
                onPageChange={setPage}
            />

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
                message={`Apakah Anda yakin ingin menghapus user "${userToDelete?.name}"?`}
                confirmLabel="Hapus"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}