import apiClient from "./api-client";
import type { LoginCredentials, AuthResponse } from "@/types/entities";

const AUTH_ENDPOINT = "/auth";

export const authService = {
  /**
   * Login dengan email dan password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post(`${AUTH_ENDPOINT}/login`, credentials);
  },

  /**
   * Refresh access token menggunakan refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post(`${AUTH_ENDPOINT}/refresh-token`, { refreshToken });
  },

  /**
   * Logout (revoke refresh token)
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`${AUTH_ENDPOINT}/logout`);
  },
};
