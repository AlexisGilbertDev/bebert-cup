import { useEffect, useRef, useState } from 'react';

interface Props {
  duration: number;
}

export default function ChallengeTimer({ duration }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(duration);
    setRunning(false);
  }, [duration]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) { setRunning(false); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) { setRunning(false); return 0; }
        return previous - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, timeLeft]);

  function toggle() {
    if (timeLeft === 0) return;
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

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: finished ? '#fff0ee' : '#f0faf5',
      border: `2px solid ${accent}`,
      borderRadius: 12,
    }}>
      {/* Countdown display */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Bangers, cursive',
          fontSize: finished ? 22 : 32,
          color: accent,
          lineHeight: 1,
          letterSpacing: 1,
        }}>
          {finished ? 'TEMPS !' : display}
        </div>
        {!finished && (
          <div style={{
            marginTop: 5, height: 4, borderRadius: 99,
            background: 'rgba(0,0,0,.08)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 99,
              background: accent,
              width: `${pct * 100}%`,
              transition: 'width 1s linear, background 0.3s',
            }} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {!finished && (
          <button
            type="button"
            onClick={toggle}
            style={{
              width: 44, height: 44, borderRadius: 10,
              border: `2.5px solid ${accent}`,
              background: running ? accent : '#fff',
              color: running ? '#fff' : accent,
              font: '900 18px Nunito', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {running ? '⏸' : '▶'}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            width: 44, height: 44, borderRadius: 10,
            border: '2.5px solid var(--ink)',
            background: '#fff', color: 'var(--ink)',
            font: '900 16px Nunito', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
