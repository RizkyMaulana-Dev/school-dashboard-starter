import { useState, useEffect, useMemo } from "react";
import {
    Calendar,
    LogIn,
    CheckCircle2,
    Clock,
    CalendarDays,
    Lock
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query"; // 👈 Import queryClient

// Import komponen UI dan Hooks untuk tabel dari backend
import { DataView } from "@/components/ui/DataView";
import type { FilterOption } from "@/components/ui/DataView";
import { Badge, LoadingScreen } from "@/components/ui";
import { ErrorMessage } from "@/components/feedback";
import { Pagination } from "@/components/ui/Pagination";
import { usePagination, useDebounce } from "@/hooks";
import { useAttendanceRecords } from "@/features/attendance/hooks/useAttendanceRecords";
import { useSessions } from "@/features/attendance/hooks/useSessions";
// 👈 Pastikan hook mutasi create ini ada di folder mutations kamu
import { useCreateAttendanceRecord } from "@/features/attendance/hooks/useAttendanceMutations";
import { formatAttendanceStatus, formatDate, formatTime } from "@/utils/formatters";
import { useAuthStore } from "@/stores/auth.store";

export default function PresensiDashboard() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    // =========================================
    // 1. STATE & HOOKS UNTUK TABEL BACKEND
    // =========================================
    const [search, setSearch] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [groupBy, setGroupBy] = useState<string>("");

    const debouncedSearch = useDebounce(search, 500);
    const { page, limit, sortBy, sortOrder, queryParams, setSortBy, setPage, setTotalItems } = usePagination();

    // Fetch Riwayat Kehadiran
    const { data: recordsData, isLoading: isLoadingRecords, isError, error, refetch } = useAttendanceRecords({
        ...queryParams,
        search: debouncedSearch || undefined,
        ...filterValues,
    });

    // Fetch Semua Sesi
    const { data: sessionsData, isLoading: isLoadingSessions } = useSessions({ limit: 100 });

    // Hook Mutasi untuk Tambah Absen
    const createRecordMutation = useCreateAttendanceRecord();

    const [currentTime, setCurrentTime] = useState(new Date());

    // Update waktu setiap menit
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Pagination sync
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, filterValues, setPage]);

    useEffect(() => {
        if (recordsData?.meta?.total !== undefined) {
            setTotalItems(recordsData.meta.total);
        }
    }, [recordsData?.meta?.total, setTotalItems]);

    // =========================================
    // 2. LOGIKA SESI & JADWAL (UPDATE TOTAL MENIT)
    // =========================================
    const { currentActiveSession, upcomingSessions, isAllDone } = useMemo(() => {
        if (!sessionsData?.data) return { currentActiveSession: null, upcomingSessions: [], isAllDone: false };

        const now = currentTime;
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;

        // TOTAL MENIT SAAT INI
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

        // HELPER: Konversi string jam (cth: "15:07" / "15.07") ke total menit
        const getMinutesFromFormat = (rawTime: string) => {
            if (!rawTime) return 0;
            const formatted = formatTime(rawTime);
            const [h, m] = formatted.replace(".", ":").split(":");
            return parseInt(h || "0", 10) * 60 + parseInt(m || "0", 10);
        };

        const todaySessions = sessionsData.data.filter((s) => {
            const sessionDate = s.date?.split("T")[0];
            return sessionDate === todayString;
        });

        const active = todaySessions.find((s) => {
            if (!s.startTime || !s.endTime) return false;
            const startMins = getMinutesFromFormat(s.startTime);
            const endMins = getMinutesFromFormat(s.endTime);
            return currentTotalMinutes >= startMins && currentTotalMinutes <= endMins;
        });

        const upcoming = todaySessions
            .filter((s) => {
                if (!s.startTime) return false;
                return currentTotalMinutes < getMinutesFromFormat(s.startTime);
            })
            .sort((a, b) => getMinutesFromFormat(a.startTime!) - getMinutesFromFormat(b.startTime!));

        const done = !active && upcoming.length === 0 && todaySessions.length > 0;

        return { currentActiveSession: active, upcomingSessions: upcoming, isAllDone: done };
    }, [sessionsData?.data, currentTime]);

    // =========================================
    // 3. CEK APAKAH SUDAH ABSEN DI SESI INI
    // =========================================
    const hasAttendedCurrentSession = useMemo(() => {
        if (!currentActiveSession || !recordsData?.data) return false;
        // Cek apakah di riwayat sudah ada ID sesi yang sama dengan sesi aktif
        return recordsData.data.some((r: any) => r.session?.id === currentActiveSession.id);
    }, [currentActiveSession, recordsData?.data]);

    // =========================================
    // 4. STATISTIK BULAN INI
    // =========================================
    const stats = useMemo(() => {
        if (!recordsData?.data) return { present: 0, late: 0, absent: 0 };
        return {
            present: recordsData.data.filter(r => r.status === "PRESENT").length,
            late: recordsData.data.filter(r => r.status === "LATE").length,
            absent: recordsData.data.filter(r => r.status === "ABSENT").length,
        };
    }, [recordsData?.data]);

    // =========================================
    // 5. KONFIGURASI FILTER & GROUP BY TABEL
    // =========================================
    const filterOptions: FilterOption[] = useMemo(() => {
        if (!recordsData?.data) return [];
        const sessions = Array.from(new Set(recordsData.data.map((r) => r.session?.title).filter(Boolean))).sort() as string[];
        const classes = Array.from(new Set(recordsData.data.map((r) => r.session?.class?.name).filter(Boolean))).sort() as string[];

        const options: FilterOption[] = [
            {
                key: "status", label: "Status", type: "select", placeholder: "Semua Status",
                options: [
                    { value: "", label: "Semua" }, { value: "PRESENT", label: "Hadir" },
                    { value: "ABSENT", label: "Tidak Hadir" }, { value: "LATE", label: "Terlambat" },
                    { value: "EXCUSED", label: "Izin" },
                ],
            },
        ];

        if (sessions.length > 0) options.push({ key: "sessionTitle", label: "Sesi", type: "select", options: [{ value: "", label: "Semua" }, ...sessions.map((s) => ({ value: s, label: s }))], placeholder: "Semua Sesi" });
        if (classes.length > 0) options.push({ key: "class", label: "Kelas", type: "select", options: [{ value: "", label: "Semua" }, ...classes.map((c) => ({ value: c, label: c }))], placeholder: "Semua Kelas" });

        return options;
    }, [recordsData?.data]);

    const groupByOptions = [
        { value: "", label: "Tidak Dikelompokkan" },
        { value: "status", label: "Status Kehadiran" },
        { value: "sessionTitle", label: "Sesi" },
    ];

    const transformedData = useMemo(() => {
        if (!recordsData?.data) return [];
        let result = recordsData.data.map((r) => ({
            ...r,
            sessionTitle: r.session?.title ?? "Tanpa Sesi",
            className: r.session?.class?.name ?? "Tanpa Kelas",
            statusLabel: formatAttendanceStatus(r.status),
        }));

        if (filterValues.status) result = result.filter((r) => r.status === filterValues.status);
        if (filterValues.sessionTitle) result = result.filter((r) => r.sessionTitle === filterValues.sessionTitle);
        if (filterValues.class) result = result.filter((r) => r.className === filterValues.class);

        return result;
    }, [recordsData?.data, filterValues]);

    const columns = [
        {
            key: "session", header: "Tanggal / Sesi", render: (r: any) => (
                <div>
                    <p className="font-medium text-gray-900">{r.session?.title ?? "-"}</p>
                    <p className="text-sm text-gray-500">{r.session?.date ? formatDate(r.session.date) : ""}</p>
                </div>
            )
        },
        { key: "class", header: "Kelas", render: (r: any) => <span className="text-gray-900">{r.session?.class?.name ?? "-"}</span> },
        {
            key: "status", header: "Status", align: "center" as const, render: (r: any) => (
                <Badge variant={r.status === "PRESENT" ? "success" : r.status === "ABSENT" ? "error" : r.status === "LATE" ? "warning" : "info"}>
                    {formatAttendanceStatus(r.status)}
                </Badge>
            )
        },
        { key: "notes", header: "Catatan", render: (r: any) => <span className="text-gray-600">{r.notes || "-"}</span> },
    ];

    const renderGridItem = (r: any) => (
        <div className="space-y-2 text-gray-900 border p-4 rounded-xl shadow-sm bg-white">
            <h3 className="font-semibold">{r.session?.title ?? "-"}</h3>
            <p className="text-sm text-gray-600">Kelas: {r.session?.class?.name ?? "-"}</p>
            <p className="text-sm text-gray-600">Tanggal: {r.session?.date ? formatDate(r.session.date) : ""}</p>
            <div className="pt-2">
                <Badge variant={r.status === "PRESENT" ? "success" : r.status === "ABSENT" ? "error" : r.status === "LATE" ? "warning" : "info"}>
                    {formatAttendanceStatus(r.status)}
                </Badge>
            </div>
        </div>
    );

    // =========================================
    // 6. HANDLER ABSENSI (OFFLINE FIRST / OPTIMISTIC UI)
    // =========================================
    const handleAbsenClick = () => {
        if (!currentActiveSession || hasAttendedCurrentSession) return;

        // Ambil ID student yang terhubung dengan user login
        const studentId = user?.student?.id;
        if (!studentId) {
            alert("Akun Anda belum terhubung dengan data siswa. Hubungi administrator.");
            return;
        }

        const previousRecords = queryClient.getQueryData(["attendance-records"]);

        // Optimistic update (sama seperti sebelumnya) ...
        queryClient.setQueryData(["attendance-records"], (old: any) => {
            if (!old || !old.data) return old;
            const newTempRecord = {
                id: `temp-${Date.now()}`,
                status: "PRESENT",
                notes: "Hadir Tepat Waktu (Mandiri)",
                session: currentActiveSession,
            };
            return {
                ...old,
                data: [newTempRecord, ...old.data],
                meta: { ...old.meta, total: (old.meta?.total || 0) + 1 }
            };
        });

        // Kirim data yang benar ke API
        createRecordMutation.mutate(
            {
                attendanceSessionId: currentActiveSession.id,
                studentId: studentId,   // ✅ sekarang ID student yang valid
                status: "PRESENT",
                notes: "Hadir Tepat Waktu (Mandiri)"
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
                },
                onError: () => {
                    queryClient.setQueryData(["attendance-records"], previousRecords);
                }
            }
        );
    };

    // =========================================
    // 7. RENDER UI
    // =========================================
    if ((isLoadingRecords || isLoadingSessions) && !recordsData) return <LoadingScreen message="Memuat Dashboard..." fullScreen />;
    if (isError) return <ErrorMessage title="Gagal memuat data presensi" message={error?.message} onRetry={refetch} />;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen">

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Presensi</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Catat kehadiranmu hari ini dengan mudah dan cepat.
                    </p>
                </div>

                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">
                            {currentTime.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {currentTime.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                        </p>
                    </div>
                </div>
            </div>

            {/* HERO SECTION (Tombol Absen) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                <div className="mb-6 h-8">
                    {currentActiveSession && !hasAttendedCurrentSession && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-bold rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Sesi Terbuka: {currentActiveSession.title}
                        </span>
                    )}
                    {hasAttendedCurrentSession && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-sm font-bold rounded-full">
                            <span className="w-4 h-4"><CheckCircle2 size={16} /></span>
                            Anda Sudah Absen
                        </span>
                    )}
                    {!currentActiveSession && isAllDone && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-sm font-bold rounded-full">
                            <span className="w-4 h-4"><CheckCircle2 size={16} /></span>
                            Semua Sesi Hari Ini Selesai
                        </span>
                    )}
                    {!currentActiveSession && !isAllDone && upcomingSessions.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 border border-gray-200 text-sm font-bold rounded-full">
                            <Lock size={16} />
                            Belum Ada Sesi Terbuka
                        </span>
                    )}
                </div>

                <div className="mb-6">
                    <button
                        disabled={!currentActiveSession || hasAttendedCurrentSession || createRecordMutation.isPending}
                        onClick={handleAbsenClick}
                        className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center relative shadow-inner group transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 
                            ${hasAttendedCurrentSession ? "bg-green-50 cursor-default"
                                : currentActiveSession ? "bg-blue-50 cursor-pointer"
                                    : isAllDone ? "bg-green-50 cursor-default" : "bg-gray-100 cursor-not-allowed"}`}
                    >
                        <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center shadow-lg transform transition-all duration-300 
                            ${hasAttendedCurrentSession ? "bg-green-500 scale-100"
                                : currentActiveSession
                                    ? "bg-blue-500 group-hover:bg-blue-600 group-hover:scale-105 active:scale-95 group-hover:shadow-blue-200"
                                    : isAllDone ? "bg-green-500 scale-100" : "bg-gray-300"
                            }`}>
                            <div className="text-white flex flex-col items-center">
                                {currentActiveSession && !hasAttendedCurrentSession && <LogIn size={32} className="mb-1 md:mb-2 md:w-10 md:h-10" />}
                                {(isAllDone || hasAttendedCurrentSession) && <CheckCircle2 size={36} className="mb-1 md:mb-2 md:w-12 md:h-12" />}
                                {!currentActiveSession && !isAllDone && <Lock size={32} className="mb-1 md:mb-2 md:w-10 md:h-10" />}

                                <span className="font-bold text-sm md:text-base leading-tight text-center mt-1">
                                    {hasAttendedCurrentSession ? "Sudah\nAbsen"
                                        : currentActiveSession ? "Tap untuk\nAbsen"
                                            : isAllDone ? "Tuntas" : "Terkunci"}
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {hasAttendedCurrentSession && "Absensi Anda berhasil dicatat!"}
                    {currentActiveSession && !hasAttendedCurrentSession && "Sesi absensi sedang berlangsung!"}
                    {!currentActiveSession && isAllDone && "Terima kasih, selamat beristirahat!"}
                    {!currentActiveSession && !isAllDone && upcomingSessions.length > 0 && "Tunggu hingga jam sesi dimulai"}
                    {!currentActiveSession && !isAllDone && upcomingSessions.length === 0 && "Tidak ada jadwal absen hari ini"}
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                    {hasAttendedCurrentSession
                        ? "Anda sudah melakukan absen untuk sesi ini. Tidak perlu menekan tombol lagi."
                        : currentActiveSession
                            ? "Silakan tap tombol lingkaran di atas untuk mencatat kehadiranmu pada sesi ini."
                            : isAllDone
                                ? "Seluruh rangkaian absensi kamu untuk hari ini sudah selesai."
                                : "Sistem akan otomatis membuka tombol absen ketika jam pelajaran/sesi berikutnya dimulai."}
                </p>
            </div>

            {/* INFORMASI (RINGKASAN & JADWAL) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Statistik */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays size={20} className="text-gray-400" />
                        <h2 className="text-base font-bold text-gray-900">Statistik Riwayat (Dari {recordsData?.meta?.total ?? 0} Data)</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1">Hadir</p>
                            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        </div>
                        <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1">Telat</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                        </div>
                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1">Alpha</p>
                            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        </div>
                    </div>
                </div>

                {/* Jadwal Selanjutnya */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-gray-400" />
                            <h2 className="text-base font-bold text-gray-900">Jadwal Selanjutnya Hari Ini</h2>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {upcomingSessions.length > 0 ? (
                            upcomingSessions.map((session) => (
                                <div key={session.id} className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center flex-shrink-0 border border-blue-100">
                                        <span className="text-sm font-bold">{session.startTime ? formatTime(session.startTime) : '-'}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{session.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                            {session.schoolClass?.name ?? "Umum"} • Selesai: {session.endTime ? formatTime(session.endTime) : '-'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[100px] text-gray-500 text-sm font-medium">
                                Tidak ada jadwal sesi berikutnya
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIWAYAT ABSENSI (DATAVIEW API) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 md:px-6 py-4 md:py-5 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900 mb-4">Riwayat Kehadiran Anda</h2>

                    <DataView<any>
                        columns={columns}
                        data={transformedData}
                        keyExtractor={(r) => r.id}
                        isLoading={isLoadingRecords} // 👈 Tidak akan me-loading ulang satu halaman saat update
                        emptyMessage="Belum ada data kehadiran"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={setSortBy}
                        filters={filterOptions}
                        onFilterChange={setFilterValues}
                        onResetFilter={() => setFilterValues({})}
                        renderGridItem={renderGridItem}
                        defaultViewMode="table"
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Cari riwayat atau sesi..."
                        groupBy={groupBy}
                        groupByOptions={groupByOptions}
                        onGroupByChange={setGroupBy}
                    />

                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <Pagination
                            page={page}
                            totalPages={recordsData?.meta?.totalPages ?? 1}
                            total={recordsData?.meta?.total ?? 0}
                            limit={limit}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}