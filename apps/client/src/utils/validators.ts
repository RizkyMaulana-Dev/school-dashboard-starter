/**
 * Validasi email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validasi password strength
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Minimal 8 karakter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Harus mengandung huruf besar");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Harus mengandung huruf kecil");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Harus mengandung angka");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validasi required field
 */
export function isRequired(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

/**
 * Validasi nomor telepon Indonesia
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[0-9]{8,12}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ""));
}

/**
 * Validasi ISBN
 */
export function isValidISBN(isbn: string): boolean {
  const isbnRegex = /^(?:\d{10}|\d{13})$/;
  return isbnRegex.test(isbn.replace(/-/g, ""));
}

/**
 * Form validation helper
 */
export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!isRequired(value)) {
    return `${fieldName} wajib diisi`;
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (!isRequired(value)) {
    return "Email wajib diisi";
  }
  if (!isValidEmail(value)) {
    return "Format email tidak valid";
  }
  return undefined;
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName: string,
): string | undefined {
  if (value.length < min) {
    return `${fieldName} minimal ${min} karakter`;
  }
  return undefined;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string,
): string | undefined {
  if (value.length > max) {
    return `${fieldName} maksimal ${max} karakter`;
  }
  return undefined;
}

export function validateNumber(value: string, fieldName: string): string | undefined {
  if (!isRequired(value)) {
    return `${fieldName} wajib diisi`;
  }
  if (isNaN(Number(value))) {
    return `${fieldName} harus berupa angka`;
  }
  return undefined;
}
