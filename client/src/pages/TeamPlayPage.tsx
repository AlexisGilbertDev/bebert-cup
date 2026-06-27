import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChallengeStopwatch from '../components/ChallengeStopwatch';
import ChallengeTimer from '../components/ChallengeTimer';
import ChangeChallengeButton from '../components/ChangeChallengeButton';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import type { Challenge } from '../hooks/use-challenges';
import { useTeamPlayChallenges } from '../hooks/use-team-play-challenges';
import '../components/comic.css';

const TOTAL_ROUNDS = 8;
const ROUND_KEYS = Array.from(
  { length: TOTAL_ROUNDS },
  (_, i) => `round-${i + 1}`,
);
const TEAM1_COLOR = '#10b981';
const TEAM2_COLOR = '#3b82f6';

type RoundOutcome = 'team1' | 'team2';
type Phase = 'scoring' | 'results';

function drawTeams(
  challenge: Challenge,
  name1: string,
  name2: string,
): Array<{ team: string; role: string }> {
  if (!challenge.teamDraw || challenge.teamDraw.length === 0) return [];
  const teams = Math.random() < 0.5 ? [name1, name2] : [name2, name1];
  return challenge.teamDraw.map((slot, index) => ({
    team: teams[index % 2],
    role: slot.role,
  }));
}

function interpolateDescription(
  description: string,
  drawn: Array<{ team: string; role: string }>,
): string {
  return drawn.reduce(
    (text, { team, role }) => text.split(`{{${role}}}`).join(team),
    description,
  );
}

function computeNextChallenge(
  challenges: Challenge[],
  usedIds: ReadonlySet<string>,
  excludeId?: string,
): { challenge: Challenge; newUsedIds: Set<string> } | null {
  const exclude = excludeId ? new Set([...usedIds, excludeId]) : usedIds;
  const pool = challenges.filter((c) => !exclude.has(c.id));
  const isExhausted = pool.length === 0;
  const candidates = isExhausted
    ? challenges.filter((c) => c.id !== excludeId)
    : pool;
  if (candidates.length === 0) return null;
  const challenge = candidates[Math.floor(Math.random() * candidates.length)];
  const newUsedIds = isExhausted
    ? new Set([challenge.id])
    : new Set([...usedIds, challenge.id]);
  return { challenge, newUsedIds };
}

