import apiClient from "./api-client";
import type { ItemLoan, CreateItemLoanDTO, UpdateItemLoanDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const ITEM_LOAN_ENDPOINT = "/item-loan";

export const itemLoanService = {
  /**
   * Mendapatkan daftar peminjaman barang
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<ItemLoan>> {
    return apiClient.get(ITEM_LOAN_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail peminjaman barang
   */
  async getById(id: string): Promise<ApiResponse<ItemLoan>> {
    return apiClient.get(`${ITEM_LOAN_ENDPOINT}/${id}`);
  },

  /**
   * Membuat peminjaman barang baru
   */
  async create(data: CreateItemLoanDTO): Promise<ApiResponse<ItemLoan>> {
    return apiClient.post(ITEM_LOAN_ENDPOINT, data);
  },

  /**
   * Update status peminjaman barang
   */
  async update(id: string, data: UpdateItemLoanDTO): Promise<ApiResponse<ItemLoan>> {
    return apiClient.patch(`${ITEM_LOAN_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus catatan peminjaman
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${ITEM_LOAN_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan peminjaman berdasarkan user
   */
  async getByUser(userId: string): Promise<PaginatedResponse<ItemLoan>> {
    return apiClient.get(ITEM_LOAN_ENDPOINT, {
      params: { userId },
    });
  },

  /**
   * Mendapatkan peminjaman berdasarkan barang
   */
  async getByItem(itemId: string): Promise<PaginatedResponse<ItemLoan>> {
    return apiClient.get(ITEM_LOAN_ENDPOINT, {
      params: { itemId },
    });
  },

  /**
   * Mendapatkan peminjaman aktif
   */
  async getActive(): Promise<PaginatedResponse<ItemLoan>> {
    return apiClient.get(ITEM_LOAN_ENDPOINT, {
      params: { status: "DIPINJAM" },
    });
  },

  /**
   * Pengembalian barang (shortcut)
   */
  async returnItem(id: string, notes?: string): Promise<ApiResponse<ItemLoan>> {
    return apiClient.patch(`${ITEM_LOAN_ENDPOINT}/${id}`, {
      status: "DIKEMBALIKAN",
      returnDate: new Date().toISOString(),
      notes,
    });
  },
};
