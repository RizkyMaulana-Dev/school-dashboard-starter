import apiClient from "./api-client";
import type { Role, Permission } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const ROLES_ENDPOINT = "/roles";

export const roleService = {
  /**
   * Mendapatkan semua role
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Role>> {
    return apiClient.get(ROLES_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail role
   */
  async getById(id: string): Promise<ApiResponse<Role>> {
    return apiClient.get(`${ROLES_ENDPOINT}/${id}`);
  },

  /**
   * Membuat role baru
   */
  async create(data: {
    name: string;
    description?: string;
    permissionIds?: string[];
  }): Promise<ApiResponse<Role>> {
    return apiClient.post(ROLES_ENDPOINT, data);
  },

  /**
   * Update role
   */
  async update(
    id: string,
    data: { name?: string; description?: string; permissionIds?: string[] },
  ): Promise<ApiResponse<Role>> {
    return apiClient.patch(`${ROLES_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus role
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${ROLES_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan semua permissions yang tersedia
   */
  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    return apiClient.get("/permissions");
  },
};
