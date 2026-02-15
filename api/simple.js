export default function handler(req, res) {
    res.status(200).json({
        msg: "Vercel API is working!",
        query: req.query,
        env: process.env.NODE_ENV
    });
}
