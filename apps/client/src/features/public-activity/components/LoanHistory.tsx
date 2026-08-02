import { useQuery } from "@tanstack/react-query";
import { bookLoanService } from "@/services/book-loan.service";
import { itemLoanService } from "@/services/item-loan.service";
import { useAuthStore } from "@/stores/auth.store";
import { LoadingScreen, Badge } from "@/components/ui";
import { ErrorMessage, EmptyState } from "@/components/feedback";
import { formatDate, formatLoanStatus } from "@/utils/formatters";
import { useState } from "react";
import type { BookLoan, ItemLoan } from "@/types/entities";

export default function LoanHistory() {
    const userId = useAuthStore((state) => state.user?.id);
    const [tab, setTab] = useState<"books" | "items">("books");

    // Book loans
    const {
        data: bookData,
        isLoading: bookLoading,
        isError: bookError,
        error: bookErr,
        refetch: refetchBook,
    } = useQuery({
        queryKey: ["my-book-loans", userId],
        queryFn: () => bookLoanService.getByUser(userId!),
        enabled: !!userId,
    });

    // Item loans
    const {
        data: itemData,
        isLoading: itemLoading,
        isError: itemError,
        error: itemErr,
        refetch: refetchItem,
    } = useQuery({
        queryKey: ["my-item-loans", userId],
        queryFn: () => itemLoanService.getByUser(userId!),
        enabled: !!userId,
    });

    if (!userId) {
        return (
            <EmptyState
                title="Anda belum login"
                description="Silakan login untuk melihat riwayat peminjaman."
            />
        );
    }

    const isLoading = tab === "books" ? bookLoading : itemLoading;
    const isError = tab === "books" ? bookError : itemError;
    const error = tab === "books" ? bookErr : itemErr;
    const refetch = tab === "books" ? refetchBook : refetchItem;

    const bookLoans = bookData?.data ?? [];
    const itemLoans = itemData?.data ?? [];

    const getStatusBadge = (status: string) => {
        const variantMap: Record<string, "success" | "warning" | "error" | "info"> = {
            DIPINJAM: "info",
            DIKEMBALIKAN: "success",
            TERLAMBAT: "error",
            HILANG: "error",
            RUSAK: "warning",
        };
        return <Badge variant={variantMap[status] ?? "default"}>{formatLoanStatus(status)}</Badge>;
    };

    const renderBookLoans = () => {
        if (bookLoans.length === 0) return <EmptyState title="Tidak ada peminjaman buku" />;
        return (
            <div className="space-y-4">
                {bookLoans.map((loan: BookLoan) => (
                    <div key={loan.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {loan.book?.title ?? "Buku tidak dikenal"}
                                </h3>
                                <p className="text-sm text-gray-500">ISBN: {loan.book?.isbn}</p>
                            </div>
                            <div>{getStatusBadge(loan.status)}</div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Tanggal Pinjam:</span>
                                <p className="font-medium">{formatDate(loan.borrowDate)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Jatuh Tempo:</span>
                                <p className="font-medium">{formatDate(loan.dueDate)}</p>
                            </div>
                            {loan.returnDate && (
                                <div>
                                    <span className="text-gray-500">Tanggal Kembali:</span>
                                    <p className="font-medium">{formatDate(loan.returnDate)}</p>
                                </div>
                            )}
                            {loan.fineAmount > 0 && (
                                <div>
                                    <span className="text-gray-500">Denda:</span>
                                    <p className="font-medium text-red-600">Rp {loan.fineAmount.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderItemLoans = () => {
        if (itemLoans.length === 0) return <EmptyState title="Tidak ada peminjaman barang" />;
        return (
            <div className="space-y-4">
                {itemLoans.map((loan: ItemLoan) => (
                    <div key={loan.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {loan.item?.name ?? "Barang tidak dikenal"}
                                </h3>
                                <p className="text-sm text-gray-500">Kode: {loan.item?.itemCode}</p>
                            </div>
                            <div>{getStatusBadge(loan.status)}</div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Jumlah:</span>
                                <p className="font-medium">{loan.quantity}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Tanggal Pinjam:</span>
                                <p className="font-medium">{formatDate(loan.borrowDate)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Jatuh Tempo:</span>
                                <p className="font-medium">{formatDate(loan.dueDate)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Riwayat Peminjaman</h2>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    className={`px-4 py-2 text-sm font-medium ${tab === "books" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                    onClick={() => setTab("books")}
                >
                    Buku ({bookLoans.length})
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${tab === "items" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                    onClick={() => setTab("items")}
                >
                    Barang ({itemLoans.length})
                </button>
            </div>

            {isLoading && <LoadingScreen />}
            {isError && (
                <ErrorMessage title="Gagal memuat data" message={error?.message} onRetry={refetch} />
            )}
            {!isLoading && !isError && (tab === "books" ? renderBookLoans() : renderItemLoans())}
        </div>
    );
}
