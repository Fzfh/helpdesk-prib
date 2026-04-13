import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'admin-default',
      username: 'admin',
      email: 'admin@helpdesk.com',
      passwordHash: adminPassword,
      isActive: true,
    },
  });
  
  console.log('✅ Admin default berhasil dibuat!');
  console.log('📌 Username: admin');
  console.log('📌 Password: admin123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });