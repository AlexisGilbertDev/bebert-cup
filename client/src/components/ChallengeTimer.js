import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
function playWhistle() {
    const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioCtx)
        return;
    const ctx = new AudioCtx();
    const blasts = [
        { start: 0, duration: 0.14 },
        { start: 0.22, duration: 0.14 },
        { start: 0.44, duration: 0.55 },
    ];
    blasts.forEach(({ start, duration }) => {
        const t = ctx.currentTime + start;
        // Fundamental ~2900 Hz + 2nd harmonic for body
        [2900, 5800].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 0.97, t);
            osc.frequency.linearRampToValueAtTime(freq, t + duration * 0.25);
            const volume = i === 0 ? 0.28 : 0.06;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(volume, t + 0.012);
            gain.gain.setValueAtTime(volume, t + duration - 0.035);
            gain.gain.linearRampToValueAtTime(0, t + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + duration + 0.01);
        });
    });
    setTimeout(() => ctx.close(), 2500);
}
export default function ChallengeTimer({ duration }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);
    useEffect(() => {
        setTimeLeft(duration);
        setRunning(false);
    }, [duration]);
    useEffect(() => {
        if (!running) {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setTimeLeft((previous) => {
                if (previous <= 1) {
                    setRunning(false);
                    playWhistle();
                    return 0;
                }
                return previous - 1;
            });
        }, 1000);
        return () => { if (intervalRef.current)
            clearInterval(intervalRef.current); };
    }, [running]);
    function toggle() {
        if (timeLeft === 0)
            return;
        setRunning((previous) => !previous);
    }
    function reset() {
        setRunning(false);
        setTimeLeft(duration);
    }
    const finished = timeLeft === 0;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const display = mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}`
        : `${timeLeft}`;
    const pct = timeLeft / duration;
    const accent = finished ? '#e8413a' : pct <= 0.25 ? '#f59e0b' : '#10b981';
    return (_jsxs("div", { style: {
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px',
            background: finished ? '#fff0ee' : '#f0faf5',
            border: `2px solid ${accent}`,
            borderRadius: 12,
        }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: {
                            fontFamily: 'Bangers, cursive',
                            fontSize: finished ? 22 : 32,
                            color: accent,
                            lineHeight: 1,
                            letterSpacing: 1,
                        }, children: finished ? 'TEMPS !' : display }), !finished && (_jsx("div", { style: {
                            marginTop: 5, height: 4, borderRadius: 99,
                            background: 'rgba(0,0,0,.08)', overflow: 'hidden',
                        }, children: _jsx("div", { style: {
                                height: '100%', borderRadius: 99,
                                background: accent,
                                width: `${pct * 100}%`,
                                transition: 'width 1s linear, background 0.3s',
                            } }) }))] }), _jsxs("div", { style: { display: 'flex', gap: 6, flexShrink: 0 }, children: [!finished && (_jsx("button", { type: "button", onClick: toggle, "aria-label": running ? 'Pause' : 'Démarrer', style: {
                            width: 44, height: 44, borderRadius: 10,
                            border: `2.5px solid ${accent}`,
                            background: running ? accent : '#fff',
                            color: running ? '#fff' : accent,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }, children: running ? (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: [_jsx("rect", { x: "5", y: "4", width: "4", height: "16", rx: "1" }), _jsx("rect", { x: "15", y: "4", width: "4", height: "16", rx: "1" })] })) : (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M8 5v14l11-7z" }) })) })), _jsx("button", { type: "button", onClick: reset, "aria-label": "R\u00E9initialiser", style: {
                            width: 44, height: 44, borderRadius: 10,
                            border: '2.5px solid var(--ink)',
                            background: '#fff', color: 'var(--ink)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("polyline", { points: "1 4 1 10 7 10" }), _jsx("path", { d: "M3.51 15a9 9 0 1 0 .49-5.5L1 10" })] }) })] })] }));
}
