import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useUserDetail } from "../hooks/useUsers";
import { useCreateUser, useUpdateUser } from "../hooks/useUserMutations";
import { useRoles } from "../hooks/useRoles";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/user.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { UserCreateFormData, UserUpdateFormData } from "@/lib/validations/user.schema";

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Queries
  const { data: userResponse, isLoading: isLoadingUser } = useUserDetail(id);
  const { data: rolesData } = useRoles();

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const user = userResponse?.data;
  const roles = rolesData?.data || [];

  // Definisikan tipe yang mencakup semua field dari kedua schema
  type UserFormValues = {
    name: string;
    email: string;
    password?: string; // tetap opsional
    isActive?: boolean; // <-- ubah jadi opsional
    roleIds: string[];
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isActive: true, // meskipun opsional di tipe, nilai default true tetap valid
      roleIds: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        roleIds: user.roles?.map((r) => r.id) || [],
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormValues) => {
    if (isEditing && id) {
      updateMutation.mutate(
        // Cast data to UserUpdateFormData since zod guarantees it passed userUpdateSchema
        { id, data: data as UserUpdateFormData },
        {
          onSuccess: () => navigate(ROUTE_PATHS.USERS),
        },
      );
    } else {
      // Cast data to UserCreateFormData since zod guarantees it passed userCreateSchema
      createMutation.mutate(data as UserCreateFormData, {
        onSuccess: () => navigate(ROUTE_PATHS.USERS),
      });
    }
  };
  if (isEditing && isLoadingUser) {
    return <LoadingScreen message="Memuat data user..." />;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit User" : "Tambah User"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? "Update data user" : "Tambahkan user baru ke sistem"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* Name */}
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            {...register("name")}
            error={errors.name?.message}
            disabled={isSubmitting}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="nama@sekolah.id"
            {...register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          {/* Password (only for create) */}
          {!isEditing && (
            <Input
              label="Password"
              type="password"
              placeholder="Minimal 8 karakter"
              {...register("password")}
              error={(errors as any).password?.message}
              disabled={isSubmitting}
              helperText="Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka"
            />
          )}

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={role.id}
                    {...register("roleIds")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role.name}</p>
                    {role.description && (
                      <p className="text-xs text-gray-500">{role.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.roleIds?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.roleIds.message}</p>
            )}
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isActive")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">User aktif</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.USERS)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
