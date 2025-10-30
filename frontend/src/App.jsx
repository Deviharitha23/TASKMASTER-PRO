import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';
import HomePage from './components/HomePage';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        try {
          const response = await fetch('http://localhost:5000/api/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              if (storedUser) {
                setUser(JSON.parse(storedUser));
              } else {
                setToken(null);
                localStorage.removeItem('token');
              }
            }
          } else {
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setToken(null);
              localStorage.removeItem('token');
            }
          }
        } catch (error) {
          console.error('Auth check error:', error);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setToken(null);
            localStorage.removeItem('token');
          }
        }
      } else if (storedUser) {
        localStorage.removeItem('user');
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  // Handle login
  const handleLogin = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    navigate('/dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div style={spinnerStyles}></div>
        <p style={{ color: '#667eea', fontSize: '18px', marginTop: '20px' }}>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register onLogin={handleLogin} />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-task"
          element={user ? <AddTask token={token} user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/calendar"
          element={user ? <CalendarView token={token} user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/analytics"
          element={user ? <AnalyticsView token={token} user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </div>
  );
}

// Enhanced Loading styles
const loadingStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  position: 'relative',
  overflow: 'hidden',
};

const spinnerStyles = {
  width: '60px',
  height: '60px',
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderTop: '4px solid #ffffff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '1rem'
};

// Add spinner animation to the document
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Main App component
function App() {
  return <AppContent />;
}

export default App;