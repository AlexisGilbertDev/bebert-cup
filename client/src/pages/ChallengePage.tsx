import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import Caption from '../components/Caption';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import PageHeader from '../components/PageHeader';
import { pickChallenge, resolveRound, shuffle } from '../game';
import { useChallenges, type Challenge } from '../hooks/use-challenges';
import '../components/comic.css';

export default function ChallengePage() {
  const { players } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { challenges, loading, error } = useChallenges();

  const locationState = location.state as { finalists?: string[]; eliminationOrder?: string[] } | null;
  const finalists = locationState?.finalists;

  const [activePlayers, setActivePlayers] = useState<string[]>(() =>
    shuffle(finalists ?? players),
  );
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [eliminated, setEliminated] = useState<string | null>(null);
  const [drawnPlayers, setDrawnPlayers] = useState<Array<{ player: string; role: string }>>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [eliminationOrder, setEliminationOrder] = useState<string[]>(locationState?.eliminationOrder ?? []);

  function drawPlayers(challenge: Challenge | null, pool: string[]) {
    if (!challenge?.draw || challenge.draw.length === 0) {
      setDrawnPlayers([]);
    } else {
      const shuffled = shuffle([...pool]);
      setDrawnPlayers(challenge.draw.map((slot, index) => ({ player: shuffled[index], role: slot.role })));
    }
    setShowDetails(false);
  }

  function interpolateDescription(description: string): string {
    return drawnPlayers.reduce(
      (text, { player, role }) => text.split(`{{${role}}}`).join(player),
      description,
    );
  }

  useEffect(() => {
    if (!loading && challenges.length > 0) {
      const challenge = pickChallenge(challenges, activePlayers.length);
      setCurrentChallenge(challenge);
      drawPlayers(challenge, activePlayers);
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
    const next = eligible[Math.floor(Math.random() * eligible.length)];
    setCurrentChallenge(next);
    drawPlayers(next, activePlayers);
  }

  function nextRound() {
    if (!eliminated) return;
    const result = resolveRound(activePlayers, eliminated);
    const newEliminationOrder = [...eliminationOrder, eliminated];
    if (result.type === 'winner') {
      navigate('/survivor/winner', { state: { winner: result.winner, eliminationOrder: newEliminationOrder } });
      return;
    }
    if (result.type === 'finale') {
      navigate('/survivor/finale', { state: { finalists: result.finalists, eliminationOrder: newEliminationOrder } });
      return;
    }
    setEliminationOrder(newEliminationOrder);
    const order = shuffle(result.survivors);
    const next = pickChallenge(challenges, order.length);
    setActivePlayers(order);
    setCurrentChallenge(next);
    drawPlayers(next, order);
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
        <PageHeader>DÉFI · {activePlayers.length} joueurs</PageHeader>

        <ComicPanel style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <ComicTitle size="sm" as="h1" noStroke>{currentChallenge.name}</ComicTitle>
            {currentChallenge.details && (
              <button
                type="button"
                onClick={() => setShowDetails((previous) => !previous)}
                style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: showDetails ? 'var(--ink)' : '#e8e0d0',
                  border: '2px solid var(--ink)', cursor: 'pointer',
                  font: '900 13px Nunito', color: showDetails ? '#fff' : 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ?
              </button>
            )}
          </div>
          <p style={{ font: '700 15px Nunito', color: 'var(--text-muted)', marginTop: 8 }}>
            {interpolateDescription(currentChallenge.description)}
          </p>
          {showDetails && currentChallenge.details && (
            <div style={{ marginTop: 8, padding: '8px 10px', background: '#f0e8d4', borderRadius: 8, border: '2px solid var(--ink)' }}>
              <p style={{ font: '700 13px/1.45 Nunito', color: 'var(--ink)' }}>
                {currentChallenge.details}
              </p>
            </div>
          )}
          {drawnPlayers.length > 0 && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--yellow)', borderRadius: 8, border: '2px solid var(--ink)' }}>
              <p style={{ font: '800 12px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                🎲 Tirage au sort
              </p>
              {drawnPlayers.map(({ player, role }) => (
                <p key={role} style={{ font: '800 15px Nunito', margin: '2px 0' }}>
                  {player} <span style={{ font: '700 13px Nunito', color: 'var(--text-muted)' }}>→ {role}</span>
                </p>
              ))}
            </div>
          )}
        </ComicPanel>

        {!eliminated && (
          <>
            <Caption>Qui est éliminé&nbsp;?</Caption>
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
