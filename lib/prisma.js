import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

let prisma;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});
const adapter = new PrismaPg(pool);

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({ adapter });
} else {
    if (!global.prisma) {
        console.log('Initializing new PrismaClient instance...');
        global.prisma = new PrismaClient({ adapter });
    }
    prisma = global.prisma;
}

export default prisma;
