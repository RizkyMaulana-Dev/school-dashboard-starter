import apiClient from "./api-client";
import type { SchoolClass, CreateSchoolClassDTO, UpdateSchoolClassDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const CLASS_ENDPOINT = "/class";

export const classService = {
  /**
   * Mendapatkan daftar kelas
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<SchoolClass>> {
    return apiClient.get(CLASS_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail kelas by ID
   */
  async getById(id: string): Promise<ApiResponse<SchoolClass>> {
    return apiClient.get(`${CLASS_ENDPOINT}/${id}`);
  },

  /**
   * Membuat kelas baru
   */
  async create(data: CreateSchoolClassDTO): Promise<ApiResponse<SchoolClass>> {
    return apiClient.post(CLASS_ENDPOINT, data);
  },

  /**
   * Update data kelas
   */
  async update(id: string, data: UpdateSchoolClassDTO): Promise<ApiResponse<SchoolClass>> {
    return apiClient.patch(`${CLASS_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus kelas
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${CLASS_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan daftar siswa dalam kelas tertentu
   */
  async getStudents(classId: string): Promise<ApiResponse<SchoolClass>> {
    return apiClient.get(`${CLASS_ENDPOINT}/${classId}`, {
      params: { include: "students" },
    });
  },
};
