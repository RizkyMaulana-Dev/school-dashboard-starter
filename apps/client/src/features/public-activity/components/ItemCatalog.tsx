import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Package,
    Filter,
    Grid3x3,
    List,
    Boxes,
    Wrench,
    UserCheck,
    ChevronRight,
    Sparkles,
    MapPin,
    AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { ROUTE_PATHS } from "@/routes/route.paths";

// Dummy data untuk preview
const DUMMY_ITEMS = [
    {
        id: "1",
        itemCode: "ELEC-001",
        name: "Proyektor Epson X400",
        category: "Elektronik",
        stockAvailable: 4,
        stockTotal: 5,
        condition: "BAIK" as const,
        location: "Lab Komputer A",
        purchaseDate: "2025-01-15",
        isNew: false,
    },
    {
        id: "2",
        itemCode: "ELEC-002",
        name: "Laptop Dell Latitude",
        category: "Elektronik",
        stockAvailable: 10,
        stockTotal: 10,
        condition: "BAIK" as const,
        location: "Ruang Guru",
        purchaseDate: "2025-03-10",
        isNew: true,
    },
    {
        id: "3",
        itemCode: "MEB-001",
        name: "Meja Lipat Serbaguna",
        category: "Mebel",
        stockAvailable: 20,
        stockTotal: 20,
        condition: "BAIK" as const,
        location: "Gudang Utama",
        purchaseDate: "2024-08-20",
        isNew: false,
    },
    {
        id: "4",
        itemCode: "MEB-002",
        name: "Kursi Lipat Plastik",
        category: "Mebel",
        stockAvailable: 0,
        stockTotal: 40,
        condition: "RUSAK_RINGAN" as const,
        location: "Gudang Utama",
        purchaseDate: "2023-05-12",
        isNew: false,
    },
    {
        id: "5",
        itemCode: "OLA-001",
        name: "Bola Sepak Adidas",
        category: "Olahraga",
        stockAvailable: 8,
        stockTotal: 10,
        condition: "BAIK" as const,
        location: "Gudang Olahraga",
        purchaseDate: "2025-02-01",
        isNew: true,
    },
    {
        id: "6",
        itemCode: "ELEC-003",
        name: "Speaker Portable JBL",
        category: "Elektronik",
        stockAvailable: 2,
        stockTotal: 3,
        condition: "BAIK" as const,
        location: "Ruang OSIS",
        purchaseDate: "2024-11-15",
        isNew: false,
    },
    {
        id: "7",
        itemCode: "LAB-001",
        name: "Mikroskop Binokuler",
        category: "Laboratorium",
        stockAvailable: 6,
        stockTotal: 6,
        condition: "BAIK" as const,
        location: "Lab Biologi",
        purchaseDate: "2024-06-10",
        isNew: false,
    },
    {
        id: "8",
        itemCode: "KEB-001",
        name: "Sapu Lantai Ijuk",
        category: "Kebersihan",
        stockAvailable: 15,
        stockTotal: 20,
        condition: "RUSAK_RINGAN" as const,
        location: "Gudang Kebersihan",
        purchaseDate: "2024-01-05",
        isNew: false,
    },
];

const CATEGORIES = [
    "Semua",
    "Elektronik",
    "Mebel",
    "Olahraga",
    "Laboratorium",
    "Kebersihan",
];

const CONDITION_STYLES: Record<
    string,
    { label: string; bg: string; text: string; border: string }
