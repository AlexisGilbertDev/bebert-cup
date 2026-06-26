import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function createInput() {
    return { id: generateId(), value: '' };
}
export default function DuelSetupPage() {
    const [inputs, setInputs] = useState([createInput(), createInput()]);
    const { setPlayers } = useSession();
    const navigate = useNavigate();
    function updateInput(id, value) {
        setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
    }
    function addPlayer() {
        if (inputs.length < MAX_PLAYERS)
            setInputs([...inputs, createInput()]);
    }
    function removePlayer(id) {
        if (inputs.length > MIN_PLAYERS)
            setInputs(inputs.filter((input) => input.id !== id));
    }
    const trimmed = inputs.map((input) => input.value.trim());
    const filled = trimmed.filter(Boolean);
    const hasDuplicates = new Set(filled).size < filled.length;
    const canStart = filled.length >= MIN_PLAYERS && !hasDuplicates;
    function handleStart() {
        if (!canStart)
            return;
        setPlayers(filled);
        navigate('/duel/play');
    }
    return (_jsx("div", { className: "comic-page", children: _jsxs("div", { className: "comic-content", children: [_jsx(PageHeader, { children: "JOUEURS" }), _jsx(ComicPanel, { style: { padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }, children: inputs.map((input, index) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("span", { className: "player-dot", style: { backgroundColor: PLAYER_COLORS[index] } }), _jsx("input", { type: "text", placeholder: `Joueur ${index + 1}`, value: input.value, onChange: (event) => updateInput(input.id, event.target.value), maxLength: 30, style: {
                                    flex: 1,
                                    height: 44,
                                    border: '3px solid var(--ink)',
                                    borderRadius: 6,
                                    padding: '0 12px',
                                    font: '800 16px Nunito',
                                    background: 'var(--paper)',
                                    color: 'var(--ink)',
                                    outline: 'none',
                                } }), inputs.length > MIN_PLAYERS && (_jsx("button", { type: "button", onClick: () => removePlayer(input.id), style: {
                                    width: 36,
                                    height: 36,
                                    border: '2px solid var(--ink)',
                                    borderRadius: 6,
                                    background: '#fff',
                                    cursor: 'pointer',
                                    font: '900 16px Nunito',
                                    color: 'var(--ink)',
                                    flexShrink: 0,
                                }, children: "\u2715" }))] }, input.id))) }), hasDuplicates && (_jsx("p", { style: { font: '700 14px Nunito', color: 'var(--red)', textAlign: 'center' }, children: "Deux joueurs ne peuvent pas avoir le m\u00EAme pseudo." })), inputs.length < MAX_PLAYERS && (_jsx(ComicButton, { variant: "yellow", onClick: addPlayer, children: "+ Ajouter un joueur" })), _jsx(ComicButton, { onClick: handleStart, disabled: !canStart, children: "D\u00C9MARRER !" })] }) }));
}
