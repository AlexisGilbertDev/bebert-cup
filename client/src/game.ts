import type { Challenge } from './hooks/use-challenges';

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickChallenge(
  challenges: Challenge[],
  playerCount: number,
): Challenge | null {
  const eligible = challenges.filter(
    (c) =>
      c.minPlayers <= playerCount &&
      (c.maxPlayers === undefined || c.maxPlayers >= playerCount),
  );
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export type RoundResult =
  | { type: 'winner'; winner: string }
  | { type: 'finale'; finalists: [string, string] }
  | { type: 'continue'; survivors: string[] };

export function resolveRound(
  activePlayers: string[],
  eliminated: string,
): RoundResult {
  const survivors = activePlayers.filter((p) => p !== eliminated);
  if (survivors.length === 1) return { type: 'winner', winner: survivors[0] };
  if (survivors.length === 2)
    return { type: 'finale', finalists: [survivors[0], survivors[1]] };
  return { type: 'continue', survivors };
}
