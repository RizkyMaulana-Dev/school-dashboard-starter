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

  "attendance-session.read",
  "attendance-session.create",
  "attendance-session.update",
  "attendance-session.delete",

  "book.read",
  "book.create",
  "book.update",
  "book.delete",

  "book-loan.read",
  "book-loan.create",
  "book-loan.update",
  "book-loan.delete",

  "item.read",
  "item.create",
  "item.update",
  "item.delete",

  "item.read",
  "item.create",
  "item.update",
  "item.delete",

  "item-loan.read",
  "item-loan.create",
  "item-loan.update",
  "item-loan.delete",
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
// Teacher User + Teacher record
// =========================
async function seedTeacherUser(teacherRoleId: string) {
  const password = await bcrypt.hash("teacher123", 10);

  // 1. Buat User Guru
  const teacherUser = await prisma.user.upsert({
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

  // 2. Buat Record Guru di tabel Teacher (PENTING!)
  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      name: "Default Teacher",
      gender: "MALE", // Adjust sesuai skema Prisma kamu jika ada (opsional)
      user: { connect: { id: teacherUser.id } },
    },
  });

  logger.info("✅ Teacher record seeded");
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
// Book Categories
// =========================
async function seedBookCategories() {
  const categories = [
    { name: "Fiksi", description: "Buku-buku fiksi dan novel" },
    { name: "Teknologi", description: "Buku seputar teknologi dan komputer" },
    { name: "Sejarah", description: "Buku sejarah dan peradaban" },
    { name: "Pelajaran", description: "Buku pelajaran sekolah" },
  ];

  for (const cat of categories) {
    await prisma.bookCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  logger.info("✅ Book categories seeded");
}

// =========================
// Books
// =========================
async function seedBooks() {
  // Ambil kategori yang sudah ada
  const fiksi = await prisma.bookCategory.findUnique({ where: { name: "Fiksi" } });
  const teknologi = await prisma.bookCategory.findUnique({ where: { name: "Teknologi" } });
  const sejarah = await prisma.bookCategory.findUnique({ where: { name: "Sejarah" } });
  const pelajaran = await prisma.bookCategory.findUnique({ where: { name: "Pelajaran" } });

  if (!fiksi || !teknologi || !sejarah || !pelajaran) {
    logger.error("⚠️  Book categories not found, skipping book seed");
    return;
  }

  const books = [
    {
      isbn: "978-602-033-295-7",
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      publisher: "Bentang Pustaka",
      publishedYear: 2005,
      stockTotal: 5,
      stockAvailable: 5,
      shelfLocation: "Rak A-01",
      categoryId: fiksi.id,
    },
    {
      isbn: "978-979-306-279-2",
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      publisher: "Hasta Mitra",
      publishedYear: 1980,
      stockTotal: 3,
      stockAvailable: 3,
      shelfLocation: "Rak A-02",
      categoryId: fiksi.id,
    },
    {
      isbn: "978-602-291-490-7",
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      publisher: "Prentice Hall",
      publishedYear: 2008,
      stockTotal: 2,
      stockAvailable: 2,
      shelfLocation: "Rak B-01",
      categoryId: teknologi.id,
    },
    {
      isbn: "978-149-195-035-7",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      publisher: "O'Reilly Media",
      publishedYear: 2017,
      stockTotal: 2,
      stockAvailable: 2,
      shelfLocation: "Rak B-02",
      categoryId: teknologi.id,
    },
    {
      isbn: "978-979-229-884-0",
      title: "Sejarah Nasional Indonesia Jilid 1",
      author: "Marwati Djoened Poesponegoro",
      publisher: "Balai Pustaka",
      publishedYear: 2008,
      stockTotal: 4,
      stockAvailable: 4,
      shelfLocation: "Rak C-01",
      categoryId: sejarah.id,
    },
    {
      isbn: "978-602-434-194-2",
      title: "Matematika SMA Kelas X",
      author: "Kemendikbud",
      publisher: "Pusat Kurikulum dan Perbukuan",
      publishedYear: 2020,
      stockTotal: 10,
      stockAvailable: 10,
      shelfLocation: "Rak D-01",
      categoryId: pelajaran.id,
    },
  ];

  for (const book of books) {
    const { categoryId, ...bookData } = book;
    await prisma.book.upsert({
      where: { isbn: book.isbn ?? undefined }, // beberapa ISBN mungkin null, lebih aman pakai isbn unik
      update: {},
      create: {
        ...bookData,
        category: { connect: { id: categoryId } },
      },
    });
  }

  logger.info("✅ Books seeded");
}

// =========================
// Book Loans
// =========================
async function seedBookLoans() {
  // Ambil user yang sudah ada (student & admin)
  const studentUser = await prisma.user.findUnique({ where: { email: "student@example.com" } });
  const adminUser = await prisma.user.findUnique({ where: { email: "admin@example.com" } });

  if (!studentUser || !adminUser) {
    logger.error("⚠️  Users not found, skipping book loan seed");
    return;
  }

  // Ambil buku yang sudah di-seed
  const laskarPelangi = await prisma.book.findUnique({ where: { isbn: "978-602-033-295-7" } });
  const cleanCode = await prisma.book.findUnique({ where: { isbn: "978-602-291-490-7" } });
  const matematika = await prisma.book.findUnique({ where: { isbn: "978-602-434-194-2" } });

  if (!laskarPelangi || !cleanCode || !matematika) {
    logger.error("⚠️  Books not found, skipping book loan seed");
    return;
  }

  // Tanggal bantu
  const now = new Date();
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(now.getDate() - 10);
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 5);
  const futureDue = new Date(now);
  futureDue.setDate(now.getDate() + 7);

  // Peminjaman 1: Laskar Pelangi oleh student, status DIPINJAM, due date besok
  await prisma.bookLoan.upsert({
    where: { id: "loan-seed-1" }, // kita tentukan ID custom untuk menghindari duplikasi
    update: {},
    create: {
      id: "loan-seed-1",
      bookId: laskarPelangi.id,
      userId: studentUser.id,
      borrowDate: fiveDaysAgo,
      dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // besok
      status: "DIPINJAM",
      notes: "Pinjam untuk tugas membaca",
    },
  });

  // Kurangi stok buku yang dipinjam (karena kita langsung insert, kita harus update stok manual di seeder)
  await prisma.book.update({
    where: { id: laskarPelangi.id },
    data: { stockAvailable: { decrement: 1 } },
  });

  // Peminjaman 2: Clean Code oleh admin, sudah dikembalikan
  await prisma.bookLoan.upsert({
    where: { id: "loan-seed-2" },
    update: {},
    create: {
      id: "loan-seed-2",
      bookId: cleanCode.id,
      userId: adminUser.id,
      borrowDate: tenDaysAgo,
      dueDate: fiveDaysAgo,
      returnDate: fiveDaysAgo,
      status: "DIKEMBALIKAN",
      notes: "Selesai membaca",
    },
  });
  // Tidak perlu kurangi stok karena sudah dikembalikan, stok akan diadjust manual?
  // Karena dikembalikan, kita biarkan stok tetap (tidak dikurangi)
  // Tetapi dalam logika normal, saat peminjaman stok berkurang, saat pengembalian bertambah.
  // Untuk seeder kita bisa biarkan konsisten manual: stok Clean Code kita tetapkan tidak berubah dari awal.
  // Karena awalnya stok 2, kita tidak kurangi karena sudah dikembalikan.

  // Peminjaman 3: Matematika oleh student, status TERLAMBAT
  await prisma.bookLoan.upsert({
    where: { id: "loan-seed-3" },
    update: {},
    create: {
      id: "loan-seed-3",
      bookId: matematika.id,
      userId: studentUser.id,
      borrowDate: tenDaysAgo,
      dueDate: fiveDaysAgo,
      returnDate: null,
      status: "TERLAMBAT",
      fineAmount: 5000, // misal denda
      notes: "Terlambat mengembalikan, denda diterapkan",
    },
  });
  // Untuk yang ini, stok Matematika harus dikurangi karena masih dipinjam (TERLAMBAT = masih di luar).
  await prisma.book.update({
    where: { id: matematika.id },
    data: { stockAvailable: { decrement: 1 } },
  });

  logger.info("✅ Book loans seeded");
}

