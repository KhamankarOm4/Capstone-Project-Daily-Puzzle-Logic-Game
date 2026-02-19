import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppSelector } from '../store/hooks';
import { fetchLeaderboard, type LeaderboardEntry } from '../utils/leaderboardApi';
import CountdownTimer from '../components/CountdownTimer';
import { motion } from 'framer-motion';

const HomePage = () => {
    const { user } = useAppSelector((state) => state.user);
    const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const data = await fetchLeaderboard(today, 3); // Get top 3
                setTopPlayers(data.leaderboard || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadPreview();
    }, []);

    return (
        <Layout>
            <div className="w-full max-w-4xl space-y-8">
                {/* Hero Section */}
                <section className="text-center space-y-6 py-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white/70 drop-shadow-sm"
                    >
                        Daily Puzzle
                    </motion.h1>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                        Challenge your mind with a new logic puzzle every day. Compete with others and keep your streak alive!
                    </p>

                    <div className="flex flex-col items-center gap-4 mt-8">
                        <Link to="/play" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-accent px-8 font-medium text-white transition-all duration-300 hover:bg-accent-hover hover:scale-105 hover:shadow-[0_0_20px_rgba(112,0,255,0.5)]">
                            <span className="mr-2 text-xl">▶</span>
                            <span className="text-lg font-bold">Play Today's Puzzle</span>
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-shimmer" />
                        </Link>

                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                            <span>Next Puzzle In:</span>
                            <CountdownTimer />
                        </div>
                    </div>
                </section>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Stats Card */}
                    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl">🔥</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>Your Stats</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-accent-glow">{user?.streak_count || 0}</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider">Day Streak</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-accent-cyan">{user?.total_points?.toLocaleString() || 0}</div>
                                <div className="text-xs text-neutral-400 uppercase tracking-wider">Total Points</div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard Preview Card */}
                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>🏆</span> Top Agents
                            </h2>
                            <Link to="/leaderboard" className="text-xs text-accent-cyan hover:text-white transition-colors">View All &rarr;</Link>
                        </div>
                        <div className="space-y-3">
                            {topPlayers.length > 0 ? topPlayers.map((p, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                i === 1 ? 'bg-neutral-400/20 text-neutral-300' : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-medium text-neutral-200 truncate max-w-[100px]">
                                            {p.user?.username || p.user?.name || 'Anonymous'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-accent-glow underline decoration-dotted decoration-white/20">
                                        {p.score.toLocaleString()}
                                    </span>
                                </div>
                            )) : (
                                <div className="text-center text-neutral-500 py-4 text-sm">No scores yet today.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
