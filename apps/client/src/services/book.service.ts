import apiClient from "./api-client";
import type { Book, BookCategory, CreateBookDTO, UpdateBookDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const BOOK_ENDPOINT = "/book";
const BOOK_CATEGORY_ENDPOINT = "/book-category";

export const bookService = {
  /**
   * Mendapatkan daftar buku
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Book>> {
    return apiClient.get(BOOK_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail buku by ID
   */
  async getById(id: string): Promise<ApiResponse<Book>> {
    return apiClient.get(`${BOOK_ENDPOINT}/${id}`);
  },

  /**
   * Membuat buku baru
   */
  async create(data: CreateBookDTO): Promise<ApiResponse<Book>> {
    return apiClient.post(BOOK_ENDPOINT, data);
  },

  /**
   * Update data buku
   */
  async update(id: string, data: UpdateBookDTO): Promise<ApiResponse<Book>> {
    return apiClient.patch(`${BOOK_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus buku
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${BOOK_ENDPOINT}/${id}`);
  },

  /**
   * Cari buku berdasarkan judul, penulis, atau ISBN
   */
  async search(query: string): Promise<PaginatedResponse<Book>> {
    return apiClient.get(BOOK_ENDPOINT, {
      params: { search: query },
    });
  },

  /**
   * Mendapatkan semua kategori buku
   */
  async getAllCategories(): Promise<ApiResponse<BookCategory[]>> {
    return apiClient.get(BOOK_CATEGORY_ENDPOINT);
  },
};
