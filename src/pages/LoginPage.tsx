import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const LoginPage = () => {
    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google';
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-between p-8 relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/anime-night-sky-illustration.jpg')" }}
        >
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Top Section: Welcome & Branding */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center mt-20"
            >
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-4">
                    LOGIC LOOPER
                </h1>
                <p className="text-2xl md:text-3xl font-light text-white/90 tracking-widest uppercase">
                    Welcome to the Void
                </p>
            </motion.div>

            {/* Bottom Section: Interesting Text & Login */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md text-center mb-12 flex flex-col gap-8"
            >
                <p className="text-lg md:text-xl text-white/80 font-medium italic leading-relaxed drop-shadow-md">
                    "Chaos is merely a pattern waiting to be deciphered. <br />
                    Step inside and unravel the mystery."
                </p>

                <div className="flex justify-center">
                    <Button
                        variant="glow"
                        size="xl"
                        onClick={handleGoogleLogin}
                        className="!rounded-full px-12 py-4 text-lg shadow-[0_0_30px_rgba(112,0,255,0.6)] hover:shadow-[0_0_50px_rgba(112,0,255,0.8)] transition-shadow duration-300 transform hover:scale-105"
                        leftIcon={<span className="text-2xl mr-2">G</span>}
                    >
                        Enter the Realm
                    </Button>
                </div>

                {/* Debugging Tool */}
                <div className="relative z-10 w-full max-w-md text-center">
                    <button
                        onClick={async () => {
                            const token = localStorage.getItem('auth_token');
                            if (!token) {
                                alert('No token found in LocalStorage.');
                                return;
                            }
                            try {
                                const res = await fetch('/api/auth/user', {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                const text = await res.text();
                                alert(`Status: ${res.status}\nBody: ${text.substring(0, 100)}`);
                            } catch (e: any) {
                                alert(`Error: ${e.message}`);
                            }
                        }}
                        className="text-white/20 hover:text-white/50 text-xs font-mono transition-colors"
                    >
                        [debug: check connection]
                    </button>
                    <a href="/api/health" target="_blank" className="text-white/20 hover:text-white/50 text-xs font-mono transition-colors block mt-2">
                        [debug: test server health (TS)]
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
