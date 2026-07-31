// src/features/student-management/components/StudentDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useStudentDetail } from "../hooks/useStudents";
import { LoadingScreen, Badge, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";

import { ROUTE_PATHS } from "@/routes/route-paths";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useStudentDetail(id);
  const student = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return (
      <ErrorMessage title="Gagal memuat data siswa" message={error?.message} onRetry={refetch} />
    );
  if (!student) return <ErrorMessage title="Siswa tidak ditemukan" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Detail Siswa</h1>
        <Link to={ROUTE_PATHS.STUDENT_EDIT.replace(":id", student.id)}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg divide-y">
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Nama Lengkap</dt>
            <dd className="font-medium text-black">{student.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Jenis Kelamin</dt>
            <dd className="font-medium text-black">
              {student.gender === "MALE" ? "Laki-laki" : "Perempuan"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Tanggal Lahir</dt>
            <dd className="font-medium text-black">
              {new Date(student.birthDate).toLocaleDateString("id-ID")}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Kelas</dt>
            <dd className="font-medium text-black">
              {student.schoolClass ? (
                <Link
                  to={ROUTE_PATHS.CLASS_DETAIL.replace(":id", student.schoolClass.id)}
                  className="text-blue-600 hover:underline"
                >
                  {student.schoolClass.name}
                </Link>
              ) : (
                "-"
              )}
            </dd>
          </div>
        </div>

        {student.user && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Akun Terhubung</h2>
            <p className="text-sm">
              {student.user.name} ({student.user.email})
              <Badge variant={student.user.isActive ? "success" : "error"}>
                {student.user.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </p>
            <Link
              to={ROUTE_PATHS.USER_DETAIL.replace(":id", student.user.id)}
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              Lihat User
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
