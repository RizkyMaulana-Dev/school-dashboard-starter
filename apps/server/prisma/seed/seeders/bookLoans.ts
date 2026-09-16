// ./apps/server/prisma/seed/seeders/bookLoans.ts
import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

type BookLoanSeed = {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "DIPINJAM" | "DIKEMBALIKAN" | "TERLAMBAT";
  fineAmount?: number;
  notes?: string;
  decrementStock: boolean;
};

export async function seedBookLoans() {
  const [student, admin] = await Promise.all([
    prisma.user.findUnique({ where: { email: "student@example.com" } }),
    prisma.user.findUnique({ where: { email: "admin@example.com" } }),
  ]);
  if (!student || !admin) {
    logger.error("⚠️  Users not found, skipping book loan seed");
    return;
  }

  const [laskarPelangi, cleanCode, matematika] = await Promise.all([
    prisma.book.findUnique({ where: { isbn: "978-602-033-295-7" } }),
    prisma.book.findUnique({ where: { isbn: "978-602-291-490-7" } }),
    prisma.book.findUnique({ where: { isbn: "978-602-434-194-2" } }),
  ]);
  if (!laskarPelangi || !cleanCode || !matematika) {
    logger.error("⚠️  Books not found, skipping book loan seed");
    return;
  }

  const loans: BookLoanSeed[] = [
    {
      id: "loan-seed-1",
      bookId: laskarPelangi.id,
      userId: student.id,
      borrowDate: daysFromNow(-5),
      dueDate: daysFromNow(1),
      status: "DIPINJAM",
      notes: "Pinjam untuk tugas membaca",
      decrementStock: true,
    },
    {
      id: "loan-seed-2",
      bookId: cleanCode.id,
      userId: admin.id,
      borrowDate: daysFromNow(-10),
      dueDate: daysFromNow(-5),
      returnDate: daysFromNow(-5),
      status: "DIKEMBALIKAN",
      notes: "Selesai membaca",
      decrementStock: false,
    },
    {
      id: "loan-seed-3",
      bookId: matematika.id,
      userId: student.id,
      borrowDate: daysFromNow(-10),
      dueDate: daysFromNow(-5),
      status: "TERLAMBAT",
      fineAmount: 5000,
      notes: "Terlambat mengembalikan, denda diterapkan",
      decrementStock: true,
    },
  ];

  for (const { id, decrementStock, ...data } of loans) {
    const existing = await prisma.bookLoan.findUnique({ where: { id } });
    if (existing) continue;

    await prisma.bookLoan.create({ data: { id, ...data } });
    if (decrementStock) {
      await prisma.book.update({
        where: { id: data.bookId },
        data: { stockAvailable: { decrement: 1 } },
      });
    }
  }

  logger.info("✅ Book loans seeded");
}