// ./apps/server/src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET minimal 32 karakter"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn("⚠️ Warning: Environment variables tidak lengkap:", parsed.error.flatten().fieldErrors);
}

// Menggunakan tipe data standar TypeScript record untuk menghindari error Zod utility type
export const env = (parsed.success ? parsed.data : process.env) as {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: "development" | "production" | "test";
};