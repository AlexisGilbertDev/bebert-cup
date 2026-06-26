import { useNavigate } from 'react-router-dom';
import './mode-selection.css';

export default function ModeSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="msb-page">

      {/* Header */}
      <div className="msb-header">
        <h1 className="msb-logo">BEBERT CUP</h1>
        <div className="msb-pow-wrap" aria-hidden="true">
          <div className="msb-pow">POW!</div>
        </div>
      </div>

      {/* Hero */}
      <div className="msb-hero">
        <img
          src="/assets/bebert-character.png"
          alt="Bebert, le héros de la Bebert Cup"
          className="msb-hero-img"
        />
        <div className="msb-hero-tab" aria-hidden="true">NANKATSU SC</div>
      </div>

      {/* Banner */}
      <div className="msb-banner-wrap" aria-hidden="true">
        <div className="msb-banner-shadow" />
        <div className="msb-banner">CHOIX DU MODE</div>
      </div>

      {/* Cards */}
      <div className="msb-cards">

        <button type="button" className="msb-card" onClick={() => navigate('/survivor/setup')}>
          <div className="msb-card-top">
            <span className="msb-card-name msb-card-name--red">SURVIVOR !</span>
            <div className="msb-target" aria-hidden="true">
              <div className="msb-target-ring">
                <div className="msb-target-dot" />
              </div>
            </div>
          </div>
          <p className="msb-card-desc">3–8 joueurs · Élimination directe. À la fin, il n'en restera qu'un !</p>
          <span className="msb-pill msb-pill--red" aria-hidden="true">JOUER ›</span>
        </button>

        <button type="button" className="msb-card" onClick={() => navigate('/duel/setup')}>
          <div className="msb-card-top">
            <span className="msb-card-name msb-card-name--blue">DUEL !</span>
            <div className="msb-vs-badge" aria-hidden="true">VS</div>
          </div>
          <p className="msb-card-desc">2–4 joueurs · 8 manches. Le meilleur l'emporte !</p>
          <span className="msb-pill msb-pill--blue" aria-hidden="true">JOUER ›</span>
        </button>

        <button type="button" className="msb-card" onClick={() => navigate('/team-play/setup')}>
          <div className="msb-card-top">
            <span className="msb-card-name msb-card-name--green">TEAM !</span>
            <div className="msb-team-badge" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                <circle cx="7"  cy="13" r="3.5"/><rect x="3"  y="17" width="8" height="10" rx="2"/>
                <circle cx="14" cy="13" r="3.5"/><rect x="10" y="17" width="8" height="10" rx="2"/>
                <circle cx="26" cy="13" r="3.5"/><rect x="22" y="17" width="8" height="10" rx="2"/>
                <circle cx="33" cy="13" r="3.5"/><rect x="29" y="17" width="8" height="10" rx="2"/>
              </svg>
            </div>
          </div>
          <p className="msb-card-desc">4–8 joueurs · 2 équipes · 8 manches. L'équipe la plus forte gagne.</p>
          <span className="msb-pill msb-pill--green" aria-hidden="true">JOUER ›</span>
        </button>

      </div>
    </div>
  );
}
