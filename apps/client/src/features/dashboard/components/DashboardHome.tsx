import { SummaryCards } from "./SummaryCards";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Ringkasan data sekolah Anda</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

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
        <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
          <h3 className="font-medium text-blue-900">Buat Presensi</h3>
          <p className="text-sm text-blue-600 mt-1">Buat sesi presensi baru</p>
        </button>
        <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
          <h3 className="font-medium text-green-900">Tambah Siswa</h3>
          <p className="text-sm text-green-600 mt-1">Daftarkan siswa baru</p>
        </button>
        <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
          <h3 className="font-medium text-purple-900">Pinjam Buku</h3>
          <p className="text-sm text-purple-600 mt-1">Catat peminjaman buku</p>
        </button>
      </div>
    </div>
  );
}
