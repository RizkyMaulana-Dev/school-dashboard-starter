import { RoleRepository } from "./role.repository";
import { NotFoundError } from "../../errors";
import { PaginationQuery } from "../../utils/pagination";
import { createPaginationMeta } from "../../utils/pagination/PaginatedResponse";
import { toRoleResponse, toRolesResponse } from "./role.mapper";
import { ROLE_MESSAGES } from "../../constant/messages";

export class RoleService {
  private repository = new RoleRepository();

  async findAll(query: PaginationQuery) {
    const roles = await this.repository.findMany(query);
    const total = await this.repository.count(query.search);
    return {
      data: toRolesResponse(roles),
      meta: createPaginationMeta(query.page, query.limit, total),
    };
  }

  async findById(id: string) {
    const role = await this.repository.findById(id);
    if (!role) throw new NotFoundError(ROLE_MESSAGES.NOT_FOUND);
    return toRoleResponse(role);
  }
}