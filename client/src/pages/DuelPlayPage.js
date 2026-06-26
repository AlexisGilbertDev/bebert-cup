import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import ChangeChallengeButton from '../components/ChangeChallengeButton';
import ChallengeTimer from '../components/ChallengeTimer';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import { useDuelChallenges } from '../hooks/use-duel-challenges';
import '../components/comic.css';
import './duel-play.css';
const TOTAL_ROUNDS = 8;
const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
function findTied(scores, players) {
    const max = Math.max(...players.map((player) => scores[player]));
    return players.filter((player) => scores[player] === max);
}
function computeNextChallenge(challenges, playerCount, usedIds, excludeId) {
    const eligible = challenges.filter((c) => c.minPlayers <= playerCount && (c.maxPlayers === undefined || c.maxPlayers >= playerCount));
    const exclude = excludeId ? new Set([...usedIds, excludeId]) : usedIds;
    const pool = eligible.filter((c) => !exclude.has(c.id));
    const isExhausted = pool.length === 0;
    const candidates = isExhausted ? eligible.filter((c) => c.id !== excludeId) : pool;
    if (candidates.length === 0)
        return null;
    const challenge = candidates[Math.floor(Math.random() * candidates.length)];
    const newUsedIds = isExhausted ? new Set([challenge.id]) : new Set([...usedIds, challenge.id]);
    return { challenge, newUsedIds };
}
function medalFor(rank) {
    return ['🥇', '🥈', '🥉', '🏅'][rank] ?? '🏅';
}
function rankLabel(position) {
    return position === 1 ? '1er' : `${position}e`;
}
export default function DuelPlayPage() {
    const { players } = useSession();
    const navigate = useNavigate();
    const { challenges, loading, error } = useDuelChallenges();
    const [round, setRound] = useState(1);
    const [isTieBreak, setIsTieBreak] = useState(false);
    const [activePlayers, setActivePlayers] = useState(players);
    const [scores, setScores] = useState(Object.fromEntries(players.map((player) => [player, 0])));
    const [roundPoints, setRoundPoints] = useState(Object.fromEntries(players.map((player) => [player, 0])));
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [phase, setPhase] = useState('scoring');
    const [orderedRanks, setOrderedRanks] = useState([]);
    const [usedChallengeIds, setUsedChallengeIds] = useState(new Set());
    useEffect(() => {
        if (players.length === 0)
            navigate('/');
    }, [players, navigate]);
    useEffect(() => {
        if (!loading && challenges.length > 0 && currentChallenge === null) {
            const result = computeNextChallenge(challenges, activePlayers.length, new Set());
            if (result) {
                setCurrentChallenge(result.challenge);
                setUsedChallengeIds(result.newUsedIds);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, challenges, activePlayers.length, currentChallenge]);
    function resetRoundInputState() {
        setOrderedRanks([]);
    }
    function togglePlayerRank(player) {
        const rankIndex = orderedRanks.indexOf(player);
        if (rankIndex !== -1) {
            setOrderedRanks(orderedRanks.slice(0, rankIndex));
            return;
        }
        const newRanks = [...orderedRanks, player];
        if (newRanks.length === activePlayers.length - 1) {
            const last = activePlayers.find((p) => !newRanks.includes(p));
            if (last) {
                setOrderedRanks([...newRanks, last]);
                return;
            }
        }
        setOrderedRanks(newRanks);
    }
    function submitRanking() {
        const pointsByRank = activePlayers.length === 2 ? [1, 0] : activePlayers.length === 3 ? [2, 1, 0] : [3, 2, 1, 0];
        const points = {};
        orderedRanks.forEach((player, index) => {
            points[player] = pointsByRank[index] ?? 0;
        });
        const newScores = { ...scores };
        for (const player of activePlayers) {
            newScores[player] = (newScores[player] ?? 0) + (points[player] ?? 0);
        }
        setRoundPoints(points);
        setScores(newScores);
        setPhase('results');
    }
    function changeChallenge() {
        const result = computeNextChallenge(challenges, activePlayers.length, usedChallengeIds, currentChallenge?.id);
        if (!result)
            return;
        setCurrentChallenge(result.challenge);
        setUsedChallengeIds(result.newUsedIds);
        resetRoundInputState();
    }
    function nextRound() {
        const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;
        if (isLastNormalRound) {
            const tied = findTied(scores, players);
            if (tied.length === 1) {
                navigate('/duel/winner', { state: { scores, players } });
                return;
            }
            const tieResult = computeNextChallenge(challenges, tied.length, usedChallengeIds);
            setIsTieBreak(true);
            setActivePlayers(tied);
            if (tieResult) {
                setCurrentChallenge(tieResult.challenge);
                setUsedChallengeIds(tieResult.newUsedIds);
            }
            resetRoundInputState();
            setPhase('scoring');
            return;
        }
        if (isTieBreak) {
            const tied = findTied(scores, activePlayers);
            if (tied.length === 1) {
                navigate('/duel/winner', { state: { scores, players } });
                return;
            }
            const tieResult = computeNextChallenge(challenges, tied.length, usedChallengeIds);
            setActivePlayers(tied);
            if (tieResult) {
                setCurrentChallenge(tieResult.challenge);
                setUsedChallengeIds(tieResult.newUsedIds);
            }
            resetRoundInputState();
            setPhase('scoring');
            return;
        }
        const nextResult = computeNextChallenge(challenges, activePlayers.length, usedChallengeIds);
        setRound((previous) => previous + 1);
        if (nextResult) {
            setCurrentChallenge(nextResult.challenge);
            setUsedChallengeIds(nextResult.newUsedIds);
        }
        resetRoundInputState();
        setPhase('scoring');
    }
    if (loading)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', textAlign: 'center' }, children: "Chargement des d\u00E9fis\u2026" }) }) }));
    if (error)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', color: 'var(--red)', textAlign: 'center' }, children: error }) }) }));
    if (!currentChallenge)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', textAlign: 'center' }, children: "Pas assez de d\u00E9fis disponibles." }) }) }));
    const roundLabel = isTieBreak ? 'PROLONGATION' : `MANCHE ${round}/${TOTAL_ROUNDS}`;
    const allRanked = orderedRanks.length === activePlayers.length;
    const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;
    const hasTieAfterLastRound = isLastNormalRound && findTied(scores, players).length > 1;
    const nextButtonLabel = isTieBreak || round < TOTAL_ROUNDS || hasTieAfterLastRound
        ? 'Manche suivante →'
        : 'Voir les résultats →';
    return (_jsx("div", { className: "comic-page", children: _jsxs("div", { className: "comic-content", children: [phase === 'scoring' && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "dp-header", children: [_jsx("h1", { className: "dp-round-title", children: roundLabel }), !isTieBreak && (_jsx("div", { className: "dp-progress", role: "progressbar", "aria-valuenow": round, "aria-valuemax": TOTAL_ROUNDS, children: Array.from({ length: TOTAL_ROUNDS }, (_, i) => (_jsx("div", { className: `dp-progress-segment${i < round ? ' dp-progress-segment--filled' : ''}` }, i))) }))] }), _jsxs("div", { className: "dp-challenge-wrap", children: [_jsxs("div", { className: "dp-challenge-card", children: [_jsx("span", { className: "dp-badge", children: "D\u00C9FI EN COURS" }), _jsx("p", { className: "dp-challenge-title", children: currentChallenge.name }), _jsx("p", { className: "dp-challenge-desc", children: currentChallenge.description }), currentChallenge.duration && (_jsx("div", { style: { marginTop: 12 }, children: _jsx(ChallengeTimer, { duration: currentChallenge.duration }) }))] }), _jsx(ChangeChallengeButton, { onClick: changeChallenge })] }), _jsxs("div", { className: "dp-ranking-section", children: [_jsxs("div", { className: "dp-ranking-header", children: [_jsxs("div", { children: [_jsx("p", { className: "dp-ranking-title", children: "CLASSEZ DU GAGNANT AU PERDANT" }), _jsx("p", { className: "dp-ranking-hint", children: "Touche les joueurs dans l'ordre \u2014 le 1er touch\u00E9 finit premier." })] }), _jsxs("div", { className: "dp-ranking-counter", children: [_jsxs("span", { className: "dp-counter-fraction", children: [orderedRanks.length, "/", activePlayers.length] }), _jsx("span", { className: "dp-counter-label", children: "class\u00E9s" })] })] }), _jsx("div", { className: "dp-players", children: activePlayers.map((player) => {
                                        const rank = orderedRanks.indexOf(player);
                                        const isRanked = rank !== -1;
                                        const avatarColor = PLAYER_COLORS[players.indexOf(player) % PLAYER_COLORS.length] ?? '#888';
                                        return (_jsxs("button", { type: "button", className: `dp-player-row${isRanked ? ' dp-player-row--ranked' : ' dp-player-row--unranked'}`, onClick: () => togglePlayerRank(player), children: [_jsx("span", { className: `dp-medal${!isRanked ? ' dp-medal--empty' : ''}`, children: isRanked ? medalFor(rank) : null }), _jsx("span", { className: "dp-avatar", style: { background: avatarColor }, children: player.charAt(0).toUpperCase() }), _jsx("span", { className: "dp-player-name", children: player }), isRanked && (_jsx("span", { className: "dp-rank-label", children: rankLabel(rank + 1) }))] }, player));
                                    }) }), orderedRanks.length > 0 && (_jsx("button", { type: "button", className: "dp-restart-btn", onClick: () => setOrderedRanks([]), children: "\u21BA Recommencer le classement" }))] }), _jsx("button", { type: "button", className: `dp-submit-btn${allRanked ? ' dp-submit-btn--active' : ' dp-submit-btn--disabled'}`, onClick: allRanked ? submitRanking : undefined, disabled: !allRanked, children: allRanked ? 'SOUMETTRE →' : 'CLASSE TOUS LES JOUEURS' })] })), phase === 'results' && (_jsxs(_Fragment, { children: [_jsx(PageHeader, { children: roundLabel }), _jsxs(ComicPanel, { style: { padding: 0, overflow: 'hidden' }, children: [_jsx("div", { style: {
                                        background: 'var(--ink)',
                                        color: 'var(--yellow)',
                                        fontFamily: 'Anton, sans-serif',
                                        fontSize: 18,
                                        letterSpacing: 4,
                                        textAlign: 'center',
                                        padding: '10px 16px',
                                    }, children: "CLASSEMENT" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column' }, children: players
                                        .slice()
                                        .sort((playerA, playerB) => scores[playerB] - scores[playerA])
                                        .map((player, index) => {
                                        const isLeader = index === 0;
                                        const gained = roundPoints[player] ?? 0;
                                        return (_jsxs("div", { style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '12px 16px',
                                                background: isLeader ? 'var(--yellow)' : index % 2 === 0 ? '#fff' : 'var(--paper)',
                                                borderTop: index === 0 ? 'none' : '2px solid var(--ink)',
                                            }, children: [_jsx("span", { style: { font: '900 22px Nunito', width: 32, flexShrink: 0 }, children: medalFor(index) }), _jsx("span", { style: { font: '800 16px Nunito', flex: 1 }, children: player }), gained > 0 && (_jsxs("span", { style: {
                                                        font: '800 13px Nunito',
                                                        color: 'var(--blue)',
                                                        background: '#fff',
                                                        border: '2px solid var(--ink)',
                                                        borderRadius: 20,
                                                        padding: '2px 8px',
                                                        flexShrink: 0,
                                                    }, children: ["+", gained, " pt", gained > 1 ? 's' : ''] })), _jsx("span", { style: {
                                                        fontFamily: 'Anton, sans-serif',
                                                        fontSize: 26,
                                                        color: 'var(--ink)',
                                                        flexShrink: 0,
                                                        lineHeight: 1,
                                                    }, children: scores[player] })] }, player));
                                    }) })] }), _jsx(ComicButton, { onClick: nextRound, children: nextButtonLabel })] }))] }) }));
}
