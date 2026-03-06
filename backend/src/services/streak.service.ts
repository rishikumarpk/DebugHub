import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function getUTCDate(date: Date = new Date()) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export async function updateStreakOnSolve(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { streak: true } });
    if (!user || !user.streak) throw new Error("User or streak missing");

    const streak = user.streak;
    const today = getUTCDate();

    const lastSolved = streak.lastSolvedDate ? getUTCDate(new Date(streak.lastSolvedDate)) : null;

    // Already solved today? Just return current streak
    if (lastSolved && lastSolved.getTime() === today.getTime()) return streak;

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    let newStreak = 1;
    // If last solve was yesterday, increment
    if (lastSolved && lastSolved.getTime() === yesterday.getTime()) {
        newStreak = streak.currentStreak + 1;
    }

    const newRhythm = Math.min(100, streak.rhythmScore + 15);

    return prisma.debugStreak.update({
        where: { userId },
        data: {
            currentStreak: newStreak,
            longestStreak: Math.max(streak.longestStreak, newStreak),
            rhythmScore: newRhythm,
            lastSolvedDate: today,
        }
    });
}

export async function getValidStreak(userId: string) {
    const streak = await prisma.debugStreak.findUnique({ where: { userId } });
    if (!streak || !streak.lastSolvedDate) return streak;

    const today = getUTCDate();
    const lastSolved = getUTCDate(new Date(streak.lastSolvedDate));

    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);

    // If last solve was before yesterday, the streak is broken
    if (lastSolved.getTime() < yesterday.getTime() && lastSolved.getTime() !== today.getTime()) {
        return prisma.debugStreak.update({
            where: { userId },
            data: {
                currentStreak: 0,
                rhythmScore: Math.max(0, streak.rhythmScore - 10)
            }
        });
    }

    return streak;
}
