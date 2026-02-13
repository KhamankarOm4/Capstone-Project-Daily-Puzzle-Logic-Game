import prisma from './src/prisma.js';

async function main() {
    console.log('🔍 Checking Data...');
    try {
        const userCount = await prisma.user.count();
        console.log(`👤 Users: ${userCount}`);

        const scoreCount = await prisma.dailyScore.count();
        console.log(`🏆 Scores: ${scoreCount}`);

        if (scoreCount > 0) {
            const scores = await prisma.dailyScore.findMany({ take: 5 });
            console.log('📝 First 5 scores:', scores);
        } else {
            console.log('⚠️ No scores found in the database.');
        }
    } catch (e) {
        console.error('❌ Error checking data:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
