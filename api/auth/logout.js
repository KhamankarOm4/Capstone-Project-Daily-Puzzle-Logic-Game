
import { removeTokenCookie } from '../_lib/auth.js';

export default function handler(req, res) {
    removeTokenCookie(res);
    res.status(200).json({ message: 'Logged out successfully' });
}