> = {
    BAIK: {
        label: "Baik",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    RUSAK_RINGAN: {
        label: "Rusak Ringan",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
    },
    RUSAK_BERAT: {
        label: "Rusak Berat",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
    },
};

export default function ItemCatalog() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const [showOnlyGood, setShowOnlyGood] = useState(false);

    const filteredItems = DUMMY_ITEMS.filter((item) => {
        const matchSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.itemCode.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === "Semua" || item.category === selectedCategory;
        const matchAvailability = !showOnlyAvailable || item.stockAvailable > 0;
        const matchCondition = !showOnlyGood || item.condition === "BAIK";
        return matchSearch && matchCategory && matchAvailability && matchCondition;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-8">

                {/* =========================================
            HERO SECTION
        ========================================= */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 shadow-xl">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-full" />

                    <div className="relative px-6 md:px-10 py-10 md:py-14">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-emerald-200" />
                            <span className="text-xs md:text-sm font-bold text-emerald-200 tracking-wider uppercase">
                                Katalog Inventaris Sekolah
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                            Pinjam Barang <br />
                            <span className="text-emerald-200">Kebutuhan Sekolah</span>
                        </h1>
                        <p className="text-emerald-50 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
                            Cek ketersediaan barang inventaris sekolah, ajukan peminjaman,
                            dan pantau status barang dalam satu tempat.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama barang atau kode inventaris..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 
                           bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300/40
                           text-sm md:text-base font-medium transition-all"
                            />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
                            {[
                                { label: "Total Barang", value: "486", icon: Package },
                                { label: "Kategori", value: "8", icon: Boxes },
                                { label: "Dipinjam", value: "23", icon: UserCheck },
                                { label: "Perlu Perbaikan", value: "5", icon: Wrench },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-4"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <stat.icon className="w-4 h-4 text-emerald-200" />
                                        <span className="text-xs text-emerald-50 font-medium">{stat.label}</span>
                                    </div>
                                    <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* =========================================
            ALERT INFO
        ========================================= */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                        <p className="font-bold mb-0.5">Peminjaman Barang</p>
                        <p className="text-amber-700">
                            Barang inventaris hanya dapat dipinjam oleh siswa dan guru yang terdaftar.
                            Pastikan mengembalikan barang sesuai jatuh tempo untuk menghindari sanksi.
                        </p>
                    </div>
                </div>

                {/* =========================================
            FILTER BAR
        ========================================= */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">

                        {/* Kategori Pills */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium 
                                transition-all duration-200 
                                ${selectedCategory === cat
                                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle + View Mode */}
                        <div className="flex flex-wrap items-center gap-3 md:border-l md:pl-4 md:border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlyAvailable}
                                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                                    Tersedia
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlyGood}
                                    onChange={(e) => setShowOnlyGood(e.target.checked)}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                                    Kondisi Baik
                                </span>
                            </label>

                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-emerald-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    aria-label="Grid view"
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-md transition-all ${viewMode === "list"
                                        ? "bg-white shadow-sm text-emerald-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    aria-label="List view"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================
            RESULT INFO
        ========================================= */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                            {selectedCategory === "Semua" ? "Semua Barang" : selectedCategory}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Menampilkan{" "}
                            <span className="font-semibold text-gray-700">{filteredItems.length}</span>{" "}
                            barang
                        </p>
                    </div>
                </div>

                {/* =========================================
            ITEM GRID / LIST
        ========================================= */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Barang Tidak Ditemukan</h3>
                        <p className="text-sm text-gray-500">
                            Coba ubah kata kunci pencarian atau filter kategori.
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredItems.map((item) => (
                            <ItemGridCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredItems.map((item) => (
                            <ItemListCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// =========================================
// GRID CARD
// =========================================
function ItemGridCard({ item }: { item: (typeof DUMMY_ITEMS)[0] }) {
    const isAvailable = item.stockAvailable > 0;
    const condition = CONDITION_STYLES[item.condition];

    return (
        <Link
            to={ROUTE_PATHS.ITEM_DETAIL.replace(":id", item.id)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
            {/* Image area */}
            <div className="relative aspect-square bg-gradient-to-br from-emerald-500 to-teal-700 overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm 
                          flex items-center justify-center mb-3 border border-white/30">
                        <Package className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <p className="text-white/90 font-mono text-[10px] md:text-xs tracking-wider">
                        {item.itemCode}
                    </p>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {item.isNew && (
                        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full shadow">
                            BARU
                        </span>
                    )}
                    <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full shadow 
              ${isAvailable
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                    >
                        {isAvailable ? `Tersedia: ${item.stockAvailable}` : "HABIS"}
                    </span>
                </div>

                {/* Condition indicator */}
                <div className="absolute bottom-2 right-2">
                    <span
                        className={`px-2 py-0.5 ${condition.bg} ${condition.text} text-[10px] font-bold 
                        rounded-full shadow border ${condition.border}`}
                    >
                        {condition.label}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full self-start mb-2">
                    {item.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 leading-snug mb-2">
                    {item.name}
                </h3>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-medium">
                        Stok: {item.stockAvailable}/{item.stockTotal}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        Detail
                        <ChevronRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// =========================================
// LIST CARD
// =========================================
function ItemListCard({ item }: { item: (typeof DUMMY_ITEMS)[0] }) {
    const isAvailable = item.stockAvailable > 0;
    const condition = CONDITION_STYLES[item.condition];

    return (
        <Link
            to={ROUTE_PATHS.ITEM_DETAIL.replace(":id", item.id)}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 
                 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex gap-4"
        >
            {/* Icon area */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 
                      flex-shrink-0 flex items-center justify-center">
                <Package className="w-7 h-7 md:w-9 md:h-9 text-white/90" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[10px] md:text-xs text-gray-400">
                                {item.itemCode}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                {item.category}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">
                            {item.name}
                        </h3>
                    </div>
                    <Badge variant={isAvailable ? "success" : "error"}>
                        {isAvailable ? "Tersedia" : "Habis"}
                    </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span>
                        <span className="font-medium text-gray-700">Stok:</span> {item.stockAvailable}/
                        {item.stockTotal}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    <span
                        className={`text-xs font-bold ${condition.bg} ${condition.text} 
                        px-2 py-0.5 rounded-full border ${condition.border}`}
                    >
                        Kondisi: {condition.label}
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        Lihat Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}