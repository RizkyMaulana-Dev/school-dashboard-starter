import { StatCard } from "./StatCard";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";

// SVG Icons
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

export function SummaryCards() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  if (isLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Gagal memuat dashboard"
        message={error instanceof Error ? error.message : "Terjadi kesalahan"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={data?.totalUsers ?? 0}
        icon={<UsersIcon />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Total Siswa"
        value={data?.totalStudents ?? 0}
        icon={<StudentIcon />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Total Guru"
        value={data?.totalTeachers ?? 0}
        icon={<TeacherIcon />}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Total Buku"
        value={data?.totalBooks ?? 0}
        icon={<BookIcon />}
        trend={{ value: 3, isPositive: false }}
      />
    </div>
  );
}
