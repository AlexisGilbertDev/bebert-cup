export interface ChallengeDrawSlot {
  role: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  draw?: ChallengeDrawSlot[];
}
