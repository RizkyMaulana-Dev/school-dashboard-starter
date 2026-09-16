import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";
import { PERMISSIONS } from "../constants";

export async function seedPermissions() {
  await Promise.all(
    PERMISSIONS.map((name) =>
      prisma.permission.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  logger.info("✅ Permissions seeded");
}