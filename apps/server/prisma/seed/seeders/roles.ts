import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";
import { ROLE_PERMISSION_MAP } from "../constants";

const ROLES = [
  { name: "Super Admin", description: "Has full access to the system" },
  { name: "Teacher", description: "Teacher role" },
  { name: "Student", description: "Student role" },
  { name: "Viewer", description: "Read only role" },
  { name: "Staff", description: "Verificator daily transaction" },
];

export async function seedRoles() {
  const roles = await Promise.all(
    ROLES.map((data) =>
      prisma.role.upsert({ where: { name: data.name }, update: {}, create: data }),
    ),
  );
  logger.info("✅ Roles seeded");
  return roles;
}

export async function seedRolePermissions(roles: { id: string; name: string }[]) {
  const allPermissions = await prisma.permission.findMany();
  const idByName = new Map(allPermissions.map((p) => [p.name, p.id]));

  const idsFor = (names: string[]) =>
    names.map((n) => ({ id: idByName.get(n)! })).filter((p) => p.id);

  await Promise.all(
    roles.map((role) => {
      const permissions =
        role.name === "Super Admin"
          ? allPermissions.map((p) => ({ id: p.id }))
          : idsFor(ROLE_PERMISSION_MAP[role.name] ?? []);

      return prisma.role.update({
        where: { id: role.id },
        data: { permissions: { set: permissions } },
      });
    }),
  );
  logger.info("✅ Role permissions assigned");
}