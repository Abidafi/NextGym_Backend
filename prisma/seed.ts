import 'dotenv/config';
import { PrismaClient }  from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean tables safely using cascading truncations
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "User", "Category", "gearItem", "RentalOrder", "Payment", "Review" CASCADE;`
  );

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Cycling' } }),
    prisma.category.create({ data: { name: 'Camping' } }),
    prisma.category.create({ data: { name: 'Fitness' } }),
    prisma.category.create({ data: { name: 'Water Sports' } }),
  ]);

  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@gearup.com',
      name: 'System Administrator',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });