import apiClient from "./api-client";
import type { User, CreateUserDTO, UpdateUserDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const USERS_ENDPOINT = "/users";

export const userService = {
  /**
   * Mendapatkan daftar user dengan paginasi dan filter
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<User>> {
    return apiClient.get(USERS_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail user by ID
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get(`${USERS_ENDPOINT}/${id}`);
  },

  /**
   * Membuat user baru
   */
  async create(data: CreateUserDTO): Promise<ApiResponse<User>> {
    return apiClient.post(USERS_ENDPOINT, data);
  },

  /**
   * Update data user
   */
  async update(id: string, data: UpdateUserDTO): Promise<ApiResponse<User>> {
    return apiClient.patch(`${USERS_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus user (soft/hard delete)
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${USERS_ENDPOINT}/${id}`);
  },

  /**
   * Mencari user berdasarkan nama atau email
   */
  async search(search: string): Promise<PaginatedResponse<User>> {
    return apiClient.get(USERS_ENDPOINT, {
      params: { search },
    });
  },
};
