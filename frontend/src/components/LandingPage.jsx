import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

function LandingPage() {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const features = [
    { icon: '📋', title: 'Easy Registration', desc: 'Add attendees instantly with name, contact, ticket count and payment status in seconds.' },
    { icon: '💳', title: 'Payment Tracking', desc: 'Track Paid and Pending payments at a glance with color-coded status badges.' },
    { icon: '🔍', title: 'Smart Search', desc: 'Search registrations by name, email or phone number in real time.' },
    { icon: '📊', title: 'Live Dashboard', desc: 'See total registrations, paid count and pending payments on a live stats dashboard.' },
    { icon: '📥', title: 'Export Reports', desc: 'Download all registration data as CSV or print a formatted PDF report instantly.' },
    { icon: '🔒', title: 'Secure & Reliable', desc: 'All data stored securely in MongoDB. Full CRUD operations with confirmation dialogs.' },
  ];

  const steps = [
    { number: '01', title: 'Add Registration', desc: 'Enter attendee details including name, tickets, contact and payment status.' },
    { number: '02', title: 'Manage & Track', desc: 'View all registrations in a sortable, searchable table with live stats.' },
    { number: '03', title: 'Export & Report', desc: 'Download CSV or print a PDF report of all registrations anytime.' },
  ];

  const stats = [
    { value: 'MERN', label: 'Stack' },
    { value: 'CRUD', label: 'Operations' },
    { value: 'CSV + PDF', label: 'Export Formats' },
    { value: 'Real-Time', label: 'Dashboard' },
  ];

  const techStack = [
    { emoji: '🍃', name: 'MongoDB', desc: 'Database' },
    { emoji: '⚡', name: 'Express.js', desc: 'Backend API' },
    { emoji: '⚛️', name: 'React.js', desc: 'Frontend UI' },
    { emoji: '🟢', name: 'Node.js', desc: 'Server Runtime' },
  ];

  return (
    <div
      className="landing-page"
      style={{
        fontFamily: "'Poppins', sans-serif",
        color: dark ? '#E9E7FF' : '#1E1B4B',
        background: dark ? '#0F0E2A' : '#F8F9FF',
        overflowX: 'hidden'
      }}
    >
      {/* Mobile responsive styles */}
      <style>{`
        .hero-section {
          padding: 100px 48px 90px;
        }
        .hero-title {
          font-size: 56px;
          font-weight: 800;
          color: white;
          margin: 0 0 20px;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: 17px;
          color: rgba(255,255,255,0.65);
          max-width: 520px;
          margin: 0 auto 48px;
          line-height: 1.75;
          font-weight: 400;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 980px;
          margin: 0 auto;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 880px;
          margin: 0 auto;
          position: relative;
        }
        .connector-line {
          position: absolute;
          top: 30px;
          left: 16%;
          right: 16%;
          height: 2px;
          background: linear-gradient(90deg, #7C5CFC, #A78BFA);
          opacity: 0.25;
          z-index: 0;
        }
        .tech-grid {
          display: flex;
          gap: 18px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-section {
          margin: 0 48px 80px;
          padding: 56px 48px;
        }
        .cta-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin: 0 0 12px;
          letter-spacing: -0.03em;
        }
        .section-padding {
          padding: 88px 48px;
        }
        .stats-strip-padding {
          padding: 32px 48px;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 20px 50px !important;
          }
          .hero-title {
            font-size: 30px !important;
            letter-spacing: -0.02em !important;
          }
          .hero-subtitle {
            font-size: 14px !important;
            margin: 0 auto 32px !important;
          }
          .stats-strip-padding {
            padding: 20px 16px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .section-padding {
            padding: 50px 16px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .connector-line {
            display: none !important;
          }
          .tech-grid {
            gap: 12px !important;
          }
          .cta-section {
            margin: 0 12px 40px !important;
            padding: 32px 20px !important;
          }
          .cta-title {
            font-size: 22px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 26px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="hero-section"
        style={{
          background: dark
            ? 'linear-gradient(135deg, #090915 0%, #12122B 55%, #1C1C45 100%)'
            : 'linear-gradient(135deg, #1E1B4B 0%, #312e81 55%, #5B4CF0 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background orbs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(124,92,252,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '10%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(167,139,250,0.08)', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,92,252,0.2)',
          border: '1px solid rgba(167,139,250,0.4)',
          borderRadius: 24, padding: '7px 20px', marginBottom: 28,
        }}>
          <span style={{ fontSize: 14, color: '#A78BFA', fontWeight: 700, letterSpacing: '0.04em' }}>✦ MERN Stack Project</span>
        </div>

        <h1 className="hero-title">
          Event Registration<br />
          <span style={{ color: '#A78BFA' }}>Management System</span>
        </h1>

        <p className="hero-subtitle">
          A professional full-stack web application to manage event attendees,
          track payments, and generate reports — all in one place.
        </p>

        <button
          onClick={() => navigate('/registrations')}
          style={{
            background: dark ? '#2A2652' : 'white',
            color: dark ? '#E9E7FF' : '#7C5CFC',
            border: '1px solid transparent',
            ...(dark && { borderColor: '#4C4590' }),
            padding: '15px 40px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
          }}
        >
          Get Started →
        </button>

        <div style={{ position: 'absolute', top: 32, right: 60, opacity: 0.18, pointerEvents: 'none' }}>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="80" stroke="white" strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="90" cy="90" r="50" stroke="white" strokeWidth="1.5" opacity="0.5" />
            <circle cx="90" cy="90" r="20" fill="white" opacity="0.3" />
          </svg>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section
        className="stats-strip-padding"
        style={{
          background: 'linear-gradient(135deg, #1E1B4B, #312e81)',
          borderBottom: '1px solid rgba(124,92,252,0.2)',
        }}
      >
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#A78BFA', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section-padding" style={{ background: 'var(--bg-page)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--primary-bg)', color: 'var(--primary)',
            fontSize: 11, fontWeight: 700,
            padding: '5px 16px', borderRadius: 20,
            letterSpacing: '0.08em', marginBottom: 16,
            textTransform: 'uppercase', border: '1px solid rgba(124,92,252,0.2)',
          }}>Features</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Everything you need to manage events
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Built with React, Express.js, Node.js and MongoDB — a complete MERN stack solution.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: dark ? '#1E1D3D' : '#ffffff',
                borderRadius: 20,
                padding: '30px 26px',
                border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEBFF',
                boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.45)' : '0 4px 16px rgba(124,92,252,0.06)',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#C4B5FD';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.08)' : '#ECEBFF';
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: 'var(--primary-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 18,
                border: '1px solid rgba(124,92,252,0.15)',
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        className="section-padding"
        style={{ background: dark ? '#16152F' : '#ffffff' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--primary-bg)', color: 'var(--primary)',
            fontSize: 11, fontWeight: 700,
            padding: '5px 16px', borderRadius: 20,
            letterSpacing: '0.08em', marginBottom: 16,
            textTransform: 'uppercase', border: '1px solid rgba(124,92,252,0.2)',
          }}>How it works</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Three simple steps
          </h2>
        </div>

        <div className="steps-grid">
          <div className="connector-line" />
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 62, height: 62, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: 'white',
                margin: '0 auto 22px',
                boxShadow: '0 8px 24px rgba(124,92,252,0.35)',
                border: '3px solid white',
              }}>{s.number}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="section-padding" style={{ background: 'var(--bg-page)', paddingTop: 72, paddingBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Built with the MERN Stack
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            Industry-standard technologies used by top companies worldwide
          </p>
        </div>

        <div className="tech-grid">
          {techStack.map((t, i) => (
            <div
              key={i}
              style={{
                background: dark ? '#1E1D3D' : '#ffffff',
                borderRadius: 20,
                padding: '30px 26px',
                border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #ECEBFF',
                boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.45)' : '0 4px 16px rgba(124,92,252,0.06)',
                transition: 'all 0.25s',
                minWidth: 130, textAlign: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#C4B5FD';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.08)' : '#ECEBFF';
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>{t.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="cta-section"
        style={{
          background: dark
            ? 'linear-gradient(135deg, #1B1838, #2D285A)'
            : 'linear-gradient(135deg, #7C5CFC, #9F7AEA)',
          borderRadius: 28,
          textAlign: 'center',
          boxShadow: dark
            ? '0 20px 50px rgba(0,0,0,0.45)'
            : '0 20px 50px rgba(124,92,252,0.3)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <h2 className="cta-title">
          Ready to manage your events? 🚀
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', margin: '0 auto', maxWidth: 440, lineHeight: 1.7 }}>
          Start organizing, tracking and reporting your event registrations today.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#1E1B4B',
        padding: '28px 48px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(124,92,252,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#A78BFA', fontWeight: 800, fontSize: 13,
          }}>EH</div>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14 }}>EventHub</span>
        </div>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>
          © 2026 Event Registration Management System &nbsp;·&nbsp; Built with ❤️ using MERN Stack
        </p>
      </footer>

    </div>
  );
}

export default LandingPage;