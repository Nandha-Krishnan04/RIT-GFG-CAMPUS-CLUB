import React, { createContext, useContext, useReducer, useCallback } from 'react';

const GameContext = createContext(null);

const LEVELS = [
    { name: 'Beginner Village', xpNeeded: 0 },
    { name: 'Array Warrior', xpNeeded: 100 },
    { name: 'Graph Explorer', xpNeeded: 300 },
    { name: 'DP Master', xpNeeded: 600 },
    { name: 'Algorithm Grandmaster', xpNeeded: 1000 },
];

const initialState = {
    xp: 0,
    level: 0,
    streak: 7,
    problemsSolved: 247,
    eventsAttended: 18,
    badgesEarned: 12,
    mentorEmoji: 'happy',
    mentorMessage: 'Welcome! Ready to code? 🚀',
    showMentorMessage: true,
    challengeActive: false,
    challengeTimer: 0,
    focusMode: false,
    focusTimer: 25 * 60,
    xpPopups: [],
    currentProblemIndex: 0,
    currentWorld: 0,
    codeOutput: '',
    codeError: null,
    outputType: 'idle',
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'ADD_XP': {
            const newXp = state.xp + action.payload;
            let newLevel = state.level;
            for (let i = LEVELS.length - 1; i >= 0; i--) {
                if (newXp >= LEVELS[i].xpNeeded) { newLevel = i; break; }
            }
            return { ...state, xp: newXp, level: newLevel };
        }
        case 'SET_MENTOR': return { ...state, mentorEmoji: action.payload.emoji, mentorMessage: action.payload.message, showMentorMessage: true };
        case 'HIDE_MENTOR_MSG': return { ...state, showMentorMessage: false };
        case 'START_CHALLENGE': return { ...state, challengeActive: true, challengeTimer: 10 };
        case 'TICK_CHALLENGE': return { ...state, challengeTimer: Math.max(0, state.challengeTimer - 1) };
        case 'END_CHALLENGE': return { ...state, challengeActive: false, challengeTimer: 0 };
        case 'TOGGLE_FOCUS': return { ...state, focusMode: !state.focusMode, focusTimer: 25 * 60 };
        case 'TICK_FOCUS': return { ...state, focusTimer: Math.max(0, state.focusTimer - 1) };
        case 'SET_OUTPUT': return { ...state, codeOutput: action.payload.output, codeError: action.payload.error, outputType: action.payload.type };
        case 'NEXT_PROBLEM': return { ...state, currentProblemIndex: state.currentProblemIndex + 1 };
        case 'SET_PROBLEM': return { ...state, currentProblemIndex: action.payload };
        case 'SET_WORLD': return { ...state, currentWorld: action.payload };
        case 'ADD_XP_POPUP': return { ...state, xpPopups: [...state.xpPopups, { id: Date.now(), amount: action.payload, x: Math.random() * 60 + 20, y: Math.random() * 40 + 30 }] };
        case 'REMOVE_XP_POPUP': return { ...state, xpPopups: state.xpPopups.filter(p => p.id !== action.payload) };
        case 'INCREMENT_SOLVED': return { ...state, problemsSolved: state.problemsSolved + 1 };
        default: return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const addXP = useCallback((amount, reason) => {
        dispatch({ type: 'ADD_XP', payload: amount });
        dispatch({ type: 'ADD_XP_POPUP', payload: amount });
        setTimeout(() => dispatch({ type: 'REMOVE_XP_POPUP', payload: Date.now() }), 2000);
    }, []);

    const setMentor = useCallback((emoji, message) => {
        dispatch({ type: 'SET_MENTOR', payload: { emoji, message } });
    }, []);

    const value = { state, dispatch, addXP, setMentor, LEVELS };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used within GameProvider');
    return ctx;
}
