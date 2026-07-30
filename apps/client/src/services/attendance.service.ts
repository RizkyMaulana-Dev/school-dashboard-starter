import apiClient from "./api-client";
import type {
  AttendanceRecord,
  CreateAttendanceRecordDTO,
  UpdateAttendanceRecordDTO,
} from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const ATTENDANCE_ENDPOINT = "/attendance";

export const attendanceService = {
  /**
   * Mendapatkan daftar catatan kehadiran
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<AttendanceRecord>> {
    return apiClient.get(ATTENDANCE_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail catatan kehadiran
   */
  async getById(id: string): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.get(`${ATTENDANCE_ENDPOINT}/${id}`);
  },

  /**
   * Membuat catatan kehadiran baru
   */
  async create(data: CreateAttendanceRecordDTO): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.post(ATTENDANCE_ENDPOINT, data);
  },

  /**
   * Update catatan kehadiran (status, notes, verifikasi)
   */
  async update(
    id: string,
    data: UpdateAttendanceRecordDTO,
  ): Promise<ApiResponse<AttendanceRecord>> {
    return apiClient.patch(`${ATTENDANCE_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus catatan kehadiran
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${ATTENDANCE_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan catatan kehadiran berdasarkan sesi
   */
  async getBySession(sessionId: string): Promise<PaginatedResponse<AttendanceRecord>> {
    return apiClient.get(ATTENDANCE_ENDPOINT, {
      params: { attendanceSessionId: sessionId },
    });
  },

  /**
   * Mendapatkan catatan kehadiran berdasarkan siswa
   */
  async getByStudent(studentId: string): Promise<PaginatedResponse<AttendanceRecord>> {
    return apiClient.get(ATTENDANCE_ENDPOINT, {
      params: { studentId },
    });
  },

  /**
   * Bulk create/update attendance records untuk satu sesi
   */
  async bulkCreate(
    sessionId: string,
    records: CreateAttendanceRecordDTO[],
  ): Promise<ApiResponse<AttendanceRecord[]>> {
    return apiClient.post(`${ATTENDANCE_ENDPOINT}/bulk`, {
      sessionId,
      records,
    });
  },
};
