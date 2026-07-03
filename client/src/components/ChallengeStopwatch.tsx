import { useEffect, useRef, useState } from 'react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${seconds}s`;
}

interface PlayerTime {
  name: string;
  time: number;
}

interface Props {
  label?: string;
  players?: string[];
}

export default function ChallengeStopwatch({ label = 'Chrono', players = [] }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [playerTimes, setPlayerTimes] = useState<PlayerTime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    if (elapsed > 0 && players.length > 0) {
      const name = players[currentIndex % players.length];
      setPlayerTimes((previous) => [...previous, { name, time: elapsed }]);
      setCurrentIndex((previous) => previous + 1);
    }
    setRunning(false);
    setElapsed(0);
  }

  const currentPlayerName =
    players.length > 0 ? players[currentIndex % players.length] : null;
  const chronoLabel = currentPlayerName ?? label;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {playerTimes.length > 0 && (
        <div
          style={{
            background: '#f5f0ff',
            border: '2px solid #8b5cf6',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 10px 4px',
              borderBottom: '1.5px solid #d8b4fe',
            }}
          >
            <span
              style={{
                font: '800 10px Nunito',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                color: '#8b5cf6',
              }}
            >
              Temps
            </span>
            <button
              type="button"
              onClick={() => {
                setPlayerTimes([]);
                setCurrentIndex(0);
              }}
              aria-label="Effacer les temps"
              style={{
                background: 'none',
                border: 'none',
                color: '#a78bfa',
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </div>
          {playerTimes.map((entry, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 10px',
                borderTop: index > 0 ? '1px solid #ede9fe' : undefined,
              }}
            >
              <span style={{ font: '700 13px Nunito', color: '#4c1d95' }}>
                {entry.name}
              </span>
              <span
                style={{
                  fontFamily: 'Bangers, sans-serif',
                  fontSize: 18,
                  color: '#7c3aed',
                  letterSpacing: 0.5,
                }}
              >
                {formatTime(entry.time)}
              </span>
            </div>
          ))}
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
            {chronoLabel}
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
