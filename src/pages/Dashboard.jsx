import { useGame } from '../context/GameContext';

export default function Dashboard() {
    const { state } = useGame();
    const stats = [
        { icon: '💻', label: 'Problems Solved', number: state.problemsSolved, change: '+12 this week' },
        { icon: '⚡', label: 'Current XP', number: state.xp > 0 ? state.xp.toLocaleString() : '2,450', change: null },
        { icon: '📅', label: 'Events Attended', number: state.eventsAttended, change: null },
        { icon: '🏅', label: 'Badges Earned', number: state.badgesEarned, change: null },
    ];

    const chartData = [65, 40, 80, 55, 90, 30, 70];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const upcomingEvents = [
        { name: 'CodeStorm 2026', date: 'Mar 25', status: 'registered' },
        { name: 'Web Dev Bootcamp', date: 'Mar 28', status: 'register' },
        { name: 'DSA Challenge', date: 'Apr 1', status: 'register' },
    ];

    const activities = [
        { icon: '✅', text: "Solved 'Two Sum' — Easy", time: '2 hours ago' },
        { icon: '🏆', text: "Earned 'Problem Solver' badge", time: 'Yesterday' },
        { icon: '📝', text: 'Registered for CodeStorm 2026', time: '2 days ago' },
        { icon: '⭐', text: 'Reached 2,450 XP milestone', time: '3 days ago' },
    ];

    const badges = [
        { icon: '🥉', name: 'First Solve', locked: false },
        { icon: '🔥', name: '10 Day Streak', locked: false },
        { icon: '🥇', name: '100 Problems', locked: false },
        { icon: '⭐', name: 'Event Star', locked: false },
        { icon: '🤝', name: 'Team Player', locked: false },
        { icon: '❓', name: '????', locked: true },
    ];

    return (
        <div className="page-container">
            <div className="card welcome-bar">
                <h2>Welcome back, Rahul! 👋</h2>
                <span className="streak-badge">🔥 {state.streak}-day streak!</span>
                <span className="rank-info">📈 Your Rank: #12 out of 500</span>
            </div>

            <div className="grid-4" style={{ marginBottom: 0 }}>
                {stats.map((s, i) => (
                    <div key={i} className="card stat-card-dashboard">
                        <div className="stat-icon" style={{ fontSize: 20 }}>{s.icon}</div>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-number">{s.number}</div>
                        {s.change && <div className="stat-change">{s.change}</div>}
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <h3>Weekly Progress</h3>
                    <div className="chart-bars">
                        {chartData.map((h, i) => (
                            <div key={i} className="chart-bar-wrap">
                                <div className="chart-bar" style={{ height: `${h}%` }} />
                                <span className="chart-label">{days[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3>Upcoming Events</h3>
                    {upcomingEvents.map((e, i) => (
                        <div key={i} className="event-list-item">
                            <div className="event-list-info">
                                <h5>{e.name}</h5>
                                <p>{e.date}</p>
                            </div>
                            {e.status === 'registered' ? (
                                <span className="badge badge-green">Registered</span>
                            ) : (
                                <button className="btn btn-primary btn-sm">Register</button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h3>Recent Activity</h3>
                    {activities.map((a, i) => (
                        <div key={i} className="activity-item">
                            <span className="activity-icon">{a.icon}</span>
                            <div>
                                <div className="activity-text">{a.text}</div>
                                <div className="activity-time">{a.time}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h3>Your Badges</h3>
                    <div className="badges-grid">
                        {badges.map((b, i) => (
                            <div key={i} className={`badge-item ${b.locked ? 'locked' : ''}`}>
                                <div className="badge-icon">{b.icon}</div>
                                <div className="badge-name">{b.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
