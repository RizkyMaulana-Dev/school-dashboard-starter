import { useAuthStore } from "@/stores/auth.store";
import type { Student } from "@/types/entities";

/**
 * Mengembalikan data siswa yang terhubung dengan user yang sedang login.
 * Mengakses dari relasi user.student (jika ada).
 */
export function useCurrentStudent(): Student | null {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;
  return user.student ?? null; // asumsi field student ada di User (optional)
}
