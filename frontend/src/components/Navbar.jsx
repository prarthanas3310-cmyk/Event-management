import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role') || 'viewer';
  const isAdmin = role === 'admin';

  return (
    <aside className="sidebar">

      {/* Logo Section */}
      <div className="sidebar-brand">
        <div className="brand-icon">EH</div>
        <div className="brand-text">
          <strong>EventHub</strong>
          <small>Management System</small>
        </div>
      </div>

      {/* Logged in user */}
      {username && (
        <div style={{
          margin: '0 12px 8px',
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{username}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              {isAdmin ? 'Administrator' : 'Member'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <span className="nav-icon">🏠</span>
          Home
        </NavLink>

        <NavLink
          to="/registrations"
          className={({ isActive }) => 'nav-item' + (isActive ? ' nav-item--active' : '')}
        >
          <span className="nav-icon">📋</span>
          Registrations
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) => 'nav-item' + (isActive ? ' nav-item--active' : '')}
        >
          <span className="nav-icon">➕</span>
          Add Registration
        </NavLink>

        {/* Only admin can see Add Event */}
        {isAdmin && (
          <NavLink
            to="/add-event"
            className={({ isActive }) => 'nav-item' + (isActive ? ' nav-item--active' : '')}
          >
            <span className="nav-icon">📅</span>
            Add Event
          </NavLink>
        )}
      </nav>

      {/* Motivational Card */}
      <div className="sidebar-motive-card">
        <div className="motive-dot motive-dot-1" />
        <div className="motive-dot motive-dot-2" />

        <div className="motive-illustration">
          <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="38" cy="22" r="11" fill="rgba(255,255,255,0.85)" />
            <rect x="25" y="36" width="26" height="28" rx="8" fill="rgba(255,255,255,0.7)" />
            <circle cx="72" cy="24" r="9" fill="rgba(255,255,255,0.6)" />
            <rect x="61" y="36" width="22" height="26" rx="7" fill="rgba(255,255,255,0.5)" />
            <text x="88" y="18" fontSize="14" fill="rgba(255,220,80,0.9)">✨</text>
            <circle cx="16" cy="50" r="3" fill="rgba(255,255,255,0.35)" />
            <circle cx="100" cy="55" r="2.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="55" cy="68" r="2" fill="rgba(255,255,255,0.25)" />
          </svg>
        </div>

        <p className="motive-title">Let's make every event memorable ✨</p>
        <p className="motive-sub">Organize. Engage. Succeed. 🎉</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          margin: '8px 12px',
          padding: '10px 14px',
          background: 'rgba(220,38,38,0.12)',
          border: '1px solid rgba(220,38,38,0.25)',
          borderRadius: 10, color: '#fca5a5',
          cursor: 'pointer', fontSize: 13,
          fontWeight: 600, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all 0.15s', width: 'calc(100% - 24px)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(220,38,38,0.25)';
          e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(220,38,38,0.12)';
          e.currentTarget.style.borderColor = 'rgba(220,38,38,0.25)';
        }}
      >
        🚪 Sign Out
      </button>

      {/* Footer */}
      <div className="sidebar-footer">
        <div>EventHub v1.0</div>
        <small>© 2026 Event Management</small>
      </div>

    </aside>
  );
}

export default Navbar;