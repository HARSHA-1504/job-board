import { useEffect, useState } from "react";

export function useNexoraStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Browser storage is optional; the active session remains usable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
