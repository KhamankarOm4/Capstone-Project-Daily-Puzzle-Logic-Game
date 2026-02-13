
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { practicePuzzles } from '../puzzles/practicePuzzles';

const PracticePage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                        Practice Mode
                    </h1>
                    <p className="text-xl text-gray-300">
                        Hone your skills with these puzzles.
                        <br />
                        <span className="text-sm text-gray-500 mt-2 block">
                            (Each completion awards 100 pts and counts towards your streak!)
                        </span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practicePuzzles.map((puzzle, index) => (
                        <motion.div
                            key={puzzle.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 hover:bg-white/15 transition-all group cursor-pointer"
                            onClick={() => navigate(`/practice/${puzzle.id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {puzzle.date}
                                    </h3>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-300 uppercase tracking-wide">
                                            {puzzle.type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide
                                            ${puzzle.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                                puzzle.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-red-500/20 text-red-300'}`}>
                                            {puzzle.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                                    🧩
                                </span>
                            </div>

                            <button
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Play Now
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default PracticePage;
