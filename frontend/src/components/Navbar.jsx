import { NavLink } from 'react-router-dom';

function Navbar() {
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

        <NavLink
          to="/add-event"
          className={({ isActive }) => 'nav-item' + (isActive ? ' nav-item--active' : '')}
        >
          <span className="nav-icon">📅</span>
          Add Event
        </NavLink>
      </nav>

      {/* Motivational Card */}
      <div className="sidebar-motive-card">
        {/* Decorative dots */}
        <div className="motive-dot motive-dot-1" />
        <div className="motive-dot motive-dot-2" />

        {/* Illustration: two people */}
        <div className="motive-illustration">
          <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Person 1 */}
            <circle cx="38" cy="22" r="11" fill="rgba(255,255,255,0.85)" />
            <rect x="25" y="36" width="26" height="28" rx="8" fill="rgba(255,255,255,0.7)" />
            {/* Person 2 */}
            <circle cx="72" cy="24" r="9" fill="rgba(255,255,255,0.6)" />
            <rect x="61" y="36" width="22" height="26" rx="7" fill="rgba(255,255,255,0.5)" />
            {/* Star sparkle */}
            <text x="88" y="18" fontSize="14" fill="rgba(255,220,80,0.9)">✨</text>
            {/* Small confetti dots */}
            <circle cx="16" cy="50" r="3" fill="rgba(255,255,255,0.35)" />
            <circle cx="100" cy="55" r="2.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="55" cy="68" r="2" fill="rgba(255,255,255,0.25)" />
          </svg>
        </div>

        <p className="motive-title">Let's make every event memorable ✨</p>
        <p className="motive-sub">Organize. Engage. Succeed. 🎉</p>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div>EventHub v1.0</div>
        <small>© 2026 Event Management</small>
      </div>

    </aside>
  );
}

export default Navbar;