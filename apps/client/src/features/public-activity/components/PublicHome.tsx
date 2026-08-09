import React, { useState } from "react";
import {
    Calendar,
    LogIn,
    LogOut,
    Info,
    CheckCircle2,
    Clock,
    MapPin,
    CalendarDays
} from "lucide-react";

export default function PresensiDashboard() {
    // Simulasi state: "MASUK", "PULANG", atau "SELESAI"
    const [activeSession, setActiveSession] = useState<"MASUK" | "PULANG" | "SELESAI">("MASUK");

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen">

            {/* =========================================
          1. HEADER SECTION
      ========================================= */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Presensi</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Catat kehadiranmu hari ini dengan mudah dan cepat.
                    </p>
                </div>

                {/* Widget Tanggal & Waktu */}
                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">Jumat, 9 Mei 2026</p>
                        <p className="text-xs text-gray-500 font-medium">08:45 WIB</p>
                    </div>
                </div>
            </div>

            {/* =========================================
          2. FITUR UTAMA ABSENSI (HERO SECTION)
      ========================================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">

                {/* Hiasan Background (Opsional agar tidak terlalu sepi) */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

                {/* Label Sesi Terbuka */}
                <div className="mb-6">
                    {activeSession === "MASUK" && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-bold rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Sesi Absen Masuk Terbuka
                        </span>
                    )}
                    {activeSession === "PULANG" && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-700 border border-orange-200 text-sm font-bold rounded-full animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Waktu Absen Pulang
                        </span>
                    )}
                    {activeSession === "SELESAI" && (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-200 text-sm font-bold rounded-full">
                            <CheckCircle2 size={16} />
                            Absensi Hari Ini Selesai
                        </span>
                    )}
                </div>

                {/* Tombol Lingkaran Interaktif */}
                <div className="mb-6">
                    <button
                        disabled={activeSession === "SELESAI"}
                        onClick={() => {
                            if (activeSession === "MASUK") setActiveSession("PULANG");
                            else if (activeSession === "PULANG") setActiveSession("SELESAI");
                        }}
                        className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center relative shadow-inner group transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 ${activeSession === "SELESAI" ? "bg-green-50 cursor-default" : "bg-blue-50 cursor-pointer"
                            }`}
                    >
                        <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center shadow-lg transform transition-all duration-300 ${activeSession === "SELESAI"
                            ? "bg-green-500 scale-100"
                            : "bg-blue-500 group-hover:bg-blue-600 group-hover:scale-105 active:scale-95 group-hover:shadow-blue-200"
                            }`}>
                            <div className="text-white flex flex-col items-center">
                                {activeSession === "MASUK" && <LogIn size={32} className="mb-1 md:mb-2 md:w-10 md:h-10" />}
                                {activeSession === "PULANG" && <LogOut size={32} className="mb-1 md:mb-2 md:w-10 md:h-10" />}
                                {activeSession === "SELESAI" && <CheckCircle2 size={36} className="mb-1 md:mb-2 md:w-12 md:h-12" />}

                                <span className="font-bold text-sm md:text-base leading-tight text-center mt-1">
                                    {activeSession === "SELESAI" ? "Tuntas" : "Tap untuk\nAbsen"}
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Teks Instruksi */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {activeSession === "MASUK" && "Anda belum melakukan absen masuk"}
                    {activeSession === "PULANG" && "Jangan lupa absen pulang!"}
                    {activeSession === "SELESAI" && "Terima kasih, selamat beristirahat!"}
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md">
                    {activeSession !== "SELESAI"
                        ? "Silakan tap tombol lingkaran di atas untuk mencatat kehadiranmu secara otomatis berdasarkan zona waktu."
                        : "Seluruh rangkaian absensi kamu untuk hari ini sudah tercatat ke dalam sistem."}
                </p>

                {/* Info Tambahan Bawah Tombol */}
                {/* {activeSession !== "SELESAI" && (
                    <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                        <MapPin size={16} className="text-blue-500" />
                        <p>Sistem akan merekam lokasi perangkat Anda.</p>
                    </div>
                )} */}
            </div>

            {/* =========================================
          3. INFORMASI (RINGKASAN & JADWAL)
      ========================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Card: Ringkasan Kehadiran */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays size={20} className="text-gray-400" />
                        <h2 className="text-base font-bold text-gray-900">Statistik Bulan Ini</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {/* Hadir */}
                        <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1">Hadir</p>
                            <p className="text-2xl font-bold text-green-600">16</p>
                        </div>
                        {/* Terlambat */}
                        <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1">Telat</p>
                            <p className="text-2xl font-bold text-yellow-600">2</p>
                        </div>
                        {/* Alpha */}
                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 md:p-4 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-1">Alpha</p>
                            <p className="text-2xl font-bold text-red-600">1</p>
                        </div>
                    </div>
                </div>

                {/* Card: Jadwal Hari Ini */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-gray-400" />
                            <h2 className="text-base font-bold text-gray-900">Jadwal Selanjutnya</h2>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Lihat Semua
                        </button>
                    </div>

                    {/* Daftar Jadwal */}
                    <div className="space-y-4 flex-1">
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center flex-shrink-0">
                                <span className="text-sm font-bold">08:00</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-base">Pemrograman Web</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-0.5">Ruang A2 • Kelas XI RPL 1</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* =========================================
          4. RIWAYAT ABSENSI (BOTTOM TABLE)
      ========================================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 md:px-6 py-4 md:py-5 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Riwayat Kehadiran Terbaru</h2>
                </div>

                {/* Wrapper overflow-x-auto agar tabel bisa di-scroll horizontal di HP */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap min-w-[600px]">
                        <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="px-5 md:px-6 py-3.5 font-semibold">Tanggal</th>
                                <th className="px-5 md:px-6 py-3.5 font-semibold">Status</th>
                                <th className="px-5 md:px-6 py-3.5 font-semibold">Masuk</th>
                                <th className="px-5 md:px-6 py-3.5 font-semibold">Pulang</th>
                                <th className="px-5 md:px-6 py-3.5 font-semibold">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Baris Data 1 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 md:px-6 py-4 text-gray-900 font-medium">Kamis, 8 Mei 2026</td>
                                <td className="px-5 md:px-6 py-4">
                                    <span className="text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md text-xs font-bold">
                                        Hadir
                                    </span>
                                </td>
                                <td className="px-5 md:px-6 py-4 text-gray-900">07:55</td>
                                <td className="px-5 md:px-6 py-4 text-gray-900">15:30</td>
                                <td className="px-5 md:px-6 py-4 text-gray-500">Tepat Waktu</td>
                            </tr>
                            {/* Baris Data 2 */}
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 md:px-6 py-4 text-gray-900 font-medium">Rabu, 7 Mei 2026</td>
                                <td className="px-5 md:px-6 py-4">
                                    <span className="text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-md text-xs font-bold">
                                        Terlambat
                                    </span>
                                </td>
                                <td className="px-5 md:px-6 py-4 text-gray-900">08:15</td>
                                <td className="px-5 md:px-6 py-4 text-gray-900">15:30</td>
                                <td className="px-5 md:px-6 py-4 text-red-500 text-xs font-medium">Telat 15 Menit</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div >
    );
}