// =========================
// Item Categories
// =========================
async function seedItemCategories() {
  const categories = [
    { name: "Elektronik", description: "Peralatan elektronik" },
    { name: "Mebel", description: "Perabotan dan furnitur" },
    { name: "Alat Kebersihan", description: "Peralatan kebersihan" },
  ];

  for (const cat of categories) {
    await prisma.itemCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  logger.info("✅ Item categories seeded");
}

// =========================
// Items (Master Barang)
// =========================
async function seedItems() {
  const elektronik = await prisma.itemCategory.findUnique({ where: { name: "Elektronik" } });
  const mebel = await prisma.itemCategory.findUnique({ where: { name: "Mebel" } });

  if (!elektronik || !mebel) {
    logger.error("⚠️  Item categories not found, skipping item seed");
    return;
  }

  const items = [
    {
      itemCode: "ELEC-001",
      name: "Proyektor Epson X400",
      categoryId: elektronik.id,
      stockTotal: 5,
      stockAvailable: 5,
      condition: "BAIK" as const,
      location: "Lab Komputer A",
      purchaseDate: new Date("2025-01-15"),
    },
    {
      itemCode: "ELEC-002",
      name: "Laptop Dell Latitude",
      categoryId: elektronik.id,
      stockTotal: 10,
      stockAvailable: 10,
      condition: "BAIK" as const,
      location: "Ruang Guru",
    },
    {
      itemCode: "MEB-001",
      name: "Meja Lipat Serbaguna",
      categoryId: mebel.id,
      stockTotal: 20,
      stockAvailable: 20,
      condition: "BAIK" as const,
      location: "Gudang Utama",
    },
  ];

  for (const item of items) {
    const { categoryId, ...rest } = item;
    await prisma.item.upsert({
      where: { itemCode: item.itemCode },
      update: {},
      create: {
        ...rest,
        category: { connect: { id: categoryId } },
      },
    });
  }
  logger.info("✅ Items seeded");
}

// =========================
// Item Loans (Peminjaman Barang)
// =========================
async function seedItemLoans() {
  const studentUser = await prisma.user.findUnique({ where: { email: "student@example.com" } });
  const teacherUser = await prisma.user.findUnique({ where: { email: "teacher@example.com" } });
  const proyektor = await prisma.item.findUnique({ where: { itemCode: "ELEC-001" } });
  const laptop = await prisma.item.findUnique({ where: { itemCode: "ELEC-002" } });

  if (!studentUser || !teacherUser || !proyektor || !laptop) {
    logger.error("⚠️  Required data not found, skipping item loan seed");
    return;
  }

  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 5);
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + 5);

  // Peminjaman 1: Proyektor oleh Student, status DIPINJAM
  await prisma.itemLoan.upsert({
    where: { id: "item-loan-seed-1" },
    update: {},
    create: {
      id: "item-loan-seed-1",
      itemId: proyektor.id,
      userId: studentUser.id,
      quantity: 1,
      borrowDate: pastDate,
      dueDate: futureDate,
      status: "DIPINJAM",
      notes: "Untuk presentasi tugas",
    },
  });

  // Update stok barang yang dipinjam
  await prisma.item.update({
    where: { id: proyektor.id },
    data: { stockAvailable: { decrement: 1 } },
  });

  // Peminjaman 2: Laptop oleh Teacher, sudah dikembalikan
  await prisma.itemLoan.upsert({
    where: { id: "item-loan-seed-2" },
    update: {},
    create: {
      id: "item-loan-seed-2",
      itemId: laptop.id,
      userId: teacherUser.id,
      quantity: 2,
      borrowDate: pastDate,
      dueDate: pastDate,
      returnDate: pastDate,
      status: "DIKEMBALIKAN",
      notes: "Untuk workshop",
    },
  });
  // Stok laptop tidak perlu diadjust karena sudah dikembalikan (tetap 10)

  logger.info("✅ Item loans seeded");
}

