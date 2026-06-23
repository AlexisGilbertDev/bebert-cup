import { useLocation, useNavigate } from 'react-router-dom';

export default function FinalistPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const finalists = (location.state as { finalists?: string[] } | null)
    ?.finalists;

  if (!finalists || finalists.length !== 2) {
    navigate('/');
    return null;
  }

  return (
    <main>
      <h1>Grande Finale</h1>
      <p>La Bebert Survivor Cup se joue maintenant.</p>
      <p>
        <strong>{finalists[0]}</strong> affronte <strong>{finalists[1]}</strong>
      </p>
      <button
        type="button"
        onClick={() =>
          navigate('/survivor/play', { state: { finalists } })
        }
      >
        Lancer la finale
      </button>
    </main>
  );
}
