import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import './winner.css';
const ACCENT = '#e8413a';
const MEDALS = ['🥇', '🥈', '🥉'];
function medal(index) {
    return MEDALS[index] ?? `${index + 1}.`;
}
export default function DuelWinnerPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    if (!state || state.players.length === 0) {
        navigate('/');
        return null;
    }
    const { scores, players } = state;
    const sorted = [...players].sort((a, b) => scores[b] - scores[a]);
    const winner = sorted[0];
    const initial = winner.charAt(0).toUpperCase();
    const winnerScore = scores[winner];
    return (_jsxs("div", { className: "wc-page", children: [_jsx(Confetti, {}), _jsxs("div", { className: "wc-content", children: [_jsxs("div", { className: "wc-header", children: [_jsx("button", { type: "button", className: "wc-btn-round wc-btn-round--red", onClick: () => navigate('/'), "aria-label": "Accueil", children: "\u2190" }), _jsx("h1", { className: "wc-title", style: { color: ACCENT }, children: "VICTOIRE\u00A0!" }), _jsx("div", { className: "wc-btn-round wc-btn-round--gold", "aria-hidden": "true", children: "\uD83C\uDFC6" })] }), _jsxs("div", { className: "wc-hero-card", children: [_jsx("p", { className: "wc-hero-label", children: "Gagnant du duel" }), _jsxs("div", { className: "wc-avatar-wrap", children: [_jsx("span", { className: "wc-crown", children: "\uD83D\uDC51" }), _jsx("div", { className: "wc-avatar", style: { background: `radial-gradient(circle at 35% 30%, #ffe39a, ${ACCENT})` }, children: initial })] }), _jsx("p", { className: "wc-hero-name", style: { color: ACCENT }, children: winner }), _jsxs("div", { className: "wc-pts-pill", children: [winnerScore, " PTS"] })] }), _jsxs("div", { className: "wc-leaderboard", children: [_jsx("p", { className: "wc-section-label", children: "CLASSEMENT FINAL" }), sorted.map((player, index) => (_jsxs("div", { className: `wc-row${index === 0 ? ' wc-row--winner' : ''}`, children: [_jsx("span", { className: "wc-row-medal", children: medal(index) }), _jsx("span", { className: "wc-row-name", children: player }), _jsx("span", { className: "wc-row-score", style: index === 0 ? { color: ACCENT } : undefined, children: scores[player] })] }, player)))] }), _jsx("button", { type: "button", className: "wc-replay-btn", style: { background: ACCENT }, onClick: () => navigate('/'), children: "REJOUER\u00A0!" })] })] }));
}
