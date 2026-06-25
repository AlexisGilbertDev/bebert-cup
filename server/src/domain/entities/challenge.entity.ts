export type ChallengeMode = 'survivor' | 'duel' | 'team-play';

export interface ChallengeDrawSlot {
  role: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers?: number;
  mode: ChallengeMode;
  draw?: ChallengeDrawSlot[];
}
