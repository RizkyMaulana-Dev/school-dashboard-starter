import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

export async function seedAttendances() {
  const [schoolClass, student] = await Promise.all([
    prisma.schoolClass.findUnique({ where: { name: "X IPA 1" } }),
    prisma.student.findFirst({ where: { user: { email: "student@example.com" } } }),
  ]);

  if (!schoolClass || !student) {
    logger.error("⚠️  Prerequisites missing, skipping attendance seed");
    return;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const at = (d: Date, hour: number) => new Date(new Date(d).setHours(hour, 0, 0, 0));

  const [sessionToday, sessionYesterday] = await Promise.all([
    prisma.attendanceSession.create({
      data: {
        title: "Presensi Pagi - X IPA 1",
        date: today,
        startTime: at(today, 7),
        endTime: at(today, 8),
        schoolClassId: schoolClass.id,
      },
    }),
    prisma.attendanceSession.create({
      data: {
        title: "Presensi Sore - X IPA 1",
        date: yesterday,
        startTime: at(yesterday, 13),
        endTime: at(yesterday, 14),
        schoolClassId: schoolClass.id,
      },
    }),
  ]);

  await prisma.attendance.createMany({
    data: [
      {
        attendanceSessionId: sessionToday.id,
        studentId: student.id,
        status: "PRESENT",
        recordedAt: new Date(),
      },
      {
        attendanceSessionId: sessionYesterday.id,
        studentId: student.id,
        status: "LATE",
        notes: "Terlambat 10 menit",
        recordedAt: new Date(),
      },
    ],
  });

  logger.info("✅ Attendance sessions and records seeded");
}