import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { useClassDetail } from "../hooks/useClasses";
import { useCreateClass, useUpdateClass } from "../hooks/useClassMutations";
import { useTeachers } from "@/features/teacher-management/hooks/useTeachers";
import { classSchema, type ClassFormData } from "@/lib/validations/class.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function ClassForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { data: classData, isLoading: loadingDetail } = useClassDetail(id);
    const { data: teachersData } = useTeachers();
    const createMutation = useCreateClass();
    const updateMutation = useUpdateClass();
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClassFormData>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: "",
            description: "",
            grade: 0, // karena Zod mengharapkan number, kita beri default 0
            academicYear: "",
            teacherId: null,
        },
    });

    useEffect(() => {
        if (classData?.data) {
            const c = classData.data;
            reset({
                name: c.name,
                description: c.description,
                grade: c.grade, // langsung number
                academicYear: c.academicYear || "",
                teacherId: c.teacherId || null,
            });
        }
    }, [classData, reset]);

    const onSubmit = (data: ClassFormData) => {
        // Normalisasi
        const payload = {
            ...data,
            grade: Number(data.grade), // pastikan integer
            teacherId: data.teacherId?.trim() || null,
            description: data.description?.trim() || null,
        };

        if (isEdit && id) {
            updateMutation.mutate(
                { id, data: payload },
                { onSuccess: () => navigate(ROUTE_PATHS.CLASSES) }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => navigate(ROUTE_PATHS.CLASSES),
            });
        }
    };

    if (isEdit && loadingDetail) return <LoadingScreen />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">
                {isEdit ? "Edit Kelas" : "Tambah Kelas"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
                <Input
                    label="Nama Kelas"
                    {...register("name")}
                    error={errors.name?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />
                <Input
                    label="Deskripsi"
                    {...register("description")}
                    error={errors.description?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />
                <Input
                    label="Tingkat (angka)"
                    type="number"
                    {...register("grade", { valueAsNumber: true })} // otomatis number
                    error={errors.grade?.message}
                    disabled={isSubmitting}
                    placeholder="contoh: 10"
                    className="text-black"
                />
                <Input
                    label="Tahun Ajaran"
                    {...register("academicYear")}
                    error={errors.academicYear?.message}
                    disabled={isSubmitting}
                    placeholder="2025/2026"
                    className="text-black"
                />
                <Select
                    label="Wali Kelas (opsional)"
                    options={[
                        { value: "", label: "Tidak ada" },
                        ...(teachersData?.data?.map((t) => ({ value: t.id, label: t.name })) || []),
                    ]}
                    {...register("teacherId")}
                    error={errors.teacherId?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" type="button" onClick={() => navigate(ROUTE_PATHS.CLASSES)}>
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