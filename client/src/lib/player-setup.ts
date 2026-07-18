export const SURVIVOR_PLAYERS_STORAGE_KEY = 'bebert-cup:survivor-players';
export const DUEL_PLAYERS_STORAGE_KEY = 'bebert-cup:duel-players';
export const TEAM_PLAY_STORAGE_KEY = 'bebert-cup:team-play-setup';

export interface StoredTeamSetup {
  teamName1: string;
  teamName2: string;
  team1: string[];
  team2: string[];
}

function asStringArray(value: unknown): string[] {
  // localStorage content isn't type-checked — guard against corrupted or outdated data
  return Array.isArray(value)
    ? value.filter((name): name is string => typeof name === 'string')
    : [];
}

export function buildInitialNames(
  saved: string[],
  minPlayers: number,
  maxPlayers: number,
): string[] {
  const validSaved = asStringArray(saved);
  if (validSaved.length === 0) return Array(minPlayers).fill('');

  const clamped = validSaved.slice(0, maxPlayers);
  while (clamped.length < minPlayers) clamped.push('');
  return clamped;
}

export function buildInitialTeamNames(
  saved: Pick<StoredTeamSetup, 'team1' | 'team2'> | null,
  minPlayers: number,
  maxPlayers: number,
): { team1: string[]; team2: string[] } {
  const validTeam1 = asStringArray(saved?.team1);
  const validTeam2 = asStringArray(saved?.team2);

  if (validTeam1.length + validTeam2.length === 0) {
    const halfMin = Math.ceil(minPlayers / 2);
    return {
      team1: Array(halfMin).fill(''),
      team2: Array(minPlayers - halfMin).fill(''),
    };
  }

  // Reserve at least one slot for team2 so it's never wiped out entirely
  // when team1 alone reaches maxPlayers.
  const team1Cap = validTeam2.length > 0 ? maxPlayers - 1 : maxPlayers;
  const team1 = validTeam1.slice(0, Math.max(0, team1Cap));
  const team2 = validTeam2.slice(0, Math.max(0, maxPlayers - team1.length));
  return { team1, team2 };
}
