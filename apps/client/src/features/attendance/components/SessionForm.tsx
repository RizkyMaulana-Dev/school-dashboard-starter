import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Select, Button, LoadingScreen } from "@/components/ui";
import { useSessionDetail } from "../hooks/useSessions";
import { useCreateSession, useUpdateSession } from "../hooks/useAttendanceMutations";
import { useClasses } from "@/features/class-management/hooks/useClasses";
import { useTeachers } from "@/features/teacher-management/hooks/useTeachers";
import { sessionSchema, type SessionFormData } from "@/lib/validations/attendance.schema";
import { ROUTE_PATHS } from "@/routes/route-paths";
import { useEffect } from "react";

export default function SessionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: session, isLoading: loadingDetail } = useSessionDetail(id);
  const { data: classesData } = useClasses({ limit: 100 });
  const { data: teachersData } = useTeachers({ limit: 100 });
  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      schoolClassId: "",
      teacherId: "",
    },
  });

  useEffect(() => {
    if (session?.data) {
      const s = session.data;
      reset({
        title: s.title,
        date: s.date.split("T")[0],
        startTime: s.startTime?.slice(0, 5) || "",
        endTime: s.endTime?.slice(0, 5) || "",
        schoolClassId: s.schoolClassId,
        teacherId: s.teacherId,
      });
    }
  }, [session, reset]);

  const onSubmit = (data: SessionFormData) => {
    if (isEdit && id)
      updateMutation.mutate(
        { id, data },
        { onSuccess: () => navigate(ROUTE_PATHS.ATTENDANCE_SESSIONS) },
      );
    else
      createMutation.mutate(data, { onSuccess: () => navigate(ROUTE_PATHS.ATTENDANCE_SESSIONS) });
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-black">{isEdit ? "Edit Sesi" : "Buat Sesi Baru"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow p-6 space-y-4">
        <Input
          className="text-black"
          label="Judul Sesi"
          {...register("title")}
          error={errors.title?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tanggal"
            className="text-black"
            type="date"
            {...register("date")}
            error={errors.date?.message}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input className="text-black" label="Mulai" type="time" {...register("startTime")} />
            <Input className="text-black" label="Selesai" type="time" {...register("endTime")} />
          </div>
        </div>
        <Select
          label="Kelas"
          className="text-black"
          options={classesData?.data?.map((c) => ({ value: c.id, label: c.name })) || []}
          {...register("schoolClassId")}
          error={errors.schoolClassId?.message}
        />
        <Select
          label="Guru Pengawas"
          className="text-black"
          options={teachersData?.data?.map((t) => ({ value: t.id, label: t.name })) || []}
          {...register("teacherId")}
          error={errors.teacherId?.message}
        />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(ROUTE_PATHS.ATTENDANCE_SESSIONS)}>
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
