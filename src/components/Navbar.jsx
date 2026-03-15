import { NavLink, useLocation } from 'react-router-dom';

const links = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/team', label: 'Team' },
    { to: '/resources', label: 'Resources' },
    { to: '/practice', label: 'Practice' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
    const location = useLocation();
    const isGameMode = location.pathname === '/game';

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-logo">
                <div className="navbar-logo-icon">G</div>
                GFG Campus Club
            </NavLink>

            <div className="navbar-links">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                    >
                        {link.label}
                    </NavLink>
                ))}
                {isGameMode && (
                    <span className="navbar-link active">🎮 Game Mode</span>
                )}
            </div>

            <div className="navbar-actions">
                <span className="navbar-login">Login</span>
                <button className="btn btn-primary btn-sm">Sign Up</button>
            </div>
        </nav>
    );
}
