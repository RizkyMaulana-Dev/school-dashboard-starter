// ./apps/server/src/modules/auth/auth.repository.ts
import { prisma } from "../../lib/prisma.js";
import { Gender } from "@prisma/client"; // Sesuaikan enum Gender Prisma kamu

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

  // Method untuk auto-register User sekaligus profil Student & Role "Student"
  async createFromGoogle(data: { email: string; name?: string }) {
    return prisma.$transaction(async (tx) => {
      // 1. Cari/hubungkan role "Student" (atau buat jika belum ada)
      let studentRole = await tx.role.findUnique({
        where: { name: "Student" },
      });

      if (!studentRole) {
        studentRole = await tx.role.create({
          data: {
            name: "Student",
            description: "Role default untuk siswa",
          },
        });
      }

      // 2. Ambil kelas pertama di DB sebagai default schoolClassId
      let defaultClass = await tx.schoolClass.findFirst();

      if (!defaultClass) {
        // Jika belum ada kelas di DB, buatkan 1 kelas default sementara
        defaultClass = await tx.schoolClass.create({
          data: {
            name: "Kelas Default 10A",
            grade: 10,
            academicYear: "2025/2026",
            isActive: true,
          },
        });
      }

      // 3. Buat User sekaligus record Student-nya
      return tx.user.create({
        data: {
          email: data.email,
          name: data.name || "Google User",
          password: "", // Kosong karena via Google OAuth
          isActive: true,
          roles: {
            connect: [{ id: studentRole.id }],
          },
          student: {
            create: {
              name: data.name || "Google User",
              gender: Gender.MALE, // Default gender (atau sesuaikan dengan kebutuhan)
              schoolClassId: defaultClass.id,
            },
          },
        },
        include: {
          roles: true,
        },
      });
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