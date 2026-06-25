import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import ChallengeTimer from '../components/ChallengeTimer';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import { useDuelChallenges } from '../hooks/use-duel-challenges';
import type { Challenge } from '../hooks/use-challenges';
import '../components/comic.css';
import './duel-play.css';

const TOTAL_ROUNDS = 8;

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

type Phase = 'scoring' | 'results';

function findTied(scores: Record<string, number>, players: string[]): string[] {
  const max = Math.max(...players.map((player) => scores[player]));
  return players.filter((player) => scores[player] === max);
}

function computeNextChallenge(
  challenges: Challenge[],
  playerCount: number,
  usedIds: ReadonlySet<string>,
  excludeId?: string,
): { challenge: Challenge; newUsedIds: Set<string> } | null {
  const eligible = challenges.filter(
    (c) => c.minPlayers <= playerCount && (c.maxPlayers === undefined || c.maxPlayers >= playerCount),
  );
  const exclude = excludeId ? new Set([...usedIds, excludeId]) : usedIds;
  const pool = eligible.filter((c) => !exclude.has(c.id));
  const isExhausted = pool.length === 0;
  const candidates = isExhausted ? eligible.filter((c) => c.id !== excludeId) : pool;
  if (candidates.length === 0) return null;
  const challenge = candidates[Math.floor(Math.random() * candidates.length)];
  const newUsedIds = isExhausted ? new Set([challenge.id]) : new Set([...usedIds, challenge.id]);
  return { challenge, newUsedIds };
}

function medalFor(rank: number): string {
  return (['🥇', '🥈', '🥉', '🏅'] as const)[rank] ?? '🏅';
}

