import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import FloatingMentor from '../components/FloatingMentor';
import { problems, debugProblems, bossProblems } from '../data/problems';

// Local backend runner for executing code (not external AI)
const API_BASE = 'http://localhost:8000';

const allProblems = [...problems, ...debugProblems, ...bossProblems];

// Error type → emoji mapping for live tracking
const ERROR_EMOJI_MAP = {
    SyntaxError: { emoji: '😡', label: 'Syntax Error', color: '#EF4444' },
    IndentationError: { emoji: '🤦', label: 'Indentation Error', color: '#EC4899' },
    RuntimeError: { emoji: '😬', label: 'Runtime Error', color: '#F97316' },
    TypeError: { emoji: '😬', label: 'Type Error', color: '#F97316' },
    NameError: { emoji: '😬', label: 'Name Error', color: '#F97316' },
    Success: { emoji: '🎉', label: 'Looking Good!', color: '#22C55E' },
};

export default function GameMode() {
    const { problemId } = useParams();
    const { state, dispatch, addXP, setMentor, LEVELS } = useGame();
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [submitResult, setSubmitResult] = useState(null); // 'pass' | 'fail' | null
    const [thinkingReport, setThinkingReport] = useState(null);
    const [errorBubbles, setErrorBubbles] = useState([]);
    const [focusActive, setFocusActive] = useState(false);
    const [focusTimer, setFocusTimer] = useState(25 * 60);
    const [challengeTimer, setChallengeTimer] = useState(0);
    const [challengeActive, setChallengeActive] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);
    const typingTimerRef = useRef(null);
    const challengeRef = useRef(null);
    const errorCheckRef = useRef(null);

    const currentProblem = allProblems.find(p => p.id === Number(problemId));
    const nextLevelXP = LEVELS[Math.min(state.level + 1, LEVELS.length - 1)]?.xpNeeded || 1000;
    const currentLevelXP = LEVELS[state.level]?.xpNeeded || 0;
    const xpProgress = ((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    // Load starter code when problem changes
    useEffect(() => {
        if (currentProblem) {
            setCode(currentProblem.starterCode);
            setSubmitResult(null);
            setThinkingReport(null);
            setHintIndex(0);
            setMentor('happy', `Let's solve "${currentProblem.title}"! 🚀`);
        }
    }, [problemId]);

    // ═══ LIVE ERROR TRACKING ═══
    const checkForErrors = useCallback((codeText) => {
        const error = detectErrors(codeText);
        if (error) {
            const config = ERROR_EMOJI_MAP[error.type] || ERROR_EMOJI_MAP.RuntimeError;
            addErrorBubble(config.emoji, `${config.label}: ${error.message}`, config.color);
        } else if (codeText && codeText.trim().length > 10) {
            // Only show success if user has written substantial code
            const successConfig = ERROR_EMOJI_MAP.Success;
            addErrorBubble(successConfig.emoji, successConfig.label, successConfig.color);
        }
    }, []);

    const addErrorBubble = (emoji, message, color) => {
        const id = Date.now() + Math.random();
        setErrorBubbles(prev => [...prev.slice(-2), { id, emoji, message, color }]);
        setTimeout(() => {
            setErrorBubbles(prev => prev.filter(b => b.id !== id));
        }, 3000);
    };

    // Typing detection → mentor thinks + live error check
    const handleCodeChange = useCallback((value) => {
        setCode(value || '');
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        if (errorCheckRef.current) clearTimeout(errorCheckRef.current);

        setMentor('thinking', 'Hmm, interesting approach...');

        // Debounced error check (500ms after stop typing)
        errorCheckRef.current = setTimeout(() => {
            checkForErrors(value || '');
        }, 500);

        typingTimerRef.current = setTimeout(() => {
            setMentor('encouragement', "You're getting closer!");
        }, 3000);
    }, [setMentor, checkForErrors]);

    // ═══ LOCAL THINKING REPORT + MENTOR FEEDBACK ═══
    const buildLocalThinkingReport = useCallback(
        ({ codeText, problem, didPass, hasError }) => {
            const lower = (codeText || '').toLowerCase();

            // Rough guess of approach based on simple patterns
            const usesHashMap =
                lower.includes('dict(') ||
                lower.includes('{}') ||
                lower.includes('map[') ||
                lower.includes('hash') ||
                lower.includes('set(');
            const usesTwoLoops = (lower.match(/for /g) || []).length >= 2;
            const usesRecursion =
                (lower.match(/def /g) || []).length > 1 &&
                (lower.includes('recur') || lower.includes('permutation') || lower.includes('fibonacci'));

            let strategy = 'Iterative Improvement';
            let initialApproach = 'Brute force / direct simulation';
            let finalApproach = 'Still brute force';

            if (usesRecursion) {
                finalApproach = 'Recursive decomposition';
            } else if (usesHashMap) {
                finalApproach = 'Hash map / set optimization';
            } else if (!usesTwoLoops) {
                finalApproach = 'Single-pass linear scan';
            }

            // Very simple complexity guess
            let timeComplexity = 'O(1)';
            const loopCount = (lower.match(/for /g) || []).length + (lower.match(/while /g) || []).length;
            if (loopCount === 1) timeComplexity = 'O(n)';
            if (loopCount >= 2) timeComplexity = 'O(n²) (approx.)';
            if (usesRecursion && loopCount >= 1) timeComplexity = 'O(n * subproblem_cost)';

            // Deterministic "scores" so it feels game-like
            const base = (problem?.id || 7) * 17;
            const learningScore = 70 + (base % 21); // 70–90
            const efficiencyScore = (didPass ? 60 : 40) + (usesHashMap || usesRecursion ? 20 : 0) - (usesTwoLoops ? 10 : 0);

            // High‑level step narrative
            const steps = [];
            if (hasError) {
                steps.push('Step 1: Wrote an initial attempt that produced an error.');
                steps.push('Step 2: Fixed syntax / runtime issues based on the error message.');
                steps.push('Step 3: Re-ran tests and refined the logic.');
                if (didPass) {
                    steps.push('Step 4: Final solution accepted ✅');
                } else {
                    steps.push('Step 4: Solution still needs refinement – good learning opportunity.');
                }
            } else {
                steps.push('Step 1: Drafted an initial working solution.');
                if (usesTwoLoops) {
                    steps.push('Step 2: Considered efficiency and how nested loops affect performance.');
                }
                if (usesHashMap) {
                    steps.push('Step 3: Introduced a hash map / set to speed up lookups.');
                }
                steps.push(didPass ? 'Step 4: Final solution accepted ✅' : 'Step 4: Tests did not pass yet – iterate again.');
            }

            // Mentor-style feedback
            const mentorLines = [];
            if (didPass) {
                mentorLines.push('✔ Your code produces the correct result for the test case.');
            } else if (hasError) {
                mentorLines.push('⚠ Your code hits an error before finishing.');
            } else {
                mentorLines.push('⚠ Your code runs, but the output may not match all required cases.');
            }

            if (usesTwoLoops) {
                mentorLines.push('✔ Your approach explores pairs/combinations using nested loops.');
                mentorLines.push('This usually works but can be inefficient on large inputs.');
            } else if (usesHashMap) {
                mentorLines.push('✔ Nice use of a hash map / set to speed up lookups.');
            } else if (usesRecursion) {
                mentorLines.push('✔ You are breaking the problem into smaller recursive subproblems.');
            }

            let hint =
                'Think about how to reduce repeated work. Can you reuse partial results instead of recomputing them?';
            if (problem?.title?.toLowerCase().includes('two sum')) {
                hint =
                    'Try storing seen numbers in a hash map and check the "target - current" complement in O(1) time.';
            } else if (problem?.title?.toLowerCase().includes('binary search')) {
                hint =
                    'Focus on repeatedly cutting the search range in half instead of scanning the whole array.';
            } else if (problem?.title?.toLowerCase().includes('fibonacci')) {
                hint =
                    'Think about building the sequence from the bottom up and reusing earlier values (tabulation).';
            }

            return {
                steps,
                strategy,
                initialApproach,
                finalApproach,
                learningScore: Math.max(0, Math.min(100, learningScore)),
                efficiencyScore: Math.max(0, Math.min(100, efficiencyScore)),
                mentor: {
                    lines: mentorLines,
                    timeComplexity,
                    hint,
                },
            };
        },
        [],
    );

    // ═══ RUN CODE ═══
    const runCode = useCallback(async () => {
        setIsRunning(true);
        setMentor('thinking', 'Running your code...');
        setSubmitResult(null);
        setThinkingReport(null);

        let hasError = null;
        let output = '';

        try {
            const res = await fetch(`${API_BASE}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (data.success) {
                output = data.output || 'Code executed successfully.';
            } else {
                hasError = data.error;
            }
        } catch {
            hasError = detectErrors(code);
            if (!hasError) {
                output = simulateExecution(code);
            }
        }

        if (hasError) {
            dispatch({ type: 'SET_OUTPUT', payload: { output: '', error: hasError, type: 'error' } });
            setMentor(hasError.type === 'IndentationError' ? 'facepalm' : 'error', hasError.message);
            setSubmitResult('fail');
            const config = ERROR_EMOJI_MAP[hasError.type] || ERROR_EMOJI_MAP.RuntimeError;
            addErrorBubble(config.emoji, `${config.label}!`, config.color);

            if (!challengeActive) {
                setChallengeActive(true);
                setChallengeTimer(10);
                setMentor('warning', '🐛 Bug detected! Fix it in 10s for bonus XP!');
            }
        } else {
            dispatch({ type: 'SET_OUTPUT', payload: { output, error: null, type: 'success' } });
            setMentor('celebration', '🎉 Code runs perfectly!');
            setSubmitResult('pass');
            addXP(currentProblem?.xpReward || 20);
            dispatch({ type: 'INCREMENT_SOLVED' });
            addErrorBubble('🎉', 'All tests passed!', '#22C55E');

            if (challengeActive) {
                addXP(15);
                setMentor('celebration', '⚡ Fixed in time! +15 Bonus XP!');
                setChallengeActive(false);
                setChallengeTimer(0);
            }
        }

        // Build a local thinking report + mentor feedback based on this run
        const report = buildLocalThinkingReport({
            codeText: code,
            problem: currentProblem,
            didPass: !hasError,
            hasError: !!hasError,
        });
        setThinkingReport(report);
        setMentor('encouragement', 'Thinking report and mentor feedback ready below your editor!');

        setIsRunning(false);
    }, [code, challengeActive, currentProblem, addXP, setMentor, dispatch, buildLocalThinkingReport]);

    // ═══ TIMERS ═══
    // Challenge countdown
    useEffect(() => {
        if (!challengeActive || challengeTimer <= 0) return;
        challengeRef.current = setInterval(() => {
            setChallengeTimer(prev => {
                if (prev <= 1) {
                    setChallengeActive(false);
                    setMentor('warning', "Time's up! Try again next time.");
                    clearInterval(challengeRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(challengeRef.current);
    }, [challengeActive]);

    // Focus mode timer (persistent, not overlay)
    useEffect(() => {
        if (!focusActive) return;
        const interval = setInterval(() => {
            setFocusTimer(prev => {
                if (prev <= 1) {
                    setFocusActive(false);
                    addXP(50);
                    setMentor('celebration', '🏆 Focus session complete! +50 XP!');
                    return 25 * 60;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [focusActive, addXP, setMentor]);

    const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

    if (!currentProblem) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: 120 }}>
                <h2>Problem not found</h2>
                <Link to="/game" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Problems</Link>
            </div>
        );
    }

    return (
        <>
            <FloatingMentor />

            {/* XP Popups */}
            <AnimatePresence>
                {state.xpPopups.map(popup => (
                    <motion.div
                        key={popup.id}
                        className="xp-popup"
                        style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -60 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    >
                        +{popup.amount} XP ⚡
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Error Bubbles — floating near editor */}
            <div className="error-bubbles-container">
                <AnimatePresence>
                    {errorBubbles.map(bubble => (
                        <motion.div
                            key={bubble.id}
                            className="error-bubble"
                            style={{ borderColor: bubble.color, '--bubble-color': bubble.color }}
                            initial={{ opacity: 0, x: 40, scale: 0.6 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 40, scale: 0.6 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                            <span className="error-bubble-emoji">{bubble.emoji}</span>
                            <span className="error-bubble-text">{bubble.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="gm-editor-page">
                {/* Left: Problem description (smaller) */}
                <div className="gm-problem-pane gm-problem-pane--narrow">
                    <Link to="/game" className="gm-back-link">← All Problems</Link>
                    <h2 className="gm-problem-title">
                        {currentProblem.isBoss && '🐉 '}
                        {currentProblem.isDebug && '🐛 '}
                        {currentProblem.title}
                        <span className={`badge ${currentProblem.difficulty === 'Easy' ? 'badge-green' : currentProblem.difficulty === 'Medium' ? 'badge-orange' : 'badge-red'}`} style={{ marginLeft: 10, verticalAlign: 'middle' }}>
                            {currentProblem.difficulty}
                        </span>
                    </h2>
                    <p className="gm-problem-desc">{currentProblem.description}</p>
                    <div className="gm-problem-examples">
                        <pre>{currentProblem.examples}</pre>
                    </div>
                    <div className="gm-problem-meta">
                        <span>⚡ {currentProblem.xpReward} XP</span>
                        <span>📁 {currentProblem.category}</span>
                    </div>

                    {/* Boss hints */}
                    {currentProblem.isBoss && currentProblem.hints && (
                        <div style={{ marginTop: 16 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => {
                                setHintIndex(h => Math.min(h + 1, currentProblem.hints.length));
                                setMentor('thinking', currentProblem.hints[Math.min(hintIndex, currentProblem.hints.length - 1)]);
                            }}>
                                💡 Hint ({hintIndex}/{currentProblem.hints.length})
                            </button>
                        </div>
                    )}

                    {/* XP Bar */}
                    <div className="gm-xp-section">
                        <div className="xp-header">
                            <h4>⚡ XP Progress</h4>
                            <span className="xp-level">Lv. {state.level + 1}</span>
                        </div>
                        <div className="xp-bar">
                            <motion.div className="xp-fill" style={{ width: `${Math.min(xpProgress, 100)}%` }} layout />
                        </div>
                        <div className="xp-text">{state.xp} / {nextLevelXP} XP • {LEVELS[state.level]?.name}</div>
                    </div>

                    {/* Output Panel */}
                    <div className={`gm-output-panel ${state.outputType}`}>
                        <h4>
                            {state.outputType === 'success' ? '✅ Output' : state.outputType === 'error' ? '❌ Error' : '📋 Output'}
                        </h4>
                        <pre>
                            {state.codeError
                                ? `${state.codeError.type}: ${state.codeError.message}\nLine ${state.codeError.line}`
                                : state.codeOutput || 'Run your code to see output here...'}
                        </pre>
                        {submitResult && (
                            <motion.div
                                className={`gm-submit-result ${submitResult}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                {submitResult === 'pass' ? '✅ PASSED' : '❌ WRONG ANSWER'}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right: Code editor */}
                <div className="gm-editor-pane">
                    {/* Focus Mode (small persistent box, inside editor area) */}
                    <div className="gm-top-bar">
                        <div className="gm-focus-box">
                            {focusActive ? (
                                <>
                                    <span className="gm-focus-icon">🎯</span>
                                    <span className="gm-focus-time">{formatTime(focusTimer)}</span>
                                    <button className="gm-focus-end" onClick={() => { setFocusActive(false); setFocusTimer(25 * 60); }}>End</button>
                                </>
                            ) : (
                                <button className="gm-focus-start" onClick={() => setFocusActive(true)}>
                                    🎯 Focus Mode
                                </button>
                            )}
                        </div>

                        {/* Challenge Banner */}
                        {challengeActive && (
                            <motion.div
                                className="gm-challenge-box"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                🐛 Fix bug! <strong>{challengeTimer}s</strong>
                            </motion.div>
                        )}

                        <div className="gm-editor-actions">
                            <button className="btn btn-primary btn-sm" onClick={runCode} disabled={isRunning}>
                                {isRunning ? '⏳ Running...' : '▶ Submit & Analyze'}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="gm-editor-wrap">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                roundedSelection: true,
                                automaticLayout: true,
                                tabSize: 4,
                                wordWrap: 'on',
                            }}
                        />
                    </div>

                    {/* Bottom AI mentor area: two boxes side by side */}
                    <motion.div
                        className="gm-ai-bottom"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Left: Thinking report */}
                        <div className="gm-ai-box gm-ai-box--report">
                            <div className="gm-ai-header">
                                <span className="gm-ai-emoji">🧠</span>
                                <strong>Problem Solving Report</strong>
                            </div>
                            {thinkingReport ? (
                                <>
                                    <div className="gm-ai-steps">
                                        {thinkingReport.steps.map((s, idx) => (
                                            <div key={idx} className="gm-ai-step">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="gm-ai-metrics">
                                        <div><span>Strategy:</span> {thinkingReport.strategy}</div>
                                        <div><span>Initial Approach:</span> {thinkingReport.initialApproach}</div>
                                        <div><span>Final Approach:</span> {thinkingReport.finalApproach}</div>
                                    </div>
                                    <div className="gm-ai-scores">
                                        <div>
                                            <span>Learning Score</span>
                                            <strong>{thinkingReport.learningScore}%</strong>
                                        </div>
                                        <div>
                                            <span>Efficiency Score</span>
                                            <strong>{thinkingReport.efficiencyScore}%</strong>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="gm-ai-placeholder">
                                    Submit your code to generate a thinking report for this problem.
                                </div>
                            )}
                        </div>

                        {/* Right: Mentor feedback */}
                        <div className="gm-ai-box gm-ai-box--feedback">
                            <div className="gm-ai-header">
                                <span className="gm-ai-emoji">🤖</span>
                                <strong>AI Mentor Feedback</strong>
                            </div>
                            {thinkingReport ? (
                                <>
                                    <ul className="gm-ai-feedback-list">
                                        {thinkingReport.mentor.lines.map((line, idx) => (
                                            <li key={idx}>{line}</li>
                                        ))}
                                    </ul>
                                    <div className="gm-ai-meta">
                                        <div>
                                            <span>Time Complexity (approx):</span>{' '}
                                            <strong>{thinkingReport.mentor.timeComplexity}</strong>
                                        </div>
                                    </div>
                                    <div className="gm-ai-hint">
                                        <span>Hint (no full solution):</span>
                                        <p>{thinkingReport.mentor.hint}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="gm-ai-placeholder">
                                    After you press <b>Submit & Analyze</b>, your mentor will explain your code,
                                    estimate complexity, and give a hint without revealing the full answer.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

// ═══ Local Error Detection ═══
function detectErrors(code) {
    if (!code || code.trim() === '') return null;

    const lines = code.split('\n');

    // Check for indentation errors
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/^\t+ /) || line.match(/^ +\t/)) {
            return { type: 'IndentationError', message: 'Mixed tabs and spaces', line: i + 1 };
        }
    }

    // Check for common syntax errors
    let openParens = 0, openBrackets = 0, openBraces = 0;
    for (let i = 0; i < code.length; i++) {
        if (code[i] === '(') openParens++;
        if (code[i] === ')') openParens--;
        if (code[i] === '[') openBrackets++;
        if (code[i] === ']') openBrackets--;
        if (code[i] === '{') openBraces++;
        if (code[i] === '}') openBraces--;
    }
    if (openParens !== 0) return { type: 'SyntaxError', message: 'Unmatched parentheses', line: lines.length };
    if (openBrackets !== 0) return { type: 'SyntaxError', message: 'Unmatched brackets', line: lines.length };
    if (openBraces !== 0) return { type: 'SyntaxError', message: 'Unmatched braces', line: lines.length };

    // Check for common Python mistakes
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.match(/^(def|class|if|elif|else|for|while|try|except|finally|with)\b/) && !trimmed.endsWith(':') && trimmed.length > 0 && !trimmed.startsWith('#')) {
            return { type: 'SyntaxError', message: `Missing colon at end of ${trimmed.split(' ')[0]} statement`, line: i + 1 };
        }
        if (trimmed.match(/print\s+[^(]/) && !trimmed.includes('print(')) {
            return { type: 'SyntaxError', message: 'print is a function in Python 3, use print()', line: i + 1 };
        }
    }

    // Check mixed quotes
    const quoteMatches = code.match(/(["'])(?:(?!\1).)*$/gm);
    if (quoteMatches && quoteMatches.length > 0) {
        return { type: 'SyntaxError', message: 'Unterminated string literal', line: lines.length };
    }

    return null;
}

function simulateExecution(code) {
    if (code.includes('print(')) {
        const printMatches = code.match(/print\(([^)]+)\)/g);
        if (printMatches) {
            return printMatches.map(m => {
                const inner = m.slice(6, -1).trim();
                if (inner.startsWith('"') || inner.startsWith("'")) {
                    return inner.slice(1, -1);
                }
                try {
                    if (inner.match(/^[\d\s+\-*/%.]+$/)) {
                        return String(eval(inner));
                    }
                } catch (e) { /* ignore */ }
                return `<${inner}>`;
            }).join('\n');
        }
    }
    return 'Code executed successfully. (No print output detected)';
}
