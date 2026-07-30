import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { setTokens, clearTokens } from "@/lib/axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    setAuth,
    setLoading,
    logout,
    refreshToken,
    setAccessToken,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // If no refresh token, skip initialization
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await authService.refreshToken(refreshToken);
        const { user, tokens } = response.data;

        // Update tokens in axios instance and store
        setTokens(tokens.accessToken, tokens.refreshToken);
        setAuth(user, tokens.accessToken, tokens.refreshToken);
      } catch (error) {
        // Refresh failed, clear auth state
        console.error("Failed to refresh token:", error);
        clearTokens();
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
