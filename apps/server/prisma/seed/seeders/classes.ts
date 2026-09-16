import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

const CLASSES = [
  { name: "X IPA 1", description: "Kelas X IPA 1", grade: 10, academicYear: "2026/2027" },
  { name: "X IPA 2", description: "Kelas X IPA 2", grade: 10, academicYear: "2026/2027" },
  { name: "XI IPA 1", description: "Kelas XI IPA 1", grade: 11, academicYear: "2026/2027" },
];

export async function seedClasses() {
  await Promise.all(
    CLASSES.map((data) =>
      prisma.schoolClass.upsert({ where: { name: data.name }, update: {}, create: data }),
    ),
  );
  logger.info("✅ School classes seeded");
}