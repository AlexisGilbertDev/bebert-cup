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
      <h1>Bebert Survivor Cup</h1>
      <p>Nous avons un vainqueur.</p>
      <h2>{winner} remporte la Bebert Survivor Cup !</h2>
      <button type="button" onClick={() => navigate('/')}>
        Rejouer
      </button>
    </main>
  );
}
