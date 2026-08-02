// src/features/teacher-management/components/TeacherForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen, Badge } from "@/components/ui";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useTeacherDetail } from "../hooks/useTeachers";
import { useCreateTeacher, useUpdateTeacher } from "../hooks/useTeacherMutations";
import { useUsers } from "@/features/user-management/hooks/useUsers";
import {
    teacherSchema,
    teacherEditSchema,
    type TeacherFormData,
    type TeacherEditFormData,
} from "@/lib/validations/teacher.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function TeacherForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [showUserSelect, setShowUserSelect] = useState(false); // toggle ubah user

    const { data: teacherResponse, isLoading: isLoadingDetail } = useTeacherDetail(id);
    const { data: usersResponse } = useUsers({ limit: 1000 });

    const createMutation = useCreateTeacher();
    const updateMutation = useUpdateTeacher();

    const teacher = teacherResponse?.data;
    const users = usersResponse?.data ?? [];

    // Gunakan schema berbeda untuk create dan edit
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TeacherFormData | TeacherEditFormData>({
        resolver: zodResolver(isEdit ? teacherEditSchema : teacherSchema),
        defaultValues: {
            name: "",
            gender: "MALE",
            userId: isEdit ? null : "",
        },
    });

    useEffect(() => {
        if (teacher) {
            reset({
                name: teacher.name,
                gender: teacher.gender,
                userId: teacher.userId || null,
            });
        }
    }, [teacher, reset]);

    const onSubmit = (data: any) => {
        // Hanya kirim userId jika diubah (tidak null)
        const payload = {
            ...data,
            userId: data.userId || undefined, // null/"" jadi undefined agar tidak dikirim
        };

        if (isEdit && id) {
            updateMutation.mutate(
                { id, data: payload },
                { onSuccess: () => navigate(ROUTE_PATHS.TEACHERS) }
            );
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

    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
        disabled: !user.isActive,
    }));

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? "Edit Guru" : "Tambah Guru"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {isEdit ? "Perbarui data guru" : "Tambahkan guru baru ke sistem"}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
                <Input
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    {...register("name")}
                    error={errors.name?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />

                <Select
                    label="Jenis Kelamin"
                    options={[
                        { value: "MALE", label: "Laki-laki" },
                        { value: "FEMALE", label: "Perempuan" },
                    ]}
                    {...register("gender")}
                    error={errors.gender?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />

                {/* Mode tambah: wajib pilih user */}
                {!isEdit && (
                    <>
                        <SearchableSelect
                            label="Hubungkan dengan User"
                            options={userOptions}
                            value={watch("userId") || ""}
                            onChange={(val) => setValue("userId", val, { shouldValidate: true })}
                            placeholder="Ketik nama atau email..."
                            error={errors.userId?.message}
                            disabled={isSubmitting}
                            className="text-black"
                        />
                        {watch("userId") && (
                            <p className="text-xs text-gray-500 mt-1">
                                Email terhubung: {users.find(u => u.id === watch("userId"))?.email || "-"}
                            </p>
                        )}
                    </>
                )}
                {/* Mode edit: tampilkan user terhubung, bisa ganti jika perlu */}
                {isEdit && teacher?.user && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Akun Terhubung
                        </label>
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{teacher.user.name}</p>
                                <p className="text-xs text-gray-500">{teacher.user.email}</p>
                            </div>
                            <Badge variant={teacher.user.isActive ? "success" : "error"}>
                                {teacher.user.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </div>

                        {!showUserSelect && (
                            <button
                                type="button"
                                onClick={() => setShowUserSelect(true)}
                                className="mt-2 text-sm text-blue-600 hover:underline"
                            >
                                Ganti akun
                            </button>
                        )}

                        {showUserSelect && (
                            <div className="mt-2 space-y-2">
                                <SearchableSelect
                                    label="Pilih User Baru"
                                    options={userOptions}
                                    value={watch("userId") || ""}
                                    onChange={(val) => setValue("userId", val, { shouldValidate: true })}
                                    placeholder="Ketik nama atau email..."
                                    disabled={isSubmitting}
                                    className="text-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setValue("userId", null);
                                        setShowUserSelect(false);
                                    }}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    Batal ganti
                                </button>
                            </div>
                        )}
                    </div>
                )}

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