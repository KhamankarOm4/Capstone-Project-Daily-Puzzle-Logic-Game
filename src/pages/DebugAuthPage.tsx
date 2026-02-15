import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const DebugAuthPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [apiStatus, setApiStatus] = useState<string>('Waiting...');
    const [userDetails, setUserDetails] = useState<string>('');

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Get Token from URL or LocalStorage
            const urlToken = searchParams.get('token');
            const storedToken = localStorage.getItem('auth_token');
            const activeToken = urlToken || storedToken;

            setToken(activeToken || 'NO TOKEN FOUND');

            if (urlToken) {
                localStorage.setItem('auth_token', urlToken);
            }

            if (!activeToken) {
                setApiStatus('Failed: No token available to test.');
                return;
            }

            // 2. Test API
            setApiStatus('Testing /api/auth/user...');
            try {
                const res = await fetch('/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${activeToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setApiStatus(`SUCCESS (${res.status})`);
                    setUserDetails(JSON.stringify(data, null, 2));
                    // Auto redirect after success (optional, disabled for debugging)
                    // setTimeout(() => navigate('/'), 3000);
                } else {
                    const text = await res.text();
                    setApiStatus(`FAILED (${res.status}): ${text}`);
                }
            } catch (err: any) {
                setApiStatus(`ERROR: ${err.message}`);
            }
        };

        checkAuth();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8 font-mono">
            <h1 className="text-3xl font-bold text-red-500 mb-6">🚨 AUTH DEBUGGER 🚨</h1>

            <div className="space-y-6 max-w-2xl">
                <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                    <h2 className="text-xl font-bold mb-2">1. Token Check</h2>
                    <p className="break-all text-sm text-neutral-300">
                        {token}
                    </p>
                </div>

                <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                    <h2 className="text-xl font-bold mb-2">2. API Status</h2>
                    <div className={`p-2 rounded font-bold ${apiStatus.includes('SUCCESS') ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                        {apiStatus}
                    </div>
                </div>

                {userDetails && (
                    <div className="bg-neutral-800 p-4 rounded border border-neutral-700">
                        <h2 className="text-xl font-bold mb-2">3. User Details</h2>
                        <pre className="text-xs bg-black p-4 rounded overflow-auto">
                            {userDetails}
                        </pre>
                    </div>
                )}

                <div className="pt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold"
                    >
                        Go to Home
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="ml-4 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebugAuthPage;
