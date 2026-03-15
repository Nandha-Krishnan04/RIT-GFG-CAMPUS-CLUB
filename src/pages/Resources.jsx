import { useState } from 'react';

const courses = [
    { title: 'Python Programming', icon: '🐍', bg: '#FEF3C7', learners: '96.6k', lessons: 14, rating: 4.6, reviews: 9636 },
    { title: 'Java Programming', icon: '☕', bg: '#FED7AA', learners: '77.9k', lessons: 18, rating: 4.6, reviews: 10445 },
    { title: 'Data Structures & Algo', icon: '🌳', bg: '#E9D5FF', learners: '143.2k', lessons: 41, rating: 4.7, reviews: 12500 },
    { title: 'Web Development', icon: '🌐', bg: '#DBEAFE', learners: '81.2k', lessons: 16, rating: 4.6, reviews: 8398 },
    { title: 'AI & Machine Learning', icon: '🤖', bg: '#CCFBF1', learners: '45.3k', lessons: 22, rating: 4.5, reviews: 5200 },
    { title: 'C++ Programming', icon: '⚙️', bg: '#DBEAFE', learners: '65.8k', lessons: 20, rating: 4.6, reviews: 7800 },
];

const topics = [
    { icon: '🐍', label: 'Learn Python' }, { icon: '☕', label: 'Learn Java' },
    { icon: '⚙️', label: 'Learn C++' }, { icon: '🌐', label: 'Web Development' },
    { icon: '🌳', label: 'Data Structures' }, { icon: '🤖', label: 'AI/ML' },
];

const tutorialSections = [
    { title: 'Basics', emoji: '📘', links: ['Introduction', 'Variables', 'Operators', 'Data Types', 'Conditional Statements', 'Loops'] },
    { title: 'Functions', emoji: '⚡', links: ['Functions', 'Recursion', 'Lambda Functions', 'Map / Filter / Reduce', 'Decorators'] },
    { title: 'Data Structures', emoji: '🗃️', links: ['Strings', 'Lists', 'Tuples', 'Dictionaries', 'Sets', 'Arrays'] },
    { title: 'OOP Concepts', emoji: '🏗️', links: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'] },
];

export default function Resources() {
    const [activeTopic, setActiveTopic] = useState('All Courses');
    const [search, setSearch] = useState('');

    return (
        <div className="resources-layout">
            <aside className="sidebar">
                <div className="sidebar-section">
                    <div className="sidebar-label">Catalog</div>
                    {['All Courses', 'All Roadmaps', 'Skill Tests'].map(item => (
                        <div key={item} className={`sidebar-item ${activeTopic === item ? 'active' : ''}`} onClick={() => setActiveTopic(item)}>
                            {item}
                        </div>
                    ))}
                </div>
                <div className="sidebar-section">
                    <div className="sidebar-label">Topics</div>
                    {topics.map(t => (
                        <div key={t.label} className="sidebar-item" onClick={() => setActiveTopic(t.label)}>
                            <span className="sidebar-icon">{t.icon}</span> {t.label}
                        </div>
                    ))}
                </div>
            </aside>

            <main>
                <h1 className="page-title" style={{ marginBottom: 16 }}>Learning Resources</h1>
                <input className="search-bar" placeholder="Browse resources..." value={search} onChange={e => setSearch(e.target.value)} />

                <div className="grid-2">
                    {courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                        <div key={i} className="card course-card">
                            <div className="course-icon-wrap" style={{ background: c.bg }}>{c.icon}</div>
                            <h4>{c.title}</h4>
                            <span className="badge badge-green" style={{ marginBottom: 4 }}>Beginner</span>
                            <div className="course-rating">{'⭐'.repeat(Math.floor(c.rating))} {c.rating} ({c.reviews.toLocaleString()})</div>
                            <div className="course-stats">{c.learners} learners • {c.lessons} lessons</div>
                        </div>
                    ))}
                </div>

                <div className="tutorial-section">
                    <h3>Python Tutorial</h3>
                    {tutorialSections.map((sec, i) => (
                        <div key={i} className="tutorial-category">
                            <h4>{sec.emoji} {sec.title}</h4>
                            <div className="tutorial-links">
                                {sec.links.map((link, j) => (
                                    <div key={j} className="tutorial-link">
                                        <span className={`check ${j < 2 ? 'done' : ''}`}>{j < 2 ? '✓' : ''}</span>
                                        {link}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
