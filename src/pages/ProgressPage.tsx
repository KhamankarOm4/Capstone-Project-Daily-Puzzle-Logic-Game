import Layout from '../components/Layout';
import ActivityHeatmap from '../components/ActivityHeatmap';
import StatsDisplay from '../components/StatsDisplay';
import { useAppSelector } from '../store/hooks';

const ProgressPage = () => {
    const { user } = useAppSelector((state) => state.user);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
                        Your Progress
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Visualize your daily practice and consistency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1 md:col-span-2 bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-xl">
                        <ActivityHeatmap />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <StatsDisplay streak={user?.streak_count} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProgressPage;
