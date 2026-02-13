import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const LoginPage = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl w-full max-w-md text-center relative z-10"
            >
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-3xl">🧩</span>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-2">
                    Daily Puzzle
                </h1>

                <p className="text-gray-400 mb-10 text-lg font-light">
                    Sharpen your logic daily.
                </p>

                <div className="space-y-4">
                    <Button
                        variant="google"
                        fullWidth
                        size="lg"
                        onClick={handleGoogleLogin}
                        className="!rounded-2xl"
                        leftIcon={<img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />}
                    >
                        Continue with Google
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 text-sm text-gray-500">
                    By continuing, you agree to our Terms of Service.
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
