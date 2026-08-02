import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../utils/pagination";

export class RoleRepository {
  async findMany(query: PaginationQuery) {
    return prisma.role.findMany({
      skip: query.skip,
      take: query.limit,
      where: query.search
        ? {
            OR: [
              { name: { contains: query.search} },
              { description: { contains: query.search} },
            ],
          }
        : undefined,
      orderBy: { [query.sort || "name"]: query.order || "asc" },
    });
  }

  async count(search?: string) {
    return prisma.role.count({
      where: search
        ? {
            OR: [
              { name: { contains: search} },
              { description: { contains: search} },
            ],
          }
        : undefined,
    });
  }

  async findById(id: string) {
    return prisma.role.findUnique({
      where: { id },
    });
  }
}
