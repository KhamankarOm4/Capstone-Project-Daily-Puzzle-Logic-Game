import prisma from './src/prisma.js';

async function main() {
    console.log('🧹 Clearing Leaderboard Data...');
    try {
        const deleted = await prisma.dailyScore.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} scores.`);

        // Optional: Delete guest users too if needed, but let's keep registered ones
        // const deletedUsers = await prisma.user.deleteMany({ where: { email: { contains: 'guest' } } }); 

    } catch (e) {
        console.error('❌ Error clearing data:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
