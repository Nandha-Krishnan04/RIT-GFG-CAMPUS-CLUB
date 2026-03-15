import { useState } from 'react';

const leadership = [
    { name: 'Rahul Sharma', role: 'President', branch: 'B.Tech CSE, 4th Year', xp: 2450, color: '#4B6BF5', accent: 'gold', initial: 'RS' },
    { name: 'Priya Patel', role: 'Vice President', branch: 'B.Tech IT, 3rd Year', xp: 2280, color: '#8B5CF6', accent: 'silver', initial: 'PP' },
    { name: 'Arjun Kumar', role: 'Technical Lead', branch: 'B.Tech CSE, 3rd Year', xp: 2150, color: '#EC4899', accent: 'bronze', initial: 'AK' },
];

const members = [
    { name: 'Sneha Reddy', role: 'Content Head', branch: 'B.Tech ECE, 3rd Year', stat: 'Articles: 35', color: '#F59E0B', initial: 'SR' },
    { name: 'Vikram Singh', role: 'Event Manager', branch: 'B.Tech ME, 3rd Year', stat: 'Events: 12', color: '#22C55E', initial: 'VS' },
    { name: 'Ananya Gupta', role: 'Design Lead', branch: 'B.Tech CSE, 2nd Year', stat: 'Designs: 48', color: '#06B6D4', initial: 'AG' },
    { name: 'Rohit Jain', role: 'Social Media', branch: 'B.Tech IT, 2nd Year', stat: 'Posts: 120', color: '#EF4444', initial: 'RJ' },
];

const tabs = ['Core Team', 'Technical Leads', 'Event Managers', 'Mentors'];

export default function Team() {
    const [activeTab, setActiveTab] = useState('Core Team');

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Meet Our Team</h1>
                <p className="page-subtitle">The passionate minds behind GFG Campus Club</p>
            </div>

            <div className="filter-pills" style={{ marginBottom: 32 }}>
                {tabs.map(t => (
                    <button key={t} className={`filter-pill ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                ))}
            </div>

            <div className="grid-3" style={{ marginBottom: 40 }}>
                {leadership.map((p, i) => (
                    <div key={i} className="card team-card" style={{ borderTop: `3px solid ${p.accent === 'gold' ? '#F59E0B' : p.accent === 'silver' ? '#9CA3AF' : '#D97706'}` }}>
                        <span className={`badge badge-${p.accent}`} style={{ marginBottom: 16 }}>{p.role}</span>
                        <div className="team-avatar" style={{ background: p.color }}>{p.initial}</div>
                        <h4>{p.name}</h4>
                        <p className="branch">{p.branch}</p>
                        <span className="badge badge-blue">{p.xp.toLocaleString()} XP</span>
                        <div className="team-socials" style={{ marginTop: 16 }}>
                            <a href="#" title="GitHub">GH</a>
                            <a href="#" title="LinkedIn">LI</a>
                            <a href="#" title="Twitter">TW</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-4">
                {members.map((m, i) => (
                    <div key={i} className="card team-card-sm">
                        <div className="team-avatar" style={{ background: m.color, width: 48, height: 48, fontSize: 18 }}>{m.initial}</div>
                        <h4>{m.name}</h4>
                        <p className="role">{m.role}</p>
                        <p className="branch">{m.branch}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>{m.stat}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
