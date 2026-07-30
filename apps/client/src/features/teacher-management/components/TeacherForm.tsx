// src/features/teacher-management/components/TeacherForm.tsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { useTeacherDetail } from "../hooks/useTeachers";
import { useCreateTeacher, useUpdateTeacher } from "../hooks/useTeacherMutations";
import { useUsers } from "@/features/user-management/hooks/useUsers";
import { teacherSchema, type TeacherFormData } from "@/lib/validations/teacher.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function TeacherForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Queries
  const { data: teacherResponse, isLoading: isLoadingDetail } = useTeacherDetail(id);
  const { data: usersResponse } = useUsers({ limit: 1000 }); // ambil user untuk dropdown

  // Mutations
  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();

  const teacher = teacherResponse?.data;
  const users = usersResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      gender: "MALE",
      birthDate: "",
      userId: "",
    },
  });

  // Isi form saat edit
  useEffect(() => {
    if (teacher) {
      reset({
        name: teacher.name,
        gender: teacher.gender,
        birthDate: teacher.birthDate?.split("T")[0] ?? "",
        userId: teacher.userId,
      });
    }
  }, [teacher, reset]);

  const onSubmit = (data: TeacherFormData) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.TEACHERS) });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => navigate(ROUTE_PATHS.TEACHERS),
      });
    }
  };

  if (isEdit && isLoadingDetail) {
    return <LoadingScreen message="Memuat data guru..." />;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Guru" : "Tambah Guru"}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit ? "Perbarui data guru" : "Tambahkan guru baru ke sistem"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Nama Lengkap */}
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          {...register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Gender */}
          <Select
            label="Jenis Kelamin"
            options={[
              { value: "MALE", label: "Laki-laki" },
              { value: "FEMALE", label: "Perempuan" },
            ]}
            {...register("gender")}
            error={errors.gender?.message}
            disabled={isSubmitting}
          />

          {/* Tanggal Lahir */}
          <Input
            label="Tanggal Lahir"
            type="date"
            {...register("birthDate")}
            error={errors.birthDate?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Pilih User (email) */}
        <Select
          label="Hubungkan dengan User"
          options={users.map((user) => ({
            value: user.id,
            label: `${user.name} (${user.email})`,
          }))}
          placeholder="Pilih user..."
          {...register("userId")}
          error={errors.userId?.message}
          disabled={isSubmitting}
          helperText="User harus sudah terdaftar. Guru akan login menggunakan akun ini."
        />

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(ROUTE_PATHS.TEACHERS)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Update" : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
