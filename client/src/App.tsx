import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/session.context';
import ChallengePage from './pages/ChallengePage';
import HomePage from './pages/HomePage';
import ModeSelectionPage from './pages/ModeSelectionPage';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<ModeSelectionPage />} />
          <Route path="/survivor/setup" element={<HomePage />} />
          <Route path="/survivor/play" element={<ChallengePage />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
