export type ChallengeResultType = 'outcome' | 'score';
export type EliminationRule = 'last-unqualified' | 'highest-score' | 'fault';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  resultType: ChallengeResultType;
  eliminationRule: EliminationRule;
  minPlayers: number;
}
