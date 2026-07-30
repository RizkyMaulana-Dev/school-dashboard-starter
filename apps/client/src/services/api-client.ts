import axiosInstance from "@/lib/axios";
import type { AxiosRequestConfig } from "axios";

// ============================================================
// Generic HTTP Client
// ============================================================

/**
 * API Client yang menyediakan method HTTP generik.
 * Semua method otomatis menggunakan axios instance yang sudah dikonfigurasi
 * dengan interceptor token.
 */
const apiClient = {
  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default apiClient;
