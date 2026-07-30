import { useState, useEffect } from "react";

/**
 * Hook untuk mendeteksi media query (responsive design)
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Handle SSR
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

/**
 * Preset breakpoints yang umum digunakan
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: isMobile || isTablet,
  };
}
