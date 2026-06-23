import { useLocation, useNavigate } from 'react-router-dom';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import PowBadge from '../components/PowBadge';
import '../components/comic.css';

export default function WinnerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const winner = (location.state as { winner?: string } | null)?.winner;

  if (!winner) {
    navigate('/');
    return null;
  }

  return (
    <div className="comic-page">
      <div className="comic-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <PageHeader>VICTOIRE&nbsp;!</PageHeader>
          <PowBadge>🏆</PowBadge>
        </div>

        <ComicPanel style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ font: '700 16px Nunito', color: 'var(--text-muted)', marginBottom: 8 }}>
            Nous avons un vainqueur.
          </p>
          <p className="comic-title comic-title--sm comic-title--nostroke" style={{ lineHeight: 1.2 }}>
            {winner}<br />remporte la<br />Bebert Cup !
          </p>
        </ComicPanel>

        <ComicButton onClick={() => navigate('/')}>Rejouer !</ComicButton>
      </div>
    </div>
  );
}
