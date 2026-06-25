import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import '../components/comic.css';

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 8;

const TEAM1_COLOR = '#10b981';
const TEAM2_COLOR = '#3b82f6';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface PlayerInput {
  id: string;
  value: string;
  team: 1 | 2;
}

function createInput(team: 1 | 2): PlayerInput {
  return { id: generateId(), value: '', team };
}

export default function TeamSetupPage() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<PlayerInput[]>([
    createInput(1), createInput(1),
    createInput(2), createInput(2),
  ]);

  function updateValue(id: string, value: string) {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
  }

  function toggleTeam(id: string) {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, team: input.team === 1 ? 2 : 1 } : input)));
  }

  function addPlayer() {
    if (inputs.length < MAX_PLAYERS) {
      const team1Count = inputs.filter((i) => i.team === 1).length;
      const team2Count = inputs.filter((i) => i.team === 2).length;
      setInputs([...inputs, createInput(team1Count <= team2Count ? 1 : 2)]);
    }
  }

  function removePlayer(id: string) {
    if (inputs.length > MIN_PLAYERS) setInputs(inputs.filter((input) => input.id !== id));
  }

  const filled = inputs.map((input) => ({ ...input, value: input.value.trim() })).filter((input) => input.value);
  const team1Players = filled.filter((input) => input.team === 1).map((input) => input.value);
  const team2Players = filled.filter((input) => input.team === 2).map((input) => input.value);
  const allValues = filled.map((input) => input.value);
  const hasDuplicates = new Set(allValues).size < allValues.length;
  const canStart = filled.length >= MIN_PLAYERS && team1Players.length >= 1 && team2Players.length >= 1 && !hasDuplicates;

  function handleStart() {
    if (!canStart) return;
    navigate('/team-play/play', { state: { team1: team1Players, team2: team2Players } });
  }

  return (
    <div className="comic-page">
      <div className="comic-content">
        <PageHeader>ÉQUIPES</PageHeader>

        <ComicPanel style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 14, height: 14, borderRadius: 3,
                background: TEAM1_COLOR, border: '2px solid var(--ink)', flexShrink: 0,
              }} />
              <span style={{ font: '800 13px Nunito', color: 'var(--ink)' }}>Équipe 1</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 14, height: 14, borderRadius: 3,
                background: TEAM2_COLOR, border: '2px solid var(--ink)', flexShrink: 0,
              }} />
              <span style={{ font: '800 13px Nunito', color: 'var(--ink)' }}>Équipe 2</span>
            </div>
          </div>

          {inputs.map((input) => (
            <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Team toggle */}
              <button
                type="button"
                onClick={() => toggleTeam(input.id)}
                style={{
                  width: 30, height: 30, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                  background: input.team === 1 ? TEAM1_COLOR : TEAM2_COLOR,
                  border: '2.5px solid var(--ink)',
                  font: '900 11px Nunito', color: '#fff',
                }}
              >
                {input.team}
              </button>

              <input
                type="text"
                placeholder={`Joueur`}
                value={input.value}
                onChange={(event) => updateValue(input.id, event.target.value)}
                maxLength={30}
                style={{
                  flex: 1, height: 44,
                  border: '3px solid var(--ink)', borderRadius: 6,
                  padding: '0 12px', font: '800 16px Nunito',
                  background: 'var(--paper)', color: 'var(--ink)', outline: 'none',
                }}
              />

              {inputs.length > MIN_PLAYERS && (
                <button
                  type="button"
                  onClick={() => removePlayer(input.id)}
                  style={{
                    width: 36, height: 36, border: '2px solid var(--ink)',
                    borderRadius: 6, background: '#fff', cursor: 'pointer',
                    font: '900 16px Nunito', color: 'var(--ink)', flexShrink: 0,
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

        {canStart && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <span style={{ font: '800 13px Nunito', color: TEAM1_COLOR }}>
              Équipe 1 : {team1Players.length}
            </span>
            <span style={{ font: '800 13px Nunito', color: 'var(--ink)' }}>vs</span>
            <span style={{ font: '800 13px Nunito', color: TEAM2_COLOR }}>
              Équipe 2 : {team2Players.length}
            </span>
          </div>
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
