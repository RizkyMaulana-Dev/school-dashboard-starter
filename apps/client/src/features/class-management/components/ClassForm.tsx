import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, LoadingScreen } from "@/components/ui";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useClassDetail } from "../hooks/useClasses";
import { useCreateClass, useUpdateClass } from "../hooks/useClassMutations";
import { useTeachers } from "@/features/teacher-management/hooks/useTeachers";
import { classSchema, type ClassFormData } from "@/lib/validations/class.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { CreateSchoolClassDTO } from "@/types/entities";

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
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ClassFormData>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: "",
            description: "",
            grade: 0,
            academicYearStart: "",
            academicYearEnd: "",
            teacherId: null,
        },
    });

    useEffect(() => {
        if (classData?.data) {
            const c = classData.data;
            const [start = "", end = ""] = (c.academicYear || "/").split("/");
            reset({
                name: c.name,
                description: c.description || "",
                grade: c.grade,
                academicYearStart: start,
                academicYearEnd: end,
                teacherId: c.teacherId || null,
            });
        }
    }, [classData, reset]);

    const buildPayload = (data: ClassFormData): CreateSchoolClassDTO => {
        const payload: CreateSchoolClassDTO = {
            name: data.name,
            grade: data.grade,
            academicYear: `${data.academicYearStart}/${data.academicYearEnd}`,
            teacherId: data.teacherId?.trim() || undefined,
        };
        if (data.description?.trim()) {
            payload.description = data.description.trim();
        }
        return payload;
    };

    const onSubmit = (data: ClassFormData, stayOnPage: boolean = false) => {
        const payload = buildPayload(data);

        if (isEdit && id) {
            updateMutation.mutate(
                { id, data: payload },
                {
                    onSuccess: () => {
                        if (!stayOnPage) navigate(ROUTE_PATHS.CLASSES);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    if (stayOnPage) {
                        reset({
                            name: "",
                            description: "",
                            grade: 0,
                            academicYearStart: "",
                            academicYearEnd: "",
                            teacherId: null,
                        });
                    } else {
                        navigate(ROUTE_PATHS.CLASSES);
                    }
                },
            });
        }
    };

    if (isEdit && loadingDetail) return <LoadingScreen />;

    const teacherOptions =
        teachersData?.data?.map((t) => ({
            value: t.id,
            label: t.name,
        })) ?? [];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">
                {isEdit ? "Edit Kelas" : "Tambah Kelas"}
            </h1>
            <form
                onSubmit={handleSubmit((data) => onSubmit(data, false))}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >
                <Input
                    label="Nama Kelas"
                    {...register("name")}
                    error={errors.name?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />

                <Input
                    label="Deskripsi (opsional)"
                    {...register("description")}
                    error={errors.description?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />

                <Input
                    label="Tingkat (angka)"
                    type="number"
                    {...register("grade", { valueAsNumber: true })}
                    error={errors.grade?.message}
                    disabled={isSubmitting}
                    placeholder="contoh: 10"
                    className="text-black"
                />

                <div>
                    <label className="block text-sm font-medium text-black mb-1">
                        Tahun Ajaran
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            placeholder="Tahun Mulai (contoh: 2025)"
                            {...register("academicYearStart")}
                            error={errors.academicYearStart?.message}
                            disabled={isSubmitting}
                            className="text-black"
                        />
                        <Input
                            placeholder="Tahun Akhir (contoh: 2026)"
                            {...register("academicYearEnd")}
                            error={errors.academicYearEnd?.message}
                            disabled={isSubmitting}
                            className="text-black"
                        />
                    </div>
                    {watch("academicYearStart") && watch("academicYearEnd") && (
                        <p className="text-sm text-black mt-1">
                            {watch("academicYearStart")}/{watch("academicYearEnd")}
                        </p>
                    )}
                </div>

                <SearchableSelect
                    label="Wali Kelas (opsional)"
                    options={teacherOptions}
                    value={watch("teacherId") || ""}
                    onChange={(val) =>
                        setValue("teacherId", val || null, { shouldValidate: true })
                    }
                    placeholder="Cari guru..."
                    error={errors.teacherId?.message}
                    disabled={isSubmitting}
                    className="text-black"
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="ghost"
                        type="button"
                        onClick={() => navigate(ROUTE_PATHS.CLASSES)}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>

                    {!isEdit && (
                        <Button
                            type="button"
                            variant="outline"
                            isLoading={isSubmitting}
                            onClick={handleSubmit((data) => onSubmit(data, true))}
                        >
                            Simpan & Buat Baru
                        </Button>
                    )}

                    <Button type="submit" isLoading={isSubmitting}>
                        {isEdit ? "Update" : "Simpan"}
                    </Button>
                </div>
            </form>
        </div>
    );
}