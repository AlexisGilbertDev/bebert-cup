import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from '../components/Confetti';
import '../components/comic.css';
import './winner.css';
const TEAM1_COLOR = '#10b981';
const TEAM2_COLOR = '#3b82f6';
export default function TeamWinnerPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state;
    const scores = locationState?.scores;
    const team1 = locationState?.team1 ?? [];
    const team2 = locationState?.team2 ?? [];
    if (!scores || (team1.length === 0 && team2.length === 0)) {
        navigate('/');
        return null;
    }
    const winnerTeam = scores.team1 > scores.team2 ? 1 : 2;
    const winnerColor = winnerTeam === 1 ? TEAM1_COLOR : TEAM2_COLOR;
    const winnerPlayers = winnerTeam === 1 ? team1 : team2;
    const loserTeam = winnerTeam === 1 ? 2 : 1;
    const loserColor = winnerTeam === 1 ? TEAM2_COLOR : TEAM1_COLOR;
    const loserPlayers = winnerTeam === 1 ? team2 : team1;
    const winnerScore = winnerTeam === 1 ? scores.team1 : scores.team2;
    const loserScore = winnerTeam === 1 ? scores.team2 : scores.team1;
    return (_jsxs("div", { className: "wc-page", children: [_jsx(Confetti, {}), _jsxs("div", { className: "wc-content", children: [_jsx("h1", { style: {
                            fontFamily: 'Luckiest Guy, cursive', fontSize: 48, textAlign: 'center',
                            color: winnerColor, WebkitTextStroke: '2px var(--ink)',
                            paintOrder: 'stroke fill', textShadow: '4px 4px 0 var(--ink)',
                            animation: 'wc-rise-in 0.5s cubic-bezier(.22,1,.36,1) both',
                        }, children: "VICTOIRE !" }), _jsxs("div", { className: "wc-hero-card", style: { borderColor: winnerColor }, children: [_jsxs("div", { style: {
                                    background: `linear-gradient(135deg, #e8f5f0 0%, ${winnerColor} 100%)`,
                                    borderRadius: '18px 18px 0 0', padding: '20px 16px 16px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                                }, children: [_jsx("div", { style: {
                                            width: 72, height: 72, borderRadius: '50%', background: winnerColor,
                                            border: '4px solid var(--ink)', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontFamily: 'Bangers', fontSize: 30, color: '#fff',
                                            boxShadow: '0 4px 0 var(--ink)',
                                        }, children: "\uD83C\uDFC6" }), _jsxs("h2", { className: "wc-hero-name", style: { color: winnerColor }, children: ["\u00C9QUIPE ", winnerTeam] }), _jsx("div", { style: { font: '700 13px Nunito', color: '#fff', textAlign: 'center', opacity: 0.9 }, children: winnerPlayers.join(' · ') })] }), _jsx("div", { style: { padding: '12px 16px', display: 'flex', justifyContent: 'center' }, children: _jsxs("span", { className: "wc-pts-pill", children: [winnerScore, " pt", winnerScore > 1 ? 's' : ''] }) })] }), _jsx("div", { className: "wc-leaderboard", children: _jsxs("div", { style: {
                                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', opacity: 0.55,
                            }, children: [_jsx("span", { style: { font: '900 22px Nunito' }, children: "\uD83E\uDD48" }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: { font: '800 14px Nunito', color: 'var(--ink)' }, children: ["\u00C9quipe ", loserTeam] }), _jsx("div", { style: { font: '700 11px Nunito', color: '#9a8f76' }, children: loserPlayers.join(', ') })] }), _jsxs("span", { style: {
                                        fontFamily: 'Bangers', fontSize: 26, color: loserColor,
                                        background: '#fff', border: '2px solid var(--ink)',
                                        borderRadius: 8, padding: '2px 10px',
                                    }, children: [loserScore, " pt", loserScore !== 1 ? 's' : ''] })] }) }), _jsx("button", { type: "button", className: "wc-replay-btn", style: { background: winnerColor }, onClick: () => navigate('/'), children: "REJOUER !" })] })] }));
}
