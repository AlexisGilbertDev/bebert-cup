import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function createInput(team) {
    return { id: generateId(), value: '', team };
}
export default function TeamSetupPage() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState([
        createInput(1), createInput(1),
        createInput(2), createInput(2),
    ]);
    function updateValue(id, value) {
        setInputs(inputs.map((input) => (input.id === id ? { ...input, value } : input)));
    }
    function toggleTeam(id) {
        setInputs(inputs.map((input) => (input.id === id ? { ...input, team: input.team === 1 ? 2 : 1 } : input)));
    }
    function addPlayer() {
        if (inputs.length < MAX_PLAYERS) {
            const team1Count = inputs.filter((i) => i.team === 1).length;
            const team2Count = inputs.filter((i) => i.team === 2).length;
            setInputs([...inputs, createInput(team1Count <= team2Count ? 1 : 2)]);
        }
    }
    function removePlayer(id) {
        if (inputs.length > MIN_PLAYERS)
            setInputs(inputs.filter((input) => input.id !== id));
    }
    const filled = inputs.map((input) => ({ ...input, value: input.value.trim() })).filter((input) => input.value);
    const team1Players = filled.filter((input) => input.team === 1).map((input) => input.value);
    const team2Players = filled.filter((input) => input.team === 2).map((input) => input.value);
    const allValues = filled.map((input) => input.value);
    const hasDuplicates = new Set(allValues).size < allValues.length;
    const canStart = filled.length >= MIN_PLAYERS && team1Players.length >= 1 && team2Players.length >= 1 && !hasDuplicates;
    function handleStart() {
        if (!canStart)
            return;
        navigate('/team-play/play', { state: { team1: team1Players, team2: team2Players } });
    }
    return (_jsx("div", { className: "comic-page", children: _jsxs("div", { className: "comic-content", children: [_jsx(PageHeader, { children: "\u00C9QUIPES" }), _jsxs(ComicPanel, { style: { padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsxs("div", { style: { display: 'flex', gap: 16, marginBottom: 4 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { style: {
                                                width: 14, height: 14, borderRadius: 3,
                                                background: TEAM1_COLOR, border: '2px solid var(--ink)', flexShrink: 0,
                                            } }), _jsx("span", { style: { font: '800 13px Nunito', color: 'var(--ink)' }, children: "\u00C9quipe 1" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { style: {
                                                width: 14, height: 14, borderRadius: 3,
                                                background: TEAM2_COLOR, border: '2px solid var(--ink)', flexShrink: 0,
                                            } }), _jsx("span", { style: { font: '800 13px Nunito', color: 'var(--ink)' }, children: "\u00C9quipe 2" })] })] }), inputs.map((input) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("button", { type: "button", onClick: () => toggleTeam(input.id), style: {
                                        width: 30, height: 30, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                                        background: input.team === 1 ? TEAM1_COLOR : TEAM2_COLOR,
                                        border: '2.5px solid var(--ink)',
                                        font: '900 11px Nunito', color: '#fff',
                                    }, children: input.team }), _jsx("input", { type: "text", placeholder: `Joueur`, value: input.value, onChange: (event) => updateValue(input.id, event.target.value), maxLength: 30, style: {
                                        flex: 1, height: 44,
                                        border: '3px solid var(--ink)', borderRadius: 6,
                                        padding: '0 12px', font: '800 16px Nunito',
                                        background: 'var(--paper)', color: 'var(--ink)', outline: 'none',
                                    } }), inputs.length > MIN_PLAYERS && (_jsx("button", { type: "button", onClick: () => removePlayer(input.id), style: {
                                        width: 36, height: 36, border: '2px solid var(--ink)',
                                        borderRadius: 6, background: '#fff', cursor: 'pointer',
                                        font: '900 16px Nunito', color: 'var(--ink)', flexShrink: 0,
                                    }, children: "\u2715" }))] }, input.id)))] }), hasDuplicates && (_jsx("p", { style: { font: '700 14px Nunito', color: 'var(--red)', textAlign: 'center' }, children: "Deux joueurs ne peuvent pas avoir le m\u00EAme pseudo." })), canStart && (_jsxs("div", { style: { display: 'flex', gap: 12, justifyContent: 'center' }, children: [_jsxs("span", { style: { font: '800 13px Nunito', color: TEAM1_COLOR }, children: ["\u00C9quipe 1 : ", team1Players.length] }), _jsx("span", { style: { font: '800 13px Nunito', color: 'var(--ink)' }, children: "vs" }), _jsxs("span", { style: { font: '800 13px Nunito', color: TEAM2_COLOR }, children: ["\u00C9quipe 2 : ", team2Players.length] })] })), inputs.length < MAX_PLAYERS && (_jsx(ComicButton, { variant: "yellow", onClick: addPlayer, children: "+ Ajouter un joueur" })), _jsx(ComicButton, { onClick: handleStart, disabled: !canStart, children: "D\u00C9MARRER !" })] }) }));
}
