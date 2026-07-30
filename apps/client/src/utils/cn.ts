/**
 * Utility untuk menggabungkan className dengan kondisional
 * Mirip dengan clsx atau classnames library
 */
type ClassValue = string | undefined | null | false | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    if (typeof cls === "string") {
      result.push(cls);
    } else if (Array.isArray(cls)) {
      result.push(cn(...cls));
    }
  }

  return result.filter(Boolean).join(" ");
}
