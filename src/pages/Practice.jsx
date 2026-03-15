import { useState } from 'react';
import { Link } from 'react-router-dom';

const languages = [
    { title: 'Practice C++', icon: '⚙️', banner: '#3B82F6', iconBg: '#DBEAFE', problems: 250 },
    { title: 'Practice Python', icon: '🐍', banner: '#D97706', iconBg: '#FEF3C7', problems: 320 },
    { title: 'Practice Java', icon: '☕', banner: '#92400E', iconBg: '#FED7AA', problems: 280 },
    { title: 'Practice JavaScript', icon: '🟨', banner: '#EAB308', iconBg: '#FEF9C3', problems: 190 },
    { title: 'Practice SQL', icon: '🗄️', banner: '#22C55E', iconBg: '#DCFCE7', problems: 150 },
    { title: 'Practice HTML/CSS', icon: '🎨', banner: '#F97316', iconBg: '#FED7AA', problems: 100 },
];

const dsTopics = [
    { title: 'Arrays', difficulty: 'Easy', problems: 85 },
    { title: 'Linked Lists', difficulty: 'Medium', problems: 60 },
    { title: 'Stacks', difficulty: 'Easy', problems: 45 },
    { title: 'Queues', difficulty: 'Easy', problems: 40 },
    { title: 'Trees', difficulty: 'Medium', problems: 70 },
    { title: 'Graphs', difficulty: 'Hard', problems: 55 },
];

const tabs = ['Programming Languages', 'Projects', 'Beginner DSA', 'Data Structures', 'Algorithms'];

export default function Practice() {
    const [activeTab, setActiveTab] = useState('Programming Languages');

    return (
        <div className="page-container">
            <div className="practice-tabs">
                {tabs.map(t => (
                    <button key={t} className={`practice-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                ))}
            </div>

            <div className="page-header">
                <h1 className="page-title">Welcome to Practice!</h1>
                <p className="page-subtitle">Practice over 500+ problems in Python, Java, C++, JavaScript and more. Start with beginner friendly challenges and solve hard problems as you become better.</p>
            </div>

            <input className="search-bar" placeholder="Browse practice paths..." style={{ marginBottom: 32 }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700 }}>Programming Languages</h2>
                <Link to="/game" className="btn btn-primary">🎮 Enter Game Mode</Link>
            </div>

            <div className="grid-3" style={{ marginBottom: 48 }}>
                {languages.map((lang, i) => (
                    <div key={i} className="card lang-card">
                        <div className="lang-card-banner" style={{ background: lang.banner }} />
                        <div className="lang-card-body">
                            <div className="lang-card-icon" style={{ background: lang.iconBg }}>{lang.icon}</div>
                            <h4>{lang.title}</h4>
                            <p>{lang.problems} problems • Beginner to Advanced</p>
                            <span className="link">Start Practice →</span>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Data Structures</h2>
            <div className="grid-3">
                {dsTopics.map((ds, i) => (
                    <div key={i} className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <h4 style={{ fontSize: 16, fontWeight: 700 }}>{ds.title}</h4>
                            <span className={`badge ${ds.difficulty === 'Easy' ? 'badge-green' : ds.difficulty === 'Medium' ? 'badge-orange' : 'badge-red'}`}>{ds.difficulty}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{ds.problems} problems</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
