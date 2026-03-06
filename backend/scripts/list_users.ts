import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listUsers() {
    const users = await prisma.user.findMany();
    console.log('Registered Users:');
    users.forEach(u => console.log(`- ${u.username} (${u.email})`));
}

listUsers()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
