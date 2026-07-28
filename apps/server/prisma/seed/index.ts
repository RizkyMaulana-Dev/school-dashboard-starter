import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { logger } from "../../src/lib/logger";

const prisma = new PrismaClient();

// =========================
// Permissions
// =========================
const PERMISSIONS = [
  "dashboard.read",

  "user.read",
  "user.create",
  "user.update",
  "user.delete",

  "role.read",
  "role.create",
  "role.update",
  "role.delete",

  "permission.read",
  "permission.create",
  "permission.update",
  "permission.delete",

  "class.read",
  "class.create",
  "class.update",
  "class.delete",

  "student.read",
  "student.create",
  "student.update",
  "student.delete",

  "teacher.read",
  "teacher.create",
  "teacher.update",
  "teacher.delete",

  "attendance.read",
  "attendance.create",
  "attendance.update",
  "attendance.delete",
];

// Permission subsets used by non-admin roles
const TEACHER_PERMISSIONS = ["dashboard.read", "class.read", "student.read", "student.update"];

const STUDENT_PERMISSIONS = ["dashboard.read", "student.read"];

const VIEWER_PERMISSIONS = ["dashboard.read"];

async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: permission },
      update: {},
      create: { name: permission },
    });
  }

  logger.info("✅ Permissions seeded");
}

// =========================
// Roles
// =========================
async function seedRoles() {
  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: {
      name: "Super Admin",
      description: "Has full access to the system",
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: "Teacher" },
    update: {},
    create: { name: "Teacher", description: "Teacher role" },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "Student" },
    update: {},
    create: { name: "Student", description: "Student role" },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: "Viewer" },
    update: {},
    create: { name: "Viewer", description: "Read only role" },
  });

  logger.info("✅ Roles seeded");

  return { superAdminRole, teacherRole, studentRole, viewerRole };
}

// =========================
// Connect permissions to roles
// =========================
async function seedRolePermissions(roles: {
  superAdminRole: { id: string };
  teacherRole: { id: string };
  studentRole: { id: string };
  viewerRole: { id: string };
}) {
  const allPermissions = await prisma.permission.findMany();
  const findIds = (names: string[]) =>
    allPermissions
      .filter((permission) => names.includes(permission.name))
      .map((permission) => ({ id: permission.id }));

  await prisma.role.update({
    where: { id: roles.superAdminRole.id },
    data: {
      permissions: {
        set: allPermissions.map((permission) => ({ id: permission.id })),
      },
    },
  });

  await prisma.role.update({
    where: { id: roles.teacherRole.id },
    data: { permissions: { set: findIds(TEACHER_PERMISSIONS) } },
  });

  await prisma.role.update({
    where: { id: roles.studentRole.id },
    data: { permissions: { set: findIds(STUDENT_PERMISSIONS) } },
  });

  await prisma.role.update({
    where: { id: roles.viewerRole.id },
    data: { permissions: { set: findIds(VIEWER_PERMISSIONS) } },
  });

  logger.info("✅ Role permissions assigned");
}

// =========================
// Admin User
// =========================
async function seedAdminUser(superAdminRoleId: string) {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@example.com",
      password,
      roles: { connect: [{ id: superAdminRoleId }] },
    },
  });

  logger.info("✅ Admin user seeded");
}

// =========================
// School Classes
// =========================
async function seedSchoolClasses() {
  const classes = [
    {
      name: "X IPA 1",
      description: "Kelas X IPA 1",
      grade: 10,
      academicYear: "2026/2027",
    },
    {
      name: "X IPA 2",
      description: "Kelas X IPA 2",
      grade: 10,
      academicYear: "2026/2027",
    },
    {
      name: "XI IPA 1",
      description: "Kelas XI IPA 1",
      grade: 11,
      academicYear: "2026/2027",
    },
  ];

  for (const schoolClass of classes) {
    await prisma.schoolClass.upsert({
      where: { name: schoolClass.name },
      update: {},
      create: schoolClass,
    });
  }

  logger.info("✅ School classes seeded");
}

// =========================
// Teacher User
// =========================
async function seedTeacherUser(teacherRoleId: string) {
  const password = await bcrypt.hash("teacher123", 10);

  await prisma.user.upsert({
    where: { email: "teacher@example.com" },
    update: {},
    create: {
      name: "Default Teacher",
      email: "teacher@example.com",
      password,
      roles: { connect: [{ id: teacherRoleId }] },
    },
  });

  logger.info("✅ Teacher user seeded");
}

// =========================
// Student User + Student record
// =========================
async function seedStudentUserAndRecord(studentRoleId: string) {
  const password = await bcrypt.hash("student123", 10);

  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Rizky Maulana",
      email: "student@example.com",
      password,
      roles: { connect: [{ id: studentRoleId }] },
    },
  });

  logger.info("✅ Student user seeded");

  const classXIPA1 = await prisma.schoolClass.findUnique({
    where: { name: "X IPA 1" },
  });

  if (!classXIPA1) {
    logger.error("⚠️  Class 'X IPA 1' not found, skipping student record seed");
    return;
  }

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      name: "Rizky Maulana",
      gender: "MALE",
      birthDate: new Date("2007-08-31"),
      user: { connect: { id: studentUser.id } },
      schoolClass: { connect: { id: classXIPA1.id } },
    },
  });
  logger.info("✅ Student record seeded");
}

// =========================
// Attendance seeder
// =========================

async function seedAttendances() {
  // Ambil data yang diperlukan
  const classXIPA1 = await prisma.schoolClass.findUnique({ where: { name: "X IPA 1" } });
  if (!classXIPA1) {
    logger.error("⚠️  Class 'X IPA 1' not found, skipping attendance seed");
    return;
  }

  const teacherUser = await prisma.user.findUnique({ where: { email: "teacher@example.com" } });
  if (!teacherUser) {
    logger.error("⚠️  Teacher user not found, skipping attendance seed");
    return;
  }

  const teacher = await prisma.teacher.findUnique({ where: { userId: teacherUser.id } });
  if (!teacher) {
    logger.error("⚠️  Teacher record not found, skipping attendance seed");
    return;
  }

  const student = await prisma.student.findFirst({
    where: { user: { email: "student@example.com" } },
  });
  if (!student) {
    logger.error("⚠️  Student record not found, skipping attendance seed");
    return;
  }

  // Ambil waktu sekarang
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Buat sesi absensi
  const session1 = await prisma.attendanceSession.create({
    data: {
      title: "Presensi Pagi - X IPA 1",
      date: today,
      startTime: new Date(new Date(today).setHours(7, 0, 0, 0)),
      endTime: new Date(new Date(today).setHours(8, 0, 0, 0)),
      schoolClassId: classXIPA1.id,
      teacherId: teacher.id,
    },
  });

  const session2 = await prisma.attendanceSession.create({
    data: {
      title: "Presensi Sore - X IPA 1",
      date: yesterday,
      startTime: new Date(new Date(yesterday).setHours(13, 0, 0, 0)),
      endTime: new Date(new Date(yesterday).setHours(14, 0, 0, 0)),
      schoolClassId: classXIPA1.id,
      teacherId: teacher.id,
    },
  });

  // Buat catatan kehadiran untuk student di dua sesi
  await prisma.attendance.createMany({
    data: [
      {
        attendanceSessionId: session1.id,
        studentId: student.id,
        status: "PRESENT",
        recordedAt: new Date(),
      },
      {
        attendanceSessionId: session2.id,
        studentId: student.id,
        status: "LATE",
        notes: "Terlambat 10 menit",
        recordedAt: new Date(),
      },
    ],
  });

  logger.info("✅ Attendance sessions and records seeded");
}

// =========================
// Main
// =========================
async function main() {
  logger.info("🌱 Starting seed...");

  await seedPermissions();

  const roles = await seedRoles();

  await seedRolePermissions(roles);

  await seedAdminUser(roles.superAdminRole.id);

  await seedSchoolClasses();

  await seedTeacherUser(roles.teacherRole.id);

  await seedStudentUserAndRecord(roles.studentRole.id);
  await seedAttendances(); // <-- tambahkan ini

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
