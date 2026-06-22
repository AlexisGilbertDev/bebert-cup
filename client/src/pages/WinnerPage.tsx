import { useLocation, useNavigate } from 'react-router-dom';

export default function WinnerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const winner = (location.state as { winner?: string } | null)?.winner;

  if (!winner) {
    navigate('/');
    return null;
  }

  return (
    <main>
      <h1>Bebert Cup — Survivor</h1>
      <h2>🏆 {winner} remporte la Bebert Cup !</h2>
      <button type="button" onClick={() => navigate('/')}>
        Rejouer
      </button>
    </main>
  );
}