// Helper untuk ambil item acak dari array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper untuk generate tanggal lahir acak (range umur SMA/SMK)
function getRandomBirthDate(startYear = 2006, endYear = 2008): Date {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear + 1));
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

export async function seedBulkStudents(studentRoleId: string, count = 50) {
  logger.info(`⏳ Memulai seeding ${count} data siswa...`);

  // 1. Ambil semua kelas yang ada di database
  const schoolClasses = await prisma.schoolClass.findMany();

  if (schoolClasses.length === 0) {
    logger.error("⚠️ Tidak ada data kelas di DB. Harap seed data kelas terlebih dahulu!");
    return;
  }

  // 2. Hash password CUKUP 1 KALI saja di awal agar seeding cepat!
  const hashedPassword = await bcrypt.hash("student123", 10);

  // 3. Pool nama Indonesia untuk variasi dummy data
  const firstNamesMale = [
    "Rizky",
    "Budi",
    "Ahmad",
    "Muhammad",
    "Dimas",
    "Bayu",
    "Hendra",
    "Fajar",
    "Aditya",
    "Farhan",
    "Andi",
    "Gilang",
    "Rian",
    "Daffa",
    "Eka",
  ];
  const firstNamesFemale = [
    "Siti",
    "Nur",
    "Anisa",
    "Putri",
    "Dewi",
    "Rina",
    "Indah",
    "Maya",
    "Aulia",
    "Sarah",
    "Nabila",
    "Tia",
    "Salsa",
    "Fitri",
    "Lestari",
  ];
  const lastNames = [
    "Pratama",
    "Saputra",
    "Hidayat",
    "Maulana",
    "Kurniawan",
    "Santoso",
    "Wijaya",
    "Ramadhan",
    "Nugroho",
    "Utomo",
    "Kusuma",
    "Setiawan",
    "Syahputra",
  ];

  let successCount = 0;

  // 4. Loop pembuatan data
  for (let i = 1; i <= count; i++) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? "MALE" : "FEMALE";
    const firstName = isMale ? getRandomItem(firstNamesMale) : getRandomItem(firstNamesFemale);
    const lastName = getRandomItem(lastNames);
    const fullName = `${firstName} ${lastName}`;

    // Email unik menggunakan nomor urut iterasi
    const email = `siswa${i}@sekolah.sch.id`;

    // Pilih kelas acak dari daftar kelas yang tersedia
    const randomClass = getRandomItem(schoolClasses);
    const birthDate = getRandomBirthDate(2006, 2008);

    try {
      // Upsert User
      const studentUser = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: fullName,
          email,
          password: hashedPassword,
          roles: { connect: [{ id: studentRoleId }] },
        },
      });

      // Upsert Student Record
      await prisma.student.upsert({
        where: { userId: studentUser.id },
        update: {},
        create: {
          name: fullName,
          gender,
          birthDate,
          user: { connect: { id: studentUser.id } },
          schoolClass: { connect: { id: randomClass.id } },
        },
      });

      successCount++;
    } catch (error) {
      logger.error(`❌ Gagal seed siswa ke-${i} (${email}):`);
    }
  }

  logger.info(`✅ Berhasil melakukan seed ${successCount} dari ${count} siswa!`);
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
  await seedAttendances();

  await seedItemCategories();
  await seedItems();
  await seedItemLoans();

  await seedBookCategories();
  await seedBooks();
  await seedBookLoans();

  await seedBulkStudents(roles.studentRole.id, 50);

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
