import { PrismaClient } from '@prisma/client';
import { sendDailyReminder } from '../src/services/email.service';

const prisma = new PrismaClient();

async function testReminder() {
    console.log('[TEST] Checking for users who haven\'t solved today\'s bug...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challenge = await prisma.dailyChallenge.findFirst({ where: { date: today } });
    if (!challenge) {
        console.log('[TEST] No challenge found for today.');
        return;
    }

    const users = await prisma.user.findMany({
        where: {
            attempts: {
                none: {
                    challengeId: challenge.id,
                    solved: true
                }
            }
        }
    });

    console.log(`[TEST] Found ${users.length} users who haven't solved today's bug.`);
    for (const user of users) {
        console.log(`[TEST] Sending reminder to ${user.username} (${user.email})`);
        await sendDailyReminder(user.email, user.username || 'Debugger');
    }
}

testReminder()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
