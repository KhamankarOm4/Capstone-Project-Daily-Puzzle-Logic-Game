import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DebugTrace = () => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const testEndpoint = async (url: string) => {
        addLog(`Fetching ${url}...`);
        try {
            const res = await fetch(url);
            addLog(`Status: ${res.status} ${res.statusText}`);
            addLog(`Type: ${res.headers.get('content-type')}`);
            const text = await res.text();
            addLog(`Body: ${text.substring(0, 100)}...`);
        } catch (e: any) {
            addLog(`Error: ${e.message}`);
        }
    };

    useEffect(() => {
        testEndpoint('/api/hello');
    }, []);

    return (
        <div className="p-8 bg-black text-green-400 min-h-screen font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">🔍 API Debug Trace</h1>
            <div className="space-x-4 mb-6">
                <button onClick={() => testEndpoint('/api/hello')} className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">Test /api/hello</button>
                <button onClick={() => testEndpoint('/api/debug_db')} className="bg-red-900 px-3 py-1 rounded hover:bg-red-800">Test Database</button>
                <button onClick={() => testEndpoint('/api/auth/user')} className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700">Test /api/auth/user</button>
                <Link to="/login" className="text-blue-400">Back to Login</Link>
            </div>
            <div className="bg-gray-900 p-4 rounded border border-gray-800 h-96 overflow-auto">
                {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
            </div>
        </div>
    );
};

export default DebugTrace;
