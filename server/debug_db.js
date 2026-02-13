import prisma from './src/prisma.js';

async function main() {
    console.log('🔍 Checking Database Connection and Schema...');
    try {
        // 1. Check if we can count users
        const count = await prisma.user.count();
        console.log(`✅ Connected! User count: ${count}`);

        // 2. Check if we can find a user and see the new fields
        const user = await prisma.user.findFirst();
        if (user) {
            console.log('✅ Found a user:', user);
            console.log(`   - username field exists: ${'username' in user}`);
            console.log(`   - name field exists: ${'name' in user}`);
            console.log(`   - mobile field exists: ${'mobile' in user}`);
        } else {
            console.log('⚠️ No users found to check fields.');
        }

        // 3. Test uniqueness check (simulating the profile update logic)
        console.log('🧪 Testing findUnique on username...');
        // We know 'test_unique_check_123' doesn't exist, but we check if the query throws
        const check = await prisma.user.findUnique({
            where: { username: 'test_unique_check_123' }
        });
        console.log('✅ findUnique execution successful (result null as expected).');

    } catch (e) {
        console.error('❌ Database Check Failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
