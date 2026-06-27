import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const API = `${import.meta.env.VITE_API_URL}/registrations`;
const PAGE_SIZE = 5;

function getAvatar(name = '') {
  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colours = [
    '#7C5CFC', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B',
    '#10B981', '#3B82F6', '#EF4444', '#14B8A6', '#F97316',
  ];
  const idx = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % colours.length;
  return { initials, colour: colours[idx] };
}

function RegistrationList() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`${API}/${deleteTarget.id}`, { method: 'DELETE' });
      setRegistrations((prev) => prev.filter((r) => r._id !== deleteTarget.id));
      showToast('Registration deleted successfully.');
    } catch {
      showToast('Failed to delete registration.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const filtered = registrations.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.userName || '').toLowerCase().includes(q) ||
      (r.contact || '').toLowerCase().includes(q) ||
      (r.NameofEvent || '').toLowerCase().includes(q) ||
      (r.roomNo || '').toLowerCase().includes(q) ||
      (r.paymentStatus || '').toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    let va = a[sortKey]; let vb = b[sortKey];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = (vb || '').toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalTickets = registrations.reduce((s, r) => s + (r.ticketCount || 0), 0);
  const paidCount    = registrations.filter(r => r.paymentStatus === 'Paid').length;
  const unpaidCount  = registrations.filter(r => r.paymentStatus !== 'Paid').length;

  const username = localStorage.getItem('username') || 'Admin';

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const exportCSV = () => {
    const headers = ['#', 'User Name', 'Tickets', 'Contact', 'Event Name', 'Event Date', 'Room No', 'Payment Status'];
    const rows = registrations.map((r, i) => [
      i + 1, r.userName, r.ticketCount, r.contact,
      r.NameofEvent || '', r.Date ? new Date(r.Date).toLocaleDateString('en-IN') : '',
      r.roomNo || '—', r.paymentStatus
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'registrations.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully.');
  };

  const exportPDF = () => {
    const rows = registrations.map((r, i) => `
      <tr>
        <td>${i + 1}</td><td>${r.NameofEvent || '—'}</td>
        <td>${r.Date ? new Date(r.Date).toLocaleDateString('en-IN') : '—'}</td>
        <td>${r.roomNo || '—'}</td><td>${r.userName}</td>
        <td>${r.ticketCount}</td><td>${r.contact}</td><td>${r.paymentStatus}</td>
      </tr>`).join('');
    const html = `
      <html><head><title>Registrations</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        h2 { margin-bottom: 16px; color: #1e1b4b; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #eef2ff; color: #4f46e5; padding: 10px 12px; text-align: left; }
        td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
        tr:nth-child(even) { background: #fafafa; }
      </style></head>
      <body>
        <h2>Event Registration Report</h2>
        <p style="color:#6b7280;margin-bottom:16px">
          Total: ${registrations.length} | Paid: ${paidCount} | Pending: ${unpaidCount} | Tickets: ${totalTickets}
        </p>
        <table>
          <thead><tr>
            <th>#</th><th>Event Name</th><th>Event Date</th>
            <th>Room No</th><th>User Name</th><th>Tickets</th>
            <th>Contact</th><th>Payment Status</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
    showToast('PDF print dialog opened.');
  };

  const thStyle = (key) => ({
    cursor: 'pointer', userSelect: 'none',
    background: sortKey === key ? '#e8e6ff' : undefined,
    transition: 'background 0.15s',
  });

  return (
    <div>

      {/* ── Dashboard header ── */}
      <div className="dashboard-header">
        <div>
          <h1>Event Dashboard 👋</h1>
          <p>Manage registrations, events and attendees effortlessly</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="header-icon-btn" onClick={toggle} title="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="header-icon-btn" title="Notifications">🔔</button>

          {/* ── Profile chip with purple avatar circle ── */}
          <div className="profile-chip">
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #818cf8, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: 'white', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(109,40,217,0.4)',
            }}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{username}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Event Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Page title + illustration ── */}
      <div className="page-title-row">
        <div className="page-header">
          <h1>All Registrations</h1>
          <p>View and manage all event registrations</p>
        </div>
        <div className="page-illustration">
          <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="28" width="88" height="78" rx="14" fill="#EDE9FE" />
            <rect x="18" y="28" width="88" height="26" rx="14" fill="#7C5CFC" />
            <rect x="18" y="44" width="88" height="10" fill="#7C5CFC" />
            <rect x="40" y="20" width="8" height="18" rx="4" fill="#6548F7" />
            <rect x="76" y="20" width="8" height="18" rx="4" fill="#6548F7" />
            <rect x="32" y="66" width="8" height="8" rx="2" fill="#7C5CFC" />
            <rect x="50" y="66" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="68" y="66" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="86" y="66" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="32" y="80" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="50" y="80" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="68" y="80" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="86" y="80" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="32" y="94" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="50" y="94" width="8" height="8" rx="2" fill="#C4B5FD" />
            <rect x="68" y="94" width="8" height="8" rx="2" fill="#C4B5FD" />
            <circle cx="118" cy="42" r="20" fill="#FEF3C7" />
            <text x="108" y="48" fontSize="18">⭐</text>
            <text x="130" y="22" fontSize="12">✨</text>
          </svg>
        </div>
      </div>

      {/* ── Welcome banner ── */}
      <div className="welcome-banner">
        <div>
          <h2>Welcome Back 👋</h2>
          <p>Manage registrations, track attendees, and monitor event performance from one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add')}>
          + New Registration
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div className="stat-info">
            <span className="stat-value">{registrations.length}</span>
            <span className="stat-label">Total Registrations</span>
            <span className="stat-delta">+2 from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <span className="stat-value">{paidCount}</span>
            <span className="stat-label">Paid</span>
            <span className="stat-delta stat-delta--green">+1 from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{unpaidCount}</span>
            <span className="stat-label">Pending Payment</span>
            <span className="stat-delta stat-delta--warn">-1 from last week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce7f3' }}>🎟️</div>
          <div className="stat-info">
            <span className="stat-value">{totalTickets}</span>
            <span className="stat-label">Total Tickets</span>
            <span className="stat-delta">+24 from last week</span>
          </div>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div className="search-bar">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input" type="text"
                placeholder="Search by name, contact, event, room..."
                value={search} onChange={handleSearchChange}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={exportCSV}>📥 Export CSV</button>
            <button className="btn btn-success" onClick={exportPDF}>🖨️ Export PDF</button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state"><div className="empty-state-icon">⏳</div><p>Loading registrations...</p></div>
        ) : registrations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No registrations found</p>
            <span>Add your first registration to get started</span>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th style={{ minWidth: 40 }}>#</th>
                    <th style={{ minWidth: 160, ...thStyle('userName') }} onClick={() => handleSort('userName')}>User Name {sortIcon('userName')}</th>
                    <th style={{ minWidth: 100, ...thStyle('ticketCount') }} onClick={() => handleSort('ticketCount')}>Tickets {sortIcon('ticketCount')}</th>
                    <th style={{ minWidth: 160, ...thStyle('contact') }} onClick={() => handleSort('contact')}>Contact {sortIcon('contact')}</th>
                    <th style={{ minWidth: 160, ...thStyle('NameofEvent') }} onClick={() => handleSort('NameofEvent')}>Event Name {sortIcon('NameofEvent')}</th>
                    <th style={{ minWidth: 130, ...thStyle('Date') }} onClick={() => handleSort('Date')}>Event Date {sortIcon('Date')}</th>
                    <th style={{ minWidth: 110, ...thStyle('roomNo') }} onClick={() => handleSort('roomNo')}>Room No {sortIcon('roomNo')}</th>
                    <th style={{ minWidth: 130, ...thStyle('paymentStatus') }} onClick={() => handleSort('paymentStatus')}>Payment Status {sortIcon('paymentStatus')}</th>
                    <th style={{ minWidth: 160 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No results found for "{search}"</td></tr>
                  ) : (
                    paginated.map((reg, index) => {
                      const av = getAvatar(reg.userName);
                      return (
                        <tr key={reg._id}>
                          <td style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{(page - 1) * PAGE_SIZE + index + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: '50%',
                                background: av.colour, color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 12, flexShrink: 0,
                              }}>{av.initials}</div>
                              <span style={{ fontWeight: 600 }}>{reg.userName}</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: 700, padding: '3px 10px', borderRadius: 20, fontSize: 13 }}>
                              {reg.ticketCount}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{reg.contact}</td>
                          <td>
                            <span style={{ fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-bg)', padding: '3px 10px', borderRadius: 20, fontSize: 12, whiteSpace: 'nowrap' }}>
                              {reg.NameofEvent || '—'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>📅 {formatDate(reg.Date)}</td>
                          <td>
                            {reg.roomNo ? (
                              <span style={{ background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0', fontWeight: 700, padding: '3px 10px', borderRadius: 20, fontSize: 12, whiteSpace: 'nowrap' }}>
                                🚪 {reg.roomNo}
                              </span>
                            ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                          </td>
                          <td>
                            <span className={reg.paymentStatus === 'Paid' ? 'badge badge-paid' : 'badge badge-notpaid'}>
                              {reg.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button className="btn btn-edit" onClick={() => navigate(`/edit/${reg._id}`)}>✏️ Edit</button>
                              <button className="btn btn-delete" onClick={() => setDeleteTarget({ id: reg._id, name: reg.userName })}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
                </span>
                <div className="pagination-controls">
                  <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                  <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={'page-btn' + (p === page ? ' page-btn--active' : '')} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                  <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon-wrap">⚠️</div>
            <h3>Delete Registration?</h3>
            <p>
              You're about to permanently delete the registration for{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{deleteTarget.name}</strong>.
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-delete" onClick={handleDelete}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default RegistrationList;