import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';

export default function ModeSelectionPage() {
  const { setMode } = useSession();
  const navigate = useNavigate();

  function selectSurvivor() {
    setMode('survivor');
    navigate('/survivor/setup');
  }

  return (
    <main>
      <h1>Bebert Cup</h1>
      <h2>Choix du mode</h2>
      <button type="button" onClick={selectSurvivor}>
        Survivor
        <span>3–8 joueurs · Élimination directe</span>
      </button>
    </main>
  );
}
