import prisma from './_lib/prisma.js';

export default async function handler(req, res) {
    try {
        console.log('Testing DB connection...');
        const count = await prisma.user.count();
        res.status(200).json({ status: 'ok', userCount: count, message: 'Database connection successful' });
    } catch (error) {
        console.error('DB Connection Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
            stack: error.stack
        });
    }
}
