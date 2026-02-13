
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { practicePuzzles } from '../puzzles/practicePuzzles';

const PracticePage = () => {
    return (
        <Layout>
            <div className="w-full max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-32 bg-accent-cyan/20 blur-[80px] rounded-full pointer-events-none"></div>
                    <h1 className="relative text-4xl md:text-6xl font-black text-white tracking-tight">
                        Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-500">Lab</span>
                    </h1>
                    <p className="relative text-neutral-300 text-lg max-w-2xl mx-auto font-medium">
                        Hone your skills. Master the patterns. Prepare for the daily challenge.
                    </p>
                </div>

                {/* Puzzle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practicePuzzles.map((puzzle) => (
                        <div
                            key={puzzle.id}
                            className="group relative glass-card rounded-3xl p-1 overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,194,255,0.3)] transition-all duration-500"
                        >
                            {/* Card Content Container */}
                            <div className="bg-primary/90 h-full rounded-[1.4rem] p-6 flex flex-col relative z-10 overflow-hidden">

                                {/* Background Glow on Hover */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-3xl rounded-full group-hover:bg-accent-cyan/20 transition-colors duration-500"></div>

                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-surface-200 backdrop-blur-md rounded-xl p-3 border border-white/10 group-hover:border-accent-cyan/30 transition-colors">
                                        <span className="text-2xl group-hover:scale-110 transition-transform block">🧩</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                                        ${puzzle.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            puzzle.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                        {puzzle.difficulty}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                                    {puzzle.type.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <p className="text-neutral-400 text-sm mb-6 flex-grow line-clamp-2">
                                    Master the art of {puzzle.type} with this specific challenge layout.
                                </p>

                                {/* Action Button */}
                                <Link
                                    to={`/practice/${puzzle.id}`}
                                    className="w-full py-3 rounded-xl bg-surface-100 hover:bg-accent-cyan hover:text-black text-white text-center font-bold text-sm transition-all duration-300 border border-white/10 group-hover:border-transparent flex items-center justify-center gap-2 group/btn"
                                >
                                    <span>Start Simulation</span>
                                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default PracticePage;
