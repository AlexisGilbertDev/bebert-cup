import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import './winner.css';

type LocationState = { scores: Record<string, number>; players: string[] } | null;

const ACCENT = '#e8413a';

const MEDALS = ['🥇', '🥈', '🥉'];
function medal(index: number): string {
  return MEDALS[index] ?? `${index + 1}.`;
}

export default function DuelWinnerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/');
    return null;
  }

  const { scores, players } = state;
  const sorted = [...players].sort((a, b) => scores[b] - scores[a]);
  const winner = sorted[0];
  const initial = winner.charAt(0).toUpperCase();
  const winnerScore = scores[winner];

  return (
    <div className="wc-page">
      <Confetti />
      <div className="wc-content">

        <div className="wc-header">
          <button type="button" className="wc-btn-round wc-btn-round--red" onClick={() => navigate('/')} aria-label="Accueil">
            ←
          </button>
          <h1 className="wc-title" style={{ color: ACCENT }}>VICTOIRE&nbsp;!</h1>
          <div className="wc-btn-round wc-btn-round--gold" aria-hidden="true">🏆</div>
        </div>

        <div className="wc-hero-card">
          <p className="wc-hero-label">Gagnant du duel</p>
          <div className="wc-avatar-wrap">
            <span className="wc-crown">👑</span>
            <div
              className="wc-avatar"
              style={{ background: `radial-gradient(circle at 35% 30%, #ffe39a, ${ACCENT})` }}
            >
              {initial}
            </div>
          </div>
          <p className="wc-hero-name" style={{ color: ACCENT }}>{winner}</p>
          <div className="wc-pts-pill">{winnerScore} PTS</div>
        </div>

        <div className="wc-leaderboard">
          <p className="wc-section-label">CLASSEMENT FINAL</p>
          {sorted.map((player, index) => (
            <div key={player} className={`wc-row${index === 0 ? ' wc-row--winner' : ''}`}>
              <span className="wc-row-medal">{medal(index)}</span>
              <span className="wc-row-name">{player}</span>
              <span className="wc-row-score" style={index === 0 ? { color: ACCENT } : undefined}>
                {scores[player]}
              </span>
            </div>
          ))}
        </div>

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
