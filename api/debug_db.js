import prisma from './_lib/prisma.js';

export default async function handler(req, res) {
    try {
        console.log('Testing DB connection...');
        const result = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('DB Connection successful:', result);
        res.status(200).json({ status: 'Connected', result, env_url: !!process.env.DATABASE_URL });
    } catch (error) {
        console.error('DB Connection Failed:', error);
        res.status(500).json({
            status: 'Failed',
            error: error.message,
            stack: error.stack,
            env_defined: !!process.env.DATABASE_URL
        });
    }
}
