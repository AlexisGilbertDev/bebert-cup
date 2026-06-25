import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import PageHeader from '../components/PageHeader';
import { pickChallenge } from '../game';
import { useDuelChallenges } from '../hooks/use-duel-challenges';
import type { Challenge } from '../hooks/use-challenges';
import '../components/comic.css';

const TOTAL_ROUNDS = 8;

type Phase = 'scoring' | 'results';

function findTied(scores: Record<string, number>, players: string[]): string[] {
  const max = Math.max(...players.map((player) => scores[player]));
  return players.filter((player) => scores[player] === max);
}

export default function DuelPlayPage() {
  const { players } = useSession();
  const navigate = useNavigate();
  const { challenges, loading, error } = useDuelChallenges();

  const [round, setRound] = useState(1);
  const [isTieBreak, setIsTieBreak] = useState(false);
  const [activePlayers, setActivePlayers] = useState<string[]>(players);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((player) => [player, 0])),
  );
  const [roundPoints, setRoundPoints] = useState<Record<string, number>>(
    Object.fromEntries(players.map((player) => [player, 0])),
  );
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [phase, setPhase] = useState<Phase>('scoring');
  const [orderedRanks, setOrderedRanks] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (players.length === 0) navigate('/');
  }, [players, navigate]);

  useEffect(() => {
    if (!loading && challenges.length > 0) {
      setCurrentChallenge(pickChallenge(challenges, activePlayers.length));
    }
  }, [loading, challenges, activePlayers.length]);

  function resetRoundInputState() {
    setOrderedRanks([]);
    setShowDetails(false);
  }

  function togglePlayerRank(player: string) {
    const rankIndex = orderedRanks.indexOf(player);
    if (rankIndex === -1) {
      setOrderedRanks([...orderedRanks, player]);
    } else {
      // Remove this player and all ranked after them
      setOrderedRanks(orderedRanks.slice(0, rankIndex));
    }
  }

  function submitRanking() {
    const pointsByRank = activePlayers.length === 2 ? [1, 0] : activePlayers.length === 3 ? [2, 1, 0] : [3, 2, 1, 0];
    const points: Record<string, number> = {};
    orderedRanks.forEach((player, index) => {
      points[player] = pointsByRank[index] ?? 0;
    });
    const newScores = { ...scores };
    for (const player of activePlayers) {
      newScores[player] = (newScores[player] ?? 0) + (points[player] ?? 0);
    }
    setRoundPoints(points);
    setScores(newScores);
    setPhase('results');
  }

  function changeChallenge() {
    const eligible = challenges.filter(
      (c) =>
        c.minPlayers <= activePlayers.length &&
        (c.maxPlayers === undefined || c.maxPlayers >= activePlayers.length) &&
        c.id !== currentChallenge?.id,
    );
    if (eligible.length === 0) return;
    setCurrentChallenge(eligible[Math.floor(Math.random() * eligible.length)]);
    resetRoundInputState();
  }

  function nextRound() {
    const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;

    if (isLastNormalRound) {
      const tied = findTied(scores, players);
      if (tied.length === 1) {
        navigate('/duel/winner', { state: { scores, players } });
        return;
      }
      setIsTieBreak(true);
      setActivePlayers(tied);
      setCurrentChallenge(pickChallenge(challenges, tied.length));
      resetRoundInputState();
      setPhase('scoring');
      return;
    }

    if (isTieBreak) {
      const tied = findTied(scores, activePlayers);
      if (tied.length === 1) {
        navigate('/duel/winner', { state: { scores, players } });
        return;
      }
      setActivePlayers(tied);
      setCurrentChallenge(pickChallenge(challenges, tied.length));
      resetRoundInputState();
      setPhase('scoring');
      return;
    }

    setRound((previous) => previous + 1);
    setCurrentChallenge(pickChallenge(challenges, activePlayers.length));
    resetRoundInputState();
    setPhase('scoring');
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

  const roundLabel = isTieBreak ? 'PROLONGATION' : `MANCHE ${round}/${TOTAL_ROUNDS}`;
  const allRanked = orderedRanks.length === activePlayers.length;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="comic-page">
      <div className="comic-content">
        <PageHeader>{roundLabel}</PageHeader>

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
            {currentChallenge.description}
          </p>
          {showDetails && currentChallenge.details && (
            <div style={{ marginTop: 8, padding: '8px 10px', background: '#f0e8d4', borderRadius: 8, border: '2px solid var(--ink)' }}>
              <p style={{ font: '700 13px/1.45 Nunito', color: 'var(--ink)' }}>
                {currentChallenge.details}
              </p>
            </div>
          )}
        </ComicPanel>

        {phase === 'scoring' && (
          <ComicButton variant="ghost" onClick={changeChallenge}>
            ↻ Changer de défi
          </ComicButton>
        )}

        {phase === 'scoring' && (
          <ComicPanel style={{ padding: 16 }}>
            <p style={{ font: '800 13px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Classez du gagnant au perdant
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activePlayers.map((player) => {
                const rank = orderedRanks.indexOf(player);
                const isRanked = rank !== -1;
                return (
                  <button
                    key={player}
                    type="button"
                    onClick={() => togglePlayerRank(player)}
                    style={{
                      height: 56,
                      border: '3px solid var(--ink)',
                      borderRadius: 8,
                      font: '800 16px Nunito',
                      cursor: 'pointer',
                      background: isRanked ? 'var(--ink)' : 'var(--paper)',
                      color: isRanked ? '#fff' : 'var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 16px',
                    }}
                  >
                    <span>{player}</span>
                    {isRanked && <span>{medals[rank]}</span>}
                  </button>
                );
              })}
            </div>
          </ComicPanel>
        )}

        {phase === 'scoring' && (
          <ComicButton onClick={submitRanking} disabled={!allRanked}>
            Soumettre →
          </ComicButton>
        )}

        {phase === 'results' && (
          <>
            <ComicPanel style={{ padding: 0, overflow: 'hidden' }}>
              {/* Bandeau titre */}
              <div style={{
                background: 'var(--ink)',
                color: 'var(--yellow)',
                fontFamily: 'Anton, sans-serif',
                fontSize: 18,
                letterSpacing: 4,
                textAlign: 'center',
                padding: '10px 16px',
              }}>
                CLASSEMENT
              </div>

              {/* Lignes joueurs */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {players
                  .slice()
                  .sort((playerA, playerB) => scores[playerB] - scores[playerA])
                  .map((player, index) => {
                    const isLeader = index === 0;
                    const gained = roundPoints[player] ?? 0;
                    return (
                      <div
                        key={player}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          background: isLeader ? 'var(--yellow)' : index % 2 === 0 ? '#fff' : 'var(--paper)',
                          borderTop: index === 0 ? 'none' : '2px solid var(--ink)',
                        }}
                      >
                        <span style={{ font: '900 22px Nunito', width: 32, flexShrink: 0 }}>
                          {medals[index]}
                        </span>
                        <span style={{ font: '800 16px Nunito', flex: 1 }}>{player}</span>
                        {gained > 0 && (
                          <span style={{
                            font: '800 13px Nunito',
                            color: 'var(--blue)',
                            background: '#fff',
                            border: '2px solid var(--ink)',
                            borderRadius: 20,
                            padding: '2px 8px',
                            flexShrink: 0,
                          }}>
                            +{gained} pt{gained > 1 ? 's' : ''}
                          </span>
                        )}
                        <span style={{
                          fontFamily: 'Anton, sans-serif',
                          fontSize: 26,
                          color: 'var(--ink)',
                          flexShrink: 0,
                          lineHeight: 1,
                        }}>
                          {scores[player]}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </ComicPanel>

            <ComicButton onClick={nextRound}>
              {isTieBreak || round < TOTAL_ROUNDS ? 'Manche suivante →' : 'Voir les résultats →'}
            </ComicButton>
          </>
        )}
      </div>
    </div>
  );
}
