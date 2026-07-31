// src/features/teacher-management/components/TeacherDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useTeacherDetail } from "../hooks/useTeachers";
import { LoadingScreen, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useTeacherDetail(id);
  const teacher = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return (
      <ErrorMessage title="Gagal memuat data guru" message={error?.message} onRetry={refetch} />
    );
  if (!teacher) return <ErrorMessage title="Guru tidak ditemukan" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detail Guru</h1>
        <Link to={ROUTE_PATHS.TEACHER_EDIT.replace(":id", teacher.id)}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg divide-y">
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Nama</dt>
            <dd className="font-medium text-black">{teacher.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Jenis Kelamin</dt>
            <dd className="font-medium text-black">
              {teacher.gender === "MALE" ? "Laki-laki" : "Perempuan"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Tanggal Lahir</dt>
            <dd className="font-medium text-black">
              {new Date(teacher.birthDate).toLocaleDateString("id-ID")}
            </dd>
          </div>
        </div>

        {teacher.user && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Akun Terhubung</h2>
            <p>
              {teacher.user.name} ({teacher.user.email})
            </p>
            <Link
              to={ROUTE_PATHS.USER_DETAIL.replace(":id", teacher.user.id)}
              className="text-blue-600 text-sm hover:underline"
            >
              Lihat User
            </Link>
          </div>
        )}

        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Kelas yang Diampu (Wali Kelas)</h2>
          {teacher.homeroomClasses?.length ? (
            <ul className="list-disc pl-5 space-y-1">
              {teacher.homeroomClasses.map((c) => (
                <li key={c.id}>
                  <Link
                    to={ROUTE_PATHS.CLASS_DETAIL.replace(":id", c.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {c.name}
                  </Link>
                  (Grade {c.grade})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Tidak menjadi wali kelas.</p>
          )}
        </div>
      </div>
    </div>
  );
}
