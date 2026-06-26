import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import '../components/comic.css';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

interface PlayerInput {
  id: string;
  value: string;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createInput(): PlayerInput {
  return { id: generateId(), value: '' };
}

export default function DuelSetupPage() {
  const [inputs, setInputs] = useState<PlayerInput[]>([createInput(), createInput()]);
  const { setPlayers } = useSession();
  const navigate = useNavigate();

  function updateInput(id: string, value: string) {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
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
    navigate('/duel/play');
  }

  return (
    <div className="comic-page">
      <div className="comic-content">
        <PageHeader>JOUEURS</PageHeader>

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

        {inputs.length < MAX_PLAYERS && (
          <ComicButton variant="yellow" onClick={addPlayer}>
            + Ajouter un joueur
          </ComicButton>
        )}

        <ComicButton onClick={handleStart} disabled={!canStart}>
          DÉMARRER !
        </ComicButton>
      </div>
    </div>
  );
}
