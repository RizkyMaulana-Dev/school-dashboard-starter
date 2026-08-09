import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Home,
    CalendarDays,
    BarChart2,
    User,
    Filter,
    FileSpreadsheet,
    FileText
} from 'lucide-react';

// Daftar tab (Mata Pelajaran dihapus)
const TABS = [
    { id: 'ringkasan', label: 'Ringkasan' },
    { id: 'bulanan', label: 'Bulanan' },
];

export default function RekapKehadiran() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="max-w-4xl mx-auto bg-gray-50/50 min-h-screen flex flex-col md:py-6 lg:py-8">

            {/* --- HEADER --- */}
            <div className="bg-white pt-4 pb-0 px-4 md:px-6 shadow-sm md:rounded-t-2xl border-b border-gray-100 z-10">
                <div className="flex items-center gap-3 mb-4 md:mb-6 md:pt-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                        <ChevronLeft size={22} className="text-gray-800" />
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">Rekap Kehadiran</h1>
                </div>

                {/* --- TAB NAVIGATION --- */}
                <div className="relative flex justify-between md:justify-start md:gap-8 border-b border-gray-200">
                    {TABS.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveIndex(index)}
                            className={`pb-2.5 px-2 w-1/2 md:w-auto text-sm font-semibold transition-colors duration-300 ${activeIndex === index ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                    {/* Garis Indikator Bergerak (Mobile) */}
                    <div
                        className="absolute bottom-0 h-0.5 bg-blue-600 rounded-t-md transition-all duration-300 ease-in-out md:hidden"
                        style={{
                            width: `${100 / TABS.length}%`,
                            transform: `translateX(${activeIndex * 100}%)`
                        }}
                    />
                    {/* Garis Indikator Bergerak (Desktop) */}
                    <div
                        className="absolute bottom-0 h-0.5 bg-blue-600 rounded-t-md transition-all duration-300 ease-in-out hidden md:block"
                        style={{
                            width: '80px',
                            transform: `translateX(${activeIndex * 110}px)`
                        }}
                    />
                </div>
            </div>

            {/* --- TAB CONTENT AREA (200% width untuk 2 tab) --- */}
            <div className="flex-1 overflow-hidden bg-gray-50/50 md:rounded-b-2xl md:border-x md:border-b border-gray-200">
                <div
                    className="flex w-[200%] h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(activeIndex * 100) / 2}%)` }}
                >
                    {/* Halaman 1: Ringkasan */}
                    <div className="w-1/2 h-full overflow-y-auto px-4 py-5 md:p-6 pb-24 md:pb-6">
                        <TabRingkasan />
                    </div>

                    {/* Halaman 2: Bulanan */}
                    <div className="w-1/2 h-full overflow-y-auto px-4 py-5 md:p-6 pb-24 md:pb-6">
                        <TabBulanan />
                    </div>
                </div>
            </div>

            {/* --- BOTTOM NAVIGATION (Hanya Muncul di Layar HP) --- */}
            <div className="md:hidden bg-white border-t border-gray-100 flex justify-around items-center py-3 px-2 fixed bottom-0 w-full pb-safe z-50">
                <NavItem icon={<Home size={22} />} label="Presensi" />
                <NavItem icon={<CalendarDays size={22} />} label="Riwayat" />
                <NavItem icon={<BarChart2 size={22} />} label="Rekap" active />
                <NavItem icon={<User size={22} />} label="Akun" />
            </div>
        </div>
    );
}

/* ========================================================
   KOMPONEN TAB 1: RINGKASAN
======================================================== */
function TabRingkasan() {
    return (
        <div className="space-y-5">
            <div className="bg-white rounded-xl p-3.5 flex justify-between items-center shadow-sm border border-gray-100 max-w-xs mx-auto">
                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <ChevronLeft size={18} />
                </button>
                <span className="font-bold text-gray-900 text-sm">Mei 2026</span>
                <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 lg:col-span-2 space-y-5">
                    <h2 className="font-bold text-gray-900 text-base">Ringkasan Bulan Ini</h2>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-around gap-6">
                        <div className="flex justify-center">
                            <div
                                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-sm"
                                style={{
                                    background: 'conic-gradient(#10b981 0% 84.2%, #f59e0b 84.2% 94.7%, #ef4444 94.7% 100%)'
                                }}
                            >
                                <div className="w-24 h-24 md:w-30 md:h-30 bg-white rounded-full flex flex-col items-center justify-center">
                                    <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-none">19</span>
                                    <span className="text-[10px] text-gray-500 font-medium mt-1">Total Kehadiran</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 flex-1 max-w-xs mx-auto md:mx-0 w-full">
                            <LegendItem color="bg-green-500" count={16} label="Hadir" percent="84.2%" />
                            <LegendItem color="bg-yellow-500" count={2} label="Terlambat" percent="10.5%" />
                            <LegendItem color="bg-red-500" count={1} label="Tidak Hadir" percent="5.3%" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <SummaryBox color="green" count={16} label="Hadir" />
                        <SummaryBox color="yellow" count={2} label="Terlambat" />
                        <SummaryBox color="red" count={1} label="Tidak Hadir" />
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-xs md:text-sm text-gray-900">Persentase Kehadiran</span>
                            <span className="font-bold text-xs md:text-sm text-gray-900">84.2%</span>
                        </div>
                        <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '84.2%' }}></div>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">Target minimal 80%</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <h2 className="font-bold text-gray-900 text-base mb-4">Statistik Harian</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100">
                            <span className="text-xs text-gray-500 font-medium mb-1">Rata-rata Datang</span>
                            <span className="text-xl md:text-2xl font-bold text-gray-900">07:54</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100">
                            <span className="text-xs text-gray-500 font-medium mb-1">Rata-rata Pulang</span>
                            <span className="text-xl md:text-2xl font-bold text-gray-900">15:28</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================================
   KOMPONEN TAB 2: BULANAN
