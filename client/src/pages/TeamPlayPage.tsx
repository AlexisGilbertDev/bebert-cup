import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import { useTeamPlayChallenges } from '../hooks/use-team-play-challenges';
import type { Challenge } from '../hooks/use-challenges';
import '../components/comic.css';

const TOTAL_ROUNDS = 8;
const TEAM1_COLOR = '#10b981';
const TEAM2_COLOR = '#3b82f6';

type RoundOutcome = 'team1' | 'team2' | 'draw';
type Phase = 'scoring' | 'results';

function computeNextChallenge(
  challenges: Challenge[],
  usedIds: ReadonlySet<string>,
  excludeId?: string,
): { challenge: Challenge; newUsedIds: Set<string> } | null {
  const exclude = excludeId ? new Set([...usedIds, excludeId]) : usedIds;
  const pool = challenges.filter((c) => !exclude.has(c.id));
  const isExhausted = pool.length === 0;
  const candidates = isExhausted ? challenges.filter((c) => c.id !== excludeId) : pool;
  if (candidates.length === 0) return null;
  const challenge = candidates[Math.floor(Math.random() * candidates.length)];
  const newUsedIds = isExhausted ? new Set([challenge.id]) : new Set([...usedIds, challenge.id]);
  return { challenge, newUsedIds };
}

