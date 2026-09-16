import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

const CATEGORIES = [
  { name: "Fiksi", description: "Buku-buku fiksi dan novel" },
  { name: "Teknologi", description: "Buku seputar teknologi dan komputer" },
  { name: "Sejarah", description: "Buku sejarah dan peradaban" },
  { name: "Pelajaran", description: "Buku pelajaran sekolah" },
];

const BOOKS = [
  { isbn: "978-602-033-295-7", title: "Laskar Pelangi", author: "Andrea Hirata",
    publisher: "Bentang Pustaka", publishedYear: 2005, stockTotal: 5, stockAvailable: 5,
    shelfLocation: "Rak A-01", categoryName: "Fiksi" },
  { isbn: "978-979-306-279-2", title: "Bumi Manusia", author: "Pramoedya Ananta Toer",
    publisher: "Hasta Mitra", publishedYear: 1980, stockTotal: 3, stockAvailable: 3,
    shelfLocation: "Rak A-02", categoryName: "Fiksi" },
  { isbn: "978-602-291-490-7", title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin", publisher: "Prentice Hall", publishedYear: 2008,
    stockTotal: 2, stockAvailable: 2, shelfLocation: "Rak B-01", categoryName: "Teknologi" },
  { isbn: "978-149-195-035-7", title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann", publisher: "O'Reilly Media", publishedYear: 2017,
    stockTotal: 2, stockAvailable: 2, shelfLocation: "Rak B-02", categoryName: "Teknologi" },
  { isbn: "978-979-229-884-0", title: "Sejarah Nasional Indonesia Jilid 1",
    author: "Marwati Djoened Poesponegoro", publisher: "Balai Pustaka", publishedYear: 2008,
    stockTotal: 4, stockAvailable: 4, shelfLocation: "Rak C-01", categoryName: "Sejarah" },
  { isbn: "978-602-434-194-2", title: "Matematika SMA Kelas X", author: "Kemendikbud",
    publisher: "Pusat Kurikulum dan Perbukuan", publishedYear: 2020,
    stockTotal: 10, stockAvailable: 10, shelfLocation: "Rak D-01", categoryName: "Pelajaran" },
];

export async function seedBooks() {
  await Promise.all(
    CATEGORIES.map((data) =>
      prisma.bookCategory.upsert({ where: { name: data.name }, update: {}, create: data }),
    ),
  );

  const categories = await prisma.bookCategory.findMany();
  const idByName = new Map(categories.map((c) => [c.name, c.id]));

  await Promise.all(
    BOOKS.map(({ categoryName, ...book }) =>
      prisma.book.upsert({
        where: { isbn: book.isbn },
        update: {},
        create: { ...book, category: { connect: { id: idByName.get(categoryName)! } } },
      }),
    ),
  );

  logger.info("✅ Book categories + books seeded");
}