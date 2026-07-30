import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/entities";

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  isSuperAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Set full auth data (used after login)
      setAuth: (user: User, accessToken: string, refreshToken: string) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      // Update user only
      setUser: (user: User) => set({ user }),

      // Update tokens only
      setTokens: (accessToken: string, refreshToken: string) => set({ accessToken, refreshToken }),

      // Update access token only (after refresh)
      setAccessToken: (accessToken: string) => set({ accessToken }),

      // Set loading state
      setLoading: (isLoading: boolean) => set({ isLoading }),

      // Logout - clear all auth data
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      // Check if user is Super Admin
      isSuperAdmin: () => {
        const { user } = get();
        if (!user?.roles) return false;
        return user.roles.some((role) => role.name === "Super Admin");
      },

      // Check if user has specific permission
      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user?.roles) return false;

        // Super Admin has all permissions
        if (user.roles.some((role) => role.name === "Super Admin")) return true;

        return user.roles.some((role) => role.permissions?.some((p) => p.name === permission));
      },

      // Check if user has specific role
      hasRole: (roleName: string) => {
        const { user } = get();
        if (!user?.roles) return false;
        return user.roles.some((role) => role.name === roleName);
      },
    }),
    {
      name: "auth-storage", // Key di localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
