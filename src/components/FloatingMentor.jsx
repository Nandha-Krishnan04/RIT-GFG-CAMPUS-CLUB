import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const MOOD_CONFIG = {
    happy: { eyes: '◠ ◠', mouth: '‿', color: '#22C55E', glow: 'rgba(34,197,94,0.3)' },
    thinking: { eyes: '◉ ◉', mouth: '···', color: '#4B6BF5', glow: 'rgba(75,107,245,0.3)' },
    error: { eyes: '✖ ✖', mouth: '△', color: '#EF4444', glow: 'rgba(239,68,68,0.4)' },
    celebration: { eyes: '★ ★', mouth: '▽', color: '#F59E0B', glow: 'rgba(245,158,11,0.4)' },
    warning: { eyes: '● ●', mouth: '—', color: '#F97316', glow: 'rgba(249,115,22,0.3)' },
    encouragement: { eyes: '◠ ◠', mouth: '‿‿', color: '#8B5CF6', glow: 'rgba(139,92,246,0.3)' },
    facepalm: { eyes: '— —', mouth: '∪', color: '#EC4899', glow: 'rgba(236,72,153,0.3)' },
};

export default function FloatingMentor() {
    const { state } = useGame();
    const nodeRef = useRef(null);
    const [showMsg, setShowMsg] = useState(true);
    const [bounce, setBounce] = useState(false);

    const mood = MOOD_CONFIG[state.mentorEmoji] || MOOD_CONFIG.happy;

    useEffect(() => {
        setShowMsg(true);
        setBounce(true);
        const msgTimer = setTimeout(() => setShowMsg(false), 5000);
        const bounceTimer = setTimeout(() => setBounce(false), 600);
        return () => { clearTimeout(msgTimer); clearTimeout(bounceTimer); };
    }, [state.mentorEmoji, state.mentorMessage]);

    return (
        <Draggable nodeRef={nodeRef} defaultPosition={{ x: 20, y: 300 }} bounds="body">
            <div ref={nodeRef} className="floating-mentor">
                <div className="mentor-bubble">
                    {/* Speech bubble */}
                    <AnimatePresence>
                        {showMsg && state.mentorMessage && (
                            <motion.div
                                className="mentor-speech"
                                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.85 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {state.mentorMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Robot Character */}
                    <motion.div
                        className="robot-body"
                        style={{
                            '--robot-color': mood.color,
                            '--robot-glow': mood.glow,
                        }}
                        animate={{
                            scale: bounce ? [1, 1.15, 0.95, 1.05, 1] : 1,
                            rotate: bounce ? [0, -5, 5, -3, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        onClick={() => setShowMsg(!showMsg)}
                    >
                        {/* Antenna */}
                        <div className="robot-antenna">
                            <motion.div
                                className="robot-antenna-ball"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                            />
                        </div>
                        {/* Head */}
                        <div className="robot-head">
                            <div className="robot-eyes">
                                <motion.span
                                    className="robot-eye"
                                    key={state.mentorEmoji + '-eyes'}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                >
                                    {mood.eyes}
                                </motion.span>
                            </div>
                            <motion.div
                                className="robot-mouth"
                                key={state.mentorEmoji + '-mouth'}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                {mood.mouth}
                            </motion.div>
                        </div>
                        {/* Arms */}
                        <motion.div
                            className="robot-arm robot-arm-left"
                            animate={{ rotate: state.mentorEmoji === 'celebration' ? [0, -20, 0, -20, 0] : [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: state.mentorEmoji === 'celebration' ? 0.8 : 3 }}
                        />
                        <motion.div
                            className="robot-arm robot-arm-right"
                            animate={{ rotate: state.mentorEmoji === 'celebration' ? [0, 20, 0, 20, 0] : [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: state.mentorEmoji === 'celebration' ? 0.8 : 3 }}
                        />
                    </motion.div>
                </div>
            </div>
        </Draggable>
    );
}
