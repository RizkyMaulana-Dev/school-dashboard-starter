// src/features/class-management/components/ClassDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useClassDetail } from "../hooks/useClasses";
import { LoadingScreen, Button, Table } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";

import { ROUTE_PATHS } from "@/routes/route-paths";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: classData, isLoading, isError, error, refetch } = useClassDetail(id);
  const kelas = classData?.data;

  const { data: studentsData } = useQuery({
    queryKey: ["students", "class", id],
    queryFn: () => studentService.getByClass(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat kelas" message={error?.message} onRetry={refetch} />;
  if (!kelas) return <ErrorMessage title="Kelas tidak ditemukan" />;

  const students = studentsData?.data ?? [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{kelas.name}</h1>
        <Link to={ROUTE_PATHS.CLASS_EDIT.replace(":id", kelas.id)}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Tingkat</dt>
            <dd className="font-medium text-black">{kelas.grade}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Tahun Ajaran</dt>
            <dd className="font-medium text-black">{kelas.academicYear}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Wali Kelas</dt>
            <dd className="font-medium text-black">
              {kelas.teacher ? (
                <Link
                  to={ROUTE_PATHS.TEACHER_DETAIL.replace(":id", kelas.teacher.id)}
                  className="text-blue-600 hover:underline"
                >
                  {kelas.teacher.name}
                </Link>
              ) : (
                "-"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Jumlah Siswa</dt>
            <dd className="font-medium text-black">{students.length}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Daftar Siswa</h2>
        {students.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada siswa.</p>
        ) : (
          <Table
            columns={[
              { key: "name", header: "Nama" },
              {
                key: "gender",
                header: "JK",
                render: (s: any) => (s.gender === "MALE" ? "L" : "P"),
              },
              {
                key: "aksi",
                header: "",
                align: "right",
                render: (s: any) => (
                  <Link to={ROUTE_PATHS.STUDENT_DETAIL.replace(":id", s.id)}>
                    <Button variant="ghost" size="sm">
                      Lihat
                    </Button>
                  </Link>
                ),
              },
            ]}
            data={students}
            keyExtractor={(s) => s.id}
          />
        )}
      </div>
    </div>
  );
}
