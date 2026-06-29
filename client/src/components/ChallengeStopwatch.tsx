import { useEffect, useRef, useState } from 'react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${seconds}s`;
}

export default function ChallengeStopwatch({ label = 'Chrono par équipe' }: { label?: string }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [savedTime, setSavedTime] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function toggle() {
    setRunning((previous) => !previous);
  }

  function reset() {
    if (elapsed > 0) setSavedTime(elapsed);
    setRunning(false);
    setElapsed(0);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {savedTime !== null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            background: '#f5f0ff',
            border: '2px solid #8b5cf6',
            borderRadius: 10,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                font: '800 10px Nunito',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                color: '#8b5cf6',
                marginBottom: 2,
              }}
            >
              Équipe précédente
            </div>
            <div
              style={{
                fontFamily: 'Bangers, sans-serif',
                fontSize: 26,
                color: '#8b5cf6',
                lineHeight: 1,
                letterSpacing: 1,
              }}
            >
              {formatTime(savedTime)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSavedTime(null)}
            aria-label="Effacer le temps précédent"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '2px solid #8b5cf6',
              background: '#fff',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          background: '#f0f6ff',
          border: '2px solid #3b82f6',
          borderRadius: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              font: '800 10px Nunito',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              color: '#3b82f6',
              marginBottom: 3,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: 'Bangers, sans-serif',
              fontSize: 32,
              color: '#3b82f6',
              lineHeight: 1,
              letterSpacing: 1,
            }}
          >
            {formatTime(elapsed)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={toggle}
            aria-label={running ? 'Pause' : 'Démarrer'}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: '2.5px solid #3b82f6',
              background: running ? '#3b82f6' : '#fff',
              color: running ? '#fff' : '#3b82f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {running ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Réinitialiser"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: '2.5px solid var(--ink)',
              background: '#fff',
              color: 'var(--ink)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <polyline points="3 3 3 8 8 8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
