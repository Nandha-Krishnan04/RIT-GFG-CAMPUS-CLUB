import { useState } from 'react';

const players = [
    { rank: 1, name: 'Rahul Sharma', college: 'IIT Delhi', xp: 2450, color: '#4B6BF5', initial: 'RS', badge: 'badge-gold' },
    { rank: 2, name: 'Priya Patel', college: 'NIT Trichy', xp: 2280, color: '#8B5CF6', initial: 'PP', badge: 'badge-silver' },
    { rank: 3, name: 'Arjun Kumar', college: 'BITS Pilani', xp: 2150, color: '#EC4899', initial: 'AK', badge: 'badge-bronze' },
    { rank: 4, name: 'Sneha Reddy', college: 'VIT Vellore', xp: 1980, color: '#F59E0B', initial: 'SR', badge: 'badge-gray' },
    { rank: 5, name: 'Vikram Singh', college: 'DTU Delhi', xp: 1850, color: '#22C55E', initial: 'VS', badge: 'badge-gray' },
];

const rankColors = { 1: '#F59E0B', 2: '#9CA3AF', 3: '#D97706', 4: '#6B7280', 5: '#6B7280' };

export default function Leaderboard() {
    const [timeFilter, setTimeFilter] = useState('All Time');

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Leaderboard</h1>
                <p className="page-subtitle">See who's leading the GFG Campus Club</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div className="filter-pills">
                    {['All Time', 'This Month', 'This Week'].map(f => (
                        <button key={f} className={`filter-pill ${timeFilter === f ? 'active' : ''}`} onClick={() => setTimeFilter(f)}>{f}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span>Total: 500 participants</span>
                    <span className="badge badge-blue">Your Rank: #12</span>
                </div>
            </div>

            <div className="leaderboard-layout">
                <div className="card featured-player">
                    <div className="rank-badge">🏆 1st Rank</div>
                    <div className="avatar">{players[0].initial}</div>
                    <div className="stars">⭐⭐⭐</div>
                    <h3>{players[0].name}</h3>
                    <p className="role">Full-Stack Developer</p>
                    <div className="xp">{players[0].xp.toLocaleString()} XP</div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>View Profile</button>
                </div>

                <div className="card" style={{ padding: 0 }}>
                    {players.map((p, i) => (
                        <div key={i} className="rank-row">
                            <span className="rank-num" style={{ color: rankColors[p.rank] }}>{p.rank}</span>
                            <div className="rank-avatar" style={{ background: p.color }}>{p.initial}</div>
                            <div className="rank-info-text">
                                <h5>{p.name}</h5>
                                <p>{p.college}</p>
                            </div>
                            <span className={`badge ${p.badge}`}>{p.xp.toLocaleString()} XP</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
