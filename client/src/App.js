import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/session.context';
import ChallengePage from './pages/ChallengePage';
import DuelPlayPage from './pages/DuelPlayPage';
import DuelSetupPage from './pages/DuelSetupPage';
import DuelWinnerPage from './pages/DuelWinnerPage';
import FinalistPage from './pages/FinalistPage';
import HomePage from './pages/HomePage';
import ModeSelectionPage from './pages/ModeSelectionPage';
import TeamPlayPage from './pages/TeamPlayPage';
import TeamSetupPage from './pages/TeamSetupPage';
import TeamWinnerPage from './pages/TeamWinnerPage';
import WinnerPage from './pages/WinnerPage';
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsx(SessionProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ModeSelectionPage, {}) }), _jsx(Route, { path: "/survivor/setup", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/survivor/play", element: _jsx(ChallengePage, {}) }), _jsx(Route, { path: "/survivor/finale", element: _jsx(FinalistPage, {}) }), _jsx(Route, { path: "/survivor/winner", element: _jsx(WinnerPage, {}) }), _jsx(Route, { path: "/duel/setup", element: _jsx(DuelSetupPage, {}) }), _jsx(Route, { path: "/duel/play", element: _jsx(DuelPlayPage, {}) }), _jsx(Route, { path: "/duel/winner", element: _jsx(DuelWinnerPage, {}) }), _jsx(Route, { path: "/team-play/setup", element: _jsx(TeamSetupPage, {}) }), _jsx(Route, { path: "/team-play/play", element: _jsx(TeamPlayPage, {}) }), _jsx(Route, { path: "/team-play/winner", element: _jsx(TeamWinnerPage, {}) })] }) }) }));
}
