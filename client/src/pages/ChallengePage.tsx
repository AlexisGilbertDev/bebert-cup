import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import Caption from '../components/Caption';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import { pickChallenge, resolveRound, shuffle } from '../game';
import { useChallenges, type Challenge } from '../hooks/use-challenges';
import '../components/comic.css';

export default function ChallengePage() {
  const { players } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { challenges, loading, error } = useChallenges();

  const finalists = (location.state as { finalists?: string[] } | null)
    ?.finalists;

  const [activePlayers, setActivePlayers] = useState<string[]>(() =>
    shuffle(finalists ?? players),
  );
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [eliminated, setEliminated] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && challenges.length > 0) {
      setCurrentChallenge(pickChallenge(challenges, activePlayers.length));
    }
  }, [loading, challenges, activePlayers.length]);

  useEffect(() => {
    if (players.length === 0) navigate('/');
  }, [players, navigate]);

  function changeChallenge() {
    if (!currentChallenge) return;
    const eligible = challenges.filter(
      (c) =>
        c.minPlayers <= activePlayers.length && c.id !== currentChallenge.id,
    );
    if (eligible.length === 0) return;
    setCurrentChallenge(
      eligible[Math.floor(Math.random() * eligible.length)],
    );
  }

  function nextRound() {
    if (!eliminated) return;
    const result = resolveRound(activePlayers, eliminated);
    if (result.type === 'winner') {
      navigate('/survivor/winner', { state: { winner: result.winner } });
      return;
    }
    if (result.type === 'finale') {
      navigate('/survivor/finale', { state: { finalists: result.finalists } });
      return;
    }
    const order = shuffle(result.survivors);
    setActivePlayers(order);
    setCurrentChallenge(pickChallenge(challenges, order.length));
    setEliminated(null);
  }

  if (loading) return (
    <div className="comic-page">
      <div className="comic-content">
        <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>Chargement des défis…</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="comic-page">
      <div className="comic-content">
        <p style={{ font: '800 18px Nunito', color: 'var(--red)', textAlign: 'center' }}>{error}</p>
      </div>
    </div>
  );
  if (!currentChallenge) return (
    <div className="comic-page">
      <div className="comic-content">
        <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>Pas assez de défis disponibles.</p>
      </div>
    </div>
  );

  return (
    <div className="comic-page">
      <div className="comic-content">
        <Caption>Round en cours · {activePlayers.length} joueurs</Caption>

        <ComicPanel style={{ padding: 16 }}>
          <ComicTitle size="sm" as="h1">{currentChallenge.name}</ComicTitle>
          <p style={{ font: '700 15px Nunito', color: 'var(--text-muted)', marginTop: 8 }}>
            {currentChallenge.description}
          </p>
        </ComicPanel>

        {!eliminated && (
          <>
            <Caption>Qui est éliminé ?</Caption>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activePlayers.map((player) => (
                <button
                  key={player}
                  type="button"
                  onClick={() => setEliminated(player)}
                  className="comic-btn"
                  style={{
                    background: '#fff',
                    color: 'var(--ink)',
                    font: '800 18px Nunito',
                    letterSpacing: 0,
                  }}
                >
                  {player}
                </button>
              ))}
            </div>
            <ComicButton variant="ghost" onClick={changeChallenge}>
              🔀 Changer de défi
            </ComicButton>
          </>
        )}

        {eliminated && (
          <ComicPanel style={{ padding: 16, textAlign: 'center' }}>
            <p style={{ font: '900 20px Nunito', color: 'var(--red)', marginBottom: 16 }}>
              {eliminated} est éliminé !
            </p>
            <ComicButton onClick={nextRound}>Défi suivant →</ComicButton>
          </ComicPanel>
        )}
      </div>
    </div>
  );
}
