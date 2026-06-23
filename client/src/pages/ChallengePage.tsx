import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import { pickChallenge, resolveRound, shuffle } from '../game';
import { useChallenges } from '../hooks/use-challenges';

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
