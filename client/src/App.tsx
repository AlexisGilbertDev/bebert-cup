import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './context/session.context';
import ChallengePage from './pages/ChallengePage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/challenges" element={<ChallengePage />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
