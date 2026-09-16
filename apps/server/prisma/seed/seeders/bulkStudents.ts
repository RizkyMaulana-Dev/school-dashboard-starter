import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

const MALE_FIRST = ["Rizky","Budi","Ahmad","Muhammad","Dimas","Bayu","Hendra","Fajar","Aditya","Farhan","Andi","Gilang","Rian","Daffa","Eka"];
const FEMALE_FIRST = ["Siti","Nur","Anisa","Putri","Dewi","Rina","Indah","Maya","Aulia","Sarah","Nabila","Tia","Salsa","Fitri","Lestari"];
const LAST_NAMES = ["Pratama","Saputra","Hidayat","Maulana","Kurniawan","Santoso","Wijaya","Ramadhan","Nugroho","Utomo","Kusuma","Setiawan","Syahputra"];

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const randomBirthDate = (minYear = 2006, maxYear = 2008) => {
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
};

export async function seedBulkStudents(studentRoleId: string, count = 50) {
  logger.info(`⏳ Memulai seeding ${count} data siswa...`);

  const schoolClasses = await prisma.schoolClass.findMany();
  if (schoolClasses.length === 0) {
    logger.error("⚠️ Tidak ada data kelas di DB. Seed data kelas terlebih dahulu!");
    return;
  }

  const hashedPassword = await bcrypt.hash("student123", 10);
  let successCount = 0;

  for (let i = 1; i <= count; i++) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? "MALE" : "FEMALE";
    const firstName = pick(isMale ? MALE_FIRST : FEMALE_FIRST);
    const fullName = `${firstName} ${pick(LAST_NAMES)}`;
    const email = `siswa${i}@sekolah.sch.id`;
    const randomClass = pick(schoolClasses);

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: fullName,
          email,
          password: hashedPassword,
          roles: { connect: [{ id: studentRoleId }] },
        },
      });

      await prisma.student.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          name: fullName,
          gender,
          birthDate: randomBirthDate(),
          user: { connect: { id: user.id } },
          schoolClass: { connect: { id: randomClass.id } },
        },
      });

      successCount++;
    } catch {
      logger.error(`❌ Gagal seed siswa ke-${i} (${email})`);
    }
  }

  logger.info(`✅ Berhasil seed ${successCount} dari ${count} siswa!`);
}