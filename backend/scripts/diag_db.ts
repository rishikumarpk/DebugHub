import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const c = await prisma.dailyChallenge.findFirst({
        where: { date: today }
    });
    console.log('Today\'s Challenge:');
    console.log(JSON.stringify(c, null, 2));

    const user = await prisma.user.findFirst({ where: { email: 'demo@example.com' } });
    if (user && c) {
        const attempt = await prisma.challengeAttempt.findFirst({
            where: {
                challengeId: c.id,
                userId: user.id,
                solved: true
            }
        });
        console.log('User solved status for today:', !!attempt);
        if (attempt) {
            console.log('Attempt details:', JSON.stringify(attempt, null, 2));
        }
    }

    // Check if any other challenges exist for today (should be impossible due to unique constraint)
    const allToday = await prisma.dailyChallenge.findMany({
        where: { date: today }
    });
    console.log('Total challenges for today count:', allToday.length);
}

check().catch(console.error).finally(() => prisma.$disconnect());
