// ./apps/server/src/lib/prisma.ts
import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL ?? "";

  // Cek apakah URL menggunakan protokol Prisma Accelerate
  const isAccelerateEnabled =
    dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+postgres://");

  const baseClient = new PrismaClient({
    datasourceUrl: dbUrl,
  });

  // Hanya aktifkan Accelerate jika URL mendukung
  if (isAccelerateEnabled) {
    return baseClient.$extends(withAccelerate());
  }

  return baseClient;
};

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

export const asyncLocalStorage = new AsyncLocalStorage();

export const prisma: ExtendedPrismaClient = new Proxy({} as ExtendedPrismaClient, {
  get(_target, prop) {
    const client = asyncLocalStorage.getStore() ?? createPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
