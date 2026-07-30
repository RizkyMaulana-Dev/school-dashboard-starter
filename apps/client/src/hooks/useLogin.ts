import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { setTokens } from "@/lib/axios";
import { ROUTE_PATHS } from "@/routes/route-paths";
import type { LoginCredentials } from "@/types/entities";
import type { ApiResponse } from "@/types/api";
import type { AuthResponse } from "@/types/entities";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      const { user, tokens } = response.data;

      // Save tokens to axios instance & localStorage
      setTokens(tokens.accessToken, tokens.refreshToken);

      // Update auth store
      setAuth(user, tokens.accessToken, tokens.refreshToken);

      // Redirect based on role
      if (user.roles?.some((role) => role.name === "Student")) {
        navigate(ROUTE_PATHS.PUBLIC, { replace: true });
      } else {
        navigate(ROUTE_PATHS.DASHBOARD_HOME, { replace: true });
      }
    },
  });
}
