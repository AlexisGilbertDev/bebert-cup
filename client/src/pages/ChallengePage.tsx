import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import type { Challenge } from '../hooks/use-challenges';
import { useChallenges } from '../hooks/use-challenges';

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
    const survivors = activePlayers.filter((p) => p !== eliminated);
    if (survivors.length === 1) {
      navigate('/survivor/winner', { state: { winner: survivors[0] } });
      return;
    }
    if (survivors.length === 2) {
      navigate('/survivor/finale', { state: { finalists: survivors } });
      return;
    }
    const order = shuffle(survivors);
    setActivePlayers(order);
    setCurrentChallenge(pickChallenge(challenges, order.length));
    setEliminated(null);
  }

  if (loading) return <p>Chargement des défis…</p>;
  if (error) return <p>{error}</p>;
  if (!currentChallenge) return <p>Pas assez de défis disponibles.</p>;

  return (
    <main>
      <h1>{currentChallenge.name}</h1>
      <p>{currentChallenge.description}</p>

      {!eliminated && (
        <>
          <ul>
            {activePlayers.map((player) => (
              <li key={player}>
                <button type="button" onClick={() => setEliminated(player)}>
                  {player}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={changeChallenge}>
            Changer de défi
          </button>
        </>
      )}

      {eliminated && (
        <div>
          <p>{eliminated} est éliminé !</p>
          <button type="button" onClick={nextRound}>
            Défi suivant
          </button>
        </div>
      )}
    </main>
  );
}
