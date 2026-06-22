import { useState } from 'react';

interface Props {
  activePlayers: string[];
  onEliminate: (player: string) => void;
}

export default function WinnerChoosesChallenge({
  activePlayers,
  onEliminate,
}: Props) {
  const [winner, setWinner] = useState<string | null>(null);

  if (winner) {
    return (
      <div>
        <p>
          <strong>{winner}</strong> choisit qui est éliminé :
        </p>
        <ul>
          {activePlayers.map((player) => (
            <li key={player}>
              {player}
              <button type="button" onClick={() => onEliminate(player)}>
                Éliminer
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <p>Qui a remporté le défi ?</p>
      <ul>
        {activePlayers.map((player) => (
          <li key={player}>
            <button type="button" onClick={() => setWinner(player)}>
              {player}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
