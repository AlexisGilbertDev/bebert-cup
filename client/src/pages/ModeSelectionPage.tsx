import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import '../components/comic.css';
import './mode-selection.css';

export default function ModeSelectionPage() {
  const { setMode } = useSession();
  const navigate = useNavigate();

  function selectSurvivor() {
    setMode('survivor');
    navigate('/survivor/setup');
  }

  function selectDuel() {
    navigate('/duel/setup');
  }

  function selectTeamPlay() {
    navigate('/team-play/setup');
  }

  return (
    <div className="comic-page">
      <div className="comic-content msb-content">

        {/* 1. Logo + POW badge */}
        <div className="msb-logo-wrap">
          <h1 className="msb-logo">BEBERT<br />CUP</h1>
          <div className="msb-pow-wrap" aria-hidden="true">
            <div className="msb-pow">POW!</div>
          </div>
        </div>

        {/* 2. Hero panel */}
        <div className="msb-hero">
          <img
            src="/assets/bebert-character.png"
            alt="Bebert, le héros de la Bebert Cup"
            className="msb-hero-img"
          />
          <div className="msb-hero-tab" aria-hidden="true">NANKATSU SC</div>
        </div>

        {/* 3. Mode banner — pancarte inclinée */}
        <div className="msb-banner-wrap">
          <div className="msb-banner-shadow" aria-hidden="true" />
          <div className="msb-banner">CHOIX DU MODE</div>
        </div>

        {/* 4a. Survivor card */}
        <div className="msb-card">
          <div className="msb-card-header">
            <h2 className="msb-card-title msb-card-title--red">SURVIVOR&nbsp;!</h2>
            <div className="msb-target" aria-hidden="true">
              <div className="msb-target-ring">
                <div className="msb-target-dot" />
              </div>
            </div>
          </div>
          <p className="msb-card-desc">
            3–8 joueurs · Élimination directe. À la fin, il n'en restera qu'un !
          </p>
          <button type="button" className="msb-play-btn msb-play-btn--red" onClick={selectSurvivor}>
            JOUER&nbsp;!
          </button>
        </div>

        {/* 4b. Duel card */}
        <div className="msb-card">
          <div className="msb-card-header">
            <h2 className="msb-card-title msb-card-title--blue">DUEL&nbsp;!</h2>
            <div className="msb-vs-badge" aria-hidden="true">VS</div>
          </div>
          <p className="msb-card-desc">
            2–4 joueurs · 8 manches. Le meilleur l'emporte !
          </p>
          <button type="button" className="msb-play-btn msb-play-btn--blue" onClick={selectDuel}>
            JOUER&nbsp;!
          </button>
        </div>

        {/* 4c. Team Play card */}
        <div className="msb-card">
          <div className="msb-card-header">
            <h2 className="msb-card-title msb-card-title--green">TEAM&nbsp;!</h2>
            <div className="msb-team-badge" aria-hidden="true">2v2</div>
          </div>
          <p className="msb-card-desc">
            4–8 joueurs · 2 équipes · 8 manches. L'équipe la plus forte gagne.
          </p>
          <button type="button" className="msb-play-btn msb-play-btn--green" onClick={selectTeamPlay}>
            JOUER&nbsp;!
          </button>
        </div>

      </div>
    </div>
  );
}
