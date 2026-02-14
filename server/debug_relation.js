import prisma from './src/prisma.js';

async function main() {
    console.log('🔍 Checking User-Score Relations...');
    try {
        // 1. Get all users with usernames
        const usersWithNames = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { not: null } },
                    { name: { not: null } }
                ]
            },
            select: { id: true, username: true, name: true }
        });
        console.log(`👤 Users with names/usernames (${usersWithNames.length}):`);
        usersWithNames.forEach(u => console.log(`   - ID: ${u.id}, User: ${u.username}, Name: ${u.name}`));

        // 2. Get recent scores
        const scores = await prisma.dailyScore.findMany({
            take: 10,
            orderBy: { score: 'desc' }
        });
        console.log(`\n🏆 Recent Scores (${scores.length}):`);

        // 3. Check matches
        scores.forEach(s => {
            const user = usersWithNames.find(u => u.id === s.user_id);
            const isGuest = s.user_id.startsWith('guest');
            const foundStatus = user ? '✅ Linked' : (isGuest ? '👤 Guest' : '❌ ORPHAN');
            console.log(`   - Score: ${s.score}, UserID: ${s.user_id} -> ${foundStatus}`);
            if (user) console.log(`     -> Should show: ${user.username || user.name}`);
        });

    } catch (e) {
        console.error('❌ Error checking details:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
