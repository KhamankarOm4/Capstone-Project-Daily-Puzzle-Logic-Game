import { useAppSelector } from '../store/hooks';

interface StatsDisplayProps {
    streak?: number;
}

const StatsDisplay = ({ streak }: StatsDisplayProps) => {
    const { user } = useAppSelector((state) => state.user);
    const displayStreak = streak !== undefined ? streak : (user?.streak_count || 0);

    return (
        <div className="glass-panel p-8 rounded-3xl w-full max-w-sm mx-auto relative overflow-hidden group">
            {/* Ambient background blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-accent/30 transition-colors duration-500"></div>

            <h2 className="text-2xl font-black text-center mb-8 tracking-tight relative z-10">
                <span className="bg-gradient-to-r from-accent-cyan via-neutral-800 dark:via-white to-accent-glow bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(112,0,255,0.5)]">
                    Your Statistics
                </span>
            </h2>

            <div className="flex flex-col gap-4 mb-6 relative z-10">
                {/* Streak Card */}
                <div className="flex flex-row items-center justify-between p-5 bg-surface-200 border border-black/5 dark:border-white/10 rounded-2xl hover:border-accent-cyan/50 transition-colors duration-300 shadow-lg group/card">
                    <div className="text-left">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 group-hover/card:text-accent-cyan transition-colors">
                            Current Streak
                        </div>
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-500">Keep it going!</div>
                    </div>
                    <div className="text-4xl font-black text-neutral-900 dark:text-white drop-shadow-[0_0_8px_rgba(0,194,255,0.5)]">
                        {displayStreak} <span className="text-lg text-accent-cyan">🔥</span>
                    </div>
                </div>

                {/* Points Card */}
                <div className="flex flex-row items-center justify-between p-5 bg-surface-200 border border-black/5 dark:border-white/10 rounded-2xl hover:border-accent-glow/50 transition-colors duration-300 shadow-lg group/card">
                    <div className="text-left">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 group-hover/card:text-accent-glow transition-colors">
                            Total Points
                        </div>
                        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-500">Lifetime Score</div>
                    </div>
                    <div className="text-4xl font-black text-neutral-900 dark:text-white drop-shadow-[0_0_8px_rgba(176,102,255,0.5)]">
                        {user?.total_points || 0}
                    </div>
                </div>
            </div>

            <div className="text-center relative z-10 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse"></div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Last played: <span className="text-neutral-800 dark:text-neutral-200">{user?.last_played ? new Date(user.last_played).toLocaleDateString() : 'Never'}</span>
                </p>
            </div>
        </div>
    );
};

export default StatsDisplay;
