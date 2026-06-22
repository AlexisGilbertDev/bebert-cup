export type ChallengeResultType = 'outcome' | 'score';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  resultType: ChallengeResultType;
  minPlayers: number;
}
