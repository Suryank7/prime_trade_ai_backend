import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log(`Admin user created: ${adminUser.email}`);
  } else {
    console.log('Admin user already exists.');
  }

  // Optional: Add a normal user for testing
  const userEmail = 'user@example.com';
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('User@123', 10);
    const regularUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: userEmail,
        password: hashedPassword,
        role: 'USER'
      }
    });
    console.log(`Test user created: ${regularUser.email}`);
  }
}

main()
  .catch((e) => {
    console.error('Error in seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
