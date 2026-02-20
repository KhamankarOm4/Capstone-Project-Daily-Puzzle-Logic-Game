import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { fetchLeaderboard, type LeaderboardEntry } from '../utils/leaderboardApi';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import ActivityHeatmap from '../components/ActivityHeatmap';

const LeaderboardPage = () => {
    const { user } = useAppSelector((state) => state.user);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                // Pass today's date to get the daily leaderboard
                const today = new Date().toISOString().split('T')[0];
                const data = await fetchLeaderboard(today);
                setLeaderboard(data.leaderboard || []); // Handle response structure
            } catch (err) {
                setError('Failed to load leaderboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-red-500 text-xl font-semibold bg-red-50 px-6 py-4 rounded-lg shadow-sm border border-red-100">
                    {error}
                </div>
            </div>
        );
    }



    return (
        <Layout>
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Activity Heatmap Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10 p-6">
                    <ActivityHeatmap />
                </div>
                <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 border-b border-white/5 backdrop-blur-md">
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 flex items-center gap-3 drop-shadow-sm">
                            <span>🏆</span> Daily Leaderboard
                        </h1>
                        <p className="text-neutral-400 mt-2 font-medium tracking-wide text-sm uppercase">Top Contestants for {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-neutral-400 uppercase tracking-wider">Score</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-neutral-400 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leaderboard.length > 0 ? (
                                        leaderboard.map((entry, index) => (
                                            <motion.tr
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`hover:bg-white/5 transition-colors group ${entry.user_id === user?.id ? 'bg-accent/10 border-l-2 border-accent' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                                                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                                                            index === 1 ? 'bg-neutral-400/20 text-neutral-300' :
                                                                index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                                    'text-neutral-500'}`}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                            {(entry.user?.username || entry.user?.name || 'A').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-bold text-sm ${entry.user_id === user?.id ? 'text-accent' : 'text-neutral-200 group-hover:text-white transition-colors'}`}>
                                                                {entry.user_id === user?.id ? 'You' : (entry.user?.username || entry.user?.name || 'Anonymous')}
                                                            </span>
                                                            {(entry.user?.username || entry.user?.name) && (
                                                                <span className="text-[10px] text-neutral-500">
                                                                    {entry.user?.username ? `@${entry.user.username}` : entry.user?.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-accent-cyan drop-shadow-[0_0_5px_rgba(0,194,255,0.3)]">
                                                    {entry.score.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-neutral-400 font-mono text-sm">
                                                    {entry.time_taken}s
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-neutral-500 text-xs uppercase tracking-wide">
                                                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 italic">
                                                No daily records yet. Be the first to solve it!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LeaderboardPage;
