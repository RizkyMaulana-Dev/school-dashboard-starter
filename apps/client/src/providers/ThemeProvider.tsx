import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useUIStore, type ThemeMode } from "@/stores/ui.store";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useUIStore();

  // Determine if dark mode is active
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = document.documentElement;
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    isDark,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
