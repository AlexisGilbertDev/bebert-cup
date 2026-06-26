import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import Caption from '../components/Caption';
import ChangeChallengeButton from '../components/ChangeChallengeButton';
import ChallengeTimer from '../components/ChallengeTimer';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import { pickChallenge, resolveRound, shuffle } from '../game';
import { useChallenges } from '../hooks/use-challenges';
import '../components/comic.css';
const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
export default function ChallengePage() {
    const { players } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const { challenges, loading, error } = useChallenges();
    const locationState = location.state;
    const finalists = locationState?.finalists;
    const [activePlayers, setActivePlayers] = useState(() => shuffle(finalists ?? players));
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [eliminated, setEliminated] = useState(null);
    const [drawnPlayers, setDrawnPlayers] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [eliminationOrder, setEliminationOrder] = useState(locationState?.eliminationOrder ?? []);
    const [usedChallengeIds, setUsedChallengeIds] = useState(new Set());
    function drawPlayers(challenge, pool) {
        setShowDetails(false);
        if (!challenge?.draw || challenge.draw.length === 0) {
            setDrawnPlayers([]);
            return;
        }
        const shuffled = shuffle([...pool]);
        setDrawnPlayers(challenge.draw.slice(0, shuffled.length).map((slot, index) => ({ player: shuffled[index], role: slot.role })));
    }
    function interpolateDescription(description) {
        return drawnPlayers.reduce((text, { player, role }) => text.split(`{{${role}}}`).join(player), description);
    }
    useEffect(() => {
        if (!loading && challenges.length > 0) {
            const challenge = pickChallenge(challenges, activePlayers.length);
            setCurrentChallenge(challenge);
            if (challenge)
                setUsedChallengeIds(new Set([challenge.id]));
            drawPlayers(challenge, activePlayers);
        }
    }, [loading, challenges, activePlayers.length]);
    useEffect(() => {
        if (players.length === 0)
            navigate('/');
    }, [players, navigate]);
    function changeChallenge() {
        if (!currentChallenge)
            return;
        const excluded = new Set([...usedChallengeIds, currentChallenge.id]);
        const fresh = challenges.filter((c) => c.minPlayers <= activePlayers.length && !excluded.has(c.id));
        const pool = fresh.length > 0
            ? fresh
            : challenges.filter((c) => c.minPlayers <= activePlayers.length && c.id !== currentChallenge.id);
        if (pool.length === 0)
            return;
        const next = pool[Math.floor(Math.random() * pool.length)];
        setCurrentChallenge(next);
        setUsedChallengeIds(fresh.length > 0 ? new Set([...usedChallengeIds, next.id]) : new Set([next.id]));
        drawPlayers(next, activePlayers);
    }
    function nextRound() {
        if (!eliminated)
            return;
        const result = resolveRound(activePlayers, eliminated);
        const newEliminationOrder = [...eliminationOrder, eliminated];
        if (result.type === 'winner') {
            navigate('/survivor/winner', { state: { winner: result.winner, eliminationOrder: newEliminationOrder } });
            return;
        }
        if (result.type === 'finale') {
            navigate('/survivor/finale', { state: { finalists: result.finalists, eliminationOrder: newEliminationOrder } });
            return;
        }
        setEliminationOrder(newEliminationOrder);
        setActivePlayers(shuffle(result.survivors));
        setEliminated(null);
    }
    if (loading)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', textAlign: 'center' }, children: "Chargement des d\u00E9fis\u2026" }) }) }));
    if (error)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', color: 'var(--red)', textAlign: 'center' }, children: error }) }) }));
    if (!currentChallenge)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', textAlign: 'center' }, children: "Pas assez de d\u00E9fis disponibles." }) }) }));
    return (_jsx("div", { className: "comic-page", children: _jsxs("div", { className: "comic-content", children: [_jsxs("div", { className: "page-header", children: [_jsx("button", { type: "button", "aria-label": "Retour", onClick: () => navigate('/'), className: "comic-btn-retour", children: _jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: "M14 5 L7 12 L14 19", fill: "none", stroke: "#fff", strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("div", { style: { display: 'flex', gap: 5, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }, children: players.map((player, index) => {
                                const isOut = eliminationOrder.includes(player) || player === eliminated;
                                return (_jsx("div", { title: player, style: {
                                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                                        background: isOut ? '#9a8f76' : PLAYER_COLORS[index % PLAYER_COLORS.length],
                                        border: '2.5px solid var(--ink)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        font: '800 12px/1 Nunito', color: '#fff',
                                        opacity: isOut ? 0.4 : 1,
                                    }, children: isOut ? '✕' : player.charAt(0).toUpperCase() }, player));
                            }) })] }), _jsxs(ComicPanel, { style: { padding: 16 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, children: [_jsx(ComicTitle, { size: "sm", as: "h1", noStroke: true, children: currentChallenge.name }), currentChallenge.details && (_jsx("button", { type: "button", onClick: () => setShowDetails((previous) => !previous), style: {
                                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                        background: showDetails ? 'var(--ink)' : '#e8e0d0',
                                        border: '2px solid var(--ink)', cursor: 'pointer',
                                        font: '900 13px Nunito', color: showDetails ? '#fff' : 'var(--ink)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }, children: "?" }))] }), _jsx("p", { style: { font: '700 15px Nunito', color: 'var(--text-muted)', marginTop: 8 }, children: interpolateDescription(currentChallenge.description) }), showDetails && currentChallenge.details && (_jsx("div", { style: { marginTop: 8, padding: '8px 10px', background: '#f0e8d4', borderRadius: 8, border: '2px solid var(--ink)' }, children: _jsx("p", { style: { font: '700 13px/1.45 Nunito', color: 'var(--ink)' }, children: currentChallenge.details }) })), drawnPlayers.length > 0 && (_jsxs("div", { style: { marginTop: 12, padding: '10px 12px', background: 'var(--yellow)', borderRadius: 8, border: '2px solid var(--ink)' }, children: [_jsx("p", { style: { font: '800 12px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }, children: "\uD83C\uDFB2 Tirage au sort" }), drawnPlayers.map(({ player, role }) => (_jsxs("p", { style: { font: '800 15px Nunito', margin: '2px 0' }, children: [player, " ", _jsxs("span", { style: { font: '700 13px Nunito', color: 'var(--text-muted)' }, children: ["\u2192 ", role] })] }, role)))] })), currentChallenge.duration && (_jsx("div", { style: { marginTop: 12 }, children: _jsx(ChallengeTimer, { duration: currentChallenge.duration }) }))] }), !eliminated && (_jsxs(_Fragment, { children: [_jsx(ChangeChallengeButton, { onClick: changeChallenge }), _jsx(Caption, { children: "Qui est \u00E9limin\u00E9\u00A0?" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: (() => {
                                const eliminableNames = currentChallenge.eliminableRoles
                                    ? new Set(drawnPlayers
                                        .filter((d) => currentChallenge.eliminableRoles.includes(d.role))
                                        .map((d) => d.player))
                                    : null;
                                return activePlayers.map((player) => {
                                    const drawnRole = drawnPlayers.find((d) => d.player === player)?.role;
                                    const isDisabled = eliminableNames ? !eliminableNames.has(player) : drawnRole === 'juge';
                                    const suffix = drawnRole && isDisabled ? ` (${drawnRole})` : '';
                                    return (_jsxs("button", { type: "button", onClick: () => { if (!isDisabled)
                                            setEliminated(player); }, disabled: isDisabled, className: "comic-btn", style: {
                                            background: isDisabled ? '#e5e0d5' : '#fff',
                                            color: isDisabled ? '#b0a890' : 'var(--ink)',
                                            font: '800 18px Nunito',
                                            letterSpacing: 0,
                                            cursor: isDisabled ? 'default' : undefined,
                                        }, children: [player, suffix] }, player));
                                });
                            })() })] })), eliminated && (_jsxs(ComicPanel, { style: { padding: 16, textAlign: 'center' }, children: [_jsxs("p", { style: { font: '900 20px Nunito', color: 'var(--red)', marginBottom: 16 }, children: [eliminated, " est \u00E9limin\u00E9 !"] }), _jsx(ComicButton, { onClick: nextRound, children: "D\u00E9fi suivant \u2192" })] }))] }) }));
}
