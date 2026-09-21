import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const createPrismaClient = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
};

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

export const asyncLocalStorage = new AsyncLocalStorage<ExtendedPrismaClient>();

export const prisma: ExtendedPrismaClient = new Proxy({} as ExtendedPrismaClient, {
  get(_target, prop) {
    const client = asyncLocalStorage.getStore() ?? createPrismaClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});