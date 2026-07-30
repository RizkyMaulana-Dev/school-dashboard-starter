import apiClient from "./api-client";
import type { Item, ItemCategory, CreateItemDTO, UpdateItemDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const ITEM_ENDPOINT = "/item";
const ITEM_CATEGORY_ENDPOINT = "/item-category";

export const itemService = {
  /**
   * Mendapatkan daftar barang inventaris
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Item>> {
    return apiClient.get(ITEM_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail barang
   */
  async getById(id: string): Promise<ApiResponse<Item>> {
    return apiClient.get(`${ITEM_ENDPOINT}/${id}`);
  },

  /**
   * Membuat barang baru
   */
  async create(data: CreateItemDTO): Promise<ApiResponse<Item>> {
    return apiClient.post(ITEM_ENDPOINT, data);
  },

  /**
   * Update data barang
   */
  async update(id: string, data: UpdateItemDTO): Promise<ApiResponse<Item>> {
    return apiClient.patch(`${ITEM_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus barang
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${ITEM_ENDPOINT}/${id}`);
  },

  /**
   * Cari barang berdasarkan kode atau nama
   */
  async search(query: string): Promise<PaginatedResponse<Item>> {
    return apiClient.get(ITEM_ENDPOINT, {
      params: { search: query },
    });
  },

  /**
   * Mendapatkan barang berdasarkan kondisi
   */
  async getByCondition(condition: string): Promise<PaginatedResponse<Item>> {
    return apiClient.get(ITEM_ENDPOINT, {
      params: { condition },
    });
  },

  /**
   * Mendapatkan semua kategori barang
   */
  async getAllCategories(): Promise<ApiResponse<ItemCategory[]>> {
    return apiClient.get(ITEM_CATEGORY_ENDPOINT);
  },
};
