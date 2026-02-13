import { useAppSelector } from '../store/hooks';


interface StatsDisplayProps {
    streak?: number;
}

const StatsDisplay = ({ streak }: StatsDisplayProps) => {
    const { user } = useAppSelector((state) => state.user);
    const displayStreak = streak !== undefined ? streak : (user?.streak_count || 0);

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Statistics
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl backdrop-blur-sm">
                    <div className="text-4xl font-bold text-orange-400">{displayStreak}</div>
                    <div className="text-sm text-gray-400 mt-1">Current Streak</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl backdrop-blur-sm">
                    <div className="text-4xl font-bold text-purple-400">{user?.total_points || 0}</div>
                    <div className="text-sm text-gray-400 mt-1">Total Points</div>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500">
                {user?.last_played && (
                    <p>Last played: {new Date(user.last_played).toLocaleDateString()}</p>
                )}
            </div>
        </div>
    );
};

export default StatsDisplay;
