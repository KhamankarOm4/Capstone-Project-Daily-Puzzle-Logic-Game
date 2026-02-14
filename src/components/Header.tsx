import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../features/user/userSlice';
import { useState, useRef, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SettingsModal from './SettingsModal';

const ProfileModal = lazy(() => import('./ProfileModal'));

const Header = () => {
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
            await fetch('/api/auth/logout', { credentials: 'include' });
        } catch (e) {
            console.error('Logout failed', e);
        }

        // Clear Client State
        dispatch(logout());
        localStorage.removeItem('daily-puzzle-state');
        localStorage.removeItem('daily-puzzle-user');

        // Close Dropdown & Redirect
        setIsDropdownOpen(false);
        navigate('/login');
    };

    return (
        <header className="sticky top-4 z-50 px-4 mb-4">
            <div className="max-w-4xl mx-auto rounded-full bg-surface-100 backdrop-blur-xl border border-white/10 shadow-lg px-6 py-3 flex justify-between items-center transition-all duration-300 hover:border-white/20 hover:shadow-accent/5 relative group/header">

                {/* Subtle sheen effect */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/header:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </div>

                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group relative z-10">
                    <span className="text-2xl transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300 filter drop-shadow-[0_0_8px_rgba(112,0,255,0.5)]">🧩</span>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent group-hover:from-accent-cyan group-hover:to-accent-glow transition-all duration-500">
                        Logic Looper
                    </span>
                </Link>

                {/* Navigation Links - Desktop */}
                <nav className="hidden md:flex items-center gap-8 relative z-10">
                    <Link to="/practice" className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors group">
                        Practice
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-cyan transition-all group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(0,194,255,0.8)]"></span>
                    </Link>
                    <Link to="/leaderboard" className="relative text-sm font-medium text-neutral-300 hover:text-white transition-colors group">
                        Leaderboard
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-glow transition-all group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(176,102,255,0.8)]"></span>
                    </Link>
                </nav>

                {/* Right Side: Stats & Profile */}
                <div className="flex items-center gap-4 relative z-10">
                    {/* Settings Button */}
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {/* Streak Badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/40 border border-white/5 hover:border-accent/20 transition-colors group relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 text-lg group-hover:scale-110 transition-transform drop-shadow-[0_0_5px_rgba(255,100,0,0.5)]">🔥</span>
                        <span className="relative z-10 font-bold text-neutral-200 group-hover:text-white">
                            {user?.streak_count || 0}
                        </span>
                    </div>

                    {/* Points Display */}
                    <div className="hidden sm:block text-right mr-2">
                        <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Score</div>
                        <div className="text-sm font-bold text-white font-mono tabular-nums">{user?.total_points?.toLocaleString() || 0}</div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg hover:shadow-accent/40 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-white text-sm">
                                        {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-64 bg-[#050508]/90 backdrop-blur-2xl rounded-xl border border-white/10 shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] overflow-hidden py-1 z-50 ring-1 ring-white/5"
                                >
                                    {user ? (
                                        <>
                                            <div className="px-5 py-4 border-b border-gray-800 bg-white/[0.02]">
                                                <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                                                <p className="text-xs text-neutral-400 truncate font-mono mt-0.5">{user?.email}</p>

                                                {/* Mobile Stats */}
                                                <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-white/5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-neutral-500 uppercase">Streak</span>
                                                        <span className="text-sm font-bold text-white">🔥 {user?.streak_count || 0}</span>
                                                    </div>
                                                    <div className="flex flex-col text-right">
                                                        <span className="text-[10px] text-neutral-500 uppercase">Score</span>
                                                        <span className="text-sm font-bold text-white">{user?.total_points || 0}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        setIsProfileModalOpen(true);
                                                    }}
                                                    className="w-full text-left px-5 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group"
                                                >
                                                    <span className="group-hover:scale-110 transition-transform">👤</span> Edit Profile
                                                </button>
                                                <Link to="/practice" className="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors group" onClick={() => setIsDropdownOpen(false)}>
                                                    <span className="group-hover:scale-110 transition-transform">🧩</span> Practice
                                                </Link>
                                                <Link to="/leaderboard" className="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors group" onClick={() => setIsDropdownOpen(false)}>
                                                    <span className="group-hover:scale-110 transition-transform">🏆</span> Leaderboard
                                                </Link>
                                            </div>

                                            <div className="h-px bg-white/5 my-1 mx-2"></div>

                                            <div className="py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3 group"
                                                >
                                                    <span className="group-hover:-translate-x-1 transition-transform">🚪</span>
                                                    <span>Log Out</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="px-2 py-2">
                                            <Link
                                                to="/login"
                                                className="block w-full px-4 py-2.5 text-sm text-center font-bold text-white bg-accent hover:bg-accent-hover rounded-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <Suspense fallback={null}>
                {user && <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />}
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </Suspense>
        </header>
    );
};

export default Header;
