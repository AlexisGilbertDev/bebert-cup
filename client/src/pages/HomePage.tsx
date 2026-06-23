import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 8;

const PLAYER_COLORS = [
  '#ef4444', // rouge      H=0°
  '#f59e0b', // ambre      H=45°
  '#84cc16', // lime       H=90°
  '#10b981', // émeraude   H=162°
  '#06b6d4', // cyan       H=192°
  '#3b82f6', // bleu       H=217°
  '#8b5cf6', // violet     H=258°
  '#ec4899', // rose       H=328°
];

interface PlayerInput {
  id: string;
  value: string;
}

function createInput(): PlayerInput {
  return { id: crypto.randomUUID(), value: '' };
}

export default function HomePage() {
  const [inputs, setInputs] = useState<PlayerInput[]>([
    createInput(),
    createInput(),
    createInput(),
  ]);
  const { setPlayers } = useSession();
  const navigate = useNavigate();

  function updateInput(id: string, value: string) {
    setInputs(
      inputs.map((input) => (input.id === id ? { ...input, value } : input)),
    );
  }

  function addPlayer() {
    if (inputs.length < MAX_PLAYERS) setInputs([...inputs, createInput()]);
  }

  function removePlayer(id: string) {
    if (inputs.length > MIN_PLAYERS)
      setInputs(inputs.filter((input) => input.id !== id));
  }

  const trimmed = inputs.map((input) => input.value.trim());
  const filled = trimmed.filter(Boolean);
  const hasDuplicates = new Set(filled).size < filled.length;
  const canStart = filled.length >= MIN_PLAYERS && !hasDuplicates;

  function handleStart() {
    if (!canStart) return;
    setPlayers(filled);
    navigate('/survivor/play');
  }

  return (
    <main>
      <h1>Bebert Cup — Survivor</h1>
      <h2>Joueurs</h2>
      {inputs.map((input, index) => (
        <div key={input.id}>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: PLAYER_COLORS[index],
              marginRight: 8,
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            placeholder={`Joueur ${index + 1}`}
            value={input.value}
            onChange={(event) => updateInput(input.id, event.target.value)}
            maxLength={30}
          />
          {inputs.length > MIN_PLAYERS && (
            <button type="button" onClick={() => removePlayer(input.id)}>
              Supprimer
            </button>
          )}
        </div>
      ))}
      {hasDuplicates && (
        <p>Deux joueurs ne peuvent pas avoir le même pseudo.</p>
      )}
      <button
        type="button"
        onClick={addPlayer}
        disabled={inputs.length >= MAX_PLAYERS}
      >
        Ajouter un joueur
      </button>
      <button type="button" onClick={handleStart} disabled={!canStart}>
        Démarrer
      </button>
    </main>
  );
}
