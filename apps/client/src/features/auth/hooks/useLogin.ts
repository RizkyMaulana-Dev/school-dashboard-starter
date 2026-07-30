import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { setTokens } from "@/lib/axios";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { LoginCredentials, AuthResponse } from "@/types/entities";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      // ✅ TypeScript sekarang mengenali accessToken & refreshToken secara langsung di response.data
      const { user, accessToken, refreshToken } = response.data;

      const refresh = refreshToken || "";

      // Save tokens to axios instance & localStorage
      setTokens(accessToken, refresh);

      // Update auth store
      setAuth(user, accessToken, refresh);

      // Redirect berdasarkan role
      if (user.roles?.some((role) => role.name === "Student")) {
        navigate(ROUTE_PATHS.PUBLIC, { replace: true });
      } else {
        navigate(ROUTE_PATHS.DASHBOARD_HOME, { replace: true });
      }
    },
  });
}