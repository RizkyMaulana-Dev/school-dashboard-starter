import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
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
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const { data: userResponse, isLoading: isLoadingUser } = useUserDetail(id);
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    isError: isRolesError,
    error: rolesError,
  } = useRoles();

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const user = userResponse?.data;
  const roles = rolesData?.data || [];

  type UserFormValues = {
    name: string;
    email: string;
    password?: string;
    isActive?: boolean;
    roleId: string; // single role ID
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
      isActive: true,
      roleId: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        roleId: user.roles?.[0]?.id || "", // ambil role pertama sebagai default
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserFormValues) => {
    // Jika backend masih menerima array roleIds, kirim sebagai array
    const payload = {
      ...data,
      roleIds: [data.roleId], // konversi ke array jika perlu
      roleId: undefined, // hapus field tunggal jika tidak diperlukan
    };

    if (isEditing && id) {
      updateMutation.mutate(
        { id, data: payload as any },
        { onSuccess: () => navigate(ROUTE_PATHS.USERS) },
      );
    } else {
      createMutation.mutate(payload as any, {
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit User" : "Tambah User"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? "Update data user" : "Tambahkan user baru ke sistem"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <Input
            label="Nama Lengkap"
            className="text-black"
            placeholder="Masukkan nama lengkap"
            {...register("name")}
            error={errors.name?.message}
            disabled={isSubmitting}
          />

          <Input
            label="Email"
            className="text-black"
            type="email"
            placeholder="nama@sekolah.id"
            {...register("email")}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          {!isEditing && (
            <Input
              label="Password"
              type="password"
              className="text-black"
              placeholder="Minimal 8 karakter"
              {...register("password")}
              error={(errors as any).password?.message}
              disabled={isSubmitting}
              helperText="Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka"
            />
          )}

          {/* Role – Radio Button Collapsible */}
          <div>
            <button
              type="button"
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 mb-1"
            >
              <span>Role</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isRoleOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isRoleOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {isLoadingRoles && <p className="text-sm text-gray-500 py-2">Memuat role...</p>}
              {isRolesError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  Gagal memuat role: {rolesError?.message}
                </div>
              )}
              {!isLoadingRoles && !isRolesError && (
                <div className="space-y-2 pt-2">
                  {roles.length === 0 ? (
                    <p className="text-sm text-gray-500">Tidak ada role tersedia.</p>
                  ) : (
                    roles.map((role) => (
                      <label
                        key={role.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-black"
                      >
                        <input
                          type="radio"
                          value={role.id}
                          {...register("roleId")}
                          className="border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{role.name}</p>
                          {role.description && (
                            <p className="text-xs text-gray-500">{role.description}</p>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
              {errors.roleId?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.roleId.message}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isActive")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">User aktif</span>
          </label>
        </div>

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
