import { Student } from "@prisma/client";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleIds: string[];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UserQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;

  roles: {
    id: string;
    name: string;
  }[];
  student?: Student | null;
  createdAt: Date;
  updatedAt: Date;
}
