import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/registrations`;
const EVENTS_API = `${import.meta.env.VITE_API_URL}/events`;

function AddRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '', ticketCount: '', contact: '',
    paymentStatus: 'Not Paid', NameofEvent: '',
    Date: '', roomNo: '', eventId: '',
  });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(EVENTS_API).then(r => r.json()).then(setEvents);
  }, []);

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    const event = events.find(ev => ev._id === eventId);
    setSelectedEvent(event || null);
    setSelectedRoom(null);
    setForm(prev => ({
      ...prev, eventId,
      NameofEvent: event ? event.name : '',
      Date: event ? new Date(event.date).toISOString().split('T')[0] : '',
      roomNo: '',
    }));
  };

  const handleRoomChange = (e) => {
    const roomNo = e.target.value;
    const room = selectedEvent?.rooms.find(r => r.roomNo === roomNo);
    setSelectedRoom(room || null);
    setForm(prev => ({ ...prev, roomNo }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.userName.trim() || !form.ticketCount || !form.contact.trim() ||
        !form.eventId || !form.roomNo) {
      setError('Please fill in all fields before saving.');
      return;
    }
    if (selectedRoom) {
      const available = selectedRoom.capacity - selectedRoom.bookedSeats;
      if (Number(form.ticketCount) > available) {
        setError(`Only ${available} seat(s) available in ${form.roomNo}.`);
        return;
      }
    }
    setError('');
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ticketCount: Number(form.ticketCount) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); return; }
      navigate('/registrations');
    } catch {
      setError('Failed to save registration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <button className="back-btn" onClick={() => navigate('/registrations')}>← Back to Registrations</button>

      {/* Title row with clipboard illustration */}
      <div className="page-title-row">
        <div className="form-header">
          <h1 className="form-title">
            Add <span style={{ color: 'var(--primary)' }}>New Registration</span>
          </h1>
          <p className="form-subtitle">Enter details to create a new registration</p>
        </div>

        {/* Clipboard illustration */}
        <div className="page-illustration">
          <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Clipboard body */}
            <rect x="30" y="30" width="90" height="100" rx="12" fill="#EDE9FE" />
            <rect x="30" y="30" width="90" height="100" rx="12" stroke="#C4B5FD" strokeWidth="1.5" />
            {/* Clipboard top clip */}
            <rect x="58" y="22" width="34" height="18" rx="9" fill="#7C5CFC" />
            <rect x="66" y="26" width="18" height="10" rx="5" fill="#EDE9FE" />
            {/* Lines */}
            <rect x="44" y="58" width="62" height="6" rx="3" fill="#C4B5FD" />
            <rect x="44" y="72" width="50" height="6" rx="3" fill="#DDD6FE" />
            <rect x="44" y="86" width="56" height="6" rx="3" fill="#DDD6FE" />
            <rect x="44" y="100" width="38" height="6" rx="3" fill="#EDE9FE" />
            {/* Pencil */}
            <g transform="rotate(-30 130 90)">
              <rect x="110" y="68" width="10" height="40" rx="3" fill="#F59E0B" />
              <polygon points="110,108 120,108 115,120" fill="#1E1B4B" />
              <rect x="110" y="66" width="10" height="6" rx="1" fill="#9CA3AF" />
            </g>
            {/* Sparkles */}
            <text x="12" y="40" fontSize="12">✨</text>
            <text x="135" y="35" fontSize="10">✦</text>
          </svg>
        </div>
      </div>

      <div className="card registration-form-card">
        {error && <div className="form-error">⚠️ {error}</div>}

        <div className="form-group">
          <label>Select Event</label>
          <select className="form-control" value={form.eventId} onChange={handleEventChange}>
            <option value="">-- Choose an Event --</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.name}</option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div className="form-group">
            <label>Select Room</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {selectedEvent.rooms.map(room => {
                const available = room.capacity - room.bookedSeats;
                const isFull = available <= 0;
                const isSelected = form.roomNo === room.roomNo;
                return (
                  <button
                    key={room.roomNo}
                    type="button"
                    disabled={isFull}
                    onClick={() => !isFull && handleRoomChange({ target: { value: room.roomNo } })}
                    style={{
                      padding: '10px 18px', borderRadius: 10,
                      cursor: isFull ? 'not-allowed' : 'pointer',
                      border: `2px solid ${isSelected ? 'var(--primary)' : isFull ? '#e5e7eb' : '#d1d5db'}`,
                      background: isSelected ? 'var(--primary-bg)' : isFull ? '#f9fafb' : 'white',
                      color: isFull ? 'var(--text-muted)' : isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      fontWeight: 600, fontSize: 13, transition: 'all 0.15s',
                    }}
                  >
                    {room.roomNo}
                    <span style={{ display: 'block', fontSize: 11, fontWeight: 400, marginTop: 2 }}>
                      {isFull ? '🚫 Full' : `${available} seats left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {form.Date && (
          <div className="form-group">
            <label>Event Date</label>
            <input className="form-control" type="date" value={form.Date} readOnly
              style={{ background: '#f3f4f6', color: 'var(--text-secondary)' }} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>User Name</label>
            <input className="form-control" type="text" name="userName"
              placeholder="Enter full name" value={form.userName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              Number of Tickets
              {selectedRoom && (
                <span style={{ fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 6 }}>
                  (max: {selectedRoom.capacity - selectedRoom.bookedSeats})
                </span>
              )}
            </label>
            <input className="form-control" type="number" name="ticketCount"
              placeholder="Enter number of tickets" value={form.ticketCount}
              onChange={handleChange} min="1"
              max={selectedRoom ? selectedRoom.capacity - selectedRoom.bookedSeats : undefined} />
          </div>
        </div>

        <div className="form-group">
          <label>Email / Phone Number</label>
          <input className="form-control" type="text" name="contact"
            placeholder="Enter email or phone number" value={form.contact} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Payment Status</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="paymentStatus" value="Paid"
                checked={form.paymentStatus === 'Paid'} onChange={handleChange} /> ✅ Paid
            </label>
            <label className="radio-label">
              <input type="radio" name="paymentStatus" value="Not Paid"
                checked={form.paymentStatus === 'Not Paid'} onChange={handleChange} /> ⏳ Not Paid
            </label>
          </div>
        </div>

        {/* "You're one step away!" nudge */}
        <div className="form-nudge">
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>You're one step away!</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Fill in the details and save the registration.</div>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={saving}
          style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 12, justifyContent: 'center', borderRadius: 12 }}
        >
          {saving ? '⏳ Saving...' : '💾 Save Registration'}
        </button>
      </div>
    </div>
  );
}

export default AddRegistration;