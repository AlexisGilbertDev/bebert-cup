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

  useEffect(() => {
    if (players.length === 0) navigate('/');
  }, [players, navigate]);

  useEffect(() => {
    if (!loading && challenges.length > 0) {
      setCurrentChallenge(pickChallenge(challenges, activePlayers.length));
    }
  }, [loading, challenges, activePlayers.length]);

  function setPointsForPlayer(player: string, points: number) {
    setRoundPoints((previous) => ({ ...previous, [player]: points }));
  }

  function confirmRound() {
    const newScores = { ...scores };
    for (const player of activePlayers) {
      newScores[player] = (newScores[player] ?? 0) + (roundPoints[player] ?? 0);
    }
    setScores(newScores);
    setPhase('results');
  }

  function nextRound() {
    const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;

    if (isLastNormalRound) {
      const newScores = scores;
      const tied = findTied(newScores, players);
      if (tied.length === 1) {
        navigate('/duel/winner', { state: { scores: newScores, players } });
        return;
      }
      setIsTieBreak(true);
      setActivePlayers(tied);
      setRoundPoints(Object.fromEntries(tied.map((player) => [player, 0])));
      setCurrentChallenge(pickChallenge(challenges, tied.length));
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
      setRoundPoints(Object.fromEntries(tied.map((player) => [player, 0])));
      setCurrentChallenge(pickChallenge(challenges, tied.length));
      setPhase('scoring');
      return;
    }

    setRound((previous) => previous + 1);
    setRoundPoints(Object.fromEntries(activePlayers.map((player) => [player, 0])));
    setCurrentChallenge(pickChallenge(challenges, activePlayers.length));
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

  return (
    <div className="comic-page">
      <div className="comic-content">
        <PageHeader>{roundLabel}</PageHeader>

        <ComicPanel style={{ padding: 16 }}>
          <ComicTitle size="sm" as="h1" noStroke>{currentChallenge.name}</ComicTitle>
          <p style={{ font: '700 15px Nunito', color: 'var(--text-muted)', marginTop: 8 }}>
            {currentChallenge.description}
          </p>
        </ComicPanel>

        {phase === 'scoring' && (
          <>
            <ComicPanel style={{ padding: 16 }}>
              <p style={{ font: '800 13px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Points de la manche
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activePlayers.map((player) => (
                  <div key={player} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ font: '800 15px Nunito', flex: 1 }}>{player}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0, 1, 2, 3].map((points) => (
                        <button
                          key={points}
                          type="button"
                          onClick={() => setPointsForPlayer(player, points)}
                          style={{
                            width: 40,
                            height: 40,
                            border: '2px solid var(--ink)',
                            borderRadius: 6,
                            font: '800 16px Nunito',
                            cursor: 'pointer',
                            background: roundPoints[player] === points ? 'var(--ink)' : '#fff',
                            color: roundPoints[player] === points ? '#fff' : 'var(--ink)',
                          }}
                        >
                          {points}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ComicPanel>

            <ComicButton onClick={confirmRound}>Valider →</ComicButton>
          </>
        )}

        {phase === 'results' && (
          <>
            <ComicPanel style={{ padding: 16 }}>
              <p style={{ font: '800 13px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Scores
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {players
                  .slice()
                  .sort((playerA, playerB) => scores[playerB] - scores[playerA])
                  .map((player) => (
                    <div key={player} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ font: '800 15px Nunito' }}>{player}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {activePlayers.includes(player) && roundPoints[player] > 0 && (
                          <span style={{ font: '700 13px Nunito', color: 'var(--text-muted)' }}>
                            +{roundPoints[player]}
                          </span>
                        )}
                        <span style={{ font: '900 18px Nunito' }}>{scores[player]} pts</span>
                      </div>
                    </div>
                  ))}
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
