import "dotenv/config";
import { logger } from "../../src/lib/logger";
import { prisma } from "./prisma";

import { seedPermissions } from "./seeders/permissions";
import { seedRoles, seedRolePermissions } from "./seeders/roles";
import { seedAdmin, seedTeacher, seedStudent } from "./seeders/users";
import { seedClasses } from "./seeders/classes";
import { seedAttendances } from "./seeders/attendances";
import { seedBooks } from "./seeders/books";
import { seedBookLoans } from "./seeders/bookLoans";
import { seedItems } from "./seeders/items";
import { seedItemLoans } from "./seeders/itemLoans";
import { seedBulkStudents } from "./seeders/bulkStudents";

async function main() {
  logger.info("🌱 Starting seed...");

  // 1. RBAC
  await seedPermissions();
  const roles = await seedRoles();
  await seedRolePermissions(roles);
  const roleId = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  // 2. Master data
  await seedClasses();

  // 3. Users (urutan penting: guru & siswa butuh role + kelas)
  await seedAdmin(roleId["Super Admin"]);
  await seedTeacher(roleId["Teacher"]);
  await seedStudent(roleId["Student"]);

  // 4. Transaksi contoh
  await seedAttendances();
  await seedBooks();
  await seedBookLoans();
  await seedItems();
  await seedItemLoans();

  // 5. Bulk data opsional
  await seedBulkStudents(roleId["Student"], 50);

  logger.info("🎉 Seed completed!");
}

main()
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });