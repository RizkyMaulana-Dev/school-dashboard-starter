import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? "Edit Siswa" : "Tambah Siswa"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-4">
        <Input label="Nama Lengkap" {...register("name")} error={errors.name?.message} />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Gender"
            options={[
              { value: "MALE", label: "Laki-laki" },
              { value: "FEMALE", label: "Perempuan" },
            ]}
            {...register("gender")}
            error={errors.gender?.message}
          />
          <Input
            label="Tanggal Lahir"
            type="date"
            {...register("birthDate")}
            error={errors.birthDate?.message}
          />
        </div>
        <Select
          label="User (Email)"
          options={
            usersData?.data?.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })) || []
          }
          {...register("userId")}
          error={errors.userId?.message}
        />
        <Select
          label="Kelas"
          options={classesData?.data?.map((c) => ({ value: c.id, label: c.name })) || []}
          {...register("schoolClassId")}
          error={errors.schoolClassId?.message}
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
