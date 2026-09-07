// ./apps/server/src/modules/auth/auth.repository.ts
import { prisma } from "../../lib/prisma.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByEmailWithRoles(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: true,
      },
    });
  }

  // Method murni untuk register User baru dari Google OAuth
  async createFromGoogle(data: { email: string; name?: string }) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name || "Google User",
        password: "", // Kosong karena login via Google OAuth
        isActive: true,
      },
      include: {
        roles: true,
      },
    });
  }

  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}