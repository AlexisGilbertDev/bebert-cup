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
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<ModeSelectionPage />} />
          <Route path="/survivor/setup" element={<HomePage />} />
          <Route path="/survivor/play" element={<ChallengePage />} />
          <Route path="/survivor/finale" element={<FinalistPage />} />
          <Route path="/survivor/winner" element={<WinnerPage />} />
          <Route path="/duel/setup" element={<DuelSetupPage />} />
          <Route path="/duel/play" element={<DuelPlayPage />} />
          <Route path="/duel/winner" element={<DuelWinnerPage />} />
          <Route path="/team-play/setup" element={<TeamSetupPage />} />
          <Route path="/team-play/play" element={<TeamPlayPage />} />
          <Route path="/team-play/winner" element={<TeamWinnerPage />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
