export interface ChallengeDrawSlot {
  role: string;
}

export type ChallengeEquipment = 'but' | 'mur';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration?: number;
  stopwatch?: boolean;
  details?: string;
  minPlayers: number;
  maxPlayers?: number;
  draw?: ChallengeDrawSlot[];
  eliminableRoles?: string[];
  teamDraw?: ChallengeDrawSlot[];
  equipment?: ChallengeEquipment;
}
