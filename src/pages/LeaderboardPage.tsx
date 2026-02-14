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
                const data = await fetchLeaderboard();
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
                <div className=" bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10">
                    <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 px-8 py-6 border-b border-white/10">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <span>🏆</span> Leaderboard
                        </h1>
                        <p className="text-blue-100 mt-2">Top players of all time</p>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-neutral-200">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-neutral-200">Player</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-neutral-200">Score</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-neutral-200">Time</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-neutral-200">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leaderboard.map((entry, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`hover:bg-white/5 transition-colors ${entry.user_id === user?.id ? 'bg-white/10 border-l-4 border-accent-cyan' : ''}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold
                                                    ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        index === 1 ? 'bg-neutral-400/20 text-neutral-300' :
                                                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                                'text-neutral-500'}`}
                                                >
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                                                        {(entry.user?.username || entry.user?.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`font-bold ${entry.user_id === user?.id ? 'text-accent-cyan' : 'text-white'}`}>
                                                            {entry.user_id === user?.id ? 'You' : (entry.user?.username || 'Anonymous')}
                                                        </span>
                                                        {entry.user_id === user?.id && entry.user?.username && (
                                                            <span className="text-[10px] text-neutral-400">@{entry.user.username}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-accent-glow">
                                                {entry.score.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-neutral-300 font-medium">
                                                {entry.time_taken}s
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-neutral-400 text-sm">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))}
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
