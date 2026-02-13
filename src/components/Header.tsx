import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
    const { user } = useAppSelector((state) => state.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3001/auth/logout', { credentials: 'include' });
        } catch (e) {
            console.error('Logout failed', e);
        }
        localStorage.removeItem('daily-puzzle-state');
        localStorage.removeItem('daily-puzzle-user');
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10">
            <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    Daily Puzzle
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        to="/practice"
                        className="flex items-center justify-center gap-2 h-12 px-4 bg-white/5 hover:bg-white/10 text-green-300 rounded-xl font-medium transition-colors border border-transparent hover:border-white/10"
                    >
                        <span className="text-xl">🧩</span>
                        <span className="hidden sm:inline">Practice</span>
                    </Link>

                    <Link
                        to="/leaderboard"
                        className="flex items-center justify-center gap-2 h-12 px-4 bg-white/5 hover:bg-white/10 text-blue-300 rounded-xl font-medium transition-colors border border-transparent hover:border-white/10"
                    >
                        <span className="text-xl">🏆</span>
                        <span className="hidden sm:inline">Leaderboard</span>
                    </Link>

                    <div className="flex items-center gap-3 h-12 px-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                        <span className="text-2xl">🔥</span>
                        <div className="flex flex-col leading-none justify-center">
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Streak</span>
                            <span className="text-lg font-bold text-orange-400 leading-none">{user?.streak_count || 0}</span>
                        </div>
                    </div>

                    {user && (
                        <div className="relative pl-4 border-l border-white/10" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center justify-center transition-transform hover:scale-105 focus:outline-none"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border-2 border-blue-500/50 shadow-sm"
                                        title={user.name}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 shadow-sm bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {user.email?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 top-12 w-64 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-4 overflow-hidden"
                                    >
                                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full border border-white/10 bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                                    {user.email?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-white truncate">{user.name}</div>
                                                <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                            </div>
                                        </div>

                                        <Link
                                            to="/progress"
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors mb-1"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <span className="text-lg">📊</span>
                                            Your Progress
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
