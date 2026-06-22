import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import type { Challenge } from '../hooks/use-challenges';
import { useChallenges } from '../hooks/use-challenges';

type PlayerStatus = 'playing' | 'qualified' | 'eliminated';

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickChallenge(
  challenges: Challenge[],
  playerCount: number,
): Challenge | null {
  const eligible = challenges.filter(
    (challenge) => challenge.minPlayers <= playerCount,
  );
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export default function ChallengePage() {
  const { players } = useSession();
  const navigate = useNavigate();
  const { challenges, loading, error } = useChallenges();

  const [activePlayers, setActivePlayers] = useState<string[]>(() =>
    shuffle(players),
  );
  const [statuses, setStatuses] = useState<Record<string, PlayerStatus>>(() =>
    Object.fromEntries(players.map((player) => [player, 'playing'])),
  );
  const [scores, setScores] = useState<Record<string, string>>({});
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [roundOver, setRoundOver] = useState(false);

  useEffect(() => {
    if (!loading && challenges.length > 0) {
      setCurrentChallenge(pickChallenge(challenges, activePlayers.length));
    }
  }, [loading, challenges, activePlayers.length]);

  useEffect(() => {
    if (players.length === 0) navigate('/');
  }, [players, navigate]);

  function eliminate(player: string) {
    setStatuses((prev) => ({ ...prev, [player]: 'eliminated' }));
    setRoundOver(true);
  }

  function qualify(player: string) {
    const next = { ...statuses, [player]: 'qualified' as PlayerStatus };
    const stillPlaying = activePlayers.filter((p) => next[p] === 'playing');
    if (stillPlaying.length === 1) {
      next[stillPlaying[0]] = 'eliminated';
      setStatuses(next);
      setRoundOver(true);
    } else {
      setStatuses(next);
    }
  }

  function submitScores() {
    const sorted = activePlayers
      .filter((p) => scores[p] !== undefined)
      .sort((a, b) => Number(scores[b]) - Number(scores[a]));
    if (sorted.length === 0) return;
    eliminate(sorted[0]);
  }

  function nextRound() {
    const survivors = activePlayers.filter((p) => statuses[p] !== 'eliminated');
    if (survivors.length === 1) {
      navigate('/survivor/winner', { state: { winner: survivors[0] } });
      return;
    }
    const order = shuffle(survivors);
    setActivePlayers(order);
    setStatuses(Object.fromEntries(order.map((p) => [p, 'playing'])));
    setScores({});
    setCurrentChallenge(pickChallenge(challenges, order.length));
    setRoundOver(false);
  }

  if (loading) return <p>Chargement des défis…</p>;
  if (error) return <p>{error}</p>;
  if (!currentChallenge) return <p>Pas assez de défis disponibles.</p>;

  const eliminated = activePlayers.find((p) => statuses[p] === 'eliminated');
  const survivors = activePlayers.filter((p) => statuses[p] !== 'eliminated');
  const allScoresEntered = activePlayers.every(
    (p) => scores[p] !== undefined && scores[p] !== '',
  );

  return (
    <main>
      <h1>{currentChallenge.name}</h1>
      <p>{currentChallenge.description}</p>

      <h2>Joueurs</h2>
      <ol>
        {activePlayers.map((player, index) => (
          <li key={player}>
            <span>
              {index + 1}. {player}
            </span>

            {statuses[player] === 'qualified' && <span> ✓ Qualifié</span>}
            {statuses[player] === 'eliminated' && <span> ✗ Éliminé</span>}

            {statuses[player] === 'playing' && !roundOver && (
              <>
                {currentChallenge.eliminationRule === 'last-unqualified' && (
                  <button type="button" onClick={() => qualify(player)}>
                    Touché !
                  </button>
                )}

                {currentChallenge.eliminationRule === 'fault' && (
                  <button type="button" onClick={() => eliminate(player)}>
                    A laissé tomber
                  </button>
                )}

                {currentChallenge.eliminationRule === 'highest-score' && (
                  <input
                    type="number"
                    min="0"
                    placeholder="Distance (m)"
                    value={scores[player] ?? ''}
                    onChange={(event) =>
                      setScores((prev) => ({
                        ...prev,
                        [player]: event.target.value,
                      }))
                    }
                  />
                )}
              </>
            )}
          </li>
        ))}
      </ol>

      {currentChallenge.eliminationRule === 'highest-score' &&
        !roundOver &&
        allScoresEntered && (
          <button type="button" onClick={submitScores}>
            Valider les distances
          </button>
        )}

      {roundOver && eliminated && (
        <div>
          <p>{eliminated} est éliminé !</p>
          <button type="button" onClick={nextRound}>
            {survivors.length === 1 ? 'Voir le vainqueur' : 'Défi suivant'}
          </button>
        </div>
      )}
    </main>
  );
}
