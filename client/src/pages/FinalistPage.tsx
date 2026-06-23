import { useLocation, useNavigate } from 'react-router-dom';
import Caption from '../components/Caption';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import ComicTitle from '../components/ComicTitle';
import '../components/comic.css';

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
    <div className="comic-page">
      <div className="comic-content">
        <ComicTitle size="lg" as="h1" variant="long">GRANDE FINALE</ComicTitle>
        <Caption>La Bebert Survivor Cup se joue maintenant.</Caption>

        <ComicPanel style={{ padding: 20, textAlign: 'center' }}>
          <p style={{ font: '800 18px Nunito', color: 'var(--text-muted)', marginBottom: 12 }}>
            Le duel final
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <span style={{ font: '900 22px Nunito', color: 'var(--ink)' }}>{finalists[0]}</span>
            <span style={{ font: '800 20px Bangers', color: 'var(--red)', fontSize: 24 }}>VS</span>
            <span style={{ font: '900 22px Nunito', color: 'var(--ink)' }}>{finalists[1]}</span>
          </div>
        </ComicPanel>

        <ComicButton onClick={() => navigate('/survivor/play', { state: { finalists } })}>
          LANCER LA FINALE !
        </ComicButton>
      </div>
    </div>
  );
}
