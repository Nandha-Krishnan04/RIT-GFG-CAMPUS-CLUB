import { Link } from 'react-router-dom';

export default function Home() {
    const stats = [
        { icon: '👥', number: '500+', label: 'Members' },
        { icon: '📅', number: '50+', label: 'Events' },
        { icon: '💻', number: '1000+', label: 'Problems Solved' },
        { icon: '🎓', number: '20+', label: 'Workshops' },
    ];

    return (
        <>
            <div className="hero">
                <div className="hero-content">
                    <div className="hero-avatars">
                        {['R', 'P', 'A', 'S'].map((l, i) => (
                            <div key={i} className="hero-avatar" style={{ background: ['#4B6BF5', '#8B5CF6', '#EC4899', '#F59E0B'][i] }}>{l}</div>
                        ))}
                    </div>
                    <p className="hero-trust">{'{ Trusted by 500+ students }'}</p>
                    <h2 className="hero-heading">Master Programming with</h2>
                    <h1 className="hero-title">GFG Campus Club</h1>
                    <p className="hero-subtitle">
                        Join 500+ students building projects, cracking contests, and landing internships.
                        Kickstart Your Coding Journey — No Boring Lectures, Just Real Practice!
                    </p>
                    <div className="hero-ctas">
                        <Link to="/practice" className="btn btn-primary btn-lg">Join Now</Link>
                        <Link to="/resources" className="btn btn-outline btn-lg">Explore Resources</Link>
                    </div>
                </div>
            </div>
            <div className="stats-row">
                {stats.map((s, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-number">{s.number}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ height: 60 }} />
        </>
    );
}
