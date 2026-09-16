import { prisma } from "../prisma";
import { logger } from "../../../src/lib/logger";

const CATEGORIES = [
  { name: "Elektronik", description: "Peralatan elektronik" },
  { name: "Mebel", description: "Perabotan dan furnitur" },
  { name: "Alat Kebersihan", description: "Peralatan kebersihan" },
];

const ITEMS = [
  { itemCode: "ELEC-001", name: "Proyektor Epson X400", categoryName: "Elektronik",
    stockTotal: 5, stockAvailable: 5, condition: "BAIK" as const,
    location: "Lab Komputer A", purchaseDate: new Date("2025-01-15") },
  { itemCode: "ELEC-002", name: "Laptop Dell Latitude", categoryName: "Elektronik",
    stockTotal: 10, stockAvailable: 10, condition: "BAIK" as const, location: "Ruang Guru" },
  { itemCode: "MEB-001", name: "Meja Lipat Serbaguna", categoryName: "Mebel",
    stockTotal: 20, stockAvailable: 20, condition: "BAIK" as const, location: "Gudang Utama" },
];

export async function seedItems() {
  await Promise.all(
    CATEGORIES.map((data) =>
      prisma.itemCategory.upsert({ where: { name: data.name }, update: {}, create: data }),
    ),
  );

  const categories = await prisma.itemCategory.findMany();
  const idByName = new Map(categories.map((c) => [c.name, c.id]));

  await Promise.all(
    ITEMS.map(({ categoryName, ...item }) =>
      prisma.item.upsert({
        where: { itemCode: item.itemCode },
        update: {},
        create: { ...item, category: { connect: { id: idByName.get(categoryName)! } } },
      }),
    ),
  );

  logger.info("✅ Item categories + items seeded");
}