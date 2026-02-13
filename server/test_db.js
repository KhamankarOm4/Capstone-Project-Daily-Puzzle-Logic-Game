
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

console.log('Testing connection to:', connectionString ? 'Reachable URL found' : 'MISSING URL');

try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connection successful!');

    const count = await prisma.user.count();
    console.log(`Found ${count} users.`);

    await prisma.$disconnect();
} catch (error) {
    console.error('❌ Connection failed:', error);
}
