import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

console.log('Attempting to instantiate PrismaClient with adapter...');
try {
    const prisma = new PrismaClient({ adapter });
    console.log('✅ PrismaClient instantiated successfully!');
    await prisma.$disconnect();
} catch (e) {
    console.error('❌ Error instantiating PrismaClient:', e);
    process.exit(1);
}
