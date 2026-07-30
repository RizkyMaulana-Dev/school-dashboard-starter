/**
 * Format tanggal ke format yang mudah dibaca
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("id-ID", defaultOptions).format(
    typeof date === "string" ? new Date(date) : date,
  );
}

/**
 * Format tanggal pendek (DD/MM/YYYY)
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Format waktu (HH:MM)
 */
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(typeof date === "string" ? new Date(date) : date);
}

/**
 * Format tanggal dan waktu
 */
export function formatDateTime(date: string | Date): string {
  return `${formatDateShort(date)} ${formatTime(date)}`;
}

/**
 * Format angka ke mata uang Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format nama lengkap (kapitalisasi huruf pertama)
 */
export function formatName(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Format status ke label Bahasa Indonesia
 */
export function formatAttendanceStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PRESENT: "Hadir",
    ABSENT: "Tidak Hadir",
    LATE: "Terlambat",
    EXCUSED: "Izin",
  };
  return statusMap[status] || status;
}

/**
 * Format loan status ke label
 */
export function formatLoanStatus(status: string): string {
  const statusMap: Record<string, string> = {
    DIPINJAM: "Dipinjam",
    DIKEMBALIKAN: "Dikembalikan",
    TERLAMBAT: "Terlambat",
    HILANG: "Hilang",
    RUSAK: "Rusak",
  };
  return statusMap[status] || status;
}

/**
 * Format item condition
 */
export function formatItemCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    BAIK: "Baik",
    RUSAK_RINGAN: "Rusak Ringan",
    RUSAK_BERAT: "Rusak Berat",
  };
  return conditionMap[condition] || condition;
}

/**
 * Format gender
 */
export function formatGender(gender: string): string {
  return gender === "MALE" ? "Laki-laki" : "Perempuan";
}

/**
 * Format nomor telepon
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("62")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
}
