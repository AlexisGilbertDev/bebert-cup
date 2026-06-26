import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Caption from '../components/Caption';
import ChallengeTimer from '../components/ChallengeTimer';
import ChangeChallengeButton from '../components/ChangeChallengeButton';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import { useSession } from '../context/session.context';
import { pickChallenge, resolveRound, shuffle } from '../game';
import { type Challenge, useChallenges } from '../hooks/use-challenges';
import '../components/comic.css';

const PLAYER_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export default function ChallengePage() {
  const { players } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { challenges, loading, error } = useChallenges();

  const locationState = location.state as {
    finalists?: string[];
    eliminationOrder?: string[];
  } | null;
  const finalists = locationState?.finalists;

  const [activePlayers, setActivePlayers] = useState<string[]>(() =>
    shuffle(finalists ?? players),
  );
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [eliminated, setEliminated] = useState<string | null>(null);
  const [drawnPlayers, setDrawnPlayers] = useState<
    Array<{ player: string; role: string }>
  >([]);
  const [showDetails, setShowDetails] = useState(false);
  const [eliminationOrder, setEliminationOrder] = useState<string[]>(
    locationState?.eliminationOrder ?? [],
  );
  const [usedChallengeIds, setUsedChallengeIds] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const drawPlayers = useCallback(
    (challenge: Challenge | null, pool: string[]) => {
      setShowDetails(false);
      if (!challenge?.draw || challenge.draw.length === 0) {
        setDrawnPlayers([]);
        return;
      }
      const shuffled = shuffle([...pool]);
      setDrawnPlayers(
        challenge.draw
          .slice(0, shuffled.length)
          .map((slot, index) => ({ player: shuffled[index], role: slot.role })),
      );
    },
    [],
  );

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
      if (challenge) setUsedChallengeIds(new Set([challenge.id]));
      drawPlayers(challenge, activePlayers);
    }
  }, [loading, challenges, activePlayers, drawPlayers]);

  useEffect(() => {
    if (players.length === 0) navigate('/');
  }, [players, navigate]);

  function changeChallenge() {
    if (!currentChallenge) return;
    const excluded = new Set([...usedChallengeIds, currentChallenge.id]);
    const fresh = challenges.filter(
      (c) => c.minPlayers <= activePlayers.length && !excluded.has(c.id),
    );
    const pool =
      fresh.length > 0
        ? fresh
        : challenges.filter(
            (c) =>
              c.minPlayers <= activePlayers.length &&
              c.id !== currentChallenge.id,
          );
    if (pool.length === 0) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrentChallenge(next);
    setUsedChallengeIds(
      fresh.length > 0
        ? new Set([...usedChallengeIds, next.id])
        : new Set([next.id]),
    );
    drawPlayers(next, activePlayers);
  }

  function nextRound() {
    if (!eliminated) return;
    const result = resolveRound(activePlayers, eliminated);
    const newEliminationOrder = [...eliminationOrder, eliminated];
    if (result.type === 'winner') {
      navigate('/survivor/winner', {
        state: { winner: result.winner, eliminationOrder: newEliminationOrder },
      });
      return;
    }
    if (result.type === 'finale') {
      navigate('/survivor/finale', {
        state: {
          finalists: result.finalists,
          eliminationOrder: newEliminationOrder,
        },
      });
      return;
    }
    setEliminationOrder(newEliminationOrder);
    setActivePlayers(shuffle(result.survivors));
    setEliminated(null);
  }

  if (loading)
    return (
      <div className="comic-page">
        <div className="comic-content">
          <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>
            Chargement des défis…
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="comic-page">
        <div className="comic-content">
          <p
            style={{
              font: '800 18px Nunito',
              color: 'var(--red)',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  if (!currentChallenge)
    return (
      <div className="comic-page">
        <div className="comic-content">
          <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>
            Pas assez de défis disponibles.
          </p>
        </div>
      </div>
    );

  return (
    <div className="comic-page">
      <div className="comic-content">
        <div className="page-header">
          <button
            type="button"
            aria-label="Retour"
            onClick={() => navigate('/')}
            className="comic-btn-retour"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M14 5 L7 12 L14 19"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            style={{
              display: 'flex',
              gap: 5,
              flexWrap: 'wrap',
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {players.map((player, index) => {
              const isOut =
                eliminationOrder.includes(player) || player === eliminated;
              return (
                <div
                  key={player}
                  title={player}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isOut
                      ? '#9a8f76'
                      : PLAYER_COLORS[index % PLAYER_COLORS.length],
                    border: '2.5px solid var(--ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    font: '800 12px/1 Nunito',
                    color: '#fff',
                    opacity: isOut ? 0.4 : 1,
                  }}
                >
                  {isOut ? '✕' : player.charAt(0).toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>

        <ComicPanel style={{ padding: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <ComicTitle size="sm" as="h1" noStroke>
              {currentChallenge.name}
            </ComicTitle>
            {currentChallenge.details && (
              <button
                type="button"
                onClick={() => setShowDetails((previous) => !previous)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: showDetails ? 'var(--ink)' : '#e8e0d0',
                  border: '2px solid var(--ink)',
                  cursor: 'pointer',
                  font: '900 13px Nunito',
                  color: showDetails ? '#fff' : 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ?
              </button>
            )}
          </div>
          <p
            style={{
              font: '700 15px Nunito',
              color: 'var(--text-muted)',
              marginTop: 8,
            }}
          >
            {interpolateDescription(currentChallenge.description)}
          </p>
          {showDetails && currentChallenge.details && (
            <div
              style={{
                marginTop: 8,
                padding: '8px 10px',
                background: '#f0e8d4',
                borderRadius: 8,
                border: '2px solid var(--ink)',
              }}
            >
              <p style={{ font: '700 13px/1.45 Nunito', color: 'var(--ink)' }}>
                {currentChallenge.details}
              </p>
            </div>
          )}
          {drawnPlayers.length > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                background: 'var(--yellow)',
                borderRadius: 8,
                border: '2px solid var(--ink)',
              }}
            >
              <p
                style={{
                  font: '800 12px Nunito',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                🎲 Tirage au sort
              </p>
              {drawnPlayers.map(({ player, role }) => (
                <p
                  key={role}
                  style={{ font: '800 15px Nunito', margin: '2px 0' }}
                >
                  {player}{' '}
                  <span
                    style={{
                      font: '700 13px Nunito',
                      color: 'var(--text-muted)',
                    }}
                  >
                    → {role}
                  </span>
                </p>
              ))}
            </div>
          )}
          {currentChallenge.duration && (
            <div style={{ marginTop: 12 }}>
              <ChallengeTimer duration={currentChallenge.duration} />
            </div>
          )}
        </ComicPanel>

        {!eliminated && (
          <>
            <ChangeChallengeButton onClick={changeChallenge} />
            <Caption>Qui est éliminé&nbsp;?</Caption>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(() => {
                const eliminableNames: Set<string> | null =
                  currentChallenge.eliminableRoles
                    ? new Set(
                        drawnPlayers
                          .filter(
                            (d) =>
                              currentChallenge.eliminableRoles?.includes(
                                d.role,
                              ) ?? false,
                          )
                          .map((d) => d.player),
                      )
                    : null;
                return activePlayers.map((player) => {
                  const drawnRole = drawnPlayers.find(
                    (d) => d.player === player,
                  )?.role;
                  const isDisabled = eliminableNames
                    ? !eliminableNames.has(player)
                    : drawnRole === 'juge';
                  const suffix =
                    drawnRole && isDisabled ? ` (${drawnRole})` : '';
                  return (
                    <button
                      key={player}
                      type="button"
                      onClick={() => {
                        if (!isDisabled) setEliminated(player);
                      }}
                      disabled={isDisabled}
                      className="comic-btn"
                      style={{
                        background: isDisabled ? '#e5e0d5' : '#fff',
                        color: isDisabled ? '#b0a890' : 'var(--ink)',
                        font: '800 18px Nunito',
                        letterSpacing: 0,
                        cursor: isDisabled ? 'default' : undefined,
                      }}
                    >
                      {player}
                      {suffix}
                    </button>
                  );
                });
              })()}
            </div>
          </>
        )}

        {eliminated && (
          <ComicPanel style={{ padding: 16, textAlign: 'center' }}>
            <p
              style={{
                font: '900 20px Nunito',
                color: 'var(--red)',
                marginBottom: 16,
              }}
            >
              {eliminated} est éliminé !
            </p>
            <ComicButton onClick={nextRound}>Défi suivant →</ComicButton>
          </ComicPanel>
        )}
      </div>
    </div>
  );
}
