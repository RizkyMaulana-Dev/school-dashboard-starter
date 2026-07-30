import apiClient from "./api-client";
import type { Teacher, CreateTeacherDTO, UpdateTeacherDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const TEACHER_ENDPOINT = "/teacher";

export const teacherService = {
  /**
   * Mendapatkan daftar guru
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Teacher>> {
    return apiClient.get(TEACHER_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail guru by ID
   */
  async getById(id: string): Promise<ApiResponse<Teacher>> {
    return apiClient.get(`${TEACHER_ENDPOINT}/${id}`);
  },

  /**
   * Membuat data guru baru
   */
  async create(data: CreateTeacherDTO): Promise<ApiResponse<Teacher>> {
    return apiClient.post(TEACHER_ENDPOINT, data);
  },

  /**
   * Update data guru
   */
  async update(id: string, data: UpdateTeacherDTO): Promise<ApiResponse<Teacher>> {
    return apiClient.patch(`${TEACHER_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus data guru
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${TEACHER_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan kelas yang diampu oleh guru (sebagai wali kelas)
   */
  async getHomeroomClasses(teacherId: string): Promise<ApiResponse<Teacher>> {
    return apiClient.get(`${TEACHER_ENDPOINT}/${teacherId}`, {
      params: { include: "homeroomClasses" },
    });
  },
};
