import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { setTokens, clearTokens } from "@/lib/axios";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Type the context properly so useAuth() below gets real typing instead of `null`
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const {
        isAuthenticated,
        isLoading,
        setAuth,
        setLoading,
        logout,
        refreshToken,
    } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (!refreshToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await authService.refreshToken(refreshToken);
                const { user, tokens } = response.data;

                if (tokens && typeof tokens === "object") {
                    const accessToken = (tokens as { accessToken?: string }).accessToken || "";
                    const newRefreshToken = (tokens as { refreshToken?: string }).refreshToken || "";

                    setTokens(accessToken, newRefreshToken);
                    setAuth(user, accessToken, newRefreshToken);
                }
            } catch (error) {
                console.error("Failed to refresh token:", error);
                clearTokens();
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const contextValue: AuthContextType = {
        isAuthenticated,
        isLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}