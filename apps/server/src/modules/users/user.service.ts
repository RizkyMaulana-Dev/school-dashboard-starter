import bcrypt from "bcryptjs";

import { UserRepository } from "./user.repository.js";
import { CreateUserDto, UpdateUserDto } from "./user.types.js";

import { NotFoundError } from "../../errors/NotFoundError.js";
import { ConflictError } from "../../errors/ConflictError.js";
import { PaginationQuery } from "../../utils/pagination/index.js";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse.js";
import { USER_MESSAGES } from "../../constant/messages.js";
import { toUserResponse, toUsersResponse } from "./user.mapper.js";

export class UserService {
  private repository = new UserRepository();

  /**
   * Get all users
   */
  async findAll(query: PaginationQuery) {
    const users = await this.repository.findMany(query);

    const total = await this.repository.count(query.search);

    return {
      data: toUsersResponse(users),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }
  /**
   * Get user by id
   */
  async findById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }

    return toUserResponse(user);
  }

  /**
   * Create new user
   */
  async create(data: CreateUserDto) {
    const existing = await this.repository.findByEmail(data.email);

    if (existing) {
      throw new ConflictError(USER_MESSAGES.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.repository.create({
      ...data,
      password: hashedPassword,
    });

    return toUserResponse(user);
  }
  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDto) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }

    if (data.email) {
      const existing = await this.repository.findByEmailExceptId(data.email, id);

      if (existing) {
        throw new ConflictError(USER_MESSAGES.EMAIL_EXISTS);
      }
    }

    let updateData = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.repository.update(id, updateData);

    return toUserResponse(updatedUser);
  }

  /**
   * Delete user
   */
  async delete(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new ConflictError(USER_MESSAGES.SELF_DELETE);
    }

    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.NOT_FOUND);
    }

    await this.repository.delete(id);

    return {
      message: "User deleted successfully",
    };
  }
}