export default function TeamPlayPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    team1?: string[];
    team2?: string[];
    teamName1?: string;
    teamName2?: string;
  } | null;
  const team1 = locationState?.team1 ?? [];
  const team2 = locationState?.team2 ?? [];
  const teamName1 = locationState?.teamName1 ?? 'Équipe 1';
  const teamName2 = locationState?.teamName2 ?? 'Équipe 2';

  const { challenges, loading, error } = useTeamPlayChallenges();

  const [round, setRound] = useState(1);
  const [isTieBreak, setIsTieBreak] = useState(false);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [drawnTeams, setDrawnTeams] = useState<
    Array<{ team: string; role: string }>
  >([]);
  const [showDetails, setShowDetails] = useState(false);
  const [phase, setPhase] = useState<Phase>('scoring');
  const [roundOutcome, setRoundOutcome] = useState<RoundOutcome | null>(null);
  const [usedChallengeIds, setUsedChallengeIds] = useState<ReadonlySet<string>>(
    new Set(),
  );

  useEffect(() => {
    if (team1.length === 0 || team2.length === 0) navigate('/');
  }, [team1, team2, navigate]);

  function applyChallenge(challenge: Challenge, newUsedIds: Set<string>) {
    setCurrentChallenge(challenge);
    setUsedChallengeIds(newUsedIds);
    setDrawnTeams(drawTeams(challenge, teamName1, teamName2));
    setShowDetails(false);
  }

  useEffect(() => {
    if (!loading && challenges.length > 0 && currentChallenge === null) {
      const result = computeNextChallenge(challenges, new Set());
      if (result) {
        setCurrentChallenge(result.challenge);
        setUsedChallengeIds(result.newUsedIds);
        setDrawnTeams(drawTeams(result.challenge, teamName1, teamName2));
        setShowDetails(false);
      }
    }
  }, [loading, challenges, currentChallenge, teamName1, teamName2]);

  function changeChallenge() {
    const result = computeNextChallenge(
      challenges,
      usedChallengeIds,
      currentChallenge?.id,
    );
    if (!result) return;
    applyChallenge(result.challenge, result.newUsedIds);
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
        navigate('/team-play/winner', { state: { scores, team1, team2, teamName1, teamName2 } });
        return;
      }
      setIsTieBreak(true);
      const tieResult = computeNextChallenge(challenges, usedChallengeIds);
      if (tieResult) applyChallenge(tieResult.challenge, tieResult.newUsedIds);
      setRoundOutcome(null);
      setPhase('scoring');
      return;
    }

    if (isTieBreak && scores.team1 !== scores.team2) {
      navigate('/team-play/winner', { state: { scores, team1, team2, teamName1, teamName2 } });
      return;
    }

    const nextResult = computeNextChallenge(challenges, usedChallengeIds);
    if (!isTieBreak) setRound((previous) => previous + 1);
    if (nextResult) applyChallenge(nextResult.challenge, nextResult.newUsedIds);
    setRoundOutcome(null);
    setPhase('scoring');
  }

  if (loading)
    return (
      <div className="comic-page">
        <div className="comic-content">
          <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>
            Chargement des défis…
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="comic-page">
        <div className="comic-content">
          <p
            style={{
              font: '800 18px Nunito',
              color: 'var(--red)',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  if (!currentChallenge)
    return (
      <div className="comic-page">
        <div className="comic-content">
          <p style={{ font: '800 18px Nunito', textAlign: 'center' }}>
            Pas assez de défis disponibles.
          </p>
        </div>
      </div>
    );

  const roundLabel = isTieBreak
    ? 'PROLONGATION'
    : `MANCHE ${round}/${TOTAL_ROUNDS}`;
  const isLastRound = !isTieBreak && round === TOTAL_ROUNDS;
  const nextButtonLabel =
    isTieBreak || !isLastRound || scores.team1 === scores.team2
      ? 'Manche suivante →'
      : 'Voir les résultats →';

  return (
    <div className="comic-page">
      <div className="comic-content">
        {phase === 'scoring' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h1
                style={{
                  fontFamily: 'Bangers, sans-serif',
                  fontSize: 36,
                  letterSpacing: 2,
                  color: 'var(--ink)',
                  lineHeight: 1,
                  transform: 'skewX(-5deg)',
                }}
              >
                {roundLabel}
              </h1>
              {!isTieBreak && (
                <div style={{ display: 'flex', gap: 5 }}>
                  {ROUND_KEYS.map((key, i) => (
                    <div
                      key={key}
                      style={{
                        flex: 1,
                        height: 7,
                        borderRadius: 99,
                        background: i < round ? '#10b981' : 'rgba(21,17,12,.1)',
                        border: `1.5px solid ${i < round ? '#10b981' : 'rgba(21,17,12,.25)'}`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Score banner */}
            <div
              style={{
                display: 'flex',
                height: 96,
                border: '4px solid #15110C',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '5px 5px 0 #15110C',
              }}
            >
              {/* Équipe 1 */}
              <div
                style={{
                  flex: 1,
                  background: '#2BB673',
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,.18) 1.4px, transparent 1.5px)',
                  backgroundSize: '11px 11px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 13,
                    letterSpacing: 2,
                    color: 'rgba(0,0,0,.55)',
                    textTransform: 'uppercase',
                  }}
                >
                  {teamName1}
                </div>
                <div
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 46,
                    color: '#fff',
                    lineHeight: 1,
                    WebkitTextStroke: '2px #15110C',
                    paintOrder: 'stroke fill',
                    transform: 'skewX(-6deg)',
                  }}
                >
                  {scores.team1}
                </div>
              </div>

              {/* VS */}
              <div
                style={{
                  width: 74,
                  flexShrink: 0,
                  background: '#15110C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: '#F6C544',
                    clipPath:
                      'polygon(50% 0%,59% 29%,90% 10%,70% 38%,100% 50%,70% 62%,90% 90%,59% 71%,50% 100%,41% 71%,10% 90%,30% 62%,0% 50%,30% 38%,10% 10%,41% 29%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: 19,
                      color: '#15110C',
                      transform: 'skewX(-8deg)',
                      display: 'block',
                    }}
                  >
                    VS
                  </span>
                </div>
              </div>

              {/* Équipe 2 */}
              <div
                style={{
                  flex: 1,
                  background: '#1B49B5',
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,.18) 1.4px, transparent 1.5px)',
                  backgroundSize: '11px 11px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 13,
                    letterSpacing: 2,
                    color: 'rgba(255,255,255,.6)',
                    textTransform: 'uppercase',
                  }}
                >
                  {teamName2}
                </div>
                <div
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: 46,
                    color: '#fff',
                    lineHeight: 1,
                    WebkitTextStroke: '2px #15110C',
                    paintOrder: 'stroke fill',
                    transform: 'skewX(-6deg)',
                  }}
                >
                  {scores.team2}
                </div>
              </div>
            </div>

            {/* Challenge card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  background: '#fff',
                  border: '4px solid var(--ink)',
                  borderRadius: 14,
                  boxShadow: '0 5px 0 var(--ink)',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: '#10b981',
                    border: '2px solid var(--ink)',
                    borderRadius: 4,
                    font: '900 10px Nunito',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: '#fff',
                    padding: '3px 8px',
                    alignSelf: 'flex-start',
                  }}
                >
                  DÉFI EN COURS
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Bangers, sans-serif',
                      fontSize: 24,
                      color: 'var(--ink)',
                      letterSpacing: 0.5,
                      lineHeight: 1,
                    }}
                  >
                    {currentChallenge.name}
                  </p>
                  {currentChallenge.details && (
                    <button
                      type="button"
                      onClick={() => setShowDetails((previous) => !previous)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: showDetails ? 'var(--ink)' : '#e8e0d0',
                        border: '2px solid var(--ink)',
                        cursor: 'pointer',
                        font: '900 13px Nunito',
                        color: showDetails ? '#fff' : 'var(--ink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ?
                    </button>
                  )}
                </div>
                <p style={{ font: '700 14px/1.4 Nunito', color: '#6b6154' }}>
                  {interpolateDescription(
                    currentChallenge.description,
                    drawnTeams,
                  )}
                </p>
                {currentChallenge.stopwatch && <ChallengeStopwatch />}
                {currentChallenge.duration && (
                  <ChallengeTimer duration={currentChallenge.duration} />
                )}
                {showDetails && currentChallenge.details && (
                  <div
                    style={{
                      padding: '8px 10px',
                      background: '#f0e8d4',
                      borderRadius: 8,
                      border: '2px solid var(--ink)',
                    }}
                  >
                    <p
                      style={{
                        font: '700 13px/1.45 Nunito',
                        color: 'var(--ink)',
                      }}
                    >
                      {currentChallenge.details}
                    </p>
                  </div>
                )}
                {drawnTeams.length > 0 && (
                  <div
                    style={{
                      marginTop: 4,
                      padding: '8px 10px',
                      background: 'var(--yellow)',
                      borderRadius: 8,
                      border: '2px solid var(--ink)',
                    }}
                  >
                    <p
                      style={{
                        font: '800 11px Nunito',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        marginBottom: 4,
                      }}
                    >
                      🎲 Tirage au sort
                    </p>
                    {drawnTeams.map(({ team, role }) => (
                      <p
                        key={role}
                        style={{ font: '800 14px Nunito', margin: '1px 0' }}
                      >
                        {team}{' '}
                        <span
                          style={{ font: '700 12px Nunito', color: '#6b6154' }}
                        >
                          → {role}
                        </span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <ChangeChallengeButton onClick={changeChallenge} />
            </div>

            {/* Outcome buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p
                style={{
                  font: '900 12px Nunito',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ink)',
                }}
              >
                QUI A GAGNÉ CETTE MANCHE ?
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => submitOutcome('team1')}
                  style={{
                    flex: 1,
                    minHeight: 58,
                    borderRadius: 10,
                    border: '3px solid var(--ink)',
                    boxShadow: '0 4px 0 var(--ink)',
                    background: TEAM1_COLOR,
                    fontFamily: 'Bangers, sans-serif',
                    fontSize: 20,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {teamName1}
                </button>
                <button
                  type="button"
                  onClick={() => submitOutcome('team2')}
                  style={{
                    flex: 1,
                    minHeight: 58,
                    borderRadius: 10,
                    border: '3px solid var(--ink)',
                    boxShadow: '0 4px 0 var(--ink)',
                    background: TEAM2_COLOR,
                    fontFamily: 'Bangers, sans-serif',
                    fontSize: 20,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {teamName2}
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
              <div>
                <p
                  style={{
                    font: '700 13px Nunito',
                    color: '#9a8f76',
                    marginBottom: 6,
                  }}
                >
                  Cette manche remportée par
                </p>
                <p
                  style={{
                    fontFamily: 'Bangers, sans-serif',
                    fontSize: 32,
                    letterSpacing: 1,
                    lineHeight: 1,
                    color: roundOutcome === 'team1' ? TEAM1_COLOR : TEAM2_COLOR,
                  }}
                >
                  {roundOutcome === 'team1' ? teamName1 : teamName2}
                  <span
                    style={{
                      font: '900 16px Nunito',
                      color: 'var(--ink)',
                      marginLeft: 8,
                    }}
                  >
                    +1 pt
                  </span>
                </p>
              </div>
            </ComicPanel>

            {/* Scores */}
            <ComicPanel style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  background: 'var(--ink)',
                  color: 'var(--yellow)',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 16,
                  letterSpacing: 4,
                  textAlign: 'center',
                  padding: '10px 16px',
                }}
              >
                SCORES
              </div>
              {[
                {
                  label: teamName1,
                  color: TEAM1_COLOR,
                  score: scores.team1,
                  players: team1,
                },
                {
                  label: teamName2,
                  color: TEAM2_COLOR,
                  score: scores.team2,
                  players: team2,
                },
              ].map((team, index) => (
                <div
                  key={team.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    background: index === 0 ? '#fff' : 'var(--paper)',
                    borderTop: index === 0 ? 'none' : '2px solid var(--ink)',
                  }}
                >
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: team.color,
                      border: '2px solid var(--ink)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ font: '800 14px Nunito', color: 'var(--ink)' }}
                    >
                      {team.label}
                    </div>
                    <div style={{ font: '700 11px Nunito', color: '#9a8f76' }}>
                      {team.players.join(', ')}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: 30,
                      color: 'var(--ink)',
                      lineHeight: 1,
                    }}
                  >
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
