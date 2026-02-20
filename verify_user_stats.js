import prisma from './lib/prisma.js';

async function verify() {
    const users = await prisma.user.findMany({
        orderBy: { total_points: 'desc' },
        take: 5
    });

    console.log('--- Top 5 Users ---');
    users.forEach(u => {
        console.log(`ID: ${u.id}, Email: ${u.email}, Streak: ${u.streak_count}, Points: ${u.total_points}, Last: ${u.last_played}`);
    });

    process.exit(0);
}

verify().catch(e => {
    console.error(e);
    process.exit(1);
});
