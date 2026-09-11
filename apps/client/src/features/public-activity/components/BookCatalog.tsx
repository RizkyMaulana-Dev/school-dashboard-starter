import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    BookOpen,
    Filter,
    Grid3x3,
    List,
    BookMarked,
    Library,
    Star,
    ChevronRight,
    Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { ROUTE_PATHS } from "@/routes/route.paths";

// Dummy data untuk preview
const DUMMY_BOOKS = [
    {
        id: "1",
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        isbn: "978-602-033-295-7",
        category: "Fiksi",
        stockAvailable: 4,
        stockTotal: 5,
        coverImage: null,
        shelfLocation: "Rak A-01",
        isNew: true,
    },
    {
        id: "2",
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        isbn: "978-979-306-279-2",
        category: "Fiksi",
        stockAvailable: 3,
        stockTotal: 3,
        coverImage: null,
        shelfLocation: "Rak A-02",
        isNew: false,
    },
    {
        id: "3",
        title: "Clean Code",
        author: "Robert C. Martin",
        isbn: "978-602-291-490-7",
        category: "Teknologi",
        stockAvailable: 2,
        stockTotal: 2,
        coverImage: null,
        shelfLocation: "Rak B-01",
        isNew: false,
    },
    {
        id: "4",
        title: "Matematika SMA Kelas X",
        author: "Kemendikbud",
        isbn: "978-602-434-194-2",
        category: "Pelajaran",
        stockAvailable: 0,
        stockTotal: 10,
        coverImage: null,
        shelfLocation: "Rak D-01",
        isNew: false,
    },
    {
        id: "5",
        title: "Sejarah Nasional Indonesia",
        author: "Marwati Djoened Poesponegoro",
        isbn: "978-979-229-884-0",
        category: "Sejarah",
        stockAvailable: 4,
        stockTotal: 4,
        coverImage: null,
        shelfLocation: "Rak C-01",
        isNew: false,
    },
    {
        id: "6",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        isbn: "978-149-195-035-7",
        category: "Teknologi",
        stockAvailable: 2,
        stockTotal: 2,
        coverImage: null,
        shelfLocation: "Rak B-02",
        isNew: true,
    },
];

const CATEGORIES = ["Semua", "Fiksi", "Teknologi", "Pelajaran", "Sejarah"];

export default function BookCatalog() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

    const filteredBooks = DUMMY_BOOKS.filter((book) => {
        const matchSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
        const matchAvailability = !showOnlyAvailable || book.stockAvailable > 0;
        return matchSearch && matchCategory && matchAvailability;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-8">

                {/* =========================================
            HERO SECTION
        ========================================= */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-full" />

                    <div className="relative px-6 md:px-10 py-10 md:py-14">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="text-xs md:text-sm font-bold text-yellow-300 tracking-wider uppercase">
                                Katalog Perpustakaan
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                            Jelajahi Ribuan Buku <br />
                            <span className="text-blue-200">di Perpustakaan Sekolah</span>
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
                            Temukan buku favoritmu, cek ketersediaan stok, dan pinjam langsung
                            dari katalog digital kami.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari judul buku, penulis, atau ISBN..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 placeholder-gray-400 
                           bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300/40
                           text-sm md:text-base font-medium transition-all"
                            />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
                            {[
                                { label: "Total Buku", value: "1.247", icon: BookOpen },
                                { label: "Kategori", value: "12", icon: Library },
                                { label: "Dipinjam", value: "48", icon: BookMarked },
                                { label: "Anggota Aktif", value: "312", icon: Star },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 md:p-4"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <stat.icon className="w-4 h-4 text-blue-200" />
                                        <span className="text-xs text-blue-100 font-medium">{stat.label}</span>
                                    </div>
                                    <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
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
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle + View Mode */}
                        <div className="flex items-center gap-3 md:border-l md:pl-4 md:border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showOnlyAvailable}
                                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                                    Tersedia
                                </span>
                            </label>

                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-md transition-all ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    aria-label="Grid view"
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-md transition-all ${viewMode === "list"
                                        ? "bg-white shadow-sm text-blue-600"
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
                            {selectedCategory === "Semua" ? "Semua Koleksi" : selectedCategory}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Menampilkan <span className="font-semibold text-gray-700">{filteredBooks.length}</span> buku
                        </p>
                    </div>
                </div>

                {/* =========================================
            BOOK GRID / LIST
        ========================================= */}
                {filteredBooks.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Buku Tidak Ditemukan</h3>
                        <p className="text-sm text-gray-500">
                            Coba ubah kata kunci pencarian atau filter kategori.
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredBooks.map((book) => (
                            <BookGridCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredBooks.map((book) => (
                            <BookListCard key={book.id} book={book} />
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
function BookGridCard({ book }: { book: (typeof DUMMY_BOOKS)[0] }) {
    const isAvailable = book.stockAvailable > 0;

    return (
        <Link
            to={ROUTE_PATHS.BOOK_DETAIL.replace(":id", book.id)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
            {/* Cover */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-500 to-indigo-700 overflow-hidden">
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <BookOpen className="w-12 h-12 text-white/60 mb-2" />
                        <p className="text-white font-bold text-sm line-clamp-3 leading-tight">
                            {book.title}
                        </p>
                        <div className="w-12 h-1 bg-white/40 rounded-full mt-3" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {book.isNew && (
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
                        {isAvailable ? `Stok: ${book.stockAvailable}` : "HABIS"}
                    </span>
                </div>

                {/* Category pill */}
                <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 bg-white/95 text-blue-700 text-[10px] font-bold rounded-full">
                        {book.category}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 leading-snug mb-1">
                    {book.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2">{book.author}</p>

                <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-medium">{book.shelfLocation}</span>
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
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
function BookListCard({ book }: { book: (typeof DUMMY_BOOKS)[0] }) {
    const isAvailable = book.stockAvailable > 0;

    return (
        <Link
            to={ROUTE_PATHS.BOOK_DETAIL.replace(":id", book.id)}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 
                 hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex gap-4"
        >
            {/* Cover small */}
            <div className="w-16 h-24 md:w-20 md:h-28 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 
                      flex-shrink-0 flex items-center justify-center overflow-hidden">
                {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-white/70" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">
                            {book.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{book.author}</p>
                    </div>
                    <Badge variant={isAvailable ? "success" : "error"}>
                        {isAvailable ? "Tersedia" : "Habis"}
                    </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                    <span>
                        <span className="font-medium text-gray-700">ISBN:</span> {book.isbn}
                    </span>
                    <span>
                        <span className="font-medium text-gray-700">Stok:</span> {book.stockAvailable}/
                        {book.stockTotal}
                    </span>
                    <span>
                        <span className="font-medium text-gray-700">Lokasi:</span> {book.shelfLocation}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {book.category}
                    </span>
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        Lihat Detail
                        <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}