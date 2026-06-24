export type ChallengeMode = 'survivor' | 'duel';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  mode: ChallengeMode;
}
