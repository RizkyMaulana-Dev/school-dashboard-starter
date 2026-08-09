import { User, Role, Student } from "@prisma/client";
import { UserResponseDto } from "./user.types.js";

// Buat tipe gabungan untuk menangkap hasil include dari Prisma
type UserWithRelations = User & {
  roles?: Role[];
  student?: any; // Menggunakan any atau mendefinisikan tipe spesifik untuk include student (beserta schoolClass)
};

export function toUserResponse(user: UserWithRelations): UserResponseDto {
  // Mapping eksplisit jauh lebih aman untuk memastikan tidak ada data sensitif
  // yang bocor dan formatnya sesuai 100% dengan UserResponseDto
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    roles: user.roles
      ? user.roles.map((role) => ({
          id: role.id,
          name: role.name,
        }))
      : [],
    student: user.student || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toUsersResponse(users: UserWithRelations[]): UserResponseDto[] {
  return users.map(toUserResponse);
}