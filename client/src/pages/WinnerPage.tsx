import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import './winner.css';

type LocationState = { winner: string; eliminationOrder?: string[] } | null;

const ACCENT = '#e8413a';

function survivorMedal(index: number): string {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  return '🍫';
}

export default function WinnerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state?.winner) {
    navigate('/');
    return null;
  }

  const { winner, eliminationOrder = [] } = state;
  const initial = winner.charAt(0).toUpperCase();

  // winner first, then eliminated players from most recent to earliest
  const ranking = [
    winner,
    ...eliminationOrder
      .slice()
      .reverse()
      .filter((name) => name !== winner),
  ];

  return (
    <div className="wc-page">
      <Confetti />
      <div className="wc-content">
        <div className="wc-header">
          <button
            type="button"
            className="wc-btn-round wc-btn-round--red"
            onClick={() => navigate('/')}
            aria-label="Accueil"
          >
            ←
          </button>
          <h1 className="wc-title" style={{ color: ACCENT }}>
            SURVIVOR&nbsp;!
          </h1>
          <div className="wc-btn-round wc-btn-round--gold" aria-hidden="true">
            🏆
          </div>
        </div>

        <div className="wc-hero-card">
          <p className="wc-hero-label">Dernier survivant</p>
          <div className="wc-avatar-wrap">
            <span className="wc-crown">👑</span>
            <div
              className="wc-avatar"
              style={{
                background: `radial-gradient(circle at 35% 30%, #ffe39a, ${ACCENT})`,
              }}
            >
              {initial}
            </div>
          </div>
          <p className="wc-hero-name" style={{ color: ACCENT }}>
            {winner}
          </p>
          <div className="wc-pts-pill">SURVIVOR&nbsp;!</div>
        </div>

        {ranking.length > 1 && (
          <div className="wc-leaderboard">
            <p className="wc-section-label">CLASSEMENT FINAL</p>
            {ranking.map((name, index) => {
              const isWinner = index === 0;
              const isFaded = index >= 2;
              return (
                <div
                  key={name}
                  className={`wc-row${isWinner ? ' wc-row--winner' : ''}${isFaded ? ' wc-row--faded' : ''}`}
                >
                  <span className="wc-row-medal">{survivorMedal(index)}</span>
                  <span className="wc-row-name">{name}</span>
                  {isWinner && (
                    <span className="wc-row-score" style={{ color: ACCENT }}>
                      🏆
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="wc-replay-btn"
          style={{ background: ACCENT }}
          onClick={() => navigate('/')}
        >
          REJOUER&nbsp;!
        </button>
      </div>
    </div>
  );
}
