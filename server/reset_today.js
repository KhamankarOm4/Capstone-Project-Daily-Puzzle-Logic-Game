
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetDailyProgress() {
    try {
        console.log('🔄 Resetting daily progress for ALL users...');
        const result = await prisma.user.updateMany({
            data: {
                last_played: null
            }
        });
        console.log(`✅ Reset complete. ${result.count} users updated.`);
        console.log('👉 You can now play the puzzle again immediately.');
    } catch (error) {
        console.error('❌ Error resetting progress:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetDailyProgress();
