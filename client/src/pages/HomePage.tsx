import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import Caption from '../components/Caption';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import '../components/comic.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 8;

const PLAYER_COLORS = [
  '#ef4444',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
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
    <div className="comic-page">
      <div className="comic-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            aria-label="Retour"
            onClick={() => navigate('/')}
            className="comic-btn-retour"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 5 L7 12 L14 19" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <ComicTitle size="md" as="h1">BEBERT CUP</ComicTitle>
        </div>
        <Caption>Joueurs</Caption>

        <ComicPanel style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {inputs.map((input, index) => (
            <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                className="player-dot"
                style={{ backgroundColor: PLAYER_COLORS[index] }}
              />
              <input
                type="text"
                placeholder={`Joueur ${index + 1}`}
                value={input.value}
                onChange={(event) => updateInput(input.id, event.target.value)}
                maxLength={30}
                style={{
                  flex: 1,
                  height: 44,
                  border: '3px solid var(--ink)',
                  borderRadius: 6,
                  padding: '0 12px',
                  font: '800 16px Nunito',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  outline: 'none',
                }}
              />
              {inputs.length > MIN_PLAYERS && (
                <button
                  type="button"
                  onClick={() => removePlayer(input.id)}
                  style={{
                    width: 36,
                    height: 36,
                    border: '2px solid var(--ink)',
                    borderRadius: 6,
                    background: '#fff',
                    cursor: 'pointer',
                    font: '900 16px Nunito',
                    color: 'var(--ink)',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </ComicPanel>

        {hasDuplicates && (
          <p style={{ font: '700 14px Nunito', color: 'var(--red)', textAlign: 'center' }}>
            Deux joueurs ne peuvent pas avoir le même pseudo.
          </p>
        )}

        <ComicButton
          variant="yellow"
          onClick={addPlayer}
          disabled={inputs.length >= MAX_PLAYERS}
        >
          + Ajouter un joueur
        </ComicButton>

        <ComicButton onClick={handleStart} disabled={!canStart}>
          DÉMARRER !
        </ComicButton>
      </div>
    </div>
  );
}
