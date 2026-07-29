import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
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

  // 1. Create Categories
  const cycling = await prisma.category.create({ data: { name: 'Cycling' } });
  const fitness = await prisma.category.create({ data: { name: 'Fitness' } });

  // 2. Create Provider/Admin User
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gearup.com',
      name: 'System Administrator',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  // 3. Create Gear Items with Images
  await prisma.gearItem.createMany({
    data: [
      {
        title: 'Professional Resistance Bands',
        description: 'Heavy-duty loop bands for strength training, stretching, and physical therapy.',
        pricePerDay: 8,
        brand: 'Rogue',
        stock: 20,
        isAvailable: true,
        categoryId: fitness.id,
        providerId: admin.id,
        images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=60'],
      },
      {
        title: 'Foldable Exercise Treadmill',
        description: 'Compact motorized treadmill with incline controls and LCD fitness tracking.',
        pricePerDay: 50,
        brand: 'NordicTrack',
        stock: 3,
        isAvailable: true,
        categoryId: fitness.id,
        providerId: admin.id,
        images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1000&auto=format&fit=crop&q=60'],
      },
      {
        title: 'Carbon Fiber Road Bike',
        description: 'High-performance lightweight carbon road bicycle designed for speed and endurance.',
        pricePerDay: 45,
        brand: 'Trek',
        stock: 4,
        isAvailable: true,
        categoryId: cycling.id,
        providerId: admin.id,
        images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1000&auto=format&fit=crop&q=60'],
      },
      {
        title: 'Commuter Electric Bike',
        description: 'Pedal-assist city e-bike with a built-in basket and long-range battery.',
        pricePerDay: 18,
        brand: 'Rad Power',
        stock: 12,
        isAvailable: true,
        categoryId: cycling.id,
        providerId: admin.id,
        images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=60'],
      },
      {
        title: 'Dual Suspension Mountain Bike',
        description: 'Rugged mountain bike built to absorb impact on rough trail descents.',
        pricePerDay: 40,
        brand: 'Specialized',
        stock: 7,
        isAvailable: true,
        categoryId: cycling.id,
        providerId: admin.id,
        images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000&auto=format&fit=crop&q=60'],
      },
    ],
  });

  console.log('Database seeded successfully with gear and images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });