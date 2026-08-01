// src/features/user-management/components/UserDetail.tsx
import { useParams, Link } from "react-router-dom";
import { useUserDetail } from "../hooks/useUsers";
import { LoadingScreen, Badge, Button } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useUserDetail(id);
  const user = data?.data;

  if (isLoading) return <LoadingScreen />;
  if (isError)
    return <ErrorMessage title="Gagal memuat user" message={error?.message} onRetry={refetch} />;
  if (!user) return <ErrorMessage title="User tidak ditemukan" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Detail User</h1>
        <Link to={ROUTE_PATHS.USER_EDIT.replace(":id", user.id)}>
          <Button size="sm">Edit</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg divide-y">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Informasi Akun</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Nama</dt>
              <dd className="font-medium text-black">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium text-black">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd>
                <Badge variant={user.isActive ? "success" : "error"}>
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Terdaftar Sejak</dt>
              <dd className="font-medium text-black">
                {new Date(user.createdAt).toLocaleDateString("id-ID")}
              </dd>
            </div>
          </dl>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Role</h2>
          <div className="flex flex-wrap gap-2">
            {user.roles?.map((role) => (
              <Badge key={role.id} variant="info">
                {role.name}
              </Badge>
            )) ?? <span className="text-sm text-gray-500">Tidak ada role</span>}
          </div>
        </div>
        {/* Koneksi ke Student atau Teacher */}
        {user.student && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Data Siswa Terhubung</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">{user.student.name}</p>
                <p className="text-sm text-gray-500">
                  Kelas: {user.student.schoolClass?.name ?? "-"}
                </p>
              </div>
              <Link to={ROUTE_PATHS.STUDENT_DETAIL.replace(":id", user.student.id)}>
                <Button variant="outline" size="sm">
                  Lihat Siswa
                </Button>
              </Link>
            </div>
          </div>
        )}
        {user.teacher && (
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Data Guru Terhubung</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">{user.teacher.name}</p>
                <p className="text-sm text-gray-500">
                  Kelas yang diampu:
                  {user.teacher.homeroomClasses?.map((c) => c.name).join(", ") || "-"}
                </p>
              </div>
              <Link to={ROUTE_PATHS.TEACHER_DETAIL.replace(":id", user.teacher.id)}>
                <Button variant="outline" size="sm">
                  Lihat Guru
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