======================================================== */
function TabBulanan() {
    const [selectedYear, setSelectedYear] = useState(2026);

    const MONTHLY_DATA = [
        { month: 'Mei', attended: 19, total: 21, percentage: '84.2%' },
        { month: 'April', attended: 20, total: 21, percentage: '95.2%' },
        { month: 'Maret', attended: 18, total: 20, percentage: '90.0%' },
        { month: 'Februari', attended: 17, total: 20, percentage: '85.0%' },
        { month: 'Januari', attended: 19, total: 21, percentage: '90.5%' },
    ];

    return (
        <div className="space-y-5 max-w-3xl mx-auto">
            {/* Header Tahun & Filter */}
            <div className="bg-white rounded-xl p-3.5 flex justify-between items-center shadow-sm border border-gray-100 max-w-xs mx-auto">
                <button
                    onClick={() => setSelectedYear(prev => prev - 1)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5 cursor-pointer">
                    <span className="font-bold text-gray-900 text-sm">{selectedYear}</span>
                    <ChevronRight size={14} className="text-gray-400 rotate-90" />
                </div>

                <button
                    onClick={() => setSelectedYear(prev => prev + 1)}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <ChevronRight size={18} />
                </button>

                <div className="border-l border-gray-200 pl-2.5 ml-0.5">
                    <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            {/* List Rekap Bulanan */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5">
                <h2 className="font-bold text-gray-900 text-base">Rekap Kehadiran Per Bulan</h2>
                <div className="space-y-4">
                    {MONTHLY_DATA.map((item, index) => (
                        <div key={index} className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.month}</h4>
                                    <p className="text-[11px] text-gray-500 font-medium">{item.attended} / {item.total} hari</p>
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{item.percentage}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full rounded-full transition-all duration-700 ease-out"
                                    style={{ width: item.percentage }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Export Section */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-4">
                <div>
                    <h2 className="font-bold text-gray-900 text-sm md:text-base">Export Rekap</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Unduh rekap kehadiran dalam format yang Anda butuhkan.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button className="flex items-center gap-3.5 p-3.5 rounded-xl bg-green-50/50 border border-green-200/60 hover:bg-green-50 transition-all group text-left">
                        <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <FileSpreadsheet size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Export Excel</p>
                            <p className="text-[11px] text-gray-500 font-medium">.xlsx</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-50/50 border border-red-200/60 hover:bg-red-50 transition-all group text-left">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Export PDF</p>
                            <p className="text-[11px] text-gray-500 font-medium">.pdf</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================================
   KOMPONEN PENDUKUNG
======================================================== */
function LegendItem({ color, count, label, percent }: { color: string, count: number, label: string, percent: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
                <span className="font-bold text-gray-900 text-sm w-4">{count}</span>
                <span className="text-xs text-gray-500 font-medium">{label}</span>
            </div>
            <span className="text-xs font-bold text-gray-700">{percent}</span>
        </div>
    );
}

function SummaryBox({ color, count, label }: { color: 'green' | 'yellow' | 'red', count: number, label: string }) {
    const colorMap = {
        green: 'bg-green-50/70 border-green-100 text-green-600',
        yellow: 'bg-yellow-50/70 border-yellow-100 text-yellow-600',
        red: 'bg-red-50/70 border-red-100 text-red-600',
    };

    return (
        <div className={`border rounded-xl p-3 flex flex-col items-center justify-center ${colorMap[color]}`}>
            <span className="text-xl md:text-2xl font-bold mb-0.5">{count}</span>
            <span className="text-[11px] md:text-xs text-gray-600 font-medium text-center">{label}</span>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <button className={`flex flex-col items-center justify-center gap-1.5 w-16 transition-colors ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            {icon}
            <span className={`text-[10px] font-semibold ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                {label}
            </span>
        </button>
    );
}