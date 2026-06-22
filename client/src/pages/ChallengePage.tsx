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

  function nextRound() {
    const survivors = activePlayers.filter((p) => statuses[p] !== 'eliminated');

    if (survivors.length === 1) {
      navigate('/survivor/winner', { state: { winner: survivors[0] } });
      return;
    }

    const order = shuffle(survivors);
    setActivePlayers(order);
    setStatuses(Object.fromEntries(order.map((p) => [p, 'playing'])));
    setCurrentChallenge(pickChallenge(challenges, order.length));
    setRoundOver(false);
  }

  if (loading) return <p>Chargement des défis…</p>;
  if (error) return <p>{error}</p>;
  if (!currentChallenge) return <p>Pas assez de défis disponibles.</p>;

  const eliminated = activePlayers.find((p) => statuses[p] === 'eliminated');

  return (
    <main>
      <h1>{currentChallenge.name}</h1>
      <p>{currentChallenge.description}</p>

      <h2>Ordre de passage</h2>
      <ol>
        {activePlayers.map((player) => (
          <li key={player}>
            <span>{player}</span>
            {statuses[player] === 'qualified' && <span> ✓ Qualifié</span>}
            {statuses[player] === 'eliminated' && <span> ✗ Éliminé</span>}
            {statuses[player] === 'playing' && !roundOver && (
              <button type="button" onClick={() => qualify(player)}>
                Touché !
              </button>
            )}
          </li>
        ))}
      </ol>

      {roundOver && eliminated && (
        <div>
          <p>{eliminated} est éliminé !</p>
          <button type="button" onClick={nextRound}>
            {activePlayers.filter((p) => statuses[p] !== 'eliminated')
              .length === 1
              ? 'Voir le vainqueur'
              : 'Défi suivant'}
          </button>
        </div>
      )}
    </main>
  );
}
