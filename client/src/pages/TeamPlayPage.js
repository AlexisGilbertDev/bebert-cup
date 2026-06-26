import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChangeChallengeButton from '../components/ChangeChallengeButton';
import ChallengeStopwatch from '../components/ChallengeStopwatch';
import ChallengeTimer from '../components/ChallengeTimer';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import { useTeamPlayChallenges } from '../hooks/use-team-play-challenges';
import '../components/comic.css';
const TOTAL_ROUNDS = 8;
const TEAM1_COLOR = '#10b981';
const TEAM2_COLOR = '#3b82f6';
function drawTeams(challenge) {
    if (!challenge.teamDraw || challenge.teamDraw.length === 0)
        return [];
    const teams = Math.random() < 0.5 ? ['Équipe 1', 'Équipe 2'] : ['Équipe 2', 'Équipe 1'];
    return challenge.teamDraw.map((slot, index) => ({ team: teams[index % 2], role: slot.role }));
}
function interpolateDescription(description, drawn) {
    return drawn.reduce((text, { team, role }) => text.split(`{{${role}}}`).join(team), description);
}
function computeNextChallenge(challenges, usedIds, excludeId) {
    const exclude = excludeId ? new Set([...usedIds, excludeId]) : usedIds;
    const pool = challenges.filter((c) => !exclude.has(c.id));
    const isExhausted = pool.length === 0;
    const candidates = isExhausted ? challenges.filter((c) => c.id !== excludeId) : pool;
    if (candidates.length === 0)
        return null;
    const challenge = candidates[Math.floor(Math.random() * candidates.length)];
    const newUsedIds = isExhausted ? new Set([challenge.id]) : new Set([...usedIds, challenge.id]);
    return { challenge, newUsedIds };
}
export default function TeamPlayPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state;
    const team1 = locationState?.team1 ?? [];
    const team2 = locationState?.team2 ?? [];
    const { challenges, loading, error } = useTeamPlayChallenges();
    const [round, setRound] = useState(1);
    const [isTieBreak, setIsTieBreak] = useState(false);
    const [scores, setScores] = useState({ team1: 0, team2: 0 });
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [drawnTeams, setDrawnTeams] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [phase, setPhase] = useState('scoring');
    const [roundOutcome, setRoundOutcome] = useState(null);
    const [usedChallengeIds, setUsedChallengeIds] = useState(new Set());
    useEffect(() => {
        if (team1.length === 0 || team2.length === 0)
            navigate('/');
    }, [team1, team2, navigate]);
    function applyChallenge(challenge, newUsedIds) {
        setCurrentChallenge(challenge);
        setUsedChallengeIds(newUsedIds);
        setDrawnTeams(drawTeams(challenge));
        setShowDetails(false);
    }
    useEffect(() => {
        if (!loading && challenges.length > 0 && currentChallenge === null) {
            const result = computeNextChallenge(challenges, new Set());
            if (result) {
                setCurrentChallenge(result.challenge);
                setUsedChallengeIds(result.newUsedIds);
                setDrawnTeams(drawTeams(result.challenge));
                setShowDetails(false);
            }
        }
    }, [loading, challenges, currentChallenge]);
    function changeChallenge() {
        const result = computeNextChallenge(challenges, usedChallengeIds, currentChallenge?.id);
        if (!result)
            return;
        applyChallenge(result.challenge, result.newUsedIds);
    }
    function submitOutcome(outcome) {
        const newScores = {
            team1: scores.team1 + (outcome === 'team1' ? 1 : 0),
            team2: scores.team2 + (outcome === 'team2' ? 1 : 0),
        };
        setScores(newScores);
        setRoundOutcome(outcome);
        setPhase('results');
    }
    function nextRound() {
        const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;
        if (isLastNormalRound) {
            if (scores.team1 !== scores.team2) {
                navigate('/team-play/winner', { state: { scores, team1, team2 } });
                return;
            }
            setIsTieBreak(true);
            const tieResult = computeNextChallenge(challenges, usedChallengeIds);
            if (tieResult)
                applyChallenge(tieResult.challenge, tieResult.newUsedIds);
            setRoundOutcome(null);
            setPhase('scoring');
            return;
        }
        if (isTieBreak && scores.team1 !== scores.team2) {
            navigate('/team-play/winner', { state: { scores, team1, team2 } });
            return;
        }
        const nextResult = computeNextChallenge(challenges, usedChallengeIds);
        if (!isTieBreak)
            setRound((previous) => previous + 1);
        if (nextResult)
            applyChallenge(nextResult.challenge, nextResult.newUsedIds);
        setRoundOutcome(null);
        setPhase('scoring');
    }
    if (loading)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', textAlign: 'center' }, children: "Chargement des d\u00E9fis\u2026" }) }) }));
    if (error)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', color: 'var(--red)', textAlign: 'center' }, children: error }) }) }));
    if (!currentChallenge)
        return (_jsx("div", { className: "comic-page", children: _jsx("div", { className: "comic-content", children: _jsx("p", { style: { font: '800 18px Nunito', textAlign: 'center' }, children: "Pas assez de d\u00E9fis disponibles." }) }) }));
    const roundLabel = isTieBreak ? 'PROLONGATION' : `MANCHE ${round}/${TOTAL_ROUNDS}`;
    const isLastRound = !isTieBreak && round === TOTAL_ROUNDS;
    const nextButtonLabel = isTieBreak || !isLastRound || scores.team1 === scores.team2
        ? 'Manche suivante →'
        : 'Voir les résultats →';
    return (_jsx("div", { className: "comic-page", children: _jsxs("div", { className: "comic-content", children: [phase === 'scoring' && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsx("h1", { style: {
                                        fontFamily: 'Bangers, cursive', fontSize: 36, letterSpacing: 2,
                                        color: 'var(--ink)', lineHeight: 1, transform: 'skewX(-5deg)',
                                    }, children: roundLabel }), !isTieBreak && (_jsx("div", { style: { display: 'flex', gap: 5 }, children: Array.from({ length: TOTAL_ROUNDS }, (_, i) => (_jsx("div", { style: {
                                            flex: 1, height: 7, borderRadius: 99,
                                            background: i < round ? '#10b981' : 'rgba(21,17,12,.1)',
                                            border: `1.5px solid ${i < round ? '#10b981' : 'rgba(21,17,12,.25)'}`,
                                        } }, i))) }))] }), _jsxs("div", { style: {
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'var(--ink)', borderRadius: 12, padding: '10px 16px', gap: 8,
                            }, children: [_jsxs("div", { style: { textAlign: 'center', flex: 1 }, children: [_jsx("div", { style: { font: '900 11px Nunito', color: TEAM1_COLOR, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }, children: "\u00C9quipe 1" }), _jsx("div", { style: { fontFamily: 'Bangers', fontSize: 40, color: '#fff', lineHeight: 1 }, children: scores.team1 })] }), _jsx("div", { style: { fontFamily: 'Bangers', fontSize: 22, color: 'rgba(255,255,255,.4)', letterSpacing: 2 }, children: "VS" }), _jsxs("div", { style: { textAlign: 'center', flex: 1 }, children: [_jsx("div", { style: { font: '900 11px Nunito', color: TEAM2_COLOR, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }, children: "\u00C9quipe 2" }), _jsx("div", { style: { fontFamily: 'Bangers', fontSize: 40, color: '#fff', lineHeight: 1 }, children: scores.team2 })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsxs("div", { style: {
                                        background: '#fff', border: '4px solid var(--ink)', borderRadius: 14,
                                        boxShadow: '0 5px 0 var(--ink)', padding: '14px 16px',
                                        display: 'flex', flexDirection: 'column', gap: 7,
                                    }, children: [_jsx("span", { style: {
                                                display: 'inline-block', background: '#10b981', border: '2px solid var(--ink)',
                                                borderRadius: 4, font: '900 10px Nunito', letterSpacing: 1.5,
                                                textTransform: 'uppercase', color: '#fff', padding: '3px 8px', alignSelf: 'flex-start',
                                            }, children: "D\u00C9FI EN COURS" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }, children: [_jsx("p", { style: { fontFamily: 'Bangers, cursive', fontSize: 24, color: 'var(--ink)', letterSpacing: 0.5, lineHeight: 1 }, children: currentChallenge.name }), currentChallenge.details && (_jsx("button", { type: "button", onClick: () => setShowDetails((previous) => !previous), style: {
                                                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                                        background: showDetails ? 'var(--ink)' : '#e8e0d0',
                                                        border: '2px solid var(--ink)', cursor: 'pointer',
                                                        font: '900 13px Nunito', color: showDetails ? '#fff' : 'var(--ink)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }, children: "?" }))] }), _jsx("p", { style: { font: '700 14px/1.4 Nunito', color: '#6b6154' }, children: interpolateDescription(currentChallenge.description, drawnTeams) }), currentChallenge.stopwatch && _jsx(ChallengeStopwatch, {}), currentChallenge.duration && _jsx(ChallengeTimer, { duration: currentChallenge.duration }), showDetails && currentChallenge.details && (_jsx("div", { style: {
                                                padding: '8px 10px', background: '#f0e8d4',
                                                borderRadius: 8, border: '2px solid var(--ink)',
                                            }, children: _jsx("p", { style: { font: '700 13px/1.45 Nunito', color: 'var(--ink)' }, children: currentChallenge.details }) })), drawnTeams.length > 0 && (_jsxs("div", { style: {
                                                marginTop: 4, padding: '8px 10px', background: 'var(--yellow)',
                                                borderRadius: 8, border: '2px solid var(--ink)',
                                            }, children: [_jsx("p", { style: { font: '800 11px Nunito', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }, children: "\uD83C\uDFB2 Tirage au sort" }), drawnTeams.map(({ team, role }) => (_jsxs("p", { style: { font: '800 14px Nunito', margin: '1px 0' }, children: [team, " ", _jsxs("span", { style: { font: '700 12px Nunito', color: '#6b6154' }, children: ["\u2192 ", role] })] }, role)))] }))] }), _jsx(ChangeChallengeButton, { onClick: changeChallenge })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsx("p", { style: { font: '900 12px Nunito', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }, children: "QUI A GAGN\u00C9 CETTE MANCHE ?" }), _jsxs("div", { style: { display: 'flex', gap: 10 }, children: [_jsx("button", { type: "button", onClick: () => submitOutcome('team1'), style: {
                                                flex: 1, minHeight: 58, borderRadius: 10, border: '3px solid var(--ink)',
                                                boxShadow: '0 4px 0 var(--ink)', background: TEAM1_COLOR,
                                                fontFamily: 'Bangers, cursive', fontSize: 20, color: '#fff', cursor: 'pointer',
                                            }, children: "\u00C9QUIPE 1" }), _jsx("button", { type: "button", onClick: () => submitOutcome('team2'), style: {
                                                flex: 1, minHeight: 58, borderRadius: 10, border: '3px solid var(--ink)',
                                                boxShadow: '0 4px 0 var(--ink)', background: TEAM2_COLOR,
                                                fontFamily: 'Bangers, cursive', fontSize: 20, color: '#fff', cursor: 'pointer',
                                            }, children: "\u00C9QUIPE 2" })] })] })] })), phase === 'results' && (_jsxs(_Fragment, { children: [_jsx(PageHeader, { children: roundLabel }), _jsx(ComicPanel, { style: { padding: 20, textAlign: 'center' }, children: _jsxs("div", { children: [_jsx("p", { style: { font: '700 13px Nunito', color: '#9a8f76', marginBottom: 6 }, children: "Cette manche remport\u00E9e par" }), _jsxs("p", { style: {
                                            fontFamily: 'Bangers, cursive', fontSize: 32, letterSpacing: 1, lineHeight: 1,
                                            color: roundOutcome === 'team1' ? TEAM1_COLOR : TEAM2_COLOR,
                                        }, children: [roundOutcome === 'team1' ? 'ÉQUIPE 1' : 'ÉQUIPE 2', _jsx("span", { style: { font: '900 16px Nunito', color: 'var(--ink)', marginLeft: 8 }, children: "+1 pt" })] })] }) }), _jsxs(ComicPanel, { style: { padding: 0, overflow: 'hidden' }, children: [_jsx("div", { style: {
                                        background: 'var(--ink)', color: 'var(--yellow)',
                                        fontFamily: 'Anton, sans-serif', fontSize: 16, letterSpacing: 4,
                                        textAlign: 'center', padding: '10px 16px',
                                    }, children: "SCORES" }), [{ label: 'Équipe 1', color: TEAM1_COLOR, score: scores.team1, players: team1 },
                                    { label: 'Équipe 2', color: TEAM2_COLOR, score: scores.team2, players: team2 }].map((team, index) => (_jsxs("div", { style: {
                                        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                                        background: index === 0 ? '#fff' : 'var(--paper)',
                                        borderTop: index === 0 ? 'none' : '2px solid var(--ink)',
                                    }, children: [_jsx("span", { style: { width: 12, height: 12, borderRadius: 3, background: team.color, border: '2px solid var(--ink)', flexShrink: 0 } }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { font: '800 14px Nunito', color: 'var(--ink)' }, children: team.label }), _jsx("div", { style: { font: '700 11px Nunito', color: '#9a8f76' }, children: team.players.join(', ') })] }), _jsx("span", { style: { fontFamily: 'Anton, sans-serif', fontSize: 30, color: 'var(--ink)', lineHeight: 1 }, children: team.score })] }, team.label)))] }), _jsx(ComicButton, { onClick: nextRound, children: nextButtonLabel })] }))] }) }));
}
