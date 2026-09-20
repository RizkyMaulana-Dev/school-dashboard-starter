import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const getPrisma = () => {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
};

export const prisma = getPrisma();