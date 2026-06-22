import { useState } from 'react';

interface Props {
  activePlayers: string[];
  onEliminate: (player: string) => void;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export default function DesignatorChallenge({
  activePlayers,
  onEliminate,
}: Props) {
  const [designator] = useState<string>(() => pickRandom(activePlayers));
  const [designated, setDesignated] = useState<string | null>(null);

  const others = activePlayers.filter((p) => p !== designator);

  if (!designated) {
    return (
      <div>
        <p>
          <strong>{designator}</strong> désigne un joueur et choisit son geste :
        </p>
        <ul>
          {others.map((player) => (
            <li key={player}>
              <button type="button" onClick={() => setDesignated(player)}>
                {player}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <p>
        <strong>{designated}</strong> tente le geste imposé par{' '}
        <strong>{designator}</strong>.
      </p>
      <button type="button" onClick={() => onEliminate(designated)}>
        Raté — {designated} est éliminé
      </button>
      <button type="button" onClick={() => onEliminate(designator)}>
        Réussi — {designator} est éliminé
      </button>
    </div>
  );
}
