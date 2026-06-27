import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API = `${import.meta.env.VITE_API_URL}/registrations`;
const EVENTS_API = `${import.meta.env.VITE_API_URL}/events`;

function EditRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '', ticketCount: '', contact: '',
    paymentStatus: 'Not Paid', NameofEvent: '',
    Date: '', roomNo: '', eventId: '',
  });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [originalTickets, setOriginalTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [evRes, regRes] = await Promise.all([
        fetch(EVENTS_API), fetch(`${API}/${id}`)
      ]);
      const evData = await evRes.json();
      const reg = await regRes.json();
      setEvents(evData);

      const event = evData.find(ev => ev._id === reg.eventId);
      setSelectedEvent(event || null);
      const room = event?.rooms.find(r => r.roomNo === reg.roomNo);
      setSelectedRoom(room || null);
      setOriginalTickets(reg.ticketCount);

      setForm({
        userName: reg.userName || '',
        ticketCount: reg.ticketCount || '',
        contact: reg.contact || '',
        paymentStatus: reg.paymentStatus || 'Not Paid',
        NameofEvent: reg.NameofEvent || '',
        Date: reg.Date ? new Date(reg.Date).toISOString().split('T')[0] : '',
        roomNo: reg.roomNo || '',
        eventId: reg.eventId || '',
      });
      setLoading(false);
    };
    load();
  }, [id]);

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

  const handleRoomChange = (roomNo) => {
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
      setError('Please fill in all fields before updating.');
      return;
    }
    if (selectedRoom) {
      const isSameRoom = form.roomNo === selectedRoom.roomNo;
      const refund = isSameRoom ? originalTickets : 0;
      const available = selectedRoom.capacity - selectedRoom.bookedSeats + refund;
      if (Number(form.ticketCount) > available) {
        setError(`Only ${available} seat(s) available in ${form.roomNo}.`);
        return;
      }
    }
    setError('');
    setSaving(true);
    try {
     const token = localStorage.getItem('token');
const res = await fetch(API, {
  method: 'PUT',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ ...form, ticketCount: Number(form.ticketCount) }),
});
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to update'); return; }
      navigate('/registrations');
    } catch {
      setError('Failed to update registration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="empty-state" style={{ marginTop: 80 }}>
      <div className="empty-state-icon">⏳</div>
      <p>Loading registration...</p>
    </div>
  );

  return (
    <div className="form-page">
      <button className="back-btn" onClick={() => navigate('/registrations')}>← Back</button>

      {/* Title row with edit illustration */}
      <div className="page-title-row">
        <div className="form-header">
          <h1 className="form-title">Edit Registration</h1>
          <p className="form-subtitle">Update the registration details below</p>
        </div>

        {/* Pencil / edit illustration */}
        <div className="page-illustration">
          <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Document */}
            <rect x="20" y="20" width="90" height="110" rx="14" fill="#EDE9FE" />
            <rect x="20" y="20" width="90" height="110" rx="14" stroke="#C4B5FD" strokeWidth="1.5" />
            {/* Lines */}
            <rect x="34" y="48" width="62" height="6" rx="3" fill="#C4B5FD" />
            <rect x="34" y="62" width="50" height="6" rx="3" fill="#DDD6FE" />
            <rect x="34" y="76" width="58" height="6" rx="3" fill="#DDD6FE" />
            <rect x="34" y="90" width="42" height="6" rx="3" fill="#EDE9FE" />
            <rect x="34" y="104" width="54" height="6" rx="3" fill="#EDE9FE" />
            {/* Folded top corner */}
            <path d="M86 20 L110 20 L110 44 Z" fill="#C4B5FD" opacity="0.6" />
            {/* Large pencil overlapping */}
            <g transform="rotate(-20 125 95)">
              <rect x="112" y="52" width="14" height="56" rx="4" fill="#F59E0B" />
              <rect x="112" y="50" width="14" height="8" rx="2" fill="#9CA3AF" />
              <polygon points="112,108 126,108 119,124" fill="#1E1B4B" />
              <rect x="115" y="108" width="8" height="4" fill="#FCA5A5" />
              {/* Pencil shine */}
              <rect x="114" y="56" width="3" height="40" rx="1.5" fill="rgba(255,255,255,0.4)" />
            </g>
            {/* Sparkles */}
            <text x="8" y="36" fontSize="13">✨</text>
            <text x="138" y="30" fontSize="10">✦</text>
            <text x="14" y="118" fontSize="9" opacity="0.4">✦</text>
          </svg>
        </div>
      </div>

      <div className="registration-form-card">
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
            <div className="room-grid">
              {selectedEvent.rooms.map(room => {
                const isSameRoom = room.roomNo === form.roomNo;
                const refund = isSameRoom ? originalTickets : 0;
                const available = room.capacity - room.bookedSeats + refund;
                const isFull = available <= 0;
                const isSelected = form.roomNo === room.roomNo;
                return (
                  <button
                    key={room.roomNo}
                    type="button"
                    disabled={isFull}
                    onClick={() => !isFull && handleRoomChange(room.roomNo)}
                    className={`room-card ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
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
            <input className="form-control readonly-field" type="date" value={form.Date} readOnly />
          </div>
        )}

        <div className="form-grid-2">
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
                  (max: {selectedRoom.capacity - selectedRoom.bookedSeats + originalTickets})
                </span>
              )}
            </label>
            <input className="form-control" type="number" name="ticketCount"
              placeholder="Enter number of tickets" value={form.ticketCount}
              onChange={handleChange} min="1" />
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

        <div className="form-actions">
          <button className="btn btn-cancel" onClick={() => navigate('/registrations')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? '⏳ Updating...' : '💾 Update Registration'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRegistration;