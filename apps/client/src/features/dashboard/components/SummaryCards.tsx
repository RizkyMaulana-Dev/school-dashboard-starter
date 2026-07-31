// src/features/dashboard/components/SummaryCards.tsx
import { StatCard } from "./StatCard";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";

// Ikon SVG
const UsersIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const StudentIcon = () => (
  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);

const TeacherIcon = () => (
  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const SessionIcon = () => (
  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export function SummaryCards() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  if (isLoading) {
    return <LoadingScreen message="Memuat ringkasan..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Gagal memuat ringkasan"
        message={error instanceof Error ? error.message : "Terjadi kesalahan"}
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data ?? {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalBooks: 0,
    totalSessions: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon />} />
      <StatCard title="Siswa" value={stats.totalStudents} icon={<StudentIcon />} />
      <StatCard title="Guru" value={stats.totalTeachers} icon={<TeacherIcon />} />
      <StatCard title="Buku" value={stats.totalBooks} icon={<BookIcon />} />
      <StatCard title="Sesi Presensi" value={stats.totalSessions} icon={<SessionIcon />} />
    </div>
  );
}
