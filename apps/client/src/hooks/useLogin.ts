import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { setTokens } from "@/lib/axios";
import { ROUTE_PATHS } from "@/routes/route.paths";
import type { LoginCredentials } from "@/types/entities";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      const { user, tokens } = response.data;

      // Type-check & Fallback penanganan token
      if (tokens && typeof tokens === "object") {
        const accessToken = (tokens as { accessToken?: string }).accessToken || "";
        const refreshToken = (tokens as { refreshToken?: string }).refreshToken || "";

        // Save tokens to axios instance & localStorage
        setTokens(accessToken, refreshToken);

        // Update auth store
        setAuth(user, accessToken, refreshToken);
      }

      // Redirect based on role
      if (user.roles?.some((role) => role.name === "Student" || role.name === "Teacher")) {
        navigate(ROUTE_PATHS.PUBLIC, { replace: true });
      } else {
        navigate(ROUTE_PATHS.DASHBOARD_HOME, { replace: true });
      }
    },
  });
}