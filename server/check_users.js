import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });

const prisma = new PrismaClient();

async function check() {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    const nullPoints = users.filter(u => u.total_points === null);
    console.log('Users with null total_points:', nullPoints.length);
    if (nullPoints.length > 0) {
        console.log('First one:', nullPoints[0]);
    }

    const nullStreak = users.filter(u => u.streak_count === null);
    console.log('Users with null streak_count:', nullStreak.length);
}

check().catch(console.error).finally(() => prisma.$disconnect());
