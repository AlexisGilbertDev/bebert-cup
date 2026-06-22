import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesignatorChallenge from '../components/DesignatorChallenge';
import WinnerChoosesChallenge from '../components/WinnerChoosesChallenge';
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
  const { challenges, loading, error } = useChallenges();

  const [activePlayers, setActivePlayers] = useState<string[]>(() =>
    shuffle(players),
  );
  const [scores, setScores] = useState<Record<string, string>>({});
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

  function eliminate(player: string) {
    setEliminated(player);
  }

  function submitScores() {
    const sorted = activePlayers
      .filter((p) => scores[p] !== undefined && scores[p] !== '')
      .sort((a, b) => Number(scores[b]) - Number(scores[a]));
    if (sorted.length === 0) return;
    eliminate(sorted[0]);
  }

  function nextRound() {
    const survivors = activePlayers.filter((p) => p !== eliminated);
    if (survivors.length === 1) {
      navigate('/survivor/winner', { state: { winner: survivors[0] } });
      return;
    }
    const order = shuffle(survivors);
    setActivePlayers(order);
    setScores({});
    setCurrentChallenge(pickChallenge(challenges, order.length));
    setEliminated(null);
  }

  if (loading) return <p>Chargement des défis…</p>;
  if (error) return <p>{error}</p>;
  if (!currentChallenge) return <p>Pas assez de défis disponibles.</p>;

  const rule = currentChallenge.eliminationRule;
  const allScoresEntered = activePlayers.every(
    (p) => scores[p] !== undefined && scores[p] !== '',
  );

  return (
    <main>
      <h1>{currentChallenge.name}</h1>
      <p>{currentChallenge.description}</p>

      {!eliminated &&
        (rule === 'winner-chooses' ? (
          <WinnerChoosesChallenge
            key={currentChallenge.id}
            activePlayers={activePlayers}
            onEliminate={eliminate}
          />
        ) : rule === 'designator-challenge' ? (
          <DesignatorChallenge
            key={currentChallenge.id}
            activePlayers={activePlayers}
            onEliminate={eliminate}
          />
        ) : (
          <>
            <h2>Ordre de passage</h2>
            <ol>
              {activePlayers.map((player, index) => (
                <li key={player}>
                  {index + 1}. {player}
                  {rule === 'fault' && (
                    <button type="button" onClick={() => eliminate(player)}>
                      A laissé tomber
                    </button>
                  )}
                  {rule === 'last-unqualified' && (
                    <button type="button" onClick={() => eliminate(player)}>
                      Éliminé
                    </button>
                  )}
                  {rule === 'highest-score' && (
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
                </li>
              ))}
            </ol>
            {rule === 'highest-score' && allScoresEntered && (
              <button type="button" onClick={submitScores}>
                Valider
              </button>
            )}
          </>
        ))}

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
