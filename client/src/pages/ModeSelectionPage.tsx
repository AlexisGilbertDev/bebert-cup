import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import Caption from '../components/Caption';
import ComicButton from '../components/ComicButton';
import PowBadge from '../components/PowBadge';
import '../components/comic.css';

export default function ModeSelectionPage() {
  const { setMode } = useSession();
  const navigate = useNavigate();

  function selectSurvivor() {
    setMode('survivor');
    navigate('/survivor/setup');
  }

  return (
    <div className="comic-page">
      <div className="comic-content">

        {/* Title + POW badge */}
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <h1
            className="comic-title comic-title--lg"
            style={{ lineHeight: 0.86 }}
          >
            BEBERT<br />CUP
          </h1>
          <div style={{ position: 'absolute', top: -6, right: 6 }}>
            <PowBadge>POW!</PowBadge>
          </div>
        </div>

        {/* Character panel */}
        <div className="comic-panel" style={{ overflow: 'hidden' }}>
          <img
            src="/assets/bebert-character.png"
            alt="Bebert"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Mode section */}
        <Caption>Choix du mode</Caption>

        {/* Survivor card */}
        <div className="comic-panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 className="comic-title comic-title--sm">SURVIVOR&nbsp;!</h2>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--blue)', border: '3px solid var(--ink)',
              position: 'relative', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', inset: 0, margin: 'auto',
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', border: '2px solid var(--ink)',
              }} />
            </div>
          </div>
          <p style={{ font: '700 14px Nunito', color: 'var(--text-muted)', marginBottom: 14 }}>
            3–8 joueurs · Élimination directe. Un seul ressort vivant.
          </p>
          <ComicButton onClick={selectSurvivor}>JOUER&nbsp;!</ComicButton>
        </div>

        {/* Placeholder future modes */}
        <ComicButton variant="ghost">À suivre… d'autres modes 👀</ComicButton>

      </div>
    </div>
  );
}
