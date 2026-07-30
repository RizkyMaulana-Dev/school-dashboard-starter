import apiClient from "./api-client";
import type {
  AttendanceSession,
  CreateAttendanceSessionDTO,
  UpdateAttendanceSessionDTO,
} from "@/types/entities";
import type { ApiResponse, PaginatedResponse, QueryParams } from "@/types/api";

const ATTENDANCE_SESSION_ENDPOINT = "/attendance-session";

export const attendanceSessionService = {
  /**
   * Mendapatkan daftar sesi absensi
   */
  async getAll(params?: QueryParams): Promise<PaginatedResponse<AttendanceSession>> {
    return apiClient.get(ATTENDANCE_SESSION_ENDPOINT, { params });
  },

  /**
   * Mendapatkan detail sesi absensi
   */
  async getById(id: string): Promise<ApiResponse<AttendanceSession>> {
    return apiClient.get(`${ATTENDANCE_SESSION_ENDPOINT}/${id}`);
  },

  /**
   * Membuat sesi absensi baru
   */
  async create(data: CreateAttendanceSessionDTO): Promise<ApiResponse<AttendanceSession>> {
    return apiClient.post(ATTENDANCE_SESSION_ENDPOINT, data);
  },

  /**
   * Update sesi absensi
   */
  async update(
    id: string,
    data: UpdateAttendanceSessionDTO,
  ): Promise<ApiResponse<AttendanceSession>> {
    return apiClient.patch(`${ATTENDANCE_SESSION_ENDPOINT}/${id}`, data);
  },

  /**
   * Hapus sesi absensi
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${ATTENDANCE_SESSION_ENDPOINT}/${id}`);
  },

  /**
   * Mendapatkan sesi berdasarkan tanggal
   */
  async getByDate(date: string): Promise<PaginatedResponse<AttendanceSession>> {
    return apiClient.get(ATTENDANCE_SESSION_ENDPOINT, {
      params: { date },
    });
  },

  /**
   * Mendapatkan sesi berdasarkan kelas
   */
  async getByClass(classId: string): Promise<PaginatedResponse<AttendanceSession>> {
    return apiClient.get(ATTENDANCE_SESSION_ENDPOINT, {
      params: { schoolClassId: classId },
    });
  },
};