export default function TeamPlayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { team1?: string[]; team2?: string[] } | null;
  const team1 = locationState?.team1 ?? [];
  const team2 = locationState?.team2 ?? [];

  const { challenges, loading, error } = useTeamPlayChallenges();

  const [round, setRound] = useState(1);
  const [isTieBreak, setIsTieBreak] = useState(false);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [phase, setPhase] = useState<Phase>('scoring');
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | null>(null);
  const [usedChallengeIds, setUsedChallengeIds] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (team1.length === 0 || team2.length === 0) navigate('/');
  }, [team1, team2, navigate]);

  useEffect(() => {
    if (!loading && challenges.length > 0 && currentChallenge === null) {
      const result = computeNextChallenge(challenges, new Set());
      if (result) {
        setCurrentChallenge(result.challenge);
        setUsedChallengeIds(result.newUsedIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, challenges, currentChallenge]);

  function changeChallenge() {
    const result = computeNextChallenge(challenges, usedChallengeIds, currentChallenge?.id);
    if (!result) return;
    setCurrentChallenge(result.challenge);
    setUsedChallengeIds(result.newUsedIds);
  }

  function submitOutcome(outcome: RoundOutcome) {
    const newScores = {
      team1: scores.team1 + (outcome === 'team1' ? 1 : 0),
      team2: scores.team2 + (outcome === 'team2' ? 1 : 0),
    };
    setScores(newScores);
    setRoundOutcome(outcome);
    setPhase('results');
  }

  function nextRound() {
    const isLastNormalRound = !isTieBreak && round === TOTAL_ROUNDS;

    if (isLastNormalRound) {
      if (scores.team1 !== scores.team2) {
        navigate('/team-play/winner', { state: { scores, team1, team2 } });
        return;
      }
      setIsTieBreak(true);
      const tieResult = computeNextChallenge(challenges, usedChallengeIds);
      if (tieResult) { setCurrentChallenge(tieResult.challenge); setUsedChallengeIds(tieResult.newUsedIds); }
      setRoundOutcome(null);
      setPhase('scoring');
      return;
    }

    if (isTieBreak && scores.team1 !== scores.team2) {
      navigate('/team-play/winner', { state: { scores, team1, team2 } });
      return;
    }

    const nextResult = computeNextChallenge(challenges, usedChallengeIds);
    if (!isTieBreak) setRound((previous) => previous + 1);
    if (nextResult) { setCurrentChallenge(nextResult.challenge); setUsedChallengeIds(nextResult.newUsedIds); }
    setRoundOutcome(null);
    setPhase('scoring');
  }

  if (loading) return (
    <div className="comic-page">
      <div className="comic-content">
        <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>Chargement des défis…</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="comic-page">
      <div className="comic-content">
        <p style={{ font: '800 18px Nunito', color: 'var(--red)', textAlign: 'center' }}>{error}</p>
      </div>
    </div>
  );
  if (!currentChallenge) return (
    <div className="comic-page">
      <div className="comic-content">
        <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>Pas assez de défis disponibles.</p>
      </div>
    </div>
  );

  const roundLabel = isTieBreak ? 'PROLONGATION' : `MANCHE ${round}/${TOTAL_ROUNDS}`;
  const isLastRound = !isTieBreak && round === TOTAL_ROUNDS;
  const nextButtonLabel = isTieBreak || !isLastRound || scores.team1 === scores.team2
    ? 'Manche suivante →'
    : 'Voir les résultats →';

  return (
    <div className="comic-page">
      <div className="comic-content">

        {phase === 'scoring' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h1 style={{
                fontFamily: 'Bangers, cursive', fontSize: 36, letterSpacing: 2,
                color: 'var(--ink)', lineHeight: 1, transform: 'skewX(-5deg)',
              }}>
                {roundLabel}
              </h1>
              {!isTieBreak && (
                <div style={{ display: 'flex', gap: 5 }}>
                  {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 7, borderRadius: 99,
                      background: i < round ? '#10b981' : 'rgba(21,17,12,.1)',
                      border: `1.5px solid ${i < round ? '#10b981' : 'rgba(21,17,12,.25)'}`,
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Score banner */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--ink)', borderRadius: 12, padding: '10px 16px', gap: 8,
            }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ font: '900 11px Nunito', color: TEAM1_COLOR, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
                  Équipe 1
                </div>
                <div style={{ fontFamily: 'Bangers', fontSize: 40, color: '#fff', lineHeight: 1 }}>
                  {scores.team1}
                </div>
              </div>
              <div style={{ fontFamily: 'Bangers', fontSize: 22, color: 'rgba(255,255,255,.4)', letterSpacing: 2 }}>VS</div>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ font: '900 11px Nunito', color: TEAM2_COLOR, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
                  Équipe 2
                </div>
                <div style={{ fontFamily: 'Bangers', fontSize: 40, color: '#fff', lineHeight: 1 }}>
                  {scores.team2}
                </div>
              </div>
            </div>

            {/* Challenge card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                background: '#fff', border: '4px solid var(--ink)', borderRadius: 14,
                boxShadow: '0 5px 0 var(--ink)', padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 7,
              }}>
                <span style={{
                  display: 'inline-block', background: '#10b981', border: '2px solid var(--ink)',
                  borderRadius: 4, font: '900 10px Nunito', letterSpacing: 1.5,
                  textTransform: 'uppercase', color: '#fff', padding: '3px 8px', alignSelf: 'flex-start',
                }}>
                  DÉFI EN COURS
                </span>
                <p style={{ fontFamily: 'Bangers, cursive', fontSize: 24, color: 'var(--ink)', letterSpacing: 0.5, lineHeight: 1 }}>
                  {currentChallenge.name}
                </p>
                <p style={{ font: '700 14px/1.4 Nunito', color: '#6b6154' }}>
                  {currentChallenge.description}
                </p>
              </div>
              <button type="button" onClick={changeChallenge} style={{
                background: 'none', border: 'none', color: '#9a8f76',
                font: '700 13px Nunito', cursor: 'pointer', padding: '2px 0',
                textDecoration: 'underline', textUnderlineOffset: 3, alignSelf: 'flex-start',
              }}>
                ↻ Changer de défi
              </button>
            </div>

            {/* Outcome buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ font: '900 12px Nunito', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
                QUI A GAGNÉ CETTE MANCHE ?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => submitOutcome('team1')} style={{
                  flex: 1, minHeight: 58, borderRadius: 10, border: '3px solid var(--ink)',
                  boxShadow: '0 4px 0 var(--ink)', background: TEAM1_COLOR,
                  fontFamily: 'Bangers, cursive', fontSize: 20, color: '#fff', cursor: 'pointer',
                }}>
                  ÉQUIPE 1
                </button>
                <button type="button" onClick={() => submitOutcome('draw')} style={{
                  flex: 0, minWidth: 70, minHeight: 58, borderRadius: 10,
                  border: '3px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
                  background: 'var(--paper)', fontFamily: 'Bangers, cursive', fontSize: 16,
                  color: 'var(--ink)', cursor: 'pointer',
                }}>
                  ÉGALITÉ
                </button>
                <button type="button" onClick={() => submitOutcome('team2')} style={{
                  flex: 1, minHeight: 58, borderRadius: 10, border: '3px solid var(--ink)',
                  boxShadow: '0 4px 0 var(--ink)', background: TEAM2_COLOR,
                  fontFamily: 'Bangers, cursive', fontSize: 20, color: '#fff', cursor: 'pointer',
                }}>
                  ÉQUIPE 2
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'results' && (
          <>
            <PageHeader>{roundLabel}</PageHeader>

            {/* Round result */}
            <ComicPanel style={{ padding: 20, textAlign: 'center' }}>
              {roundOutcome === 'draw' ? (
                <p style={{ font: '900 22px Nunito', color: 'var(--ink)' }}>Égalité — 0 pt chacune</p>
              ) : (
                <div>
                  <p style={{ font: '700 13px Nunito', color: '#9a8f76', marginBottom: 6 }}>
                    Cette manche remportée par
                  </p>
                  <p style={{
                    fontFamily: 'Bangers, cursive', fontSize: 32, letterSpacing: 1, lineHeight: 1,
                    color: roundOutcome === 'team1' ? TEAM1_COLOR : TEAM2_COLOR,
                  }}>
                    {roundOutcome === 'team1' ? 'ÉQUIPE 1' : 'ÉQUIPE 2'}
                    <span style={{ font: '900 16px Nunito', color: 'var(--ink)', marginLeft: 8 }}>+1 pt</span>
                  </p>
                </div>
              )}
            </ComicPanel>

            {/* Scores */}
            <ComicPanel style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                background: 'var(--ink)', color: 'var(--yellow)',
                fontFamily: 'Anton, sans-serif', fontSize: 16, letterSpacing: 4,
                textAlign: 'center', padding: '10px 16px',
              }}>
                SCORES
              </div>
              {[{ label: 'Équipe 1', color: TEAM1_COLOR, score: scores.team1, players: team1 },
                { label: 'Équipe 2', color: TEAM2_COLOR, score: scores.team2, players: team2 }].map((team, index) => (
                <div key={team.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  background: index === 0 ? '#fff' : 'var(--paper)',
                  borderTop: index === 0 ? 'none' : '2px solid var(--ink)',
                }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: team.color, border: '2px solid var(--ink)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '800 14px Nunito', color: 'var(--ink)' }}>{team.label}</div>
                    <div style={{ font: '700 11px Nunito', color: '#9a8f76' }}>{team.players.join(', ')}</div>
                  </div>
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: 30, color: 'var(--ink)', lineHeight: 1 }}>
                    {team.score}
                  </span>
                </div>
              ))}
            </ComicPanel>

            <ComicButton onClick={nextRound}>{nextButtonLabel}</ComicButton>
          </>
        )}

      </div>
    </div>
  );
}
