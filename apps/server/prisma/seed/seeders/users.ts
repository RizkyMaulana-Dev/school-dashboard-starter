import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

async function upsertUser(
  email: string,
  name: string,
  plainPassword: string,
  roleId: string,
) {
  const password = await bcrypt.hash(plainPassword, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, password, roles: { connect: [{ id: roleId }] } },
  });
}

export async function seedAdmin(superAdminRoleId: string) {
  await upsertUser("admin@example.com", "Administrator", "admin123", superAdminRoleId);
  logger.info("✅ Admin user seeded");
}

export async function seedTeacher(teacherRoleId: string) {
  const user = await upsertUser(
    "teacher@example.com",
    "Default Teacher",
    "teacher123",
    teacherRoleId,
  );
  await prisma.teacher.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: "Default Teacher",
      gender: "MALE",
      user: { connect: { id: user.id } },
    },
  });
  logger.info("✅ Teacher user + record seeded");
}

export async function seedStudent(studentRoleId: string) {
  const user = await upsertUser(
    "student@example.com",
    "Rizky Maulana",
    "student123",
    studentRoleId,
  );

  const schoolClass = await prisma.schoolClass.findUnique({ where: { name: "X IPA 1" } });
  if (!schoolClass) {
    logger.error("⚠️  Class 'X IPA 1' not found, skipping student record seed");
    return;
  }

  await prisma.student.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: "Rizky Maulana",
      gender: "MALE",
      birthDate: new Date("2007-08-31"),
      user: { connect: { id: user.id } },
      schoolClass: { connect: { id: schoolClass.id } },
    },
  });
  logger.info("✅ Student user + record seeded");
}