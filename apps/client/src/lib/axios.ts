import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ============================================================
// Konstanta
// ============================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

// ============================================================
// Helper functions
// ============================================================

/**
 * Mendapatkan token dari localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Mendapatkan refresh token dari localStorage
 */
function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Menyimpan token ke localStorage
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

/**
 * Menghapus token dari localStorage (untuk logout)
 */
export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

// ============================================================
// Axios Instance
// ============================================================

/**
 * Axios instance dengan base URL dari environment variable
 */
const axiosInstance = axios.create({
  baseURL: "/api/v1", // ✅ relatif, akan diproxy oleh Vite
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// Request Interceptor
// ============================================================

/**
 * Interceptor untuk menyisipkan Bearer token ke setiap request
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ============================================================
// Response Interceptor
// ============================================================

/**
 * Flag untuk mencegah multiple refresh token request bersamaan
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Memproses antrian request yang tertunda setelah token berhasil di-refresh
 */
function processQueue(error: AxiosError | null, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

/**
 * Response interceptor untuk menangani error 401 dan refresh token
 */
// ============================================================
// Response Interceptor
// ============================================================

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1. TAMBAHKAN PENGECEKAN URL DI SINI
    const isLoginRequest = originalRequest.url?.includes("/login");

    // 2. JIKA INI REQUEST LOGIN, LANGSUNG REJECT (JANGAN LAKUKAN LOGIC REFRESH TOKEN)
    if (isLoginRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // --- Sisa kode di bawah ini tetap sama persis ---
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"}/auth/refresh-token`,
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

      setTokens(accessToken, newRefreshToken);

      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
export default axiosInstance;
