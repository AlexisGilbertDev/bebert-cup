import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import './winner.css';
const ACCENT = '#2aa775';
function survivorMedal(index) {
    if (index === 0)
        return '🥇';
    if (index === 1)
        return '🥈';
    return '☠️';
}
export default function WinnerPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    if (!state?.winner) {
        navigate('/');
        return null;
    }
    const { winner, eliminationOrder = [] } = state;
    const initial = winner.charAt(0).toUpperCase();
    // winner first, then eliminated players from most recent to earliest
    const ranking = [winner, ...eliminationOrder.slice().reverse().filter((name) => name !== winner)];
    return (_jsxs("div", { className: "wc-page", children: [_jsx(Confetti, {}), _jsxs("div", { className: "wc-content", children: [_jsxs("div", { className: "wc-header", children: [_jsx("button", { type: "button", className: "wc-btn-round wc-btn-round--red", onClick: () => navigate('/'), "aria-label": "Accueil", children: "\u2190" }), _jsx("h1", { className: "wc-title", style: { color: ACCENT }, children: "SURVIVOR\u00A0!" }), _jsx("div", { className: "wc-btn-round wc-btn-round--gold", "aria-hidden": "true", children: "\uD83C\uDFC6" })] }), _jsxs("div", { className: "wc-hero-card", children: [_jsx("p", { className: "wc-hero-label", children: "Dernier survivant" }), _jsxs("div", { className: "wc-avatar-wrap", children: [_jsx("span", { className: "wc-crown", children: "\uD83D\uDC51" }), _jsx("div", { className: "wc-avatar", style: { background: `radial-gradient(circle at 35% 30%, #ffe39a, ${ACCENT})` }, children: initial })] }), _jsx("p", { className: "wc-hero-name", style: { color: ACCENT }, children: winner }), _jsx("div", { className: "wc-pts-pill", children: "SURVIVOR\u00A0!" })] }), ranking.length > 1 && (_jsxs("div", { className: "wc-leaderboard", children: [_jsx("p", { className: "wc-section-label", children: "CLASSEMENT FINAL" }), ranking.map((name, index) => {
                                const isWinner = index === 0;
                                const isFaded = index >= 2;
                                return (_jsxs("div", { className: `wc-row${isWinner ? ' wc-row--winner' : ''}${isFaded ? ' wc-row--faded' : ''}`, children: [_jsx("span", { className: "wc-row-medal", children: survivorMedal(index) }), _jsx("span", { className: "wc-row-name", children: name }), isWinner && (_jsx("span", { className: "wc-row-score", style: { color: ACCENT }, children: "\uD83C\uDFC6" }))] }, name));
                            })] })), _jsx("button", { type: "button", className: "wc-replay-btn", style: { background: ACCENT }, onClick: () => navigate('/'), children: "REJOUER\u00A0!" })] })] }));
}
