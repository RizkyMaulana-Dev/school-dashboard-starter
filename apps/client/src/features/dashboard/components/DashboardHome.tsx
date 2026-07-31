import { useNavigate } from "react-router-dom";
import { SummaryCards } from "./SummaryCards";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { ROUTE_PATHS } from "@/routes/route-paths";

export default function DashboardHome() {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Buat Presensi",
      description: "Buat sesi presensi baru",
      path: ROUTE_PATHS.ATTENDANCE_SESSION_CREATE,
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-900",
      descColor: "text-blue-600",
    },
    {
      label: "Tambah Siswa",
      description: "Daftarkan siswa baru",
      path: ROUTE_PATHS.STUDENT_CREATE,
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-900",
      descColor: "text-green-600",
    },
    {
      label: "Pinjam Buku",
      description: "Catat peminjaman buku",
      path: ROUTE_PATHS.BOOK_LOAN_CREATE,
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-900",
      descColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Ringkasan data sekolah Anda</p>
      </div>

      {/* Summary Cards with Error Boundary and Suspense fallback */}
      <ErrorBoundary>
        <SummaryCards />
      </ErrorBoundary>

      {/* Recent Activities Section (placeholder) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <p className="text-sm text-gray-500">
          Fitur ini akan segera tersedia. Menampilkan aktivitas terbaru seperti presensi,
          peminjaman, dan perubahan data.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`p-4 ${action.bgColor} rounded-lg transition-colors text-left`}
          >
            <h3 className={`font-medium ${action.textColor}`}>{action.label}</h3>
            <p className={`text-sm ${action.descColor} mt-1`}>{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
