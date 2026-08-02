import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { SearchableSelect } from "@/components/ui/SearchableSelect"; // ✅ baru
import { useStudentDetail } from "../hooks/useStudents";
import { useCreateStudent, useUpdateStudent } from "../hooks/useStudentMutations";
import { useUsers } from "@/features/user-management/hooks/useUsers";
import { useClasses } from "@/features/class-management/hooks/useClasses";
import { studentSchema, type StudentFormData } from "@/lib/validations/student.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function StudentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    const { data: studentData, isLoading: loadingDetail } = useStudentDetail(id);
    const { data: usersData } = useUsers({ limit: 1000 });
    const { data: classesData } = useClasses({ limit: 1000 });
    const createMutation = useCreateStudent();
    const updateMutation = useUpdateStudent();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: { name: "", gender: "MALE", birthDate: "", userId: "", schoolClassId: "" },
    });

    useEffect(() => {
        if (studentData?.data) {
            const s = studentData.data;
            reset({
                name: s.name,
                gender: s.gender,
                birthDate: s.birthDate.split("T")[0],
                userId: s.userId,
                schoolClassId: s.schoolClassId,
            });
        }
    }, [studentData, reset]);

    const onSubmit = (data: StudentFormData) => {
        if (isEdit && id) {
            updateMutation.mutate({ id, data }, { onSuccess: () => navigate(ROUTE_PATHS.STUDENTS) });
        } else {
            createMutation.mutate(data, { onSuccess: () => navigate(ROUTE_PATHS.STUDENTS) });
        }
    };

    if (isEdit && loadingDetail) return <LoadingScreen />;

    const userOptions =
        usersData?.data?.map((u) => ({
            value: u.id,
            label: `${u.name} (${u.email})`,
            disabled: !u.isActive,
        })) || [];

    const classOptions =
        classesData?.data?.map((c) => ({
            value: c.id,
            label: c.name,
        })) || [];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-black">{isEdit ? "Edit Siswa" : "Tambah Siswa"}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
                <Input className="text-black" label="Nama Lengkap" {...register("name")} error={errors.name?.message} />
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        className="text-black"
                        label="Gender"
                        options={[
                            { value: "MALE", label: "Laki-laki" },
                            { value: "FEMALE", label: "Perempuan" },
                        ]}
                        {...register("gender")}
                        error={errors.gender?.message}
                    />
                    <Input
                        className="text-black"
                        label="Tanggal Lahir"
                        type="date"
                        {...register("birthDate")}
                        error={errors.birthDate?.message}
                    />
                </div>

                {/* Ganti Select User dengan SearchableSelect */}
                <SearchableSelect
                    label="User (Email)"
                    options={userOptions}
                    value={watch("userId")}
                    onChange={(val) => setValue("userId", val, { shouldValidate: true })}
                    placeholder="Ketik nama atau email..."
                    error={errors.userId?.message}
                    className="text-black"
                />

                {/* Ganti Select Kelas dengan SearchableSelect */}
                <SearchableSelect
                    label="Kelas"
                    options={classOptions}
                    value={watch("schoolClassId")}
                    onChange={(val) => setValue("schoolClassId", val, { shouldValidate: true })}
                    placeholder="Ketik nama kelas..."
                    error={errors.schoolClassId?.message}
                    className="text-black"
                />

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.STUDENTS)}>
                        Batal
                    </Button>
                    <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                        Simpan
                    </Button>
                </div>
            </form>
        </div>
    );
}