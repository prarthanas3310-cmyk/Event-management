import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        navigate('/registrations');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F8F9FF, #F0EEFF)',
      padding: 16,
    }}>
      <div style={{
        background: 'white', borderRadius: 28,
        padding: '48px 40px', width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(124,92,252,0.12)',
        border: '1px solid rgba(124,92,252,0.1)',
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(124,92,252,0.3)',
        }}>🗓️</div>

        <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, color: '#1E1B4B', margin: '0 0 6px' }}>
          Welcome back
        </h2>
        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, margin: '0 0 32px' }}>
          Sign in to Event Registration System
        </p>

        {error && (
          <div style={{
            background: '#FEE2E2', color: '#EF4444',
            border: '1px solid #FCA5A5', borderRadius: 12,
            padding: '10px 14px', fontSize: 13, fontWeight: 500,
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6,
          }}>⚠️ {error}</div>
        )}

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E1B4B', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Username
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>👤</span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '13px 14px 13px 42px',
                border: '1.5px solid #ECEBFF', borderRadius: 14,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
                color: '#1E1B4B', background: '#FAFAFA',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#7C5CFC'}
              onBlur={e => e.target.style.borderColor = '#ECEBFF'}
            />
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E1B4B', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔒</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '13px 14px 13px 42px',
                border: '1.5px solid #ECEBFF', borderRadius: 14,
                fontSize: 14, fontFamily: 'inherit', outline: 'none',
                color: '#1E1B4B', background: '#FAFAFA',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#7C5CFC'}
              onBlur={e => e.target.style.borderColor = '#ECEBFF'}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
            color: 'white', border: 'none', borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(124,92,252,0.3)',
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? '⏳ Signing in...' : '🚀 Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 24, marginBottom: 0 }}>
          © 2026 Event Registration System
        </p>
      </div>
    </div>
  );
}

export default Login;