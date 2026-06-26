import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
export default function ChallengeStopwatch() {
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    useEffect(() => {
        if (!running)
            return;
        intervalRef.current = setInterval(() => {
            setElapsed((previous) => previous + 1);
        }, 1000);
        return () => { if (intervalRef.current)
            clearInterval(intervalRef.current); };
    }, [running]);
    function toggle() {
        setRunning((previous) => !previous);
    }
    function reset() {
        setRunning(false);
        setElapsed(0);
    }
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const display = mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}`
        : `${elapsed}s`;
    return (_jsxs("div", { style: {
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: '#f0f6ff',
            border: '2px solid #3b82f6',
            borderRadius: 12,
        }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { font: '800 10px Nunito', textTransform: 'uppercase', letterSpacing: 1.5, color: '#3b82f6', marginBottom: 3 }, children: "Chrono par \u00E9quipe" }), _jsx("div", { style: {
                            fontFamily: 'Bangers, cursive',
                            fontSize: 32,
                            color: '#3b82f6',
                            lineHeight: 1,
                            letterSpacing: 1,
                        }, children: display })] }), _jsxs("div", { style: { display: 'flex', gap: 6, flexShrink: 0 }, children: [_jsx("button", { type: "button", onClick: toggle, "aria-label": running ? 'Pause' : 'Démarrer', style: {
                            width: 44, height: 44, borderRadius: 10,
                            border: '2.5px solid #3b82f6',
                            background: running ? '#3b82f6' : '#fff',
                            color: running ? '#fff' : '#3b82f6',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }, children: running ? (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: [_jsx("rect", { x: "5", y: "4", width: "4", height: "16", rx: "1" }), _jsx("rect", { x: "15", y: "4", width: "4", height: "16", rx: "1" })] })) : (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M8 5v14l11-7z" }) })) }), _jsx("button", { type: "button", onClick: reset, "aria-label": "R\u00E9initialiser", style: {
                            width: 44, height: 44, borderRadius: 10,
                            border: '2.5px solid var(--ink)',
                            background: '#fff', color: 'var(--ink)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("polyline", { points: "1 4 1 10 7 10" }), _jsx("path", { d: "M3.51 15a9 9 0 1 0 .49-5.5L1 10" })] }) })] })] }));
}
