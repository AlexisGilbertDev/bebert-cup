import { useLocation, useNavigate } from 'react-router-dom';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import '../components/comic.css';

export default function FinalistPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    finalists?: string[];
    eliminationOrder?: string[];
  } | null;
  const finalists = locationState?.finalists;
  const eliminationOrder = locationState?.eliminationOrder;

  if (finalists?.length !== 2) {
    navigate('/');
    return null;
  }

  return (
    <div className="comic-page">
      <div className="comic-content">
        <PageHeader>GRANDE FINALE</PageHeader>

        <ComicPanel style={{ padding: 20, textAlign: 'center' }}>
          <p
            style={{
              font: '700 14px Nunito',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            La Bebert Survivor Cup se joue maintenant.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <span style={{ font: '900 22px Nunito', color: 'var(--ink)' }}>
              {finalists[0]}
            </span>
            <span
              style={{
                fontFamily: 'Bangers, sans-serif',
                color: 'var(--red)',
                fontSize: 28,
                letterSpacing: 2,
              }}
            >
              VS
            </span>
            <span style={{ font: '900 22px Nunito', color: 'var(--ink)' }}>
              {finalists[1]}
            </span>
          </div>
        </ComicPanel>

        <ComicButton
          onClick={() =>
            navigate('/survivor/play', {
              state: { finalists, eliminationOrder },
            })
          }
        >
          LANCER LA FINALE !
        </ComicButton>
      </div>
    </div>
  );
}
