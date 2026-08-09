import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { setTokens } from "@/lib/axios";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { LoginCredentials, AuthResponse } from "@/types/entities";

// Interface untuk struktur JSON error dari backend Anda
interface ApiErrorResponse {
  success: boolean;
  message: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        return await authService.login(credentials);
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error)) {
          // Ambil "Email atau password salah" dari response backend
          const errorMessage =
            error.response?.data?.message || "Terjadi kesalahan saat login";
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      const refresh = refreshToken || "";

      setTokens(accessToken, refresh);
      setAuth(user, accessToken, refresh);

      if (user.roles?.some((role) => role.name === "Student")) {
        navigate(ROUTE_PATHS.PUBLIC, { replace: true });
      } else {
        navigate(ROUTE_PATHS.DASHBOARD_HOME, { replace: true });
      }
    },
  });
}