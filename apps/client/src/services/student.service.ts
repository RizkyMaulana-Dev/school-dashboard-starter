import apiClient from "./api-client";
import type { Student, CreateStudentDTO, UpdateStudentDTO } from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const STUDENT_ENDPOINT = "/student";

export const studentService = {
  /**
   * Mendapatkan daftar siswa dengan filter
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Student>> {
    return apiClient.get(STUDENT_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail siswa by ID
   */
  async getById(id: string): Promise<ApiResponse<Student>> {
    return apiClient.get(`${STUDENT_ENDPOINT}/${id}`);
  },

  /**
   * Membuat data siswa baru
   */
  async create(data: CreateStudentDTO): Promise<ApiResponse<Student>> {
    return apiClient.post(STUDENT_ENDPOINT, data);
  },

  /**
   * Update data siswa
   */
  async update(id: string, data: UpdateStudentDTO): Promise<ApiResponse<Student>> {
    return apiClient.patch(`${STUDENT_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus data siswa
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${STUDENT_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan siswa berdasarkan kelas
   */
  async getByClass(classId: string): Promise<PaginatedResponse<Student>> {
    return apiClient.get(STUDENT_ENDPOINT, {
      params: { schoolClassId: classId },
    });
  },
};
