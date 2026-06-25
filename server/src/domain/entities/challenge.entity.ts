export type ChallengeMode = 'survivor' | 'duel';

export interface ChallengeDrawSlot {
  role: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration?: number;
  minPlayers: number;
  maxPlayers?: number;
  mode: ChallengeMode;
  draw?: ChallengeDrawSlot[];
}