function rankLabel(position: number): string {
  return position === 1 ? '1er' : `${position}e`;
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
  const [usedChallengeIds, setUsedChallengeIds] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (players.length === 0) navigate('/');
  }, [players, navigate]);

  useEffect(() => {
    if (!loading && challenges.length > 0 && currentChallenge === null) {
      const result = computeNextChallenge(challenges, activePlayers.length, new Set());
      if (result) {
        setCurrentChallenge(result.challenge);
        setUsedChallengeIds(result.newUsedIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, challenges, activePlayers.length, currentChallenge]);

  function resetRoundInputState() {
    setOrderedRanks([]);
  }

  function togglePlayerRank(player: string) {
    const rankIndex = orderedRanks.indexOf(player);
    if (rankIndex === -1) {
      const newRanks = [...orderedRanks, player];
      if (newRanks.length === activePlayers.length - 1) {
        const last = activePlayers.find((p) => !newRanks.includes(p));
        if (last) { setOrderedRanks([...newRanks, last]); return; }
      }
      setOrderedRanks(newRanks);
    } else {
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
    const result = computeNextChallenge(challenges, activePlayers.length, usedChallengeIds, currentChallenge?.id);
    if (!result) return;
    setCurrentChallenge(result.challenge);
    setUsedChallengeIds(result.newUsedIds);
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
      const tieResult = computeNextChallenge(challenges, tied.length, usedChallengeIds);
      setIsTieBreak(true);
      setActivePlayers(tied);
      if (tieResult) { setCurrentChallenge(tieResult.challenge); setUsedChallengeIds(tieResult.newUsedIds); }
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
      const tieResult = computeNextChallenge(challenges, tied.length, usedChallengeIds);
      setActivePlayers(tied);
      if (tieResult) { setCurrentChallenge(tieResult.challenge); setUsedChallengeIds(tieResult.newUsedIds); }
      resetRoundInputState();
      setPhase('scoring');
      return;
    }

    const nextResult = computeNextChallenge(challenges, activePlayers.length, usedChallengeIds);
    setRound((previous) => previous + 1);
    if (nextResult) { setCurrentChallenge(nextResult.challenge); setUsedChallengeIds(nextResult.newUsedIds); }
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
  const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;
  const hasTieAfterLastRound = isLastNormalRound && findTied(scores, players).length > 1;
  const nextButtonLabel = isTieBreak || round < TOTAL_ROUNDS || hasTieAfterLastRound
    ? 'Manche suivante →'
    : 'Voir les résultats →';

  return (
    <div className="comic-page">
      <div className="comic-content">

        {/* ── SCORING PHASE ──────────────────────────────── */}
        {phase === 'scoring' && (
          <>
            {/* Header: round title + progress bar */}
            <div className="dp-header">
              <h1 className="dp-round-title">{roundLabel}</h1>
              {!isTieBreak && (
                <div className="dp-progress" role="progressbar" aria-valuenow={round} aria-valuemax={TOTAL_ROUNDS}>
                  {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                    <div key={i} className={`dp-progress-segment${i < round ? ' dp-progress-segment--filled' : ''}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Challenge card */}
            <div className="dp-challenge-wrap">
              <div className="dp-challenge-card">
                <span className="dp-badge">DÉFI EN COURS</span>
                <p className="dp-challenge-title">{currentChallenge.name}</p>
                <p className="dp-challenge-desc">{currentChallenge.description}</p>
                {currentChallenge.duration && (
                  <div style={{ marginTop: 12 }}>
                    <ChallengeTimer duration={currentChallenge.duration} />
                  </div>
                )}
              </div>
              <button type="button" className="dp-change-btn" onClick={changeChallenge}>
                ↻ Changer de défi
              </button>
            </div>

            {/* Ranking section */}
            <div className="dp-ranking-section">
              <div className="dp-ranking-header">
                <div>
                  <p className="dp-ranking-title">CLASSEZ DU GAGNANT AU PERDANT</p>
                  <p className="dp-ranking-hint">
                    Touche les joueurs dans l'ordre — le 1er touché finit premier.
                  </p>
                </div>
                <div className="dp-ranking-counter">
                  <span className="dp-counter-fraction">{orderedRanks.length}/{activePlayers.length}</span>
                  <span className="dp-counter-label">classés</span>
                </div>
              </div>

              <div className="dp-players">
                {activePlayers.map((player) => {
                  const rank = orderedRanks.indexOf(player);
                  const isRanked = rank !== -1;
                  const avatarColor = PLAYER_COLORS[players.indexOf(player) % PLAYER_COLORS.length] ?? '#888';
                  return (
                    <button
                      key={player}
                      type="button"
                      className={`dp-player-row${isRanked ? ' dp-player-row--ranked' : ' dp-player-row--unranked'}`}
                      onClick={() => togglePlayerRank(player)}
                    >
                      <span className={`dp-medal${!isRanked ? ' dp-medal--empty' : ''}`}>
                        {isRanked ? medalFor(rank) : null}
                      </span>
                      <span className="dp-avatar" style={{ background: avatarColor }}>
                        {player.charAt(0).toUpperCase()}
                      </span>
                      <span className="dp-player-name">{player}</span>
                      {isRanked && (
                        <span className="dp-rank-label">{rankLabel(rank + 1)}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {orderedRanks.length > 0 && (
                <button type="button" className="dp-restart-btn" onClick={() => setOrderedRanks([])}>
                  ↺ Recommencer le classement
                </button>
              )}
            </div>

            <button
              type="button"
              className={`dp-submit-btn${allRanked ? ' dp-submit-btn--active' : ' dp-submit-btn--disabled'}`}
              onClick={allRanked ? submitRanking : undefined}
              disabled={!allRanked}
            >
              {allRanked ? 'SOUMETTRE →' : 'CLASSE TOUS LES JOUEURS'}
            </button>
          </>
        )}

        {/* ── RESULTS PHASE ──────────────────────────────── */}
        {phase === 'results' && (
          <>
            <PageHeader>{roundLabel}</PageHeader>

            <ComicPanel style={{ padding: 0, overflow: 'hidden' }}>
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
                          {medalFor(index)}
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
              {nextButtonLabel}
            </ComicButton>
          </>
        )}

      </div>
    </div>
  );
}
