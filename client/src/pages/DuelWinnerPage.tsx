import { useLocation, useNavigate } from 'react-router-dom';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import PowBadge from '../components/PowBadge';
import '../components/comic.css';

export default function DuelWinnerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { scores: Record<string, number>; players: string[] } | null;

  if (!state) {
    navigate('/');
    return null;
  }

  const { scores, players } = state;
  const sorted = [...players].sort((playerA, playerB) => scores[playerB] - scores[playerA]);
  const winner = sorted[0];

  return (
    <div className="comic-page">
      <div className="comic-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <PageHeader>VICTOIRE&nbsp;!</PageHeader>
          <PowBadge>🏆</PowBadge>
        </div>

        <ComicPanel style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ font: '700 16px Nunito', color: 'var(--text-muted)', marginBottom: 8 }}>
            Nous avons un vainqueur.
          </p>
          <p className="comic-title comic-title--sm comic-title--nostroke" style={{ lineHeight: 1.2 }}>
            {winner}<br />remporte le<br />Duel !
          </p>
        </ComicPanel>

        <ComicPanel style={{ padding: 16 }}>
          <p style={{ font: '800 13px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Classement final
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sorted.map((player, index) => (
              <div key={player} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ font: '800 15px Nunito' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {player}
                </span>
                <span style={{ font: '900 18px Nunito' }}>{scores[player]} pts</span>
              </div>
            ))}
          </div>
        </ComicPanel>

        <ComicButton onClick={() => navigate('/')}>Rejouer !</ComicButton>
      </div>
    </div>
  );
}
