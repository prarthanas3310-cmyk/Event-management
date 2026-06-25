import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EVENTS_API = 'http://localhost:3000/events';

function AddEvent() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [rooms, setRooms] = useState([{ roomNo: '', capacity: '' }]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleRoomChange = (i, field, val) => {
    setRooms(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const addRoom = () => setRooms(prev => [...prev, { roomNo: '', capacity: '' }]);
  const removeRoom = (i) => setRooms(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!name.trim() || !date || rooms.some(r => !r.roomNo.trim() || !r.capacity)) {
      setError('Please fill in all fields.'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(EVENTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, date,
          rooms: rooms.map(r => ({ roomNo: r.roomNo, capacity: Number(r.capacity) })),
        }),
      });
      if (!res.ok) throw new Error();
      navigate('/registrations');
    } catch {
      setError('Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <button className="back-btn" onClick={() => navigate('/registrations')}>← Back</button>

      {/* Title row with illustration */}
      <div className="page-title-row">
        <div className="form-header">
          <h1 className="form-title">
            Create a <span style={{ color: 'var(--primary)' }}>New Event</span>
          </h1>
          <p className="form-subtitle">Create an event with rooms and seat limits</p>
        </div>

        {/* Floating calendar illustration */}
        <div className="page-illustration">
          <svg viewBox="0 0 170 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Back calendar (shadow) */}
            <rect x="42" y="24" width="86" height="90" rx="14" fill="#C4B5FD" opacity="0.4" transform="rotate(-6 42 24)" />
            {/* Main calendar */}
            <rect x="28" y="28" width="90" height="90" rx="14" fill="white" stroke="#E5E7EB" strokeWidth="1.5" />
            {/* Header */}
            <rect x="28" y="28" width="90" height="28" rx="14" fill="#7C5CFC" />
            <rect x="28" y="42" width="90" height="14" fill="#7C5CFC" />
            {/* Binding rings */}
            <rect x="50" y="20" width="8" height="18" rx="4" fill="#6548F7" />
            <rect x="88" y="20" width="8" height="18" rx="4" fill="#6548F7" />
            {/* Month label */}
            <text x="55" y="45" fontSize="10" fill="white" fontWeight="700">JUNE 2026</text>
            {/* Day grid */}
            {[0,1,2,3,4,5,6].map(d => (
              <text key={d} x={36 + d * 12} y={72} fontSize="7" fill="#9CA3AF">{['S','M','T','W','T','F','S'][d]}</text>
            ))}
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((n, i) => {
              const col = i % 7; const row = Math.floor(i / 7);
              const isToday = n === 24;
              return (
                <g key={n}>
                  {isToday && <circle cx={38 + col * 12} cy={82 + row * 12} r="6" fill="#7C5CFC" />}
                  <text x={35 + col * 12} y={85 + row * 12} fontSize="7"
                    fill={isToday ? 'white' : '#374151'} fontWeight={isToday ? 700 : 400}>
                    {n}
                  </text>
                </g>
              );
            })}
            {/* Star badge */}
            <circle cx="132" cy="52" r="22" fill="#FEF3C7" />
            <text x="120" y="59" fontSize="20">⭐</text>
            {/* Sparkles */}
            <text x="140" y="28" fontSize="12">✨</text>
            <text x="14" y="90" fontSize="10" opacity="0.5">✦</text>
            <text x="150" y="100" fontSize="10" opacity="0.4">✦</text>
          </svg>
        </div>
      </div>

      {/* Form card */}
      <div className="card registration-form-card">
        {error && <div className="form-error">⚠️ {error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Event Name</label>
            <input className="form-control" type="text" placeholder="e.g. Tech Summit 2026"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Date</label>
            <input className="form-control" type="date"
              value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Rooms &amp; Seat Limits</label>
          {rooms.length === 0 && (
            <div className="rooms-empty-hint">
              No rooms added yet. Add rooms to manage seat limits.
            </div>
          )}
          {rooms.map((room, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <input className="form-control" type="text" placeholder="Room No (e.g. Room 1)"
                value={room.roomNo} onChange={e => handleRoomChange(i, 'roomNo', e.target.value)}
                style={{ flex: 2 }} />
              <input className="form-control" type="number" placeholder="Seat Capacity"
                value={room.capacity} onChange={e => handleRoomChange(i, 'capacity', e.target.value)}
                style={{ flex: 1 }} min="1" />
              {rooms.length > 1 && (
                <button className="btn btn-delete" onClick={() => removeRoom(i)}
                  style={{ padding: '8px 12px', fontSize: 13 }}>✕</button>
              )}
            </div>
          ))}
          <button className="btn btn-cancel" onClick={addRoom}
            style={{ marginTop: 4, fontSize: 13 }}>+ Add Room</button>
        </div>

        {/* Make every event count card */}
        <div className="event-count-card">
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--primary)', marginBottom: 4 }}>
              Make every event count ✨
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Organize. Engage. Succeed. 🎉</div>
          </div>
          <span style={{ fontSize: 32 }}>🎊</span>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}
          style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 12, justifyContent: 'center', borderRadius: 12 }}>
          {saving ? '⏳ Saving...' : '⭐ Create Event'}
        </button>
      </div>
    </div>
  );
}

export default AddEvent;