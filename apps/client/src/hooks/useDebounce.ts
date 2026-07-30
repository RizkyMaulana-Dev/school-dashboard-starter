import { useState, useEffect } from "react";

/**
 * Hook untuk mendebounce nilai (berguna untuk search input)
 * @param value - Nilai yang akan didebounce
 * @param delay - Delay dalam milidetik (default: 500ms)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
