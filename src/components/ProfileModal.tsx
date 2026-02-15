import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateUser } from '../features/user/userSlice';
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setUsername(user.username || '');
            setMobile(user.mobile || '');
            setError('');
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('auth_token');
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify({ name, username, mobile }),
            });

            if (!response.ok) {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.error || 'Failed to update profile');
                } catch (e) {
                    console.error('Non-JSON format response:', text);
                    throw new Error(`Server Error: ${response.status} ${response.statusText}`);
                }
            }

            const updatedUser = await response.json();
            dispatch(updateUser(updatedUser));
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface-100 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Username (Public)</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                        placeholder="Display name on leaderboard"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-400 mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-cyan transition-colors"
                                        placeholder="Optional"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-bold shadow-lg shadow-accent/20 transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
