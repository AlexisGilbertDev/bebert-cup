import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import '../components/comic.css';
import './winner.css';

const TEAM1_COLOR = '#10b981';
const TEAM2_COLOR = '#3b82f6';

export default function TeamWinnerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    scores?: { team1: number; team2: number };
    team1?: string[];
    team2?: string[];
  } | null;

  const scores = locationState?.scores;
  const team1 = locationState?.team1 ?? [];
  const team2 = locationState?.team2 ?? [];

  if (!scores || (team1.length === 0 && team2.length === 0)) {
    navigate('/');
    return null;
  }

  const winnerTeam = scores.team1 > scores.team2 ? 1 : 2;
  const winnerColor = winnerTeam === 1 ? TEAM1_COLOR : TEAM2_COLOR;
  const winnerPlayers = winnerTeam === 1 ? team1 : team2;
  const loserTeam = winnerTeam === 1 ? 2 : 1;
  const loserColor = winnerTeam === 1 ? TEAM2_COLOR : TEAM1_COLOR;
  const loserPlayers = winnerTeam === 1 ? team2 : team1;
  const winnerScore = winnerTeam === 1 ? scores.team1 : scores.team2;
  const loserScore = winnerTeam === 1 ? scores.team2 : scores.team1;

  return (
    <div className="wc-page">
      <Confetti />
      <div className="wc-content">
        <h1
          style={{
            fontFamily: 'Luckiest Guy, cursive',
            fontSize: 48,
            textAlign: 'center',
            color: winnerColor,
            WebkitTextStroke: '2px var(--ink)',
            paintOrder: 'stroke fill',
            textShadow: '4px 4px 0 var(--ink)',
            animation: 'wc-rise-in 0.5s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          VICTOIRE !
        </h1>

        {/* Winner card */}
        <div className="wc-hero-card" style={{ borderColor: winnerColor }}>
          <div
            style={{
              background: `linear-gradient(135deg, #e8f5f0 0%, ${winnerColor} 100%)`,
              borderRadius: '18px 18px 0 0',
              padding: '20px 16px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: winnerColor,
                border: '4px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Bangers',
                fontSize: 30,
                color: '#fff',
                boxShadow: '0 4px 0 var(--ink)',
              }}
            >
              🏆
            </div>
            <h2 className="wc-hero-name" style={{ color: winnerColor }}>
              ÉQUIPE {winnerTeam}
            </h2>
            <div
              style={{
                font: '700 13px Nunito',
                color: '#fff',
                textAlign: 'center',
                opacity: 0.9,
              }}
            >
              {winnerPlayers.join(' · ')}
            </div>
          </div>
          <div
            style={{
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span className="wc-pts-pill">
              {winnerScore} pt{winnerScore > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Loser row */}
        <div className="wc-leaderboard">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              opacity: 0.55,
            }}
          >
            <span style={{ font: '900 22px Nunito' }}>🥈</span>
            <div style={{ flex: 1 }}>
              <div style={{ font: '800 14px Nunito', color: 'var(--ink)' }}>
                Équipe {loserTeam}
              </div>
              <div style={{ font: '700 11px Nunito', color: '#9a8f76' }}>
                {loserPlayers.join(', ')}
              </div>
            </div>
            <span
              style={{
                fontFamily: 'Bangers',
                fontSize: 26,
                color: loserColor,
                background: '#fff',
                border: '2px solid var(--ink)',
                borderRadius: 8,
                padding: '2px 10px',
              }}
            >
              {loserScore} pt{loserScore !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="wc-replay-btn"
          style={{ background: winnerColor }}
          onClick={() => navigate('/')}
        >
          REJOUER !
        </button>
      </div>
    </div>
  );
}
