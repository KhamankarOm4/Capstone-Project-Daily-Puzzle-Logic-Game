import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useEffect, useState } from 'react';
import { login } from './features/user/userSlice';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProgressPage from './pages/ProgressPage';
import PracticePage from './pages/PracticePage';
import DebugTrace from './pages/DebugTrace';
import DebugAuthPage from './pages/DebugAuthPage';


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // 1. Check for token in URL (from Google Login redirect)
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
          localStorage.setItem('auth_token', urlToken);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 2. Prepare headers with fallback token
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/auth/user', {
          credentials: 'include',
          headers, // Send the token!
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData) {
            try {
              const dashboardResponse = await fetch('/user/dashboard', {
                credentials: 'include',
                headers, // Send here too
              });
              if (dashboardResponse.ok) {
                const dashboardData = await dashboardResponse.json();
                dispatch(login({ ...userData, ...dashboardData }));
              } else {
                dispatch(login(userData));
              }
            } catch (e) {
              console.error('Failed to fetch dashboard:', e);
              dispatch(login(userData));
            }
          }
        } else {
          // Valid token but invalid session? strict mode might want to clear token
          // localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <Router>
      <Routes>

        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <GamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/:id"
          element={
            <ProtectedRoute>
              <GamePage mode="practice" />
            </ProtectedRoute>
          }
        />
        {/* Debug Routes - Hidden from UI */}
        <Route path="/debug-trace" element={<DebugTrace />} />
        <Route path="/debug-auth" element={<DebugAuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
