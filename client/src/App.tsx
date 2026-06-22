import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/session.context';
import ChallengePage from './pages/ChallengePage';
import HomePage from './pages/HomePage';
import ModeSelectionPage from './pages/ModeSelectionPage';
import WinnerPage from './pages/WinnerPage';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<ModeSelectionPage />} />
          <Route path="/survivor/setup" element={<HomePage />} />
          <Route path="/survivor/play" element={<ChallengePage />} />
          <Route path="/survivor/winner" element={<WinnerPage />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
