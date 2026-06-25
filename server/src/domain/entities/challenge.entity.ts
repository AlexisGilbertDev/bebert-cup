export type ChallengeMode = 'survivor' | 'duel' | 'team-play';

export interface ChallengeDrawSlot {
  role: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration?: number;
  details?: string;
  minPlayers: number;
  maxPlayers?: number;
  mode: ChallengeMode;
  draw?: ChallengeDrawSlot[];
  teamDraw?: ChallengeDrawSlot[];
}
