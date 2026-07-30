import apiClient from "./api-client";
import type { BookLoan, CreateBookLoanDTO, UpdateBookLoanDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const BOOK_LOAN_ENDPOINT = "/book-loan";

export const bookLoanService = {
  /**
   * Mendapatkan daftar peminjaman buku
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<BookLoan>> {
    return apiClient.get(BOOK_LOAN_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail peminjaman buku
   */
  async getById(id: string): Promise<ApiResponse<BookLoan>> {
    return apiClient.get(`${BOOK_LOAN_ENDPOINT}/${id}`);
  },

  /**
   * Membuat peminjaman buku baru
   */
  async create(data: CreateBookLoanDTO): Promise<ApiResponse<BookLoan>> {
    return apiClient.post(BOOK_LOAN_ENDPOINT, data);
  },

  /**
   * Update status peminjaman (kembalikan, hilang, denda)
   */
  async update(id: string, data: UpdateBookLoanDTO): Promise<ApiResponse<BookLoan>> {
    return apiClient.patch(`${BOOK_LOAN_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus catatan peminjaman
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${BOOK_LOAN_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan peminjaman berdasarkan user
   */
  async getByUser(userId: string): Promise<PaginatedResponse<BookLoan>> {
    return apiClient.get(BOOK_LOAN_ENDPOINT, {
      params: { userId },
    });
  },

  /**
   * Mendapatkan peminjaman berdasarkan buku
   */
  async getByBook(bookId: string): Promise<PaginatedResponse<BookLoan>> {
    return apiClient.get(BOOK_LOAN_ENDPOINT, {
      params: { bookId },
    });
  },

  /**
   * Mendapatkan peminjaman aktif (yang belum dikembalikan)
   */
  async getActive(): Promise<PaginatedResponse<BookLoan>> {
    return apiClient.get(BOOK_LOAN_ENDPOINT, {
      params: { status: "DIPINJAM" },
    });
  },

  /**
   * Pengembalian buku (shortcut untuk update status)
   */
  async returnBook(id: string, notes?: string): Promise<ApiResponse<BookLoan>> {
    return apiClient.patch(`${BOOK_LOAN_ENDPOINT}/${id}`, {
      status: "DIKEMBALIKAN",
      returnDate: new Date().toISOString(),
      notes,
    });
  },
};
