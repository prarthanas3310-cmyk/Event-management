import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { dark } = useTheme();

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('token')) navigate('/registrations');
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      navigate('/registrations');
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Theme tokens ──
  const inputBg     = dark ? 'rgba(255,255,255,0.08)' : '#F8FAFC';
  const inputBorder = dark ? 'rgba(255,255,255,0.12)' : '#E2E8F0';
  const inputColor  = dark ? 'white' : '#1E1B4B';
  const iconColor   = dark ? 'rgba(255,255,255,0.4)' : '#94A3B8';
  const labelColor  = dark ? 'rgba(255,255,255,0.7)' : '#475569';

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: dark
        ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6d28d9 100%)'
        : 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #E0E7FF 100%)',
      position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif",
    }}>

      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%', top: -100, left: -100,
        background: dark
          ? 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        animation: 'float1 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', bottom: -80, right: -80,
        background: dark
          ? 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
        animation: 'float2 10s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200,
        borderRadius: '50%', top: '40%', right: '20%',
        background: dark
          ? 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
        animation: 'float3 6s ease-in-out infinite',
      }} />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 6 + 2,
          height: Math.random() * 6 + 2,
          borderRadius: '50%',
          background: dark ? 'rgba(255,255,255,0.3)' : 'rgba(109,40,217,0.15)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particle ${Math.random() * 10 + 8}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }} />
      ))}

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(${dark ? 'rgba(255,255,255,0.03)' : 'rgba(109,40,217,0.04)'} 1px, transparent 1px),
          linear-gradient(90deg, ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(109,40,217,0.04)'} 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />

      {/* Login card */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 440,
        margin: '0 20px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>

        {/* Glass card */}
        <div style={{
          background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E2E8F0',
          padding: '48px 40px',
          boxShadow: dark
            ? '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 32px 64px rgba(109,40,217,0.12), 0 8px 24px rgba(0,0,0,0.06)',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #818cf8, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(109,40,217,0.5)',
              animation: 'pulse 3s ease-in-out infinite',
            }}>
              📅
            </div>
            <h1 style={{
              fontSize: 26, fontWeight: 800,
              color: dark ? 'white' : '#1E1B4B',
              letterSpacing: '-0.04em', margin: '0 0 6px',
              lineHeight: 1.2,
            }}>
              Welcome back
            </h1>
            <p style={{
              fontSize: 14,
              color: dark ? 'rgba(255,255,255,0.5)' : '#64748B',
              margin: 0,
            }}>
              Sign in to Event Registration System
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.12)',
              border: '1px solid rgba(220,38,38,0.4)',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: '#ef4444',
              marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
              animation: 'shake 0.4s ease',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Username */}
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: labelColor, marginBottom: 8,
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 16,
                  color: iconColor, pointerEvents: 'none',
                }}>👤</span>
                <input
                  type="text" name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px',
                    background: inputBg,
                    border: `1.5px solid ${inputBorder}`,
                    borderRadius: 12, fontSize: 14,
                    color: inputColor, outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(139,92,246,0.8)';
                    e.target.style.background = dark ? 'rgba(255,255,255,0.12)' : '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = inputBorder;
                    e.target.style.background = inputBg;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600,
                color: labelColor, marginBottom: 8,
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 16,
                  color: iconColor, pointerEvents: 'none',
                }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '13px 44px 13px 42px',
                    background: inputBg,
                    border: `1.5px solid ${inputBorder}`,
                    borderRadius: 12, fontSize: 14,
                    color: inputColor, outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(139,92,246,0.8)';
                    e.target.style.background = dark ? 'rgba(255,255,255,0.12)' : '#FFFFFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = inputBorder;
                    e.target.style.background = inputBg;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, color: iconColor,
                    padding: 0, lineHeight: 1,
                  }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading
                  ? 'rgba(109,40,217,0.5)'
                  : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                border: 'none', borderRadius: 12,
                color: 'white', fontSize: 15, fontWeight: 700,
                fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
                boxShadow: loading ? 'none' : '0 8px 24px rgba(109,40,217,0.4)',
                transition: 'all 0.2s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(109,40,217,0.5)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(109,40,217,0.4)';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    display: 'inline-block', animation: 'spin 0.8s linear infinite',
                  }} />
                  Signing in...
                </span>
              ) : '🚀 Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p style={{
            textAlign: 'center', marginTop: 28, marginBottom: 0,
            fontSize: 12, color: dark ? 'rgba(255,255,255,0.3)' : '#94A3B8',
          }}>
            © 2026 Event Registration System
          </p>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 40px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -30px) scale(1.08); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(20px); opacity: 0.8; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(109,40,217,0.5); }
          50% { box-shadow: 0 8px 40px rgba(109,40,217,0.8); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        input[type="text"], input[type="password"] {
          color-scheme: ${dark ? 'dark' : 'light'};
        }
        input::placeholder {
          color: ${dark ? 'rgba(255,255,255,0.3)' : '#94A3B8'} !important;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default Login;