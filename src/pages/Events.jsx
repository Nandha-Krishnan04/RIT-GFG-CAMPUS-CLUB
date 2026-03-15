import { useState, useEffect } from 'react';

const events = [
    { id: 1, title: 'CodeStorm 2026', type: 'Hackathon', date: 'Mar 25, 2026', time: '10:00 AM', location: 'Online', registered: 120, badge: 'badge-blue' },
    { id: 2, title: 'Web Dev Bootcamp', type: 'Workshop', date: 'Mar 28, 2026', time: '2:00 PM', location: 'Room 302, CS Block', registered: 45, badge: 'badge-green' },
    { id: 3, title: 'DSA Challenge', type: 'Contest', date: 'Apr 1, 2026', time: '6:00 PM', location: 'Online', registered: 200, badge: 'badge-orange' },
    { id: 4, title: 'AI/ML Workshop', type: 'Workshop', date: 'Apr 5, 2026', time: '3:00 PM', location: 'Auditorium', registered: 60, badge: 'badge-green' },
    { id: 5, title: 'Code Golf Sprint', type: 'Contest', date: 'Apr 10, 2026', time: '7:00 PM', location: 'Online', registered: 95, badge: 'badge-orange' },
    { id: 6, title: 'Open Source Summit', type: 'Hackathon', date: 'Apr 15, 2026', time: '9:00 AM', location: 'Online', registered: 150, badge: 'badge-blue' },
];

const filters = ['All Events', 'Hackathons', 'Workshops', 'Contests'];

export default function Events() {
    const [activeFilter, setActiveFilter] = useState('All Events');
    const [countdown, setCountdown] = useState({ days: 10, hours: 14, mins: 32, secs: 45 });

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                let { days, hours, mins, secs } = prev;
                secs--;
                if (secs < 0) { secs = 59; mins--; }
                if (mins < 0) { mins = 59; hours--; }
                if (hours < 0) { hours = 23; days--; }
                if (days < 0) return prev;
                return { days, hours, mins, secs };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const filtered = activeFilter === 'All Events' ? events :
        events.filter(e => e.type + 's' === activeFilter || e.type === activeFilter.slice(0, -1));

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Upcoming Events</h1>
                <p className="page-subtitle">Participate in hackathons, workshops, coding contests, and more!</p>
            </div>

            <div className="featured-event">
                <div className="featured-event-info">
                    <h3>🏆 CodeStorm 2026 Hackathon</h3>
                    <p>48-hour coding marathon • Build innovative solutions • Win prizes worth ₹50,000</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="countdown">
                        {[['days', countdown.days], ['hours', countdown.hours], ['mins', countdown.mins], ['secs', countdown.secs]].map(([label, val]) => (
                            <div key={label} className="countdown-box">
                                <div className="countdown-num">{String(val).padStart(2, '0')}</div>
                                <div className="countdown-label">{label}</div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary">Register Now</button>
                </div>
            </div>

            <div className="filter-pills" style={{ marginBottom: 24 }}>
                {filters.map(f => (
                    <button key={f} className={`filter-pill ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                ))}
            </div>

            <div className="grid-3">
                {filtered.map(event => (
                    <div key={event.id} className="card event-card">
                        <span className={`badge ${event.badge} event-card-badge`}>{event.type}</span>
                        <h3>{event.title}</h3>
                        <div className="event-card-meta">
                            <span>📅 {event.date} • {event.time}</span>
                            <span>📍 {event.location}</span>
                        </div>
                        <div className="event-card-footer">
                            <span>👥 {event.registered} registered</span>
                            <button className="btn btn-primary btn-sm">Register</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
