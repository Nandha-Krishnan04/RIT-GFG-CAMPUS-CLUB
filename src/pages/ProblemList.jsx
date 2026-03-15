import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { problems, debugProblems, bossProblems, skillWorlds, getProblemsByCategory } from '../data/problems';

export default function ProblemList() {
    const { state, LEVELS } = useGame();
    const [activeCategory, setActiveCategory] = useState('all');
    const grouped = getProblemsByCategory();
    const categories = ['all', ...Object.keys(grouped)];

    const allProblems = [...problems, ...debugProblems, ...bossProblems];

    // Order: debug challenges first, then the rest
    const baseFiltered = activeCategory === 'all' ? allProblems : (grouped[activeCategory] || []);
    const debugFirst = [
        ...baseFiltered.filter(p => p.isDebug),
        ...baseFiltered.filter(p => !p.isDebug),
    ];

    // Unlock logic: first 5 easy problems (different XP) are unlocked at level 1,
    // remaining easy + higher difficulty unlock as the player levels up.
    const easyProblems = problems
        .filter(p => p.difficulty === 'Easy')
        .sort((a, b) => a.xpReward - b.xpReward);

    const starterUnlocked = easyProblems.slice(0, 5).map(p => p.id);
    const unlockedEasyIds = new Set(starterUnlocked);

    const isProblemLocked = (problem) => {
        // Debug challenges are always available (bonus HP/XP practice)
        if (problem.isDebug) return false;
        // Boss battles require at least level 2
        if (problem.isBoss) return state.level < 2;
        // Starter easy path: first 5 easy are always unlocked
        if (problem.difficulty === 'Easy') {
            if (unlockedEasyIds.has(problem.id)) return false;
            // Remaining easy problems unlock when you reach level 2
            return state.level < 1;
        }
        // Medium/Hard unlock when you reach higher levels
        if (problem.difficulty === 'Medium') {
            return state.level < 1;
        }
        return false;
    };

    const nextLevelXP = LEVELS[Math.min(state.level + 1, LEVELS.length - 1)]?.xpNeeded || 1000;
    const currentLevelXP = LEVELS[state.level]?.xpNeeded || 0;
    const xpProgress = ((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    // Simple "repeatedly solved" category focus chart (dummy distribution per session)
    const focusData = [
        { label: 'Arrays & Hashing', key: 'Arrays & Hashing', color: '#4B6BF5', value: 36 },
        { label: 'Strings', key: 'Strings', color: '#22C55E', value: 28 },
        { label: 'Intro / I/O', key: 'Introduction, Output and Math Operators', color: '#F59E0B', value: 22 },
        { label: 'Debug Challenges', key: 'Debug Challenge', color: '#EF4444', value: 14 },
    ];

    return (
        <div className="problem-list-page">
            {/* Top Stats Bar */}
            <div className="pl-stats-bar">
                <div className="pl-stat-item">
                    <span className="pl-stat-icon">🔥</span>
                    <div>
                        <div className="pl-stat-value">{state.streak}</div>
                        <div className="pl-stat-label">Day Streak</div>
                    </div>
                </div>
                <div className="pl-stat-item">
                    <span className="pl-stat-icon">⚡</span>
                    <div>
                        <div className="pl-stat-value">{state.xp} XP</div>
                        <div className="pl-stat-label">Lv. {state.level + 1} — {LEVELS[state.level]?.name}</div>
                    </div>
                </div>
                <div className="pl-stat-item">
                    <span className="pl-stat-icon">💻</span>
                    <div>
                        <div className="pl-stat-value">{state.problemsSolved}</div>
                        <div className="pl-stat-label">Solved</div>
                    </div>
                </div>
                <div className="pl-stat-item">
                    <span className="pl-stat-icon">🏅</span>
                    <div>
                        <div className="pl-stat-value">{state.badgesEarned}</div>
                        <div className="pl-stat-label">Badges</div>
                    </div>
                </div>
            </div>

            <div className="pl-main-layout">
                {/* Left: Problem list */}
                <div className="pl-content">
                    <div className="pl-header">
                        <h1>🎮 Game Mode</h1>
                        <p>Pick a challenge, write code, earn XP. Level up your skills!</p>
                    </div>

                    {/* Linear skill tree across the top */}
                    <div className="card pl-skill-card">
                        <h4>🗺️ Skill Path</h4>
                        <div className="pl-skill-row">
                            {skillWorlds.map((world, index) => {
                                const unlocked = state.xp >= world.unlockXP;
                                const isCurrent = !unlocked && (index === 0 || state.xp >= skillWorlds[index - 1].unlockXP);
                                return (
                                    <React.Fragment key={world.name}>
                                        <motion.div
                                            className={`pl-skill-node ${unlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}`}
                                            initial={{ scale: 0.9, opacity: 0.5 }}
                                            animate={{ scale: unlocked ? 1.05 : 1, opacity: unlocked ? 1 : 0.7 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                        >
                                            <div className="pl-skill-icon">{world.emoji}</div>
                                            <div className="pl-skill-text">
                                                <div className="pl-skill-name">{world.name}</div>
                                                <div className="pl-skill-sub">
                                                    {unlocked ? `${world.problems} problems` : `Unlock at ${world.unlockXP} XP`}
                                                </div>
                                            </div>
                                        </motion.div>
                                        {index < skillWorlds.length - 1 && (
                                            <div className={`pl-skill-connector ${state.xp >= skillWorlds[index + 1].unlockXP ? 'filled' : ''}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Game mode mini dashboard (2x2 grid) */}
                    <div className="pl-mini-grid">
                        {/* XP Progress */}
                        <div className="card pl-xp-card">
                            <h4>⚡ Level Progress</h4>
                            <div className="xp-bar" style={{ marginTop: 8 }}>
                                <motion.div className="xp-fill" style={{ width: `${Math.min(xpProgress, 100)}%` }} layout />
                            </div>
                            <div className="xp-text">{state.xp} / {nextLevelXP} XP</div>
                        </div>

                        {/* Debug Challenge Highlight */}
                        <div className="card pl-debug-card">
                            <h4>🐛 Debug Challenges</h4>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                                Find and fix bugs in broken code. Race the clock for bonus HP / XP!
                            </p>
                            <Link to={`/game/${debugProblems[0]?.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                                Start Debug Challenge →
                            </Link>
                        </div>

                        {/* Session Stats */}
                        <div className="card">
                            <h4>📊 Session Stats</h4>
                            <div className="pl-session-stats">
                                <div className="pl-ss-row"><span>Problems Solved</span><strong>{state.problemsSolved}</strong></div>
                                <div className="pl-ss-row"><span>Current Streak</span><strong>🔥 {state.streak} days</strong></div>
                                <div className="pl-ss-row"><span>Level</span><strong>{LEVELS[state.level]?.name}</strong></div>
                                <div className="pl-ss-row"><span>Events</span><strong>{state.eventsAttended}</strong></div>
                            </div>
                        </div>

                        {/* Problem focus pie chart */}
                        <div className="card pl-pie-card">
                            <h4>🎯 Problem Focus (Session)</h4>
                            <div className="pl-pie-layout">
                                <motion.svg
                                    viewBox="0 0 36 36"
                                    className="pl-pie-svg"
                                    initial={{ rotate: -90 }}
                                >
                                    <circle
                                        className="pl-pie-bg"
                                        cx="18"
                                        cy="18"
                                        r="15.9155"
                                    />
                                    {focusData.reduce((acc, seg, index) => {
                                        const offset = acc.offset;
                                        const strokeDasharray = `${seg.value} ${100 - seg.value}`;
                                        const el = (
                                            <motion.circle
                                                key={seg.label}
                                                className="pl-pie-segment"
                                                cx="18"
                                                cy="18"
                                                r="15.9155"
                                                stroke={seg.color}
                                                strokeDasharray={strokeDasharray}
                                                strokeDashoffset={offset}
                                                initial={{ strokeDasharray: `0 ${100}` }}
                                                animate={{ strokeDasharray }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                            />
                                        );
                                        acc.offset -= seg.value;
                                        acc.elements.push(el);
                                        return acc;
                                    }, { offset: 25, elements: [] }).elements}
                                </motion.svg>
                                <div className="pl-pie-legend">
                                    {focusData.map((seg) => (
                                        <div key={seg.label} className="pl-pie-legend-row">
                                            <span
                                                className="pl-pie-dot"
                                                style={{ backgroundColor: seg.color }}
                                            />
                                            <span className="pl-pie-label">{seg.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="pl-filter-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`pl-filter-tab ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat === 'all' ? '📋 All' : cat === 'Debug Challenge' ? '🐛 Debug' : cat === 'Boss Battle' ? '🐉 Boss' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Problem Table */}
                    <div className="pl-table">
                        <div className="pl-table-header">
                            <span className="pl-col-name">PROBLEM NAME</span>
                            <span className="pl-col-status">STATUS</span>
                            <span className="pl-col-diff">DIFFICULTY</span>
                            <span className="pl-col-xp">XP</span>
                        </div>
                        {debugFirst.map((problem, i) => {
                            const locked = isProblemLocked(problem);
                            return (
                            <motion.div
                                key={problem.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Link
                                    to={locked ? '#' : `/game/${problem.id}`}
                                    className={`pl-table-row ${locked ? 'pl-row-locked' : ''}`}
                                >
                                    <span className="pl-col-name">
                                        {problem.isBoss && '🐉 '}
                                        {problem.isDebug && '🐛 '}
                                        {problem.title}
                                    </span>
                                    <span className="pl-col-status">
                                        <span className={`pl-status-dot ${locked ? 'locked' : ''}`} />
                                    </span>
                                    <span className="pl-col-diff">
                                        <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-green' : problem.difficulty === 'Medium' ? 'badge-orange' : 'badge-red'}`}>
                                            {problem.difficulty}
                                        </span>
                                    </span>
                                    <span className="pl-col-xp">{problem.xpReward}</span>
                                    {locked && (
                                        <span className="pl-col-lock-label">
                                            🔒 Level up to unlock
                                        </span>
                                    )}
                                    {problem.isDebug && !locked && (
                                        <span className="pl-col-lock-label pl-col-lock-label--bonus">
                                            ⚡ Bonus HP / XP
                                        </span>
                                    )}
                                </Link>
                            </motion.div>
                        );})}
                    </div>
                </div>

                {/* Right Sidebar (kept for layout, currently empty) */}
                <div className="pl-sidebar" />
            </div>
        </div>
    );
}
