import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Tambahkan 'export' di sini
export type ThemeMode = "light" | "dark" | "system";
export type SidebarState = "expanded" | "collapsed";

// 2. Export interface UIState agar bisa di-import jika dibutuhkan
export interface UIState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Sidebar
  sidebarState: SidebarState;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;

  // Loading
  isPageLoading: boolean;
  setPageLoading: (isLoading: boolean) => void;

  // Toasts/Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Modal
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "system",
      setTheme: (theme: ThemeMode) => set({ theme }),

      // Sidebar
      sidebarState: "expanded",
      toggleSidebar: () =>
        set((state) => ({
          sidebarState: state.sidebarState === "expanded" ? "collapsed" : "expanded",
        })),
      setSidebarState: (sidebarState: SidebarState) => set({ sidebarState }),

      // Page loading
      isPageLoading: false,
      setPageLoading: (isPageLoading: boolean) => set({ isPageLoading }),

      // Toasts
      toasts: [],
      addToast: (toast: Omit<Toast, "id">) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = { ...toast, id };
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto remove toast after duration
        const duration = toast.duration || 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      removeToast: (id: string) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
      clearToasts: () => set({ toasts: [] }),

      // Modal
      activeModal: null,
      modalData: null,
      openModal: (modalId: string, data?: unknown) =>
        set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        sidebarState: state.sidebarState,
      }),
    },
  ),
);
