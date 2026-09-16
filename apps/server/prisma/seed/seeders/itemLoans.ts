import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

export async function seedItemLoans() {
  const [student, teacher, proyektor, laptop] = await Promise.all([
    prisma.user.findUnique({ where: { email: "student@example.com" } }),
    prisma.user.findUnique({ where: { email: "teacher@example.com" } }),
    prisma.item.findUnique({ where: { itemCode: "ELEC-001" } }),
    prisma.item.findUnique({ where: { itemCode: "ELEC-002" } }),
  ]);
  if (!student || !teacher || !proyektor || !laptop) {
    logger.error("⚠️  Required data not found, skipping item loan seed");
    return;
  }

  const loans = [
    {
      id: "item-loan-seed-1", itemId: proyektor.id, userId: student.id,
      quantity: 1, borrowDate: daysFromNow(-5), dueDate: daysFromNow(5),
      status: "DIPINJAM", notes: "Untuk presentasi tugas",
      decrementStock: true,
    },
    {
      id: "item-loan-seed-2", itemId: laptop.id, userId: teacher.id,
      quantity: 2, borrowDate: daysFromNow(-5), dueDate: daysFromNow(-5),
      returnDate: daysFromNow(-5), status: "DIKEMBALIKAN", notes: "Untuk workshop",
      decrementStock: false,
    },
  ];

  for (const { id, decrementStock, ...data } of loans) {
    const existing = await prisma.itemLoan.findUnique({ where: { id } });
    if (existing) continue;

    await prisma.itemLoan.create({ data: { id, ...data } });
    if (decrementStock) {
      await prisma.item.update({
        where: { id: data.itemId },
        data: { stockAvailable: { decrement: data.quantity } },
      });
    }
  }

  logger.info("✅ Item loans seeded");
